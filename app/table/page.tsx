import { redirect } from 'next/navigation'

export default async function TableLookup({ searchParams }: { searchParams: Promise<{ n?: string }> }) {
  const { n } = await searchParams
  const table = Number(n)
  redirect(Number.isInteger(table) && table > 0 ? `/table/${table}` : '/')
}
