<script setup lang="ts">
import type { ResourceConfig, ResourceField } from '~/config/resources/types'

const props = defineProps<{
  resource: ResourceConfig
  modelValue?: Record<string, any>
  submitLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{ submit: [data: Record<string, any>] }>()
const { t } = useI18n()

function initialFieldValue(f: ResourceField) {
  const raw = props.modelValue?.[f.name]
  if (f.type === 'boolean') return raw ?? false
  if (f.type === 'number') return raw ?? null
  if (f.type === 'list') return Array.isArray(raw) ? raw.join(', ') : (raw ?? '')
  return raw ?? ''
}

function buildInitial() {
  const obj: Record<string, any> = {}
  for (const f of props.resource.fields) {
    obj[f.name] = initialFieldValue(f)
  }
  return obj
}

const form = ref(buildInitial())
watch(
  () => props.modelValue,
  () => {
    form.value = buildInitial()
  },
)

const errors = ref<Record<string, string>>({})

function validate() {
  errors.value = {}
  for (const f of props.resource.fields) {
    const v = form.value[f.name]
    if (f.required && (v === '' || v === null || v === undefined)) {
      errors.value[f.name] = t('validation.required')
    }
  }
  return Object.keys(errors.value).length === 0
}

function buildPayload() {
  const out: Record<string, any> = {}
  for (const f of props.resource.fields) {
    const v = form.value[f.name]
    if (f.type === 'list') {
      out[f.name] = String(v || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else {
      out[f.name] = v
    }
  }
  return out
}

function onSubmit() {
  if (!validate()) return
  emit('submit', buildPayload())
}
</script>

<template>
  <form class="resource-form" novalidate @submit.prevent="onSubmit">
    <template v-for="f in resource.fields" :key="f.name">
      <AppFieldSwitch
        v-if="f.type === 'boolean'"
        v-model="form[f.name]"
        :name="f.name"
        :label="t(f.label)"
      />

      <div v-else class="resource-form__field">
        <AppFieldTextarea
          v-if="f.type === 'textarea'"
          v-model="form[f.name]"
          :name="f.name"
          :label="t(f.label)"
          :error="errors[f.name]"
        />
        <AppFieldEditor
          v-else-if="f.type === 'richtext'"
          v-model="form[f.name]"
          :name="f.name"
          :label="t(f.label)"
          :error="errors[f.name]"
        />
        <AppFieldImage
          v-else-if="f.type === 'image'"
          v-model="form[f.name]"
          :name="f.name"
          :label="t(f.label)"
          :error="errors[f.name]"
        />
        <AppFieldInput
          v-else-if="f.type === 'number'"
          v-model="form[f.name]"
          :name="f.name"
          :label="t(f.label)"
          type="number"
          :input-props="f.props"
          :error="errors[f.name]"
        />
        <AppFieldInput
          v-else
          v-model="form[f.name]"
          :name="f.name"
          :label="t(f.label)"
          :error="errors[f.name]"
        />

        <small v-if="f.type === 'list'" class="form-field__help">{{ t('form.commaSeparated') }}</small>
        <small v-if="f.help" class="form-field__help">{{ t(f.help) }}</small>
      </div>
    </template>

    <div class="resource-form__actions">
      <Button type="submit" :label="submitLabel || t('action.save')" icon="pi pi-check" size="large" :loading="loading" />
      <NuxtLink :to="`/admin/${resource.name}`">
        <Button :label="t('action.cancel')" severity="secondary" text />
      </NuxtLink>
    </div>
  </form>
</template>
