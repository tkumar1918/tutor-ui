import { z } from 'zod'
import { SUBJECT } from '@/types/api'

export const createRequestSchema = z.object({
  subject: z.enum(SUBJECT),
  message: z.string().min(1, 'Message is required').max(2000, 'Max 2000 characters'),
})

export const respondRequestSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
  tutorReply: z.string().max(2000).optional().or(z.literal('')),
})

export type CreateRequestValues = z.infer<typeof createRequestSchema>
export type RespondRequestValues = z.infer<typeof respondRequestSchema>
