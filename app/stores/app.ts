import { defineStore } from 'pinia'
import { THEME } from '~/utils/constants'

interface AppState {
  _theme: string
  _size: { w: number; h: number }
  _isLoader: boolean
  _isFixed: boolean
  _modal: Record<string, boolean>
  _sidebar: Record<string, boolean>
}

// Global UI store (theme, viewport, loader, modal/sidebar registries) —
// mirrors the Complat app store so ported components work unchanged.
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    _theme: THEME.LIGHT,
    _size: { w: 0, h: 0 },
    _isLoader: true,
    _isFixed: false,
    _modal: {},
    _sidebar: {},
  }),
  getters: {
    theme: (s) => s._theme,
    isDark: (s) => s._theme === THEME.DARK,
    size: (s) => s._size,
    isLoader: (s) => s._isLoader,
  },
  actions: {
    SET_THEME(theme: string) {
      // Persistence (cookie) + the <html> class are handled by the theme plugin
      // via useCookie + useHead — so this works on SSR and avoids a light flash.
      this._theme = theme
    },
    TOGGLE_THEME() {
      this.SET_THEME(this.isDark ? THEME.LIGHT : THEME.DARK)
    },
    SET_RESIZE(size: { w: number; h: number }) {
      this._size = size
    },
    SET_LOADER_STATUS(v: boolean) {
      this._isLoader = v
    },
    SET_FIXED_STATUS(v: boolean) {
      this._isFixed = v
      if (import.meta.client) document.documentElement.classList.toggle('app-fix', v)
    },
    MODAL_OPEN(t: string) {
      this._modal[t] = true
    },
    MODAL_CLOSE(t: string) {
      this._modal[t] = false
    },
    SIDEBAR_OPEN(t: string) {
      this._sidebar[t] = true
    },
    SIDEBAR_CLOSE(t: string) {
      this._sidebar[t] = false
    },
  },
})
