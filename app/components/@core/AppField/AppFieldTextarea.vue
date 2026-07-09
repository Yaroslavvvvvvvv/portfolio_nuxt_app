<script setup lang="ts">
// Ported from Complat @core/AppField/AppFieldTextarea — FloatLabel + Textarea.
const props = defineProps<{
  modelValue?: any
  label?: string
  name?: string
  rows?: number | string
  error?: string | string[]
}>()

const emit = defineEmits<{ 'update:modelValue': [v: any] }>()

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const id = computed(() => props.name || 'field')
</script>

<template>
  <div class="app-field">
    <FloatLabel variant="on">
      <Textarea :id="id" v-model="value" :rows="rows || 4" auto-resize size="large" fluid />
      <label v-if="label" :for="id">{{ label }}</label>
    </FloatLabel>
    <AppFieldErrors :errors="error" />
  </div>
</template>
