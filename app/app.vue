<script setup lang="ts">
const route = useRoute()
// Complat pattern: offset the toast below the admin topbar; default corner elsewhere.
const toastPt = computed(() => ({
  root: { class: route.path.startsWith('/admin') ? 'p-toast--admin' : '' },
}))

// App-wide <title> management. Without this, document.title is never set, so
// browsers fall back to the URL — and on SPA navigation (e.g. returning from an
// error route) the stale URL sticks in the tab. Pages set their own title; those
// without one fall back to the site name.
const site = useSiteConfig()
useHead({
  titleTemplate: (title) => (title ? `${title} · ${site.name}` : site.name),
})
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
