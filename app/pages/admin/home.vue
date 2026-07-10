<script setup lang="ts">
// Home page settings. Not a CRUD resource — a single row of key/value settings,
// so it gets its own screen instead of going through ResourceTable/ResourceForm.
definePageMeta({ layout: 'admin' })

const { t } = useI18n()
const toast = useToast()

const { data, refresh } = await useFetch<Record<string, string | null>>('/api/admin/settings')

const form = reactive({ heroVideo: '', heroImage: '', telegram: '' })
const saving = ref(false)
const error = ref('')

watchEffect(() => {
  form.heroVideo = data.value?.['home.heroVideo'] ?? ''
  form.heroImage = data.value?.['home.heroImage'] ?? ''
  form.telegram = data.value?.['contact.telegram'] ?? ''
})

async function save() {
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: {
        'home.heroVideo': form.heroVideo,
        'home.heroImage': form.heroImage,
        'contact.telegram': form.telegram,
      },
    })
    await refresh()
    toast.add({ severity: 'success', summary: t('toast.updated'), life: 2200 })
  } catch (e: any) {
    error.value = serverErrorMessage(e, t)
    toast.add({ severity: 'error', summary: error.value, life: 4000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <h1>{{ t('nav.homeSettings') }}</h1>
    <p class="is-muted">{{ t('admin.homeSettingsHint') }}</p>

    <form class="resource-form" novalidate @submit.prevent="save">
      <AppFieldVideo
        v-model="form.heroVideo"
        name="heroVideo"
        :label="t('fields.heroVideo')"
        :error="error"
      />

      <div class="form-field">
        <AppFieldImage v-model="form.heroImage" name="heroImage" :label="t('fields.heroImage')" />
        <small class="form-field__help">{{ t('form.heroImageHint') }}</small>
      </div>

      <div class="form-field">
        <AppFieldInput v-model="form.telegram" name="telegram" :label="t('fields.telegram')" />
        <small class="form-field__help">{{ t('form.telegramHint') }}</small>
      </div>

      <div class="resource-form__actions">
        <Button type="submit" :label="t('action.save')" icon="pi pi-check" :loading="saving" />
      </div>
    </form>
  </div>
</template>
