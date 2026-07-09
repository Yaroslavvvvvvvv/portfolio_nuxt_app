<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
const email = ref('')
const password = ref('')
const done = ref(false)
</script>

<template>
  <form class="auth__card" novalidate @submit.prevent="done = true">
    <h1>{{ t('auth.loginTitle') }}</h1>
    <p class="auth__note">{{ t('auth.stubNote') }}</p>
    <AppFieldInput v-model="email" name="a-email" type="email" :label="t('auth.email')" />
    <AppFieldInput v-model="password" name="a-password" type="password" :label="t('auth.password')" />
    <Button type="submit" :label="t('auth.submit')" icon="pi pi-sign-in" size="large" />
    <p v-if="done" class="is-muted">✓ demo</p>
    <div class="auth__links">
      <NuxtLink to="/forgot-password">{{ t('auth.forgot') }}</NuxtLink>
      <NuxtLink to="/sign-up">{{ t('auth.noAccount') }}</NuxtLink>
    </div>
  </form>
</template>
