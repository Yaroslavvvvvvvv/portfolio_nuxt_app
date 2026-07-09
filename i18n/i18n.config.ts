import en from './locales/en.json'
import uk from './locales/uk.json'

// Messages are bundled synchronously here (not lazy-loaded) so SSR never renders
// a fallback locale during the async message-load race. The `locales` array in
// nuxt.config still drives the switcher + browser/cookie detection.
export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'uk',
  messages: { en, uk },
}))
