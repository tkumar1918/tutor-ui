import { z } from 'zod'
import { LEVEL, SUBJECT } from '@/types/api'

export const courseCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  subject: z.enum(SUBJECT),
  level: z.enum(LEVEL),
  priceCents: z.coerce.number().int().nonnegative('Price must be ≥ 0'),
})

export type CourseCreateInput = z.input<typeof courseCreateSchema>
export type CourseCreateValues = z.output<typeof courseCreateSchema>
