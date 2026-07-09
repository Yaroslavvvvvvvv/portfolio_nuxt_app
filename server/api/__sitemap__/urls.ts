// Dynamic sitemap entries: every published record that has a public detail route.
// Static routes (/, /blog, /projects, …) are discovered by @nuxtjs/sitemap itself.
export default defineSitemapEventHandler(async () => {
  const [posts, projects, pages] = await Promise.all([
    prisma.blog.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.project.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.staticPage.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ])

  return [
    ...posts.map((p) => ({ loc: `/blog/${p.slug}`, lastmod: p.updatedAt })),
    ...projects.map((p) => ({ loc: `/projects/${p.slug}`, lastmod: p.updatedAt })),
    ...pages
      // Pages served by a dedicated route (e.g. /about) are already listed there.
      .filter((p) => !DEDICATED_PAGE_ROUTES[p.slug])
      .map((p) => ({ loc: `/page/${p.slug}`, lastmod: p.updatedAt })),
  ]
})
