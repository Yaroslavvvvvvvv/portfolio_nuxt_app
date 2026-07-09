<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
useSeoMeta({ title: () => t('auth.signupTitle') })
const form = reactive({ name: '', email: '', password: '' })
const done = ref(false)
</script>

<template>
  <form class="auth__card" novalidate @submit.prevent="done = true">
    <h1>{{ t('auth.signupTitle') }}</h1>
    <p class="auth__note">{{ t('auth.stubNote') }}</p>
    <AppFieldInput v-model="form.name" name="s-name" :label="t('auth.name')" />
    <AppFieldInput v-model="form.email" name="s-email" type="email" :label="t('auth.email')" />
    <AppFieldInput v-model="form.password" name="s-password" type="password" :label="t('auth.password')" />
    <Button type="submit" :label="t('auth.submit')" icon="pi pi-user-plus" size="large" />
    <p v-if="done" class="is-muted">✓ demo</p>
    <div class="auth__links">
      <span />
      <NuxtLink to="/login">{{ t('auth.haveAccount') }}</NuxtLink>
    </div>
  </form>
</template>
