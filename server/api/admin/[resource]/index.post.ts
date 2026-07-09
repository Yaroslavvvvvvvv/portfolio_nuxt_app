export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const name = getRouterParam(event, 'resource')!
  return crudCreate(event, getCrud(name))
})
