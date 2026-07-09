<script setup lang="ts">
const route = useRoute()
const { data: page } = await useFetch<any>(`/api/content/pages/${route.params.slug}`)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}
const html = computed(() => sanitizeHtml(page.value?.content))

usePageSeo(() => ({
  title: page.value?.metaTitle || page.value?.title,
  description: page.value?.metaDescription,
  image: page.value?.ogImage,
  canonicalPath: DEDICATED_PAGE_ROUTES[String(route.params.slug)],
}))
</script>

<template>
  <article v-if="page" class="pub-article">
    <h1 class="pub-article__title">{{ page.title }}</h1>
    <div class="pub-article__content" v-html="html" />
  </article>
</template>
