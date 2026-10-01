import { NextResponse } from 'next/server'
import { toView } from '@/lib/receipts/view'
import { getReceipt } from '@/lib/store'

export const dynamic = 'force-dynamic'

/** One receipt as the guest sees it. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const receipt = getReceipt(id)
  if (!receipt) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json(toView(receipt))
}
