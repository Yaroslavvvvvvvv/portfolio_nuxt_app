<script setup lang="ts">
// Ported from Complat @core/AppField/AppFieldInput — FloatLabel + text/number/password.
const props = defineProps<{
  modelValue?: any
  type?: 'text' | 'email' | 'number' | 'password'
  label?: string
  name?: string
  error?: string | string[]
  inputProps?: Record<string, any>
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
      <Password
        v-if="type === 'password'"
        :input-id="id"
        v-model="value"
        :feedback="false"
        toggle-mask
        size="large"
        fluid
        v-bind="inputProps"
      />
      <InputNumber
        v-else-if="type === 'number'"
        :input-id="id"
        v-model="value"
        :use-grouping="false"
        size="large"
        fluid
        v-bind="inputProps"
      />
      <InputText
        v-else
        :id="id"
        v-model="value"
        :type="type || 'text'"
        size="large"
        fluid
        v-bind="inputProps"
      />
      <label v-if="label" :for="id">{{ label }}</label>
    </FloatLabel>
    <AppFieldErrors :errors="error" />
  </div>
</template>
