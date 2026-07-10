import { prisma } from './prisma'

// Every setting the admin is allowed to write, and nothing else. Same idea as
// `fillable` in the CRUD engine: an unknown key from the client is dropped
// rather than persisted.
//
// `locale: '*'` marks a value that reads the same in every language. Localised
// copy will store one row per locale under the same key.
export const SETTING_KEYS = ['home.heroVideo', 'home.heroImage', 'contact.telegram'] as const

export type SettingKey = (typeof SETTING_KEYS)[number]

const ALLOWED = new Set<string>(SETTING_KEYS)

export type SettingsMap = Partial<Record<SettingKey, string | null>>

export async function readSettings(): Promise<SettingsMap> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [...SETTING_KEYS] } } })
  const out: SettingsMap = {}
  for (const row of rows) out[row.key as SettingKey] = row.value
  return out
}

// Empty strings are stored as null so "not set" has one representation.
export async function writeSettings(input: Record<string, unknown>): Promise<SettingsMap> {
  const entries = Object.entries(input).filter(([key]) => ALLOWED.has(key))

  await prisma.$transaction(
    entries.map(([key, raw]) => {
      const value = typeof raw === 'string' && raw.trim() ? raw.trim() : null
      return prisma.setting.upsert({
        where: { key_locale: { key, locale: '*' } },
        update: { value },
        create: { key, locale: '*', value },
      })
    }),
  )

  return readSettings()
}
