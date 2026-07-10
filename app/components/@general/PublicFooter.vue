<script setup lang="ts">
const { t } = useI18n()

// Computed once per render. SSR and the client agree except across a New Year
// boundary mid-session, where a stale year is harmless.
const year = new Date().getFullYear()
</script>

<template>
  <footer class="pub-footer">
    <div class="app-container pub-footer__inner">
      <span>© {{ year }} Obsigma</span>
      <NuxtLink to="/admin">{{ t('public.toAdmin') }}</NuxtLink>
    </div>
  </footer>
</template>
