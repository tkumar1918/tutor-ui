import { z } from 'zod'
import { optionalDateString } from '@/lib/schema-helpers'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Min 3 characters').max(50, 'Max 50 characters'),
  email: z.string().email('Invalid email').max(120),
  password: z.string().min(8, 'Min 8 characters').max(100, 'Max 100 characters'),
  firstName: z.string().min(1, 'First name is required').max(60),
  lastName: z.string().min(1, 'Last name is required').max(60),
  dateOfBirth: optionalDateString,
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
