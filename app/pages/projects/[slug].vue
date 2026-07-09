<script setup lang="ts">
const route = useRoute()
const { data: project } = await useFetch<any>(`/api/content/projects/${route.params.slug}`)
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
}
const html = computed(() => sanitizeHtml(project.value?.content))
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
    <ClientOnly>
      <div class="pub-article__content" v-html="html" />
    </ClientOnly>
  </article>
</template>
