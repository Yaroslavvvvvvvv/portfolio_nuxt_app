<script setup lang="ts">
// Rich-text field (PrimeVue Editor → Quill). Images never end up as base64 in
// the database: both the toolbar button and clipboard pastes are intercepted and
// routed through /api/admin/upload, and only the returned URL is inserted.
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

const uploadError = ref('')
let quill: any = null

async function upload(file: File): Promise<string | null> {
  uploadError.value = ''
  try {
    const body = new FormData()
    body.append('file', file)
    const { path } = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body })
    return path
  } catch (e: any) {
    uploadError.value = serverErrorMessage(e, t)
    return null
  }
}

function insertImage(url: string) {
  const range = quill.getSelection(true)
  quill.insertEmbed(range.index, 'image', url, 'user')
  quill.setSelection(range.index + 1, 0)
}

// Toolbar image button → file picker → upload → insert URL.
function pickImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp,image/gif,image/avif'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    const url = await upload(file)
    if (url) insertImage(url)
  }
  input.click()
}

// Pasting or dropping an image would otherwise embed it as a base64 data: URI.
async function onPasteOrDrop(event: ClipboardEvent | DragEvent) {
  const items = 'clipboardData' in event ? event.clipboardData?.files : event.dataTransfer?.files
  const file = items?.[0]
  if (!file?.type.startsWith('image/')) return

  event.preventDefault()
  const url = await upload(file)
  if (url) insertImage(url)
}

function onLoad({ instance }: { instance: any }) {
  quill = instance
  instance.getModule('toolbar').addHandler('image', pickImage)
  instance.root.addEventListener('paste', onPasteOrDrop, true)
  instance.root.addEventListener('drop', onPasteOrDrop, true)
}

onBeforeUnmount(() => {
  quill?.root?.removeEventListener('paste', onPasteOrDrop, true)
  quill?.root?.removeEventListener('drop', onPasteOrDrop, true)
})

const id = computed(() => props.name || 'editor')
</script>

<template>
  <div class="app-field app-field--editor">
    <label v-if="label" :for="id" class="app-field__label">{{ label }}</label>
    <Editor
      :id="id"
      v-model="value"
      editor-style="height: 320px"
      @load="onLoad"
    />
    <AppFieldErrors :errors="uploadError || error" />
  </div>
</template>
