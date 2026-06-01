import { z } from 'zod'
import { optionalDateString } from '@/lib/schema-helpers'

export const userUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(60),
  lastName: z.string().min(1, 'Last name is required').max(60),
  dateOfBirth: optionalDateString,
})

export type UserUpdateValues = z.infer<typeof userUpdateSchema>
