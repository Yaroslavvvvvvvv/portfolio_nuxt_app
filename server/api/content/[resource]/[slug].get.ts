export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'resource')!
  const slug = getRouterParam(event, 'slug')!
  const cfg = getPublicCfg(name)
  const row = await cfg.delegate.findFirst({ where: { slug, isPublished: true } })
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return row
})
