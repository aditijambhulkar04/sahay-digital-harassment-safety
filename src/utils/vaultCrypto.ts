/**
 * Password-based AES-GCM encryption helpers for SAHAY vault payloads.
 * The password is never stored. Store only the returned encrypted envelope.
 * Integrators must request the password on unlock and must never silently fall back
 * to plaintext if encryption/decryption fails.
 */
export interface EncryptedVaultEnvelope {
  version: 1;
  algorithm: 'AES-GCM';
  kdf: 'PBKDF2-SHA-256';
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

const ITERATIONS = 310_000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}
function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  if (!globalThis.crypto?.subtle) throw new Error('Secure browser encryption is unavailable.');
  if (password.length < 10) throw new Error('Use a vault password of at least 10 characters.');
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}

export async function encryptVaultPayload(plaintext: string, password: string): Promise<EncryptedVaultEnvelope> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ITERATIONS);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plaintext));
  return { version: 1, algorithm: 'AES-GCM', kdf: 'PBKDF2-SHA-256', iterations: ITERATIONS,
    salt: toBase64(salt), iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) };
}

export async function decryptVaultPayload(envelope: EncryptedVaultEnvelope, password: string): Promise<string> {
  if (envelope.version !== 1 || envelope.algorithm !== 'AES-GCM' || envelope.kdf !== 'PBKDF2-SHA-256') {
    throw new Error('Unsupported encrypted vault format.');
  }
  const key = await deriveKey(password, fromBase64(envelope.salt), envelope.iterations);
  try {
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(envelope.iv) }, key, fromBase64(envelope.ciphertext));
    return decoder.decode(plaintext);
  } catch {
    throw new Error('Could not unlock vault. Check your password or the data may be damaged.');
  }
}
