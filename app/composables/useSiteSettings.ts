type SettingsMap = Record<string, string | null>

// Shared across the header (every page) and the home page. The fixed key makes
// Nuxt reuse one payload instead of refetching per component.
export function useSiteSettings() {
  return useAsyncData<SettingsMap>('site-settings', () => $fetch('/api/content/settings'), {
    default: () => ({}),
  })
}
