<script setup lang="ts">
// Global full-screen loader (ported from Complat @core/AppMainLoader).
const appStore = useAppStore()
</script>

<template>
  <div class="app-main-loader" :class="{ 'app-main-loader--active': appStore.isLoader }">
    <div class="app-main-loader__box">
      <span class="app-main-loader__logo"><i class="pi pi-bolt" /></span>
    </div>
  </div>
</template>
