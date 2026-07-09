<script setup lang="ts">
const { t } = useI18n()
const { data: projects } = await useFetch<any[]>('/api/content/projects')
</script>

<template>
  <section class="pub-section app-container">
    <div class="pub-section__head"><h2>{{ t('projects.title') }}</h2></div>
    <p class="pub-subtitle">{{ t('projects.subtitle') }}</p>

    <div v-if="projects?.length" class="pub-grid">
      <NuxtLink v-for="p in projects" :key="p.id" :to="`/projects/${p.slug}`" class="pub-card">
        <div class="pub-card__media" :style="p.imagePath ? { backgroundImage: `url(${p.imagePath})` } : {}" />
        <div class="pub-card__body">
          <span class="pub-card__title">{{ p.title }}</span>
          <span class="pub-card__desc">{{ p.description }}</span>
          <div class="pub-project__meta"><span>{{ p.client }} · {{ p.type }}</span><span>{{ p.year }}</span></div>
        </div>
      </NuxtLink>
    </div>
    <p v-else class="is-muted">{{ t('projects.empty') }}</p>
  </section>
</template>
