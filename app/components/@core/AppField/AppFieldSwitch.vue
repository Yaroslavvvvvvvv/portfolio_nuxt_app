<script setup lang="ts">
// Ported from Complat @core/AppField/AppFieldSwitch — custom accessible toggle with label + hint.
const props = defineProps<{
  modelValue?: boolean
  label?: string
  hint?: string
  disabled?: boolean
  name?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [v: boolean]; change: [v: boolean] }>()

const id = computed(() => (props.name ? `app-switch-${props.name}` : 'app-switch'))

function toggle() {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div class="app-field-switch">
    <div class="app-field-switch__text">
      <label v-if="label" :for="id" class="app-field-switch__label">{{ label }}</label>
      <p v-if="hint" class="app-field-switch__hint">{{ hint }}</p>
    </div>
    <button
      :id="id"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="app-field-switch__toggle"
      :class="{
        'app-field-switch__toggle--on': modelValue,
        'app-field-switch__toggle--disabled': disabled,
      }"
      @click="toggle"
    >
      <span class="app-field-switch__track" />
      <span class="app-field-switch__handle" />
    </button>
  </div>
</template>
