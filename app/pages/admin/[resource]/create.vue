<script setup lang="ts">
import { getResource } from '~/config/resources'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const resource = getResource(route.params.resource as string)
if (!resource || resource.creatable === false) {
  throw createError({ statusCode: 404, statusMessage: t('error.resourceNotFound') })
}

const api = useResource(resource)
const loading = ref(false)

async function onSubmit(data: Record<string, any>) {
  loading.value = true
  try {
    await api.create(data)
    toast.add({ severity: 'success', summary: t('toast.created'), life: 2200 })
    await navigateTo(`/admin/${resource.name}`)
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: t('toast.error'),
      detail: serverErrorMessage(e, t),
      life: 4500,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1>{{ t('admin.createTitle', { label: t(resource.label) }) }}</h1>
    <ResourceForm :resource="resource" :loading="loading" @submit="onSubmit" />
  </div>
</template>
