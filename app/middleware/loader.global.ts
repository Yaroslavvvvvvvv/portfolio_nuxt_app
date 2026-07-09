// Show the global loader when entering the admin area (from outside it).
export default defineNuxtRouteMiddleware((to, from) => {
  if (!import.meta.client) return
  const enteringAdmin = to.path.startsWith('/admin') && !from.path.startsWith('/admin')
  if (enteringAdmin) {
    useAppStore().SET_LOADER_STATUS(true)
  }
})
