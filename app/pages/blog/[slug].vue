<script setup lang="ts">
const route = useRoute()
const { data: article } = await useFetch<any>(`/api/content/blog/${route.params.slug}`)
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}
const html = computed(() => sanitizeHtml(article.value?.content))
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
    <ClientOnly>
      <div class="pub-article__content" v-html="html" />
      <template #fallback>
        <p>{{ article.shortDescription }}</p>
      </template>
    </ClientOnly>
  </article>
</template>
