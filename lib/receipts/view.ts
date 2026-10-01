import type { StoredReceipt } from '../store'

/**
 * ReceiptView is what a guest sees. It drops the payment processor's reference and anything
 * else meant for staff: only the payment method and the card's last four digits remain.
 */
export interface ReceiptView {
  id: string
  venue: string
  table: number
  lines: { name: string; quantity: number; amount: string }[]
  subtotal: string
  tax: string
  tip: string
  total: string
  paid: boolean
  paidWith: string | null
  issuedAt: string
}

export function money(minor: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100)
}

export function toView(r: StoredReceipt): ReceiptView {
  const paidWith = r.payment ? (r.payment.method === 'card' && r.payment.card_last4 ? `Card ending ${r.payment.card_last4}` : r.payment.method === 'cash' ? 'Cash' : 'Card') : null
  return {
    id: r.receipt_id,
    venue: r.venue,
    table: r.table,
    lines: r.lines.map((l) => ({ name: l.name, quantity: l.quantity, amount: money(l.amount_minor, r.currency) })),
    subtotal: money(r.subtotal_minor, r.currency),
    tax: money(r.tax_minor, r.currency),
    tip: money(r.tip_minor, r.currency),
    total: money(r.total_minor, r.currency),
    paid: r.status === 'paid',
    paidWith,
    issuedAt: r.issued_at,
  }
}
