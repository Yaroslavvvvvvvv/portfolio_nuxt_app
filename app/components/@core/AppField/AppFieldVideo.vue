<script setup lang="ts">
// Video field: uploads through /api/admin/upload?kind=video and stores the
// returned path. Mirrors AppFieldImage — the path stays editable as text, so an
// external URL (CDN, R2) keeps working.
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

const id = computed(() => props.name || 'video')

async function onPick(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''
  try {
    const body = new FormData()
    body.append('file', file)
    const { path } = await $fetch<{ path: string }>('/api/admin/upload', {
      method: 'POST',
      query: { kind: 'video' },
      body,
    })
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
  <div class="app-field app-field--video">
    <FloatLabel variant="on">
      <InputText :id="id" v-model="value" size="large" fluid />
      <label v-if="label" :for="id">{{ label }}</label>
    </FloatLabel>

    <div class="app-field__image-row">
      <!-- `muted` + `playsinline` mirror how the hero renders it, so the preview
           shows what the visitor will actually see. -->
      <video
        v-if="value && !previewFailed"
        :key="value"
        class="app-field__preview app-field__preview--video"
        muted
        loop
        playsinline
        controls
        preload="metadata"
        @error="previewFailed = true"
      >
        <source :src="value">
      </video>
      <div v-else class="app-field__preview app-field__preview--video app-field__preview--empty">
        <i class="pi pi-video" />
      </div>

      <div class="app-field__image-actions">
        <input ref="input" type="file" accept="video/mp4,video/webm" hidden @change="onPick">
        <Button
          type="button"
          :label="t('form.uploadVideo')"
          icon="pi pi-upload"
          severity="secondary"
          size="small"
          :loading="uploading"
          @click="input?.click()"
        />
        <Button
          v-if="value"
          type="button"
          :label="t('form.removeVideo')"
          icon="pi pi-times"
          severity="secondary"
          text
          size="small"
          :disabled="uploading"
          @click="clear"
        />
      </div>
    </div>

    <small class="form-field__help">{{ t('form.videoHint') }}</small>
    <AppFieldErrors :errors="uploadError || error" />
  </div>
</template>
