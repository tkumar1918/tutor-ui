import { api, pageableToParams, unwrap } from '@/lib/api/client'
import type {
  ApiResponse,
  PageResponse,
  Pageable,
  TutorApplicationReviewRequest,
  TutorApplicationStatus,
  TutorProfileResponse,
} from '@/types/api'

export interface ListApplicationsParams {
  status?: TutorApplicationStatus
  pageable: Pageable
}

export async function listApplications(params: ListApplicationsParams) {
  const res = await api.get<ApiResponse<PageResponse<TutorProfileResponse>>>(
    '/api/v1/admin/tutor-applications',
    {
      params: {
        ...pageableToParams(params.pageable),
        status: params.status,
      },
    },
  )
  return unwrap(res)
}

export async function reviewApplication(id: number, body: TutorApplicationReviewRequest) {
  const res = await api.post<ApiResponse<TutorProfileResponse>>(
    `/api/v1/admin/tutor-applications/${id}/review`,
    body,
  )
  return unwrap(res)
}
