<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

// error.vue renders in place of the router view, so the i18n locale isn't applied
// here — resolve it from the cookie directly. The <html> theme class IS managed by
// the theme plugin (its global useHead stays active), so we only scope the local
// div; setting html class here too caused a conflicting entry that stuck on return.
const themeCookie = useCookie<string>('user_theme', { default: () => 'app-theme--light' })
const localeCookie = useCookie<string>('i18n_redirected')
const isUk = computed(() => (localeCookie.value || 'uk') === 'uk')
const is404 = computed(() => props.error?.statusCode === 404)

const title = computed(() =>
  is404.value
    ? isUk.value
      ? 'Сторінку не знайдено'
      : 'Page not found'
    : isUk.value
      ? 'Щось пішло не так'
      : 'Something went wrong',
)
const backLabel = computed(() => (isUk.value ? 'На головну' : 'Back to home'))

useHead({
  htmlAttrs: { lang: () => (isUk.value ? 'uk' : 'en') },
  title: () => title.value,
})
</script>

<template>
  <div class="pub-error" :class="themeCookie">
    <div class="pub-error__code">{{ error?.statusCode || 500 }}</div>
    <h1>{{ title }}</h1>
    <Button :label="backLabel" icon="pi pi-home" size="large" @click="clearError({ redirect: '/' })" />
  </div>
</template>
