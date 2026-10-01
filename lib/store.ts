import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { env } from './env'

/** A small JSON-file store: one file per collection, rewritten on every change. */
export interface StoredReceipt {
  receipt_id: string
  venue: string
  table: number
  lines: { name: string; quantity: number; amount_minor: number }[]
  subtotal_minor: number
  tax_minor: number
  tip_minor: number
  total_minor: number
  currency: string
  status: string
  issued_at: string
  payment: { method: string; card_last4?: string; processor_ref?: string } | null
  received_at: string
}

export interface Notification {
  id: string
  kind: string
  table: number
  guest_first_name?: string
  message: string
  created_at: string
}

function file(name: string) {
  mkdirSync(env.dataDir, { recursive: true })
  return join(env.dataDir, `${name}.json`)
}

function read<T>(name: string): T[] {
  try {
    return JSON.parse(readFileSync(file(name), 'utf8')) as T[]
  } catch {
    return []
  }
}

function write<T>(name: string, rows: T[]) {
  const path = file(name)
  writeFileSync(`${path}.tmp`, JSON.stringify(rows, null, 2))
  renameSync(`${path}.tmp`, path)
}

/** Inserts or replaces by receipt_id: bill pushes the same receipt again when it changes. */
export function upsertReceipt(r: StoredReceipt): 'created' | 'updated' {
  const rows = read<StoredReceipt>('receipts')
  const i = rows.findIndex((x) => x.receipt_id === r.receipt_id)
  if (i >= 0) rows[i] = r
  else rows.push(r)
  write('receipts', rows)
  return i >= 0 ? 'updated' : 'created'
}

export function getReceipt(id: string): StoredReceipt | undefined {
  return read<StoredReceipt>('receipts').find((r) => r.receipt_id === id)
}

export function receiptsForTable(table: number): StoredReceipt[] {
  return read<StoredReceipt>('receipts')
    .filter((r) => r.table === table)
    .sort((a, b) => b.issued_at.localeCompare(a.issued_at))
}

export function addNotification(n: Notification) {
  const rows = read<Notification>('notifications')
  rows.push(n)
  write('notifications', rows.slice(-1000))
}

export function notificationsForTable(table: number): Notification[] {
  return read<Notification>('notifications')
    .filter((n) => n.table === table)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}
