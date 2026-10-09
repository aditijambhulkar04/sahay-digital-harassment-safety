export interface LedgerEntry {
  id: string;
  timestamp: string;
  action: string;
  evidenceId: string;
  details: string;
  previousHash: string;
  hash: string;
}

const STORAGE_KEY = "sahay_evidence_ledger_v1";
const GENESIS_HASH = "GENESIS";

type UnsignedEntry = Omit<LedgerEntry, "hash">;

async function sha256(value: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      "Secure SHA-256 is unavailable. Open SAHAY in a supported browser context."
    );
  }

  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function canonical(entry: UnsignedEntry): string {
  return JSON.stringify([
    entry.id,
    entry.timestamp,
    entry.action,
    entry.evidenceId,
    entry.details,
    entry.previousHash,
  ]);
}

function isLedgerEntry(value: unknown): value is LedgerEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.timestamp === "string" &&
    !Number.isNaN(Date.parse(entry.timestamp)) &&
    typeof entry.action === "string" &&
    entry.action.trim().length > 0 &&
    typeof entry.evidenceId === "string" &&
    entry.evidenceId.trim().length > 0 &&
    typeof entry.details === "string" &&
    typeof entry.previousHash === "string" &&
    typeof entry.hash === "string" &&
    /^[a-f0-9]{64}$/.test(entry.hash)
  );
}

function readEntries(): LedgerEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Keep malformed entries so verifyLedger() can report tampering.
    return parsed as LedgerEntry[];
  } catch {
    return [];
  }
}

function createId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  throw new Error(
    "Secure ID generation is unavailable in this browser context."
  );
}

/**
 * Records an entry linked to the previous entry's hash.
 *
 * This is a local hash-linked audit log. It is not a digital signature,
 * and localStorage can be modified by someone with access to the browser.
 */
export async function addLedgerEntry(
  action: string,
  evidenceId: string,
  details: string
): Promise<LedgerEntry> {
  if (!action.trim() || !evidenceId.trim()) {
    throw new Error("Ledger action and evidence ID are required.");
  }

  const entries = readEntries();

  // Do not append to a ledger that fails integrity verification.
  const verification = await verifyLedger();
  if (!verification.valid) {
    throw new Error(
      `Cannot add an entry: ${verification.message}`
    );
  }

  const previousHash = entries.length
    ? entries[entries.length - 1].hash
    : GENESIS_HASH;

  const unsigned: UnsignedEntry = {
    id: createId(),
    timestamp: new Date().toISOString(),
    action: action.trim(),
    evidenceId: evidenceId.trim(),
    details,
    previousHash,
  };

  const entry: LedgerEntry = {
    ...unsigned,
    hash: await sha256(canonical(unsigned)),
  };

  // Re-read before writing to reduce accidental overwrites.
  const latestEntries = readEntries();
  const latestHash = latestEntries.length
    ? latestEntries[latestEntries.length - 1].hash
    : GENESIS_HASH;

  if (
    latestEntries.length !== entries.length ||
    latestHash !== previousHash
  ) {
    throw new Error(
      "The ledger changed while recording this entry. Please retry."
    );
  }

  latestEntries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(latestEntries));

  return entry;
}

export async function verifyLedger(): Promise<{
  valid: boolean;
  checked: number;
  errorIndex: number | null;
  message: string;
}> {
  let entries: unknown[];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      entries = [];
    } else {
      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return {
          valid: false,
          checked: 0,
          errorIndex: 0,
          message: "Ledger storage is not a valid entry list.",
        };
      }

      entries = parsed;
    }
  } catch {
    return {
      valid: false,
      checked: 0,
      errorIndex: 0,
      message: "Ledger storage could not be read or parsed.",
    };
  }

  let previousHash = GENESIS_HASH;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (
      !isLedgerEntry(entry) ||
      entry.previousHash !== previousHash
    ) {
      return {
        valid: false,
        checked: i,
        errorIndex: i,
        message: `Invalid or modified ledger entry at position ${i + 1}.`,
      };
    }

    const {
      hash,
      id,
      timestamp,
      action,
      evidenceId,
      details,
      previousHash: entryPreviousHash,
    } = entry;

    const unsigned: UnsignedEntry = {
      id,
      timestamp,
      action,
      evidenceId,
      details,
      previousHash: entryPreviousHash,
    };

    const expectedHash = await sha256(canonical(unsigned));

    if (hash !== expectedHash) {
      return {
        valid: false,
        checked: i,
        errorIndex: i,
        message: `Integrity check failed at entry ${i + 1}.`,
      };
    }

    previousHash = hash;
  }

  return {
    valid: true,
    checked: entries.length,
    errorIndex: null,
    message: `Verified ${entries.length} ledger entries successfully.`,
  };
}

export function getLedgerEntries(): LedgerEntry[] {
  return readEntries().slice().reverse();
}
/** Downloadable audit record for review and preservation. */
export function exportLedgerJson(): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    format: 'SAHAY_LOCAL_HASH_CHAIN_V1',
    warning: 'Local hash chain; not a digital signature or server-backed immutable log.',
    entries: readEntries(),
  }, null, 2);
}
