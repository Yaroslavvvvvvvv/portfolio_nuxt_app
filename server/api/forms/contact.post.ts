// Public endpoint: receives the site contact form and stores it as a request.
export default defineEventHandler(async (event) => {
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
