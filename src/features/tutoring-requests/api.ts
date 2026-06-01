import { api, pageableToParams, unwrap } from '@/lib/api/client'
import type {
  ApiResponse,
  PageResponse,
  Pageable,
  TutoringRequestCreateRequest,
  TutoringRequestRespondRequest,
  TutoringRequestResponse,
  TutoringRequestStatus,
} from '@/types/api'

export interface ListMyRequestsParams {
  status?: TutoringRequestStatus
  pageable: Pageable
}

export interface ListIncomingParams {
  status?: TutoringRequestStatus
  pageable: Pageable
}

export interface ListAllParams {
  studentId?: number
  tutorId?: number
  status?: TutoringRequestStatus
  pageable: Pageable
}

export async function createTutoringRequest(body: TutoringRequestCreateRequest) {
  const res = await api.post<ApiResponse<TutoringRequestResponse>>(
    '/api/v1/tutoring-requests',
    body,
  )
  return unwrap(res)
}

export async function listMyTutoringRequests(params: ListMyRequestsParams) {
  const res = await api.get<ApiResponse<PageResponse<TutoringRequestResponse>>>(
    '/api/v1/tutoring-requests/mine',
    { params: { ...pageableToParams(params.pageable), status: params.status } },
  )
  return unwrap(res)
}

export async function listIncomingTutoringRequests(params: ListIncomingParams) {
  const res = await api.get<ApiResponse<PageResponse<TutoringRequestResponse>>>(
    '/api/v1/tutoring-requests/incoming',
    { params: { ...pageableToParams(params.pageable), status: params.status } },
  )
  return unwrap(res)
}

export async function getTutoringRequest(id: number) {
  const res = await api.get<ApiResponse<TutoringRequestResponse>>(
    `/api/v1/tutoring-requests/${id}`,
  )
  return unwrap(res)
}

export async function respondToTutoringRequest(
  id: number,
  body: TutoringRequestRespondRequest,
) {
  const res = await api.patch<ApiResponse<TutoringRequestResponse>>(
    `/api/v1/tutoring-requests/${id}`,
    body,
  )
  return unwrap(res)
}

export async function cancelTutoringRequest(id: number) {
  await api.delete(`/api/v1/tutoring-requests/${id}`)
}

export async function listAllTutoringRequests(params: ListAllParams) {
  const res = await api.get<ApiResponse<PageResponse<TutoringRequestResponse>>>(
    '/api/v1/admin/tutoring-requests',
    {
      params: {
        ...pageableToParams(params.pageable),
        studentId: params.studentId,
        tutorId: params.tutorId,
        status: params.status,
      },
    },
  )
  return unwrap(res)
}
