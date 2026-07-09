// Admin-only image upload. Returns { path } — the value stored in imagePath/ogImage.
export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file?.data?.length) {
    throw createError({ statusCode: 422, statusMessage: 'server.noFile' })
  }
  if (file.data.length > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'server.imageTooLarge' })
  }

  // The browser's Content-Type is a hint, not evidence — sniff the magic bytes.
  const mime = sniffImageMime(file.data)
  if (!mime) {
    throw createError({ statusCode: 422, statusMessage: 'server.invalidImage' })
  }

  const path = await useStorage().put(buildKey(mime), file.data, mime)
  return { path }
})
