import { describe, it, expect } from 'vitest'
import { hashSecret, verifySecret } from '../server/utils/password'

describe('password (scrypt)', () => {
  it('hashes and verifies a correct password', () => {
    const hash = hashSecret('developer972')
    expect(hash).toContain(':')
    expect(verifySecret('developer972', hash)).toBe(true)
  })

  it('rejects a wrong password', () => {
    const hash = hashSecret('secret')
    expect(verifySecret('wrong', hash)).toBe(false)
  })

  it('produces a different hash each time (random salt)', () => {
    expect(hashSecret('same')).not.toBe(hashSecret('same'))
  })

  it('rejects a malformed stored hash', () => {
    expect(verifySecret('x', 'garbage')).toBe(false)
    expect(verifySecret('x', '')).toBe(false)
  })
})
