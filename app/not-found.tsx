import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <p className="muted">We couldn’t find that. Check the table number and try again.</p>
      <Link href="/">Back</Link>
    </>
  )
}
