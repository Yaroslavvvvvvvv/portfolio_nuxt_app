export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'resource')!
  const cfg = getPublicCfg(name)
  return cfg.delegate.findMany({ where: { isPublished: true }, orderBy: cfg.order })
})
