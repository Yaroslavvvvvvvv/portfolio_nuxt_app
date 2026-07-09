import { setupYupLocale } from '~/utils/validation'

// Wire yup validation messages to i18n. $i18n is read at validation time
// (not plugin-init time), so it resolves in the current locale and avoids
// plugin-ordering issues.
export default defineNuxtPlugin((nuxtApp) => {
  setupYupLocale((key: string, params?: any) => {
    const i18n = nuxtApp.$i18n as any
    return i18n?.t ? i18n.t(key, params) : key
  })
})
