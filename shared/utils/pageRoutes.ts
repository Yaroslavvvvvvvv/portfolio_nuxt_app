// Static pages that also have a dedicated public route. `/page/<slug>` keeps
// resolving, but the sitemap skips it and its canonical tag points at the
// dedicated route — otherwise Google sees the same content on two URLs.
export const DEDICATED_PAGE_ROUTES: Record<string, string> = {
  'about-page': '/about',
}
