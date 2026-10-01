/** Fixed-window rate limit per key (here, per client IP). */
const windows = new Map<string, { start: number; count: number }>()

export function allow(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now()
  const w = windows.get(key)
  if (!w || now - w.start >= windowMs) {
    windows.set(key, { start: now, count: 1 })
    return true
  }
  w.count += 1
  return w.count <= limit
}

/** The caller's IP: the first x-forwarded-for entry, as the load balancer sets it. */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim() || headers.get('x-real-ip') || 'unknown'
}
