<script setup lang="ts">
const { t } = useI18n()
const { data: services } = await useFetch<any[]>('/api/content/services')
</script>

<template>
  <section class="pub-section app-container">
    <div class="pub-section__head"><h2>{{ t('servicesPage.title') }}</h2></div>
    <p class="pub-subtitle">{{ t('servicesPage.subtitle') }}</p>

    <div v-if="services?.length" class="pub-services">
      <div v-for="s in services" :key="s.id" class="pub-service">
        <div class="pub-service__icon"><i :class="s.icon || 'pi pi-star'" /></div>
        <h3 class="pub-service__title">{{ s.title }}</h3>
        <p class="pub-service__text">{{ s.description }}</p>
      </div>
    </div>
    <p v-else class="is-muted">{{ t('servicesPage.empty') }}</p>
  </section>
</template>
