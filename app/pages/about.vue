<script setup lang="ts">
const { t } = useI18n()
const { data: page } = await useFetch<any>('/api/content/pages/about-page')
const html = computed(() => sanitizeHtml(page.value?.content))

usePageSeo(() => ({
  title: page.value?.metaTitle || t('about.title'),
  description: page.value?.metaDescription || t('meta.about'),
  image: page.value?.ogImage,
}))
</script>

<template>
  <article class="pub-article">
    <h1 class="pub-article__title">{{ page?.title || t('public.about') }}</h1>
    <div class="pub-article__content" v-html="html" />
  </article>
</template>
