<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const menuOpen = ref(false)

const links = [
  { to: '/projects', label: 'nav.projects' },
  { to: '/services', label: 'nav.services' },
  { to: '/team', label: 'nav.team' },
  { to: '/blog', label: 'nav.blog' },
  { to: '/contacts', label: 'nav.contacts' },
]

watch(() => route.path, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="pub-header">
    <div class="app-container pub-header__inner">
      <NuxtLink to="/" class="pub-header__brand">Starter</NuxtLink>
      <nav class="pub-header__nav" :class="{ 'pub-header__nav--open': menuOpen }">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{ t(l.label) }}</NuxtLink>
      </nav>
      <div class="pub-header__actions">
        <ClientOnly><HeaderLang /></ClientOnly>
        <ClientOnly><AppThemeToggle /></ClientOnly>
        <NuxtLink to="/admin" class="pub-header__admin">{{ t('public.toAdmin') }}</NuxtLink>
        <button type="button" class="pub-header__burger" @click="menuOpen = !menuOpen">
          <i class="pi pi-bars" />
        </button>
      </div>
    </div>
  </header>
</template>
