import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be 1–5').max(5, 'Rating must be 1–5'),
  comment: z.string().max(1000, 'Max 1000 characters').optional().or(z.literal('')),
})

export type ReviewValues = z.infer<typeof reviewSchema>
