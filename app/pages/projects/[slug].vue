<script setup lang="ts">
const route = useRoute()
const site = useSiteConfig()
const absoluteUrl = useAbsoluteUrl()
const { data: project } = await useFetch<any>(`/api/content/projects/${route.params.slug}`)
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}
const html = computed(() => sanitizeHtml(project.value?.content))

usePageSeo(() => ({
  title: project.value?.metaTitle || project.value?.title,
  description: project.value?.metaDescription || project.value?.description,
  image: project.value?.ogImage || project.value?.imagePath,
  type: 'article',
}))

useJsonLd(() => {
  const p = project.value
  if (!p) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.metaTitle || p.title,
    description: p.metaDescription || p.description || undefined,
    image: absoluteUrl(p.ogImage || p.imagePath),
    dateModified: p.updatedAt,
    url: absoluteUrl(route.path),
    creator: { '@type': 'Organization', name: site.name },
  }
})
</script>

<template>
  <article v-if="project" class="pub-article">
    <h1 class="pub-article__title">{{ project.title }}</h1>
    <div class="pub-article__meta">
      {{ [project.client, project.type, project.year].filter(Boolean).join(' · ') }}
    </div>
    <div
      v-if="project.imagePath"
      class="pub-article__media"
      :style="{ backgroundImage: `url(${project.imagePath})` }"
    />
    <p>{{ project.description }}</p>
    <div class="pub-article__content" v-html="html" />
  </article>
</template>
