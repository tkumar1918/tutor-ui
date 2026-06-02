import { api, pageableToParams, unwrap } from '@/lib/api/client'
import type {
  ApiResponse,
  CourseResponse,
  Expertise,
  PageResponse,
  Pageable,
  TutorProfileResponse,
  TutorUpdateRequest,
} from '@/types/api'

export interface ListTutorsParams {
  expertise?: Expertise
  search?: string
  pageable: Pageable
}

export async function listTutors(params: ListTutorsParams) {
  const res = await api.get<ApiResponse<PageResponse<TutorProfileResponse>>>('/v1/tutors', {
    params: {
      ...pageableToParams(params.pageable),
      expertise: params.expertise,
      search: params.search,
    },
  })
  return unwrap(res)
}

export async function getTutor(id: number) {
  const res = await api.get<ApiResponse<TutorProfileResponse>>(`/v1/tutors/${id}`)
  return unwrap(res)
}

export async function getTutorCourses(id: number, pageable: Pageable) {
  const res = await api.get<ApiResponse<PageResponse<CourseResponse>>>(
    `/v1/tutors/${id}/courses`,
    { params: pageableToParams(pageable) },
  )
  return unwrap(res)
}

export async function updateMyTutorProfile(body: TutorUpdateRequest) {
  const res = await api.put<ApiResponse<TutorProfileResponse>>('/v1/tutors/me', body)
  return unwrap(res)
}
