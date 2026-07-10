<script setup lang="ts">
import { resources } from '~/config/resources'

const { t } = useI18n()
const toast = useToast()
const { user, clear } = useUserSession()
const sidebarOpen = ref(false)

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  toast.add({ severity: 'success', summary: t('toast.loggedOut'), life: 3000 })
  await navigateTo('/admin/login')
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="admin">
    <aside class="admin__sidebar" :class="{ 'admin__sidebar--open': sidebarOpen }">
      <NuxtLink to="/admin" class="admin-brand" @click="closeSidebar">
        <span class="admin-brand__logo">Σ</span>
        <span>Obsigma</span>
      </NuxtLink>
      <nav class="admin-nav">
        <NuxtLink to="/admin" class="admin-nav__link" @click="closeSidebar">
          <i class="pi pi-home" /><span>{{ t('nav.dashboard') }}</span>
        </NuxtLink>
        <!-- Page-scoped settings, not a CRUD resource — hence not in the registry. -->
        <NuxtLink to="/admin/home" class="admin-nav__link" @click="closeSidebar">
          <i class="pi pi-desktop" /><span>{{ t('nav.homeSettings') }}</span>
        </NuxtLink>
        <NuxtLink
          v-for="r in resources"
          :key="r.name"
          :to="`/admin/${r.name}`"
          class="admin-nav__link"
          @click="closeSidebar"
        >
          <i :class="r.icon || 'pi pi-folder'" /><span>{{ t(r.labelPlural) }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <div v-if="sidebarOpen" class="admin__overlay" @click="closeSidebar" />

    <div class="admin__main">
      <header class="admin__topbar">
        <div class="admin__topbar-left">
          <button type="button" class="admin__burger" @click="sidebarOpen = true">
            <i class="pi pi-bars" />
          </button>
        </div>
        <div class="admin__actions">
          <HeaderLang />
          <AppThemeToggle />
          <div class="admin__user">
            <Avatar
              :label="(user?.name || user?.email || '?').charAt(0).toUpperCase()"
              shape="circle"
              style="background: var(--color-primary); color: #fff"
            />
            <span class="admin__user-email">{{ user?.email }}</span>
            <Button
              :label="t('action.logout')"
              icon="pi pi-sign-out"
              size="small"
              severity="secondary"
              text
              @click="logout"
            />
          </div>
        </div>
      </header>
      <main class="admin__content">
        <slot />
      </main>
    </div>
  </div>
</template>
