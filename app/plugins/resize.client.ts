// Track viewport size in the app store (client only).
export default defineNuxtPlugin(() => {
  const app = useAppStore()
  const setSize = () => app.SET_RESIZE({ w: window.innerWidth, h: window.innerHeight })
  setSize()
  window.addEventListener('resize', setSize)
})
