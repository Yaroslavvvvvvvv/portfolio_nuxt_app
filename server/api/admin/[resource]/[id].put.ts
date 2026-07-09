export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const name = getRouterParam(event, 'resource')!
  return crudUpdate(event, getCrud(name))
})
