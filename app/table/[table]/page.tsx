import Link from 'next/link'
import { notFound } from 'next/navigation'
import { toView } from '@/lib/receipts/view'
import { notificationsForTable, receiptsForTable } from '@/lib/store'

export const dynamic = 'force-dynamic'

/** Everything for one table: notifications first, then receipts. */
export default async function TablePage({ params }: { params: Promise<{ table: string }> }) {
  const table = Number((await params).table)
  if (!Number.isInteger(table) || table <= 0) notFound()

  const notes = notificationsForTable(table).slice(0, 5)
  const receipts = receiptsForTable(table).map(toView)

  return (
    <>
      <h1>Table {table}</h1>

      {notes.length > 0 && (
        <section>
          <h2>Updates</h2>
          {notes.map((n) => (
            <div key={n.id} className="card">
              <div>{n.message}</div>
              <div className="muted">{new Date(n.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2>Receipts</h2>
        {receipts.length === 0 && <p className="muted">Nothing yet. Receipts show up here once your order is settled.</p>}
        {receipts.map((r) => (
          <Link key={r.id} href={`/receipts/${encodeURIComponent(r.id)}`} className="card row" style={{ color: 'inherit', textDecoration: 'none' }}>
            <span>
              {r.lines.length} item{r.lines.length === 1 ? '' : 's'}
              <span className="muted"> · {new Date(r.issuedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </span>
            <span>
              <b>{r.total}</b> <span className="pill">{r.paid ? 'Paid' : 'Open'}</span>
            </span>
          </Link>
        ))}
      </section>
    </>
  )
}
