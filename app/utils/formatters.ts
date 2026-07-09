import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

export function formatCurrency(value: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

export function formatDate(date: string | number | Date, format = 'L'): string {
  return dayjs(date).format(format)
}

export function formatNumber(number: number, toFractionDigit = 2, toString = false) {
  let result: any = Number(number.toFixed(toFractionDigit))
  if (toString) {
    const parts = result.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (parts.length > 1 && parts[1].length === 1) parts[1] += '0'
    result = parts.join('.')
  }
  return result
}

// EN/UK/RU pluralization: pluralize(5, 'кредит', 'кредити', 'кредитів') → "5 кредитів"
export function pluralize(value: number, one: string, few: string, many: string): string {
  const n = Math.abs(value)
  const mod10 = n % 10
  const mod100 = n % 100
  let word: string
  if (mod100 >= 11 && mod100 <= 19) word = many
  else if (mod10 === 1) word = one
  else if (mod10 >= 2 && mod10 <= 4) word = few
  else word = many
  return `${value} ${word}`
}

// Safe nested getter: nestedValue({ a: { b: 'x' } }, 'a.b') → 'x'
export function nestedValue(obj: any, path: string, fallback: any = '—') {
  if (!obj || !path) return fallback
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj) ?? fallback
}
