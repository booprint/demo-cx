import Link from 'next/link'
import { notFound } from 'next/navigation'
import { toView } from '@/lib/receipts/view'
import { getReceipt } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stored = getReceipt(decodeURIComponent(id))
  if (!stored) notFound()
  const r = toView(stored)

  return (
    <>
      <p>
        <Link href={`/table/${r.table}`}>← Table {r.table}</Link>
      </p>
      <h1>{r.venue}</h1>
      <p className="muted">{new Date(r.issuedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>

      <div className="card">
        {r.lines.map((l, i) => (
          <div key={i} className="row">
            <span>
              {l.quantity} × {l.name}
            </span>
            <span>{l.amount}</span>
          </div>
        ))}
        <div className="row total" style={{ fontWeight: 400 }}>
          <span>Subtotal</span>
          <span>{r.subtotal}</span>
        </div>
        <div className="row">
          <span>Tax</span>
          <span>{r.tax}</span>
        </div>
        <div className="row">
          <span>Tip</span>
          <span>{r.tip}</span>
        </div>
        <div className="row total">
          <span>Total</span>
          <span>{r.total}</span>
        </div>
      </div>

      <p className="muted">{r.paid ? `Paid${r.paidWith ? ` · ${r.paidWith}` : ''}` : 'Not paid yet'}</p>
    </>
  )
}
