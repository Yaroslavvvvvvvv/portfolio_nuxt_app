import { describe, it, expect } from 'vitest'
import * as yup from 'yup'
import { emailRule, validateSchema } from '../app/utils/validation'

describe('validation', () => {
  const schema = yup.object({ email: emailRule() })

  it('accepts a valid email', async () => {
    const { valid, errors } = await validateSchema(schema, { email: 'a@b.com' })
    expect(valid).toBe(true)
    expect(errors).toEqual({})
  })

  it('rejects an invalid email', async () => {
    const { valid, errors } = await validateSchema(schema, { email: 'not-an-email' })
    expect(valid).toBe(false)
    expect(errors.email).toBeTruthy()
  })

  it('rejects an empty required email', async () => {
    const { valid, errors } = await validateSchema(schema, { email: '' })
    expect(valid).toBe(false)
    expect(errors.email).toBeTruthy()
  })

  it('collects all field errors at once', async () => {
    const multi = yup.object({
      email: emailRule(),
      name: yup.string().required(),
    })
    const { valid, errors } = await validateSchema(multi, { email: 'bad', name: '' })
    expect(valid).toBe(false)
    expect(Object.keys(errors).length).toBe(2)
  })
})
