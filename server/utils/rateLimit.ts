// Simple in-memory fixed-window rate limiter (per key, e.g. per IP).
// Good enough for a single-instance app; swap for Redis if you scale horizontally.
interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function sweep(now: number) {
  if (buckets.size < 1000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key)
  }
}

// True if the key has already hit the max within the current window.
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) return false
  return bucket.count >= max
}

// Count one attempt against the key. Callers decide what counts: login only
// registers failures, public forms register every submission.
export function registerHit(key: string, windowMs: number): void {
  const now = Date.now()
  sweep(now)
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
  } else {
    bucket.count++
  }
}

// Clear the key (e.g. on a successful login).
export function resetRateLimit(key: string): void {
  buckets.delete(key)
}
