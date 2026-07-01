import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { qk } from '@/lib/api/query-keys'
import {
  createTutorReview,
  deleteReview,
  listTutorReviews,
  updateReview,
  type ListTutorReviewsParams,
} from './api'
import type { ReviewCreateRequest, ReviewUpdateRequest } from '@/types/api'

export function useTutorReviews(params: ListTutorReviewsParams) {
  return useQuery({
    queryKey: qk.reviews.forTutor(params.tutorId, params.pageable),
    queryFn: () => listTutorReviews(params),
    placeholderData: keepPreviousData,
  })
}

function createReviewErrorMessage(e: ApiError): string {
  switch (e.status) {
    case 409:
      return 'You have already reviewed this tutor — edit your existing review instead.'
    case 422:
      return e.message || 'You can only review a tutor after they accept a session request with you.'
    case 400:
      return e.message || 'Rating must be between 1 and 5.'
    default:
      return e.message
  }
}

export function useCreateTutorReview(tutorId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ReviewCreateRequest) => createTutorReview(tutorId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.reviews.all })
      qc.invalidateQueries({ queryKey: qk.tutors.detail(tutorId) })
      qc.invalidateQueries({ queryKey: qk.tutors.all })
      toast.success('Review posted')
    },
    onError: (e: ApiError) => toast.error(createReviewErrorMessage(e)),
  })
}

export function useUpdateReview(tutorId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ReviewUpdateRequest }) =>
      updateReview(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.reviews.all })
      qc.invalidateQueries({ queryKey: qk.tutors.detail(tutorId) })
      qc.invalidateQueries({ queryKey: qk.tutors.all })
      toast.success('Review updated')
    },
    onError: (e: ApiError) =>
      toast.error(e.status === 400 ? e.message || 'Rating must be between 1 and 5.' : e.message),
  })
}

export function useDeleteReview(tutorId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.reviews.all })
      qc.invalidateQueries({ queryKey: qk.tutors.detail(tutorId) })
      qc.invalidateQueries({ queryKey: qk.tutors.all })
      toast.success('Review deleted')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}
