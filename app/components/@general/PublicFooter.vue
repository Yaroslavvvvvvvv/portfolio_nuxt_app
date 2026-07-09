<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="pub-footer">
    <div class="app-container pub-footer__inner">
      <span>© {{ 2026 }} Admin Starter</span>
      <NuxtLink to="/admin">{{ t('public.toAdmin') }}</NuxtLink>
    </div>
  </footer>
</template>
