export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const names = Object.keys(crudRegistry)
  return Promise.all(
    names.map(async (name) => ({
      name,
      total: await crudRegistry[name]!.delegate.count({}),
    })),
  )
})
