export default function Home() {
  return (
    <>
      <h1>Your table</h1>
      <p className="muted">Enter the number on your table to see your receipts and order updates.</p>
      <form action="/table" method="get" className="row" style={{ marginTop: 16 }}>
        <input name="n" inputMode="numeric" pattern="[0-9]*" placeholder="Table number" required style={{ flex: 1 }} />
        <button type="submit">Show</button>
      </form>
    </>
  )
}
