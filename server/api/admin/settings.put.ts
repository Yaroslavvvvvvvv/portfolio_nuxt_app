export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 422, statusMessage: 'server.invalidData' })
  }
  // Unknown keys are ignored by writeSettings, not persisted.
  return writeSettings(body)
})
