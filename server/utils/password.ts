import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

// Self-contained password hashing (node:crypto scrypt). Format: "<salt>:<hash>".
// Used by both the seed script and the login endpoint, so they stay in sync.
export function hashSecret(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifySecret(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuf = Buffer.from(hash, 'hex')
  const testBuf = scryptSync(password, salt, 64)
  return hashBuf.length === testBuf.length && timingSafeEqual(hashBuf, testBuf)
}
