// Branded fallback so pages without their own artwork still get a social preview
// instead of an empty card. Overridden per record by the admin `ogImage` field.
const DEFAULT_OG_IMAGE = '/og-default.png'

export interface PageSeo {
  title?: string | null
  description?: string | null
  /** Social preview image. Relative paths are resolved against the site origin. */
  image?: string | null
  type?: 'website' | 'article'
  /** Marks the page as non-indexable (auth stubs, thin pages). */
  noindex?: boolean
  /** Point the canonical link elsewhere when the same content has a preferred URL. */
  canonicalPath?: string
}

// Resolve a site-relative path against the site origin. Both Open Graph and
// JSON-LD require absolute URLs, so anything user-entered goes through here.
export function useAbsoluteUrl() {
  const site = useSiteConfig()
  return (path?: string | null): string | undefined => {
    if (!path) return undefined
    if (/^https?:\/\//i.test(path)) return path
    return new URL(path, site.url).toString()
  }
}

// Single entry point for per-page SEO: title, description, Open Graph,
// Twitter cards and the canonical link. Pass a getter so the values stay
// reactive while `useFetch` data resolves.
export function usePageSeo(source: () => PageSeo) {
  const site = useSiteConfig()
  const route = useRoute()
  const toAbsolute = useAbsoluteUrl()

  const canonical = computed(() => new URL(source().canonicalPath || route.path, site.url).toString())
  const image = computed(() => toAbsolute(source().image || DEFAULT_OG_IMAGE))

  useSeoMeta({
    title: () => source().title || undefined,
    description: () => source().description || undefined,
    robots: () => (source().noindex ? 'noindex, nofollow' : undefined),

    ogTitle: () => source().title || undefined,
    ogDescription: () => source().description || undefined,
    ogType: () => source().type ?? 'website',
    ogUrl: () => canonical.value,
    ogSiteName: site.name,
    ogImage: () => image.value,

    twitterCard: () => (image.value ? 'summary_large_image' : 'summary'),
    twitterTitle: () => source().title || undefined,
    twitterDescription: () => source().description || undefined,
    twitterImage: () => image.value,
  })

  useHead({ link: [{ rel: 'canonical', href: canonical }] })
}

// Inject a JSON-LD block. `<` is escaped so a stray "</script>" inside any
// string value cannot break out of the script tag.
export function useJsonLd(data: () => Record<string, any> | null) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => {
          const value = data()
          return value ? JSON.stringify(value).replace(/</g, '\\u003C') : ''
        }),
      },
    ],
  })
}
