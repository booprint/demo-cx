import { NextResponse } from 'next/server'
import { verifySignature } from '@/lib/receipts/verify'
import { upsertReceipt, type StoredReceipt } from '@/lib/store'

export const dynamic = 'force-dynamic'

/**
 * Receipt ingest, called by bill after every settlement, tip, void or payment.
 *
 * Signed: the raw body must carry a valid x-boo-signature (see lib/receipts/verify.ts).
 * Idempotent on receipt_id: a repeat replaces the stored copy.
 */
export async function POST(req: Request) {
  const body = await req.text()
  const check = verifySignature(body, req.headers.get('x-boo-timestamp'), req.headers.get('x-boo-signature'))
  if (!check.ok) {
    return NextResponse.json({ error: 'unauthorized', message: check.reason }, { status: 401 })
  }

  let receipt: Omit<StoredReceipt, 'received_at'>
  try {
    receipt = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  if (!receipt.receipt_id || !Number.isInteger(receipt.table) || !Array.isArray(receipt.lines)) {
    return NextResponse.json({ error: 'invalid', message: 'receipt_id, table and lines are required' }, { status: 422 })
  }

  const result = upsertReceipt({ ...receipt, received_at: new Date().toISOString() })
  return NextResponse.json({ receipt_id: receipt.receipt_id, result }, { status: result === 'created' ? 201 : 200 })
}
