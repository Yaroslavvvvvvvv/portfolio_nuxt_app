const MAX_SUBMISSIONS = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

// Public endpoint: receives the site contact form and stores it as a request.
export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `contact:${ip}`

  // Spam protection: unauthenticated endpoint that writes to the DB, so every
  // submission counts toward the limit — not just the rejected ones.
  if (isRateLimited(key, MAX_SUBMISSIONS, WINDOW_MS)) {
    throw createError({ statusCode: 429, statusMessage: 'server.tooManyRequests' })
  }
  registerHit(key, WINDOW_MS)

  const body = await readBody(event)
  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const message = String(body?.message ?? '').trim()

  if (!name || !email || !message || message.length > 5000) {
    throw createError({ statusCode: 422, statusMessage: 'server.invalidData' })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw createError({ statusCode: 422, statusMessage: 'server.invalidEmail' })
  }

  await prisma.contactRequest.create({ data: { name, email, message } })
  return { ok: true }
})
