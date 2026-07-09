const PREFIX = 'APP_ADMIN_STARTER'

function safeParse(value: string | null) {
  if (value === null || value === undefined || value === 'undefined') return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

// Prefixed, SSR-safe localStorage wrapper (no-ops on the server).
export const storage = {
  setItem(key: string, value: any) {
    if (!import.meta.client) return
    if (value === undefined) {
      localStorage.removeItem(`${PREFIX}_${key}`)
      return
    }
    localStorage.setItem(`${PREFIX}_${key}`, JSON.stringify(value))
  },
  getItem(key: string) {
    if (!import.meta.client) return null
    return safeParse(localStorage.getItem(`${PREFIX}_${key}`))
  },
  removeItem(key: string) {
    if (!import.meta.client) return
    localStorage.removeItem(`${PREFIX}_${key}`)
  },
}
