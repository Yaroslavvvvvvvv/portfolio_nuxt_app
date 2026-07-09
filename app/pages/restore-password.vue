<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
useSeoMeta({ title: () => t('auth.restoreTitle') })
const form = reactive({ password: '', confirm: '' })
const done = ref(false)
</script>

<template>
  <form class="auth__card" novalidate @submit.prevent="done = true">
    <h1>{{ t('auth.restoreTitle') }}</h1>
    <p class="auth__note">{{ t('auth.stubNote') }}</p>
    <AppFieldInput v-model="form.password" name="r-password" type="password" :label="t('auth.password')" />
    <AppFieldInput v-model="form.confirm" name="r-confirm" type="password" :label="t('auth.confirmPassword')" />
    <Button type="submit" :label="t('auth.submit')" icon="pi pi-check" size="large" />
    <p v-if="done" class="is-muted">✓ demo</p>
  </form>
</template>
