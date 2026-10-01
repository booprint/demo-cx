import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: "Boo's Restaurant",
  description: "Your receipts and order updates from Boo's Restaurant.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <Link href="/" className="brand">
            Boo’s Restaurant
          </Link>
        </header>
        <main className="page">{children}</main>
      </body>
    </html>
  )
}
