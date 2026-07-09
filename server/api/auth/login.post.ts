const MAX_ATTEMPTS = 8
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `login:${ip}`

  // Brute-force protection: block once too many failed attempts pile up per IP.
  if (isRateLimited(key, MAX_ATTEMPTS, WINDOW_MS)) {
    throw createError({ statusCode: 429, statusMessage: 'server.tooManyAttempts' })
  }

  const { email, password } = await readBody(event)

  const user = await prisma.user.findUnique({ where: { email: String(email ?? '') } })
  if (!user || !verifySecret(String(password ?? ''), user.passwordHash)) {
    registerFailure(key, WINDOW_MS) // only failed attempts count toward the limit
    throw createError({ statusCode: 401, statusMessage: 'server.invalidCredentials' })
  }

  resetRateLimit(key) // successful login clears the counter
  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })

  return { ok: true }
})
