import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { allow, clientIp } from '@/lib/rate-limit'
import { addNotification } from '@/lib/store'

export const dynamic = 'force-dynamic'

/** Guest notifications ("your tab is closed"), posted by internal services. */
export async function POST(req: Request) {
  if (!allow(clientIp(req.headers), env.notifyRateLimit)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }
  let body: { kind?: string; table?: number; guest_first_name?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  if (!Number.isInteger(body.table) || typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json({ error: 'invalid', message: 'table and message are required' }, { status: 422 })
  }
  const notification = {
    id: randomUUID(),
    kind: body.kind ?? 'info',
    table: body.table as number,
    guest_first_name: body.guest_first_name,
    message: body.message.slice(0, 280),
    created_at: new Date().toISOString(),
  }
  addNotification(notification)
  return NextResponse.json({ id: notification.id }, { status: 201 })
}
