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

// The home hero is a full-screen banner that starts at the very top of the
// viewport, behind this header. The header stays transparent for exactly as long
// as the banner is behind it, and takes its background the moment the banner has
// scrolled away — or the mobile menu opens, which needs an opaque bar.
//
// An IntersectionObserver rather than a scroll handler: measuring the banner's
// position on every scroll frame would force a layout read 60 times a second.
const pastHero = ref(false)
const isHome = computed(() => route.path === '/')
const overlay = computed(() => isHome.value && !pastHero.value && !menuOpen.value)

let observer: IntersectionObserver | null = null
let pollFrame = 0

function headerHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-total')
  return Number.parseFloat(raw) || 0
}

function stopWatching() {
  observer?.disconnect()
  observer = null
  cancelAnimationFrame(pollFrame)
}

function attach(hero: Element) {
  // Shrink the viewport by the header's own height: the banner stops
  // "intersecting" the instant its bottom edge slides under the header.
  observer = new IntersectionObserver(
    ([entry]) => {
      pastHero.value = !entry!.isIntersecting
    },
    { rootMargin: `-${headerHeight()}px 0px 0px 0px`, threshold: 0 },
  )
  observer.observe(hero)
}

// The page transition is `out-in`: the old page leaves before the new one
// mounts, so right after navigating to `/` the banner does not exist yet.
// Wait for it across a few frames instead of giving up on the first tick.
function watchHero(framesLeft = 30) {
  stopWatching()

  if (!isHome.value) {
    pastHero.value = true // No banner here — solid header from the start.
    return
  }

  const hero = document.querySelector('.home-hero')
  if (hero) {
    attach(hero)
    return
  }
  if (framesLeft > 0) {
    pollFrame = requestAnimationFrame(() => watchHero(framesLeft - 1))
  }
}

onMounted(() => watchHero())

// The header outlives the page, so the banner it watches has to be re-acquired
// on every navigation — including back onto the home page.
watch(() => route.path, () => watchHero())

onBeforeUnmount(stopWatching)

// Editable from the admin's "Home page" screen. Without it the call to action
// falls back to the internal contacts page rather than rendering a dead link.
const { data: settings } = await useSiteSettings()
const telegram = computed(() => settings.value?.['contact.telegram'] || '')
const ctaExternal = computed(() => /^https?:\/\//i.test(telegram.value))

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
  <header
    class="pub-header"
    :class="{ 'pub-header--overlay': overlay, 'pub-header--menu': menuOpen }"
  >
    <div class="app-container pub-header__inner">
      <NuxtLink to="/" class="pub-header__brand">
        <IconLogo class="pub-header__mark" />
        <span class="pub-header__wordmark">Obsigma Studio</span>
      </NuxtLink>

      <nav
        id="pub-header-nav"
        class="pub-header__nav"
        :class="{ 'pub-header__nav--open': menuOpen }"
      >
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="pub-header__nav-link">
          {{ t(l.label) }}
        </NuxtLink>

        <!-- On mobile the panel replaces the desktop action cluster, so the call
             to action has to live inside it too. -->
        <a
          v-if="ctaExternal"
          :href="telegram"
          target="_blank"
          rel="noopener noreferrer"
          class="pub-header__cta pub-header__cta--mobile"
        >{{ t('public.writeTelegram') }}</a>
        <NuxtLink v-else to="/contacts" class="pub-header__cta pub-header__cta--mobile">
          {{ t('public.discussProject') }}
        </NuxtLink>
      </nav>

      <div class="pub-header__actions">
        <ClientOnly><HeaderLang variant="inline" /></ClientOnly>
        <ClientOnly><AppThemeToggle /></ClientOnly>

        <a
          v-if="ctaExternal"
          :href="telegram"
          target="_blank"
          rel="noopener noreferrer"
          class="pub-header__cta"
        >{{ t('public.writeTelegram') }}</a>
        <NuxtLink v-else to="/contacts" class="pub-header__cta">
          {{ t('public.discussProject') }}
        </NuxtLink>

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
