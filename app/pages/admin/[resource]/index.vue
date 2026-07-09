<script setup lang="ts">
import { getResource } from '~/config/resources'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const resource = computed(() => getResource(route.params.resource as string))
</script>

<template>
  <ResourceTable v-if="resource" :key="resource.name" :resource="resource" />
  <div v-else>
    <h1>Ресурс не знайдено</h1>
  </div>
</template>
