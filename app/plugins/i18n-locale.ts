// Manual locale persistence (detectBrowserLanguage is off — it breaks SSR in v10).
// On SSR + client init we apply the locale saved in the i18n_redirected cookie;
// on the client we persist future switches back to that cookie. Because messages
// are bundled synchronously (i18n/i18n.config.ts), setLocale applies before render.
const SUPPORTED = ['uk', 'en']

export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = nuxtApp.$i18n as {
    locale: { value: string }
    setLocale: (l: string) => Promise<void>
  }
  const cookie = useCookie<string>('i18n_redirected', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const wanted = cookie.value
  if (wanted && SUPPORTED.includes(wanted) && wanted !== i18n.locale.value) {
    await i18n.setLocale(wanted)
  }

  // <html lang> for SEO — reactive so it follows locale switches (SSR + client).
  useHead({ htmlAttrs: { lang: () => i18n.locale.value } })

  if (import.meta.client) {
    watch(
      () => i18n.locale.value,
      (v) => {
        cookie.value = v
      },
    )
  }
})
