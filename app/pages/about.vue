<script setup lang="ts">
const { t } = useI18n()
const { data: page } = await useFetch<any>('/api/content/pages/about-page')
const html = computed(() => sanitizeHtml(page.value?.content))
</script>

<template>
  <article class="pub-article">
    <h1 class="pub-article__title">{{ page?.title || t('public.about') }}</h1>
    <ClientOnly>
      <div class="pub-article__content" v-html="html" />
    </ClientOnly>
  </article>
</template>
