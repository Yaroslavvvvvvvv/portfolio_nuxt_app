<script setup lang="ts">
import { getResource } from '~/config/resources'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()
const { user } = useUserSession()
const { data: stats } = await useFetch<any[]>('/api/admin/stats')

function labelKey(name: string) {
  return getResource(name)?.labelPlural || name
}
function iconFor(name: string) {
  return getResource(name)?.icon || 'pi pi-folder'
}
</script>

<template>
  <div>
    <h1>{{ t('nav.dashboard') }}</h1>
    <p class="is-muted">{{ t('admin.welcome') }}, {{ user?.name || user?.email }}.</p>

    <div class="dash-stats">
      <NuxtLink v-for="s in stats" :key="s.name" :to="`/admin/${s.name}`" class="dash-stat">
        <div class="dash-stat__icon"><i :class="iconFor(s.name)" /></div>
        <div class="dash-stat__body">
          <div class="dash-stat__num">{{ s.total }}</div>
          <div class="dash-stat__label">{{ t(labelKey(s.name)) }}</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
