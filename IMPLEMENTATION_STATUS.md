# SAHAY challenge implementation status

This package contains targeted improvements to the supplied project. Please review this status honestly before presenting the app as complete.

## Changes made in this package
- Evidence uploads now attempt to append a custody-ledger entry with filename, byte size, and the recorded SHA-256 digest.
- Evidence integrity verification no longer reports every check as verified. It hashes the original image bytes from the stored data URL, hashes complete text only when the saved text byte count matches the original file size, and otherwise reports the verification as unavailable/pending rather than making a false claim.
- `computeSHA256` now requires the browser Web Crypto API instead of returning a non-cryptographic value labelled SHA-256.
- Added JSON export support for the local hash-chain ledger.
- Added password-derived AES-256-GCM encryption/decryption helpers in `src/utils/vaultCrypto.ts` using PBKDF2-SHA-256. The helper is not yet wired into the main SahayContext persistence layer; do not claim the whole vault is encrypted at rest until that integration is completed and tested.

## Still requires implementation/validation
- Integrate encrypted envelopes into `SahayContext` storage and build a reliable unlock/migration flow. Existing localStorage records are still plaintext until this is done.
- Add actual OCR engine support for general images/PDFs; the current OCR function primarily supports existing text/transcripts and manual correction.
- Verify metadata stripping against representative image files. Canvas PNG export strips common source metadata from the exported derivative, but this is not a general metadata-scrubbing guarantee for every file type.
- A local hash chain is not a digital signature and is not tamper-proof against an attacker who can rewrite all localStorage entries. Add an asymmetric signature design if required by the challenge.
- The exact fourth challenge statement was not included in the uploaded materials/chat, so it cannot be implemented accurately without guessing.

## Run locally
1. `npm install`
2. `npm run build`
3. `npm run dev`
