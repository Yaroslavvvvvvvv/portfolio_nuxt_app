import { THEME } from '~/utils/constants'

// Theme persistence via cookie (SSR-readable) + <html> class via useHead.
// Because the class is set during SSR, dark-mode users get no flash of light.
export default defineNuxtPlugin(() => {
  const app = useAppStore()
  const themeCookie = useCookie<string>('user_theme', {
    default: () => THEME.LIGHT,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  app.SET_THEME(themeCookie.value === THEME.DARK ? THEME.DARK : THEME.LIGHT)

  // applied on both server and client → no FOUC
  useHead({ htmlAttrs: { class: () => app.theme } })

  // persist toggles back to the cookie
  watch(
    () => app.theme,
    (v) => {
      themeCookie.value = v
    },
  )
})
