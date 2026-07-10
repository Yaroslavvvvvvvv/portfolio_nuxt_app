<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="auth">
    <div class="auth__topbar">
      <ClientOnly><HeaderLang /></ClientOnly>
      <ClientOnly><AppThemeToggle /></ClientOnly>
    </div>
    <div class="auth__grid">
      <aside class="auth__aside">
        <div class="auth__banner-title">Obsigma</div>
        <div class="auth__banner-text">{{ t('public.heroText') }}</div>
      </aside>
      <div class="auth__main">
        <slot />
      </div>
    </div>
  </div>
</template>
