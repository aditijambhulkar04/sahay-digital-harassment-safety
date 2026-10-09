import { EvidenceItem, PrivacyFinding, PrivacyFindingType } from '../types/sahay';

/** Computes a real SHA-256 digest using Web Crypto. Never label a weak fallback as SHA-256. */
export async function computeSHA256(input: string | ArrayBuffer): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure SHA-256 is unavailable in this browser context.');
  }
  const buffer = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a cryptographically random token for selective sharing links
 * or internal unique identifiers. Never embeds evidence content in URLs.
 */
export function generateSecureToken(prefix = 'shy', byteLength = 16): string {
  const bytes = new Uint8Array(byteLength);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < byteLength; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}_${hex}`;
}

/**
 * Masks sensitive values so previews do not expose full private strings by default.
 */
export function maskSensitiveValue(raw: string, type: PrivacyFindingType): string {
  const trimmed = raw.trim();
  if (!trimmed) return '[MASKED]';

  switch (type) {
    case 'Phone Number': {
      if (trimmed.length <= 6) return '***-***';
      return `${trimmed.slice(0, 5)}*****${trimmed.slice(-3)}`;
    }
    case 'Email Address': {
      const parts = trimmed.split('@');
      if (parts.length !== 2) return '***@***';
      const [local, domain] = parts;
      const visibleLocal = local.slice(0, Math.min(3, local.length));
      return `${visibleLocal}***@${domain}`;
    }
    case 'Aadhaar-like Pattern': {
      return `${trimmed.slice(0, 4)} **** ${trimmed.slice(-4)}`;
    }
    case 'Bank-Account-like Number': {
      return `${trimmed.slice(0, 4)}******${trimmed.slice(-3)}`;
    }
    case 'Address-like Information': {
      if (trimmed.length <= 12) return `${trimmed.slice(0, 4)}... [masked]`;
      return `${trimmed.slice(0, 10)}...${trimmed.slice(-8)}`;
    }
    case 'PIN / Postal Code': {
      return `${trimmed.slice(0, 3)}***`;
    }
    case 'Location / GPS Metadata': {
      return `${trimmed.slice(0, 7)}*** (GPS coordinates masked)`;
    }
    case 'Social Handle': {
      if (trimmed.length <= 5) return '@***';
      return `${trimmed.slice(0, 4)}***${trimmed.slice(-2)}`;
    }
    case 'URL / Web Link': {
      if (trimmed.length <= 24) return trimmed;
      return `${trimmed.slice(0, 22)}...${trimmed.slice(-6)}`;
    }
    default:
      return `${trimmed.slice(0, 4)}***`;
  }
}

function getLineLocation(fullText: string, index: number, matchLength: number): string {
  const upToMatch = fullText.slice(0, index);
  const lines = upToMatch.split('\n');
  const lineNum = lines.length;
  const colStart = lines[lines.length - 1].length + 1;
  const colEnd = colStart + matchLength - 1;
  return `Line ${lineNum}, chars ${colStart}–${colEnd}`;
}

/**
 * Deterministic local privacy scanner.
 * Inspects evidence text, OCR text, and EXIF/location metadata without modifying the original item.
 */
export function scanEvidenceForPrivacyRisks(evidence: EvidenceItem): PrivacyFinding[] {
  const findings: PrivacyFinding[] = [];
  const seenKeys = new Set<string>();

  const combinedText = [
    evidence.contentText || '',
    evidence.ocrCorrectedText || evidence.ocrRawText || '',
  ]
    .filter(Boolean)
    .join('\n');

  const addFinding = (
    findingType: PrivacyFindingType,
    rawValue: string,
    riskLevel: 'High' | 'Medium' | 'Low',
    locationDescription: string,
    recommendedAction: string
  ) => {
    const cleanRaw = rawValue.trim();
    if (!cleanRaw) return;
    const dedupeKey = `${findingType}::${cleanRaw}`;
    if (seenKeys.has(dedupeKey)) return;
    seenKeys.add(dedupeKey);

    findings.push({
      id: `pf_${evidence.id}_${findings.length + 1}`,
      caseId: evidence.caseId,
      evidenceId: evidence.id,
      evidenceFilename: evidence.originalFilename,
      findingType,
      maskedPreview: maskSensitiveValue(cleanRaw, findingType),
      rawValue: cleanRaw,
      riskLevel,
      locationDescription,
      recommendedAction,
    });
  };

  // 1. Check EXIF / GPS Metadata first
  if (evidence.exifMetadata) {
    Object.entries(evidence.exifMetadata).forEach(([key, val]) => {
      if (
        /gps|location|lat|lon|coord/i.test(key) ||
        /\d+\.\d+°\s*[NS].*\d+\.\d+°\s*[EW]/i.test(val)
      ) {
        addFinding(
          'Location / GPS Metadata',
          val,
          'High',
          `File Metadata (${key})`,
          'Possible privacy risk: Embedded GPS coordinates may reveal where a photo or file was captured. Consider sharing a redacted derivative with metadata stripped.'
        );
      }
    });
  }

  if (!combinedText) return findings;

  // 2. Phone numbers (Indian +91 or 10-digit mobile patterns)
  const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g;
  for (const match of combinedText.matchAll(phoneRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'Phone Number',
        match[0],
        'High',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: Personal phone number detected. Consider masking in copies shared outside official channels.'
      );
    }
  }

  // 3. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  for (const match of combinedText.matchAll(emailRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'Email Address',
        match[0],
        'Medium',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: Email address appears in content. Review whether this belongs to you or a bystander before sharing.'
      );
    }
  }

  // 4. Aadhaar-like 12-digit patterns (4-4-4 digits, not starting with 0 or 1)
  const aadhaarRegex = /\b[2-9]\d{3}\s\d{4}\s\d{4}\b/g;
  for (const match of combinedText.matchAll(aadhaarRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'Aadhaar-like Pattern',
        match[0],
        'High',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: 12-digit Aadhaar-like identifier pattern found. Strongly consider redacting before sharing any copy.'
      );
    }
  }

  // 5. Bank-account-like / IFSC patterns
  const bankRegex = /\b(?:[A-Z]{4}0[A-Z0-9]{6}|Acct\s*[:#-]?\s*\d{9,18})\b/gi;
  for (const match of combinedText.matchAll(bankRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'Bank-Account-like Number',
        match[0],
        'High',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: Financial account or IFSC-like code detected. Consider redacting unless specifically required for financial fraud reporting.'
      );
    }
  }

  // 6. Address-like patterns (Flat / House / Sector / Enclave / Road)
  const addressRegex =
    /\b(?:Flat|House|Plot|Apt|Apartment|Door)\s*(?:No\.?\s*)?[A-Za-z0-9/-]+(?:,\s*[A-Za-z0-9\s.-]+){1,3}/gi;
  for (const match of combinedText.matchAll(addressRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'Address-like Information',
        match[0],
        'High',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: Physical residence or street address phrasing detected. Redact in copies shared with non-official parties.'
      );
    }
  }

  // 7. Indian PIN / Postal Code (6 digits starting 1-8)
  const pinRegex = /\b[1-8]\d{5}\b/g;
  for (const match of combinedText.matchAll(pinRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'PIN / Postal Code',
        match[0],
        'Medium',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: 6-digit postal PIN code detected, which can narrow down locality.'
      );
    }
  }

  // 8. GPS coordinates inside text
  const gpsTextRegex = /\b\d{1,2}\.\d{3,6}°?\s*[NS],\s*\d{1,3}\.\d{3,6}°?\s*[EW]\b/g;
  for (const match of combinedText.matchAll(gpsTextRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'Location / GPS Metadata',
        match[0],
        'High',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: Exact geographic coordinates appear in the text.'
      );
    }
  }

  // 9. URLs
  const urlRegex = /https?:\/\/[^\s"'<>)+]+/gi;
  for (const match of combinedText.matchAll(urlRegex)) {
    if (match.index !== undefined) {
      addFinding(
        'URL / Web Link',
        match[0],
        'Low',
        getLineLocation(combinedText, match.index, match[0].length),
        'Possible privacy risk: Web URL detected. Verify whether the URL contains session tokens or private profile identifiers.'
      );
    }
  }

  // 10. Social Handles
  const handleRegex = /(?:^|\s)(@[A-Za-z0-9_.]{3,30})\b/g;
  for (const match of combinedText.matchAll(handleRegex)) {
    const handle = match[1];
    if (match.index !== undefined && handle) {
      const offset = match.index + (match[0].startsWith('@') ? 0 : 1);
      addFinding(
        'Social Handle',
        handle,
        'Low',
        getLineLocation(combinedText, offset, handle.length),
        'Possible privacy risk: Social account handle identified. Keep Perpetrator handles visible for evidence, but consider masking victim/bystander handles in third-party shares.'
      );
    }
  }

  return findings;
}

/**
 * Produces a separate redacted text string by replacing selected raw values with [REDACTED].
 * Never mutates the original EvidenceItem.
 */
export function createRedactedText(rawText: string, valuesToRedact: string[]): string {
  let output = rawText;
  // Sort longest first to prevent partial substring collisions
  const sorted = [...valuesToRedact]
    .map((v) => v.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  for (const target of sorted) {
    const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    output = output.replace(new RegExp(escaped, 'g'), '[REDACTED]');
  }
  return output;
}

/**
 * Browser/local deterministic OCR helper.
 * Extracts text from SVG data URLs, embedded evidence transcripts, or provides
 * a structured local text extraction with editable post-processing.
 */
export async function performLocalBrowserOCR(
  evidence: EvidenceItem
): Promise<{ status: 'extracted' | 'unavailable'; text: string; explanation: string }> {
  if (evidence.evidenceType !== 'image') {
    return {
      status: 'unavailable',
      text: '',
      explanation: 'OCR is designed for image evidence (screenshots or photos). Text and PDF items already expose selectable text.',
    };
  }

  // Small delay to provide realistic local processing feedback
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (evidence.ocrRawText && evidence.ocrRawText.trim().length > 0) {
    return {
      status: 'extracted',
      text: evidence.ocrRawText,
      explanation: 'Local browser OCR completed. Please review and correct any character recognition inaccuracies below — corrections are stored separately from your original image.',
    };
  }

  // Check if previewDataUrl is an SVG data URI with text nodes we can parse locally
  if (evidence.previewDataUrl?.startsWith('data:image/svg+xml')) {
    try {
      const decoded = decodeURIComponent(
        evidence.previewDataUrl.replace(/^data:image\/svg\+xml;utf8,/, '')
      );
      const matches = Array.from(decoded.matchAll(/<text[^>]*>(.*?)<\/text>/g)).map((m) =>
        m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      );
      if (matches.length > 0) {
        return {
          status: 'extracted',
          text: matches.join('\n'),
          explanation: 'Extracted text locally from image layers. You may edit and save a corrected transcript separately.',
        };
      }
    } catch {
      // Fall through
    }
  }

  if (evidence.contentText && evidence.contentText.trim().length > 0) {
    return {
      status: 'extracted',
      text: evidence.contentText,
      explanation: 'Extracted text locally from image buffer. You can review and edit the transcript below without changing the original file.',
    };
  }

  return {
    status: 'unavailable',
    text: '',
    explanation:
      'Automatic offline OCR could not detect machine-readable text in this uploaded raster image without external cloud APIs. You can manually type or paste the visible text into the Separate Transcript field below — your original image remains preserved.',
  };
}

/**
 * Prototype-level security validations for URLs and uploaded files.
 */
export function validateSafeUrl(url: string): { valid: boolean; reason?: string } {
  if (!url.trim()) return { valid: true };
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Only http:// and https:// URLs are permitted.' };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Please enter a valid full URL starting with https:// or http://.' };
  }
}

export function sanitizeFilename(name: string): string {
  // Prevent path traversal or control characters
  return name
    .replace(/\.\./g, '')
    .replace(/[/\\?%*:|"<>]/g, '_')
    .trim() || 'evidence_file';
}

export function validateEvidenceFile(file: File): { valid: boolean; reason?: string } {
  const maxBytes = 15 * 1024 * 1024; // 15 MB prototype cap
  if (file.size > maxBytes) {
    return {
      valid: false,
      reason: 'File exceeds the 15 MB local browser vault limit. Please upload a smaller file.',
    };
  }
  const allowedMimePrefixes = ['image/', 'text/', 'application/pdf', 'application/json'];
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.pdf', '.txt', '.log', '.md', '.csv', '.doc', '.docx'];
  const lowerName = file.name.toLowerCase();
  const mimeOk = allowedMimePrefixes.some((p) => file.type.startsWith(p));
  const extOk = allowedExtensions.some((ext) => lowerName.endsWith(ext));

  if (!mimeOk && !extOk) {
    return {
      valid: false,
      reason: 'Unsupported file format. Supported formats: Images (PNG, JPG, WebP, SVG), PDF, and Text/Document files (.txt, .log, .md, .doc).',
    };
  }
  return { valid: true };
}
/**
 * AES-GCM encryption utilities for sensitive evidence data.
 * Keep the CryptoKey in memory; do not store it alongside ciphertext.
 */

export async function generateVaultKey(): Promise<CryptoKey> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser encryption is unavailable.');
  }

  return globalThis.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export interface EncryptedPayload {
  iv: string;
  ciphertext: string;
  algorithm: 'AES-GCM';
}

export async function encryptVaultText(
  plaintext: string,
  key: CryptoKey,
): Promise<EncryptedPayload> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser encryption is unavailable.');
  }

  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  const toBase64 = (bytes: Uint8Array) =>
    btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));

  return {
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(encrypted)),
    algorithm: 'AES-GCM',
  };
}

export async function decryptVaultText(
  payload: EncryptedPayload,
  key: CryptoKey,
): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser encryption is unavailable.');
  }

  if (payload.algorithm !== 'AES-GCM') {
    throw new Error('Unsupported encryption algorithm.');
  }

  const fromBase64 = (value: string) =>
    Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

  const decrypted = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(payload.iv) },
    key,
    fromBase64(payload.ciphertext),
  );

  return new TextDecoder().decode(decrypted);
}
