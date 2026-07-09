<script setup lang="ts">
const { t } = useI18n()
const { data: blog } = await useFetch<any[]>('/api/content/blog')
</script>

<template>
  <section class="pub-section app-container">
    <div class="pub-section__head"><h2>{{ t('blog.title') }}</h2></div>

    <div v-if="blog?.length" class="pub-grid">
      <NuxtLink v-for="b in blog" :key="b.id" :to="`/blog/${b.slug}`" class="pub-card">
        <div class="pub-card__media" :style="b.imagePath ? { backgroundImage: `url(${b.imagePath})` } : {}" />
        <div class="pub-card__body">
          <span class="pub-card__title">{{ b.title }}</span>
          <span class="pub-card__desc">{{ b.shortDescription }}</span>
          <div v-if="b.tags?.length" class="pub-card__tags">
            <span v-for="tg in b.tags" :key="tg" class="pub-tag">{{ tg }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
    <p v-else class="is-muted">{{ t('blog.empty') }}</p>
  </section>
</template>
