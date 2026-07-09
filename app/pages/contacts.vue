<script setup lang="ts">
import * as yup from 'yup'
import { emailRule, validateSchema } from '~/utils/validation'

const { t } = useI18n()
useSeoMeta({ title: () => t('contacts.title') })
const toast = useToast()
const form = reactive({ name: '', email: '', message: '' })
const fieldErrors = reactive<Record<string, string>>({ name: '', email: '', message: '' })
const sent = ref(false)
const loading = ref(false)
const showErrors = ref(false)

const schema = yup.object({
  name: yup.string().required(),
  email: emailRule(),
  message: yup.string().required(),
})

async function validateNow() {
  const { valid, errors } = await validateSchema(schema, { ...form })
  fieldErrors.name = errors.name || ''
  fieldErrors.email = errors.email || ''
  fieldErrors.message = errors.message || ''
  return valid
}

watch(form, () => {
  if (showErrors.value) validateNow()
})

async function submit() {
  showErrors.value = true
  if (!(await validateNow())) return

  loading.value = true
  try {
    await $fetch('/api/forms/contact', { method: 'POST', body: { ...form } })
    sent.value = true
    form.name = ''
    form.email = ''
    form.message = ''
    toast.add({ severity: 'success', summary: t('contacts.sent'), life: 3500 })
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: t('toast.error'),
      detail: serverErrorMessage(e, t),
      life: 4000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="pub-section app-container">
    <div class="pub-contacts">
      <div class="pub-contacts__info">
        <h1>{{ t('contacts.title') }}</h1>
        <dl>
          <dt>{{ t('contacts.address') }}</dt>
          <dd>Kyiv, Ukraine</dd>
          <dt>{{ t('contacts.phone') }}</dt>
          <dd>+380 00 000 0000</dd>
          <dt>{{ t('contacts.emailLabel') }}</dt>
          <dd>hello@example.com</dd>
        </dl>
      </div>

      <form class="pub-form" novalidate @submit.prevent="submit">
        <h2 style="margin: 0">{{ t('contacts.formTitle') }}</h2>
        <AppFieldInput v-model="form.name" name="c-name" :label="t('contacts.name')" :error="fieldErrors.name" />
        <AppFieldInput
          v-model="form.email"
          name="c-email"
          type="email"
          :label="t('contacts.emailLabel')"
          :error="fieldErrors.email"
        />
        <AppFieldTextarea
          v-model="form.message"
          name="c-message"
          :label="t('contacts.message')"
          :rows="4"
          :error="fieldErrors.message"
        />
        <Button type="submit" :label="t('action.send')" icon="pi pi-send" size="large" :loading="loading" />
        <p v-if="sent" class="is-muted">{{ t('contacts.sent') }}</p>
      </form>
    </div>
  </section>
</template>
