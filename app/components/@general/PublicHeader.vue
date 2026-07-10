<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const app = useAppStore()
const menuOpen = ref(false)

const links = [
  { to: '/projects', label: 'nav.projects' },
  { to: '/services', label: 'nav.services' },
  { to: '/team', label: 'nav.team' },
  { to: '/blog', label: 'nav.blog' },
  { to: '/contacts', label: 'nav.contacts' },
]

const MOBILE_MAX = 768

function close() {
  menuOpen.value = false
}

// The open panel covers the viewport, so the page behind it must not scroll.
watch(menuOpen, (open) => app.SET_FIXED_STATUS(open))

watch(() => route.path, close)

// Resizing past the breakpoint hides the panel via CSS; release the lock too,
// otherwise the desktop page stays unscrollable.
watch(() => app.size.w, (w) => {
  if (w > MOBILE_MAX) close()
})

onBeforeUnmount(() => app.SET_FIXED_STATUS(false))
</script>

<template>
  <header class="pub-header">
    <div class="app-container pub-header__inner">
      <NuxtLink to="/" class="pub-header__brand">Obsigma</NuxtLink>

      <nav
        id="pub-header-nav"
        class="pub-header__nav"
        :class="{ 'pub-header__nav--open': menuOpen }"
      >
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="pub-header__nav-link">
          {{ t(l.label) }}
        </NuxtLink>
        <NuxtLink to="/admin" class="pub-header__nav-admin">{{ t('public.toAdmin') }}</NuxtLink>
      </nav>

      <div class="pub-header__actions">
        <ClientOnly><HeaderLang /></ClientOnly>
        <ClientOnly><AppThemeToggle /></ClientOnly>
        <NuxtLink to="/admin" class="pub-header__admin">{{ t('public.toAdmin') }}</NuxtLink>

        <button
          type="button"
          class="pub-header__burger"
          :aria-expanded="menuOpen"
          :aria-label="t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')"
          aria-controls="pub-header-nav"
          @click="menuOpen = !menuOpen"
        >
          <i
            class="pi pi-bars pub-header__burger-icon"
            :class="{ 'pub-header__burger-icon--visible': !menuOpen }"
          />
          <i
            class="pi pi-times pub-header__burger-icon"
            :class="{ 'pub-header__burger-icon--visible': menuOpen }"
          />
        </button>
      </div>
    </div>
  </header>
</template>
