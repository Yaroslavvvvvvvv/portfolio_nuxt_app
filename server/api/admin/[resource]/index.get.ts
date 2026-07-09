export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const name = getRouterParam(event, 'resource')!
  return crudList(event, getCrud(name))
})
