<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const FLAG: Record<string, string> = { en: 'gb', uk: 'ua' }
const SHORT: Record<string, string> = { en: 'EN', uk: 'UA' }

const current = computed(
  () => (locales.value as any[]).find((l) => l.code === locale.value) || (locales.value as any[])[0],
)
const others = computed(() => (locales.value as any[]).filter((l) => l.code !== locale.value))

function toggle() {
  open.value = !open.value
}

function choose(code: string) {
  open.value = false
  if (code !== locale.value) setLocale(code as any)
}

function onOutside(e: MouseEvent) {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onOutside))
onBeforeUnmount(() => document.removeEventListener('click', onOutside))
</script>

<template>
  <div ref="rootRef" class="header-lang">
    <button
      type="button"
      class="header-lang__current"
      :aria-label="t('langSwitch.aria')"
      :aria-expanded="open"
      @click.stop="toggle"
    >
      <span>{{ SHORT[current.code] }}</span>
      <span class="header-lang__flag"><span :class="`fi fis fi-${FLAG[current.code]}`" /></span>
    </button>

    <transition name="header-lang-fade">
      <div v-if="open" class="header-lang__submenu">
        <button
          v-for="item in others"
          :key="item.code"
          type="button"
          class="header-lang__submenu-item"
          @click.stop="choose(item.code)"
        >
          <span class="header-lang__submenu-flag"><span :class="`fi fis fi-${FLAG[item.code]}`" /></span>
          {{ item.name }}
        </button>
      </div>
    </transition>
  </div>
</template>
