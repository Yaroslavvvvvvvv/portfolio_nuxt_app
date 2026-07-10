// Admin-only media upload. Returns { path } — the value stored in imagePath,
// ogImage, or a `Setting` such as home.heroVideo.
//
// `?kind=video` switches both the accepted formats and the size ceiling. It
// defaults to `image`, so an image field can never be fed a video by omitting
// the parameter.
export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const kind = getQuery(event).kind === 'video' ? 'video' : 'image'

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file?.data?.length) {
    throw createError({ statusCode: 422, statusMessage: 'server.noFile' })
  }
  if (file.data.length > maxBytesFor(kind)) {
    throw createError({
      statusCode: 413,
      statusMessage: kind === 'video' ? 'server.videoTooLarge' : 'server.imageTooLarge',
    })
  }

  // The browser's Content-Type is a hint, not evidence — sniff the magic bytes.
  const mime = sniffUploadMime(file.data, kind)
  if (!mime) {
    throw createError({
      statusCode: 422,
      statusMessage: kind === 'video' ? 'server.invalidVideo' : 'server.invalidImage',
    })
  }

  const path = await useStorage().put(buildKey(mime), file.data, mime)
  return { path }
})
