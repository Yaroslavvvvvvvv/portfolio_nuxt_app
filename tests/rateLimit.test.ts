import { describe, it, expect } from 'vitest'
import { isRateLimited, registerFailure, resetRateLimit } from '../server/utils/rateLimit'

describe('rateLimit', () => {
  it('allows under the limit and blocks at the limit', () => {
    const key = 'test:allow'
    resetRateLimit(key)
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key, 5, 60_000)).toBe(false)
      registerFailure(key, 60_000)
    }
    expect(isRateLimited(key, 5, 60_000)).toBe(true)
  })

  it('reset clears the counter', () => {
    const key = 'test:reset'
    for (let i = 0; i < 10; i++) registerFailure(key, 60_000)
    expect(isRateLimited(key, 5, 60_000)).toBe(true)
    resetRateLimit(key)
    expect(isRateLimited(key, 5, 60_000)).toBe(false)
  })

  it('keeps separate counters per key', () => {
    resetRateLimit('test:a')
    resetRateLimit('test:b')
    for (let i = 0; i < 6; i++) registerFailure('test:a', 60_000)
    expect(isRateLimited('test:a', 5, 60_000)).toBe(true)
    expect(isRateLimited('test:b', 5, 60_000)).toBe(false)
  })
})
