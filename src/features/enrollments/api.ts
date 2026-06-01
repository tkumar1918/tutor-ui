import { api, pageableToParams, unwrap } from '@/lib/api/client'
import type {
  ApiResponse,
  EnrollmentCreateRequest,
  EnrollmentResponse,
  EnrollmentStatus,
  EnrollmentStatusUpdateRequest,
  PageResponse,
  Pageable,
} from '@/types/api'

export interface ListEnrollmentsParams {
  userId?: number
  courseId?: number
  status?: EnrollmentStatus
  pageable: Pageable
}

export async function listEnrollments(params: ListEnrollmentsParams) {
  const res = await api.get<ApiResponse<PageResponse<EnrollmentResponse>>>('/api/v1/enrollments', {
    params: {
      ...pageableToParams(params.pageable),
      userId: params.userId,
      courseId: params.courseId,
      status: params.status,
    },
  })
  return unwrap(res)
}

export async function listMyEnrollments(params: { status?: EnrollmentStatus; pageable: Pageable }) {
  const res = await api.get<ApiResponse<PageResponse<EnrollmentResponse>>>('/api/v1/enrollments/mine', {
    params: {
      ...pageableToParams(params.pageable),
      status: params.status,
    },
  })
  return unwrap(res)
}

export async function listCourseEnrollments(
  courseId: number,
  params: { status?: EnrollmentStatus; pageable: Pageable },
) {
  const res = await api.get<ApiResponse<PageResponse<EnrollmentResponse>>>(
    `/api/v1/courses/${courseId}/enrollments`,
    {
      params: {
        ...pageableToParams(params.pageable),
        status: params.status,
      },
    },
  )
  return unwrap(res)
}

export async function getEnrollment(id: number) {
  const res = await api.get<ApiResponse<EnrollmentResponse>>(`/api/v1/enrollments/${id}`)
  return unwrap(res)
}

export async function createEnrollment(body: EnrollmentCreateRequest) {
  const res = await api.post<ApiResponse<EnrollmentResponse>>('/api/v1/enrollments', body)
  return unwrap(res)
}

export async function updateEnrollmentStatus(id: number, body: EnrollmentStatusUpdateRequest) {
  const res = await api.patch<ApiResponse<EnrollmentResponse>>(
    `/api/v1/enrollments/${id}/status`,
    body,
  )
  return unwrap(res)
}

export async function deleteEnrollment(id: number) {
  await api.delete(`/api/v1/enrollments/${id}`)
}
