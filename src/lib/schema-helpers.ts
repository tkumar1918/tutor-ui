import { z } from 'zod'

export const optionalDateString = z
  .string()
  .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'Use YYYY-MM-DD' })

export const emptyToUndefined = (v: string | undefined): string | undefined =>
  v && v.length > 0 ? v : undefined
