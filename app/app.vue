<script setup lang="ts">
const route = useRoute()
// Complat pattern: offset the toast below the admin topbar; default corner elsewhere.
const toastPt = computed(() => ({
  root: { class: route.path.startsWith('/admin') ? 'p-toast--admin' : '' },
}))
</script>

<template>
  <div>
    <AppMainLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Toast position="top-right" :pt="toastPt" />
      <ConfirmDialog />
    </ClientOnly>
  </div>
</template>

<style>
/* Page transition — soft opacity fade + slight lift */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Layout transition — soft fade */
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.22s ease;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
