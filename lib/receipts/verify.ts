import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from '../env'

/**
 * Checks bill's signature: HMAC-SHA256 over "<timestamp>.<body>" with the shared key, sent as
 * x-boo-signature (hex) and x-boo-timestamp (unix seconds). Old timestamps are refused so a
 * captured request can't be replayed later.
 */
export function verifySignature(body: string, timestamp: string | null, signature: string | null): { ok: true } | { ok: false; reason: string } {
  if (!timestamp || !signature) return { ok: false, reason: 'missing signature headers' }
  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(age) || age > env.signatureMaxAge) return { ok: false, reason: 'timestamp outside the allowed window' }

  const expected = createHmac('sha256', env.ingestSigningKey).update(`${timestamp}.${body}`).digest()
  let given: Buffer
  try {
    given = Buffer.from(signature, 'hex')
  } catch {
    return { ok: false, reason: 'signature is not hex' }
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: 'signature mismatch' }
  return { ok: true }
}
