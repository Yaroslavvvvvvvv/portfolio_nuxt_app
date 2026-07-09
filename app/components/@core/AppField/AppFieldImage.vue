<script setup lang="ts">
// Image field: uploads through /api/admin/upload and stores the returned path.
// The path stays editable as text so existing external URLs keep working.
const props = defineProps<{
  modelValue?: string | null
  label?: string
  name?: string
  error?: string | string[]
}>()

const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const { t } = useI18n()

const value = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v),
})

const input = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadError = ref('')
const previewFailed = ref(false)

watch(value, () => {
  previewFailed.value = false
})

const id = computed(() => props.name || 'image')

async function onPick(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''
  try {
    const body = new FormData()
    body.append('file', file)
    const { path } = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body })
    value.value = path
  } catch (e: any) {
    uploadError.value = serverErrorMessage(e, t)
  } finally {
    uploading.value = false
    // Let the same file be picked again after a failure.
    if (input.value) input.value.value = ''
  }
}

function clear() {
  value.value = ''
  uploadError.value = ''
}
</script>

<template>
  <div class="app-field app-field--image">
    <FloatLabel variant="on">
      <InputText :id="id" v-model="value" size="large" fluid />
      <label v-if="label" :for="id">{{ label }}</label>
    </FloatLabel>

    <div class="app-field__image-row">
      <img
        v-if="value && !previewFailed"
        :src="value"
        :alt="label || ''"
        class="app-field__preview"
        @error="previewFailed = true"
      >
      <div v-else class="app-field__preview app-field__preview--empty">
        <i class="pi pi-image" />
      </div>

      <div class="app-field__image-actions">
        <input
          ref="input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          hidden
          @change="onPick"
        >
        <Button
          type="button"
          :label="t('form.uploadImage')"
          icon="pi pi-upload"
          severity="secondary"
          size="small"
          :loading="uploading"
          @click="input?.click()"
        />
        <Button
          v-if="value"
          type="button"
          :label="t('form.removeImage')"
          icon="pi pi-times"
          severity="secondary"
          text
          size="small"
          :disabled="uploading"
          @click="clear"
        />
      </div>
    </div>

    <AppFieldErrors :errors="uploadError || error" />
  </div>
</template>
