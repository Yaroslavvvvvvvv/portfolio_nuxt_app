<script setup lang="ts">
import * as yup from 'yup'
import { emailRule, validateSchema } from '~/utils/validation'

definePageMeta({ layout: false })

const { t } = useI18n()
const toast = useToast()
const email = ref('')
const password = ref('')
const fieldErrors = reactive<Record<string, string>>({ email: '', password: '' })
const serverError = ref('')
const showErrors = ref(false)
const loading = ref(false)
const { fetch: refreshSession } = useUserSession()

const schema = yup.object({
  email: emailRule(),
  password: yup.string().required(),
})

async function validateNow() {
  const { valid, errors } = await validateSchema(schema, {
    email: email.value,
    password: password.value,
  })
  fieldErrors.email = errors.email || ''
  fieldErrors.password = errors.password || ''
  return valid
}

// Complat-style: editing clears the stale server error and re-checks live.
watch([email, password], () => {
  serverError.value = ''
  if (showErrors.value) validateNow()
})

async function submit() {
  serverError.value = ''
  showErrors.value = true
  if (!(await validateNow())) return

  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await refreshSession()
    toast.add({ severity: 'success', summary: t('toast.loggedIn'), life: 3000 })
    await navigateTo('/admin')
  } catch (e: any) {
    serverError.value = serverErrorMessage(e, t, 'admin.loginError')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="login__topbar">
      <ClientOnly><HeaderLang /></ClientOnly>
      <ClientOnly><AppThemeToggle /></ClientOnly>
    </div>
    <form class="login__card" novalidate @submit.prevent="submit">
      <h1 class="login__title">{{ t('admin.loginTitle') }}</h1>
      <AppFieldInput
        v-model="email"
        name="email"
        type="email"
        :label="t('auth.email')"
        :error="fieldErrors.email"
      />
      <AppFieldInput
        v-model="password"
        name="password"
        type="password"
        :label="t('auth.password')"
        :error="fieldErrors.password"
      />
      <small v-if="serverError" class="form-field__error">{{ serverError }}</small>
      <Button type="submit" :label="t('action.login')" icon="pi pi-sign-in" size="large" :loading="loading" />
    </form>
  </div>
</template>
