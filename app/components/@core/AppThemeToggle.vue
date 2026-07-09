<script setup lang="ts">
const appStore = useAppStore()
const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    class="app-theme-toggle"
    :class="{ 'app-theme-toggle--dark': appStore.isDark }"
    :aria-label="t('themeToggle.aria')"
    :aria-pressed="appStore.isDark"
    @click="appStore.TOGGLE_THEME()"
  >
    <span class="app-theme-toggle__handle">
      <IconSun class="app-theme-toggle__icon app-theme-toggle__icon--sun" />
      <IconMoon class="app-theme-toggle__icon app-theme-toggle__icon--moon" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.app-theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 52px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background-color: #dee0e5;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

  &--dark {
    background-color: #2a2b34;
  }

  &__handle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #1b2f47;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  &--dark &__handle {
    background-color: #25b0ed;
    transform: translateX(24px);
  }

  &__icon {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 15px;
    height: 15px;
    transition: opacity 0.3s ease;

    &--moon {
      opacity: 0;
    }
  }

  &--dark &__icon {
    &--sun {
      opacity: 0;
    }
    &--moon {
      opacity: 1;
    }
  }
}
</style>
