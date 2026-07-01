import { api, pageableToParams, unwrap } from '@/lib/api/client'
import type {
  ApiResponse,
  PageResponse,
  Pageable,
  ReviewCreateRequest,
  ReviewResponse,
  ReviewUpdateRequest,
} from '@/types/api'

export interface ListTutorReviewsParams {
  tutorId: number
  pageable: Pageable
}

export async function listTutorReviews(params: ListTutorReviewsParams) {
  const res = await api.get<ApiResponse<PageResponse<ReviewResponse>>>(
    `/v1/tutors/${params.tutorId}/reviews`,
    { params: pageableToParams(params.pageable) },
  )
  return unwrap(res)
}

export async function createTutorReview(tutorId: number, body: ReviewCreateRequest) {
  const res = await api.post<ApiResponse<ReviewResponse>>(
    `/v1/tutors/${tutorId}/reviews`,
    body,
  )
  return unwrap(res)
}

export async function updateReview(id: number, body: ReviewUpdateRequest) {
  const res = await api.patch<ApiResponse<ReviewResponse>>(`/v1/reviews/${id}`, body)
  return unwrap(res)
}

export async function deleteReview(id: number) {
  await api.delete(`/v1/reviews/${id}`)
}
