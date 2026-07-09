// Hides the global loader once the app is ready and after every navigation.
// (Initial value is `true` in the store → loader shows on first render.)
export default defineNuxtPlugin((nuxtApp) => {
  const stop = () => useAppStore().SET_LOADER_STATUS(false)
  nuxtApp.hook('app:suspense:resolve', stop)
  nuxtApp.hook('page:finish', stop)
})
