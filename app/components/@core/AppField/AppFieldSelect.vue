<script setup lang="ts">
// Ported from Complat @core/AppField/AppFieldSelect — FloatLabel + Select / MultiSelect.
const props = defineProps<{
  modelValue?: any
  label?: string
  name?: string
  options?: any[]
  optionLabel?: string
  optionValue?: string
  multiple?: boolean
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
      <MultiSelect
        v-if="multiple"
        :input-id="id"
        v-model="value"
        :options="options"
        :option-label="optionLabel || 'label'"
        :option-value="optionValue"
        size="large"
        fluid
      />
      <Select
        v-else
        :input-id="id"
        v-model="value"
        :options="options"
        :option-label="optionLabel || 'label'"
        :option-value="optionValue"
        size="large"
        fluid
      />
      <label v-if="label" :for="id">{{ label }}</label>
    </FloatLabel>
    <AppFieldErrors :errors="error" />
  </div>
</template>
