<script setup lang="ts">
const { t } = useI18n()
usePageSeo(() => ({ title: t('team.title'), description: t('meta.team') }))
const { data: team } = await useFetch<any[]>('/api/content/team')
</script>

<template>
  <section class="pub-section app-container">
    <div class="pub-section__head"><h2>{{ t('team.title') }}</h2></div>
    <p class="pub-subtitle">{{ t('team.subtitle') }}</p>

    <div v-if="team?.length" class="pub-team">
      <div v-for="m in team" :key="m.id" class="pub-member">
        <div class="pub-member__photo" :style="m.imagePath ? { backgroundImage: `url(${m.imagePath})` } : {}" />
        <div class="pub-member__name">{{ m.name }}</div>
        <div class="pub-member__role">{{ m.role }}</div>
        <div class="pub-member__bio">{{ m.bio }}</div>
      </div>
    </div>
    <p v-else class="is-muted">{{ t('team.empty') }}</p>
  </section>
</template>
