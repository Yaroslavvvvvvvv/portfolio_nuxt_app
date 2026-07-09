<script setup lang="ts">
const route = useRoute()
const site = useSiteConfig()
const absoluteUrl = useAbsoluteUrl()
const { data: article } = await useFetch<any>(`/api/content/blog/${route.params.slug}`)
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}
const html = computed(() => sanitizeHtml(article.value?.content))

usePageSeo(() => ({
  title: article.value?.metaTitle || article.value?.title,
  description: article.value?.metaDescription || article.value?.shortDescription,
  image: article.value?.ogImage || article.value?.imagePath,
  type: 'article',
}))

useJsonLd(() => {
  const a = article.value
  if (!a) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.metaTitle || a.title,
    description: a.metaDescription || a.shortDescription || undefined,
    image: absoluteUrl(a.ogImage || a.imagePath),
    datePublished: a.createdAt,
    dateModified: a.updatedAt,
    mainEntityOfPage: absoluteUrl(route.path),
    publisher: { '@type': 'Organization', name: site.name },
  }
})
</script>

<template>
  <article v-if="article" class="pub-article">
    <h1 class="pub-article__title">{{ article.title }}</h1>
    <div class="pub-article__meta">{{ article.shortDescription }}</div>
    <div
      v-if="article.imagePath"
      class="pub-article__media"
      :style="{ backgroundImage: `url(${article.imagePath})` }"
    />
    <div class="pub-article__content" v-html="html" />
  </article>
</template>
