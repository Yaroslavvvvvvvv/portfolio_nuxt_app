import * as yup from 'yup'

// Ported from Complat (models/custom/validation.js + utils/yup-locale.js).
// yup rule builders + i18n-wired messages.

let _t: (key: string, params?: any) => string = (key) => key
export const translate = (key: string, params?: any) => _t(key, params)

// Wire yup's default messages to i18n (called once from a plugin).
export function setupYupLocale(t: (key: string, params?: any) => string) {
  _t = t
  yup.setLocale({
    mixed: {
      required: () => t('validation.required'),
      notType: () => t('validation.wrongInput'),
    },
    string: {
      email: () => t('validation.email'),
      min: ({ min }: any) => t('validation.minLength', { length: min }),
      max: ({ max }: any) => t('validation.maxLength', { length: max }),
    },
    number: {
      min: ({ min }: any) => t('validation.minValue', { value: min }),
      max: ({ max }: any) => t('validation.maxValue', { value: max }),
    },
  })
}

// ---- Regex constants ----
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.-]*$/u
export const NAME_MIN = 2
export const NAME_MAX = 50

// ---- Reusable field-rule builders ----
export const emailRule = ({ max = null as number | null, required = true } = {}) => {
  let s = yup.string().nullable().email()
  if (max) s = s.max(max)
  if (required) s = s.required()
  return s
}

export const passwordRule = ({ min = 8 as number | null, max = null as number | null, required = true } = {}) => {
  let s = yup.string().nullable()
  if (required) s = s.required()
  if (min) s = s.min(min)
  if (max) s = s.max(max)
  return s
}

export const passwordConfirmRule = (ref: string) =>
  yup
    .string()
    .nullable()
    .required()
    .oneOf([yup.ref(ref)], () => translate('validation.passwordsMatch'))

export const textRule = ({ required = false, min = null as number | null, max = null as number | null } = {}) => {
  let s = yup.string().nullable()
  if (required) s = s.required()
  if (min) s = s.min(min)
  if (max) s = s.max(max)
  return s
}

export const personNameRule = ({ required = true } = {}) => {
  let s = yup.string().nullable()
  if (required) s = s.required()
  return s
    .min(NAME_MIN)
    .max(NAME_MAX)
    .matches(NAME_REGEX, { excludeEmptyString: true, message: () => translate('validation.nameFormat') })
}

// Validate values against a yup schema → { valid, errors: { field: message } }
export async function validateSchema(
  schema: yup.AnySchema | yup.ObjectSchema<any>,
  values: Record<string, any>,
): Promise<{ valid: boolean; errors: Record<string, string> }> {
  try {
    await (schema as any).validate(values, { abortEarly: false })
    return { valid: true, errors: {} }
  } catch (e: any) {
    const errors: Record<string, string> = {}
    if (e?.inner?.length) {
      for (const err of e.inner) {
        if (err.path && !errors[err.path]) errors[err.path] = err.message
      }
    } else if (e?.path) {
      errors[e.path] = e.message
    }
    return { valid: false, errors }
  }
}
