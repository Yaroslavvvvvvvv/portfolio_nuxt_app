import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// Brand navy (#1b2f47) primary scale for PrimeVue components (from Complat design system).
const AdminPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f0f3f7',
      100: '#d9e0ea',
      200: '#b3c1d5',
      300: '#8da2bf',
      400: '#4d6a8f',
      500: '#1b2f47',
      600: '#182a40',
      700: '#142335',
      800: '#101b2a',
      900: '#0c1420',
      950: '#060a10',
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f7f8fa',
          100: '#eaecf0',
          200: '#cfd3db',
          300: '#a9afbb',
          400: '#767d8c',
          500: '#4b5262',
          600: '#383f4d',
          700: '#2b2f3b',
          800: '#242732',
          900: '#1c1d27',
          950: '#161720',
        },
      },
    },
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  modules: ['@primevue/nuxt-module', 'nuxt-auth-utils', '@pinia/nuxt', '@nuxtjs/i18n'],

  components: [{ path: '~/components', pathPrefix: false }],

  css: ['primeicons/primeicons.css', 'flag-icons/css/flag-icons.min.css', '~/assets/scss/main.scss'],

  primevue: {
    options: {
      theme: {
        preset: AdminPreset,
        options: {
          darkModeSelector: '.app-theme--dark',
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue',
          },
        },
      },
    },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'uk',
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'uk', name: 'Українська' },
      { code: 'en', name: 'English' },
    ],
    // detectBrowserLanguage is disabled: in v10 + no_prefix + SSR it forces `en`
    // regardless of the cookie. Locale persistence is handled manually in
    // app/plugins/i18n-locale.ts (reads/writes the i18n_redirected cookie).
    detectBrowserLanguage: false,
  },

  // Session (nuxt-auth-utils): 1-day expiry + hardened cookie. Password from NUXT_SESSION_PASSWORD.
  runtimeConfig: {
    session: {
      // password is overridden at runtime by NUXT_SESSION_PASSWORD; '' is just the
      // typed default that enables that env override (SessionConfig requires it).
      password: '',
      maxAge: 60 * 60 * 24,
      cookie: {
        sameSite: 'lax',
      },
    },
  },

  // Public site = SSR (SEO); admin panel = client-only SPA
  routeRules: {
    '/admin/**': { ssr: false },
  },
})
