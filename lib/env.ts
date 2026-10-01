/**
 * customer-experience configuration.
 *
 * INGEST_SIGNING_KEY must match bill's WORKSPACE_SIGNING_KEY, or every receipt is rejected.
 */
const ingestSigningKey = process.env.INGEST_SIGNING_KEY ?? 'dev-only-signing-key'

if (!process.env.INGEST_SIGNING_KEY) {
  console.warn('[env] INGEST_SIGNING_KEY is not set; using the development key')
}

export const env = {
  ingestSigningKey,
  /** Where receipts and notifications are kept (JSON files). */
  dataDir: process.env.DATA_DIR ?? '.data',
  /** Notify calls allowed per IP per minute. */
  notifyRateLimit: Number(process.env.NOTIFY_RATE_LIMIT ?? 30),
  /** How old a signed receipt may be, in seconds. */
  signatureMaxAge: Number(process.env.SIGNATURE_MAX_AGE ?? 300),
}
