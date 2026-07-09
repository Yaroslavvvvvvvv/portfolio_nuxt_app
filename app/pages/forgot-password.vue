<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
useSeoMeta({ title: () => t('auth.forgotTitle') })
const email = ref('')
const done = ref(false)
</script>

<template>
  <form class="auth__card" novalidate @submit.prevent="done = true">
    <h1>{{ t('auth.forgotTitle') }}</h1>
    <p class="auth__note">{{ t('auth.stubNote') }}</p>
    <AppFieldInput v-model="email" name="f-email" type="email" :label="t('auth.email')" />
    <Button type="submit" :label="t('auth.submit')" icon="pi pi-envelope" size="large" />
    <p v-if="done" class="is-muted">✓ demo</p>
    <div class="auth__links">
      <span />
      <NuxtLink to="/login">{{ t('auth.haveAccount') }}</NuxtLink>
    </div>
  </form>
</template>
