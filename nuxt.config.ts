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

  modules: [
    '@primevue/nuxt-module',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

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

  // Canonical origin for absolute URLs (canonical tags, og:image, sitemap).
  // Override per environment with NUXT_PUBLIC_SITE_URL.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: 'Starter',
  },

  robots: {
    // The admin SPA and the API have nothing to index.
    disallow: ['/admin', '/api/'],
  },

  sitemap: {
    // Static public routes are discovered automatically; the dynamic ones
    // (blog posts, project cases, static pages) come from the DB via this source.
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**', '/login', '/sign-up', '/forgot-password', '/restore-password'],
  },

  i18n: {
    // hreflang is intentionally absent: with `no_prefix` both locales share one
    // URL, so there is no alternate href to point at. Switching to
    // `prefix_except_default` would be a prerequisite.
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
    // Image uploads. Local disk in dev; set NUXT_STORAGE_DRIVER=s3 in production,
    // where the container filesystem is wiped on every redeploy.
    storage: {
      driver: 'local', // NUXT_STORAGE_DRIVER: 'local' | 's3'
      uploadDir: '.data/uploads', // NUXT_STORAGE_UPLOAD_DIR
      s3Endpoint: '', // NUXT_STORAGE_S3_ENDPOINT
      s3Bucket: '', // NUXT_STORAGE_S3_BUCKET
      s3Region: 'auto', // NUXT_STORAGE_S3_REGION
      s3AccessKeyId: '', // NUXT_STORAGE_S3_ACCESS_KEY_ID
      s3SecretAccessKey: '', // NUXT_STORAGE_S3_SECRET_ACCESS_KEY
      s3PublicUrl: '', // NUXT_STORAGE_S3_PUBLIC_URL
    },

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
