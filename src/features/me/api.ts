import { api, unwrap } from '@/lib/api/client'
import type {
  ApiResponse,
  CurrentUserResponse,
  NotificationCountsResponse,
  TutorApplicationRequest,
  TutorProfileResponse,
  UserUpdateRequest,
} from '@/types/api'

export async function getMe() {
  const res = await api.get<ApiResponse<CurrentUserResponse>>('/api/v1/me')
  return unwrap(res)
}

export async function getNotificationCounts() {
  const res = await api.get<ApiResponse<NotificationCountsResponse>>(
    '/api/v1/me/notifications',
  )
  return unwrap(res)
}

export async function updateMe(body: UserUpdateRequest) {
  const res = await api.put<ApiResponse<CurrentUserResponse>>('/api/v1/me', body)
  return unwrap(res)
}

export async function applyForTutor(body: TutorApplicationRequest) {
  const res = await api.post<ApiResponse<TutorProfileResponse>>(
    '/api/v1/me/tutor-application',
    body,
  )
  return unwrap(res)
}
