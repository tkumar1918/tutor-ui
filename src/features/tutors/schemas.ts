import { z } from 'zod'
import { EXPERTISE } from '@/types/api'

export const tutorProfileSchema = z.object({
  bio: z.string().max(1000).optional().or(z.literal('')),
  qualifications: z.string().max(500).optional().or(z.literal('')),
  yearsOfExperience: z.coerce.number().int().min(0, 'Must be ≥ 0').max(60, 'Max 60'),
  expertise: z.enum(EXPERTISE),
  hourlyRate: z.coerce.number().nonnegative('Must be ≥ 0'),
})

export type TutorProfileInput = z.input<typeof tutorProfileSchema>
export type TutorProfileValues = z.output<typeof tutorProfileSchema>
