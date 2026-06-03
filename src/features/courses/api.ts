import { api, pageableToParams, unwrap } from '@/lib/api/client'
import type {
  ApiResponse,
  CourseCreateRequest,
  CourseResponse,
  CourseUpdateRequest,
  Level,
  PageResponse,
  Pageable,
  Subject,
} from '@/types/api'

export interface ListCoursesParams {
  tutorId?: number
  subject?: Subject
  level?: Level
  search?: string
  pageable: Pageable
}

export async function listCourses(params: ListCoursesParams) {
  const res = await api.get<ApiResponse<PageResponse<CourseResponse>>>('/v1/courses', {
    params: {
      ...pageableToParams(params.pageable),
      tutorId: params.tutorId,
      subject: params.subject,
      level: params.level,
      search: params.search,
    },
  })
  return unwrap(res)
}

export async function listMyCourses(pageable: Pageable) {
  const res = await api.get<ApiResponse<PageResponse<CourseResponse>>>('/v1/courses/mine', {
    params: pageableToParams(pageable),
  })
  return unwrap(res)
}

export async function getCourse(id: number) {
  const res = await api.get<ApiResponse<CourseResponse>>(`/v1/courses/${id}`)
  return unwrap(res)
}

export async function createCourse(body: CourseCreateRequest) {
  const res = await api.post<ApiResponse<CourseResponse>>('/v1/courses', body)
  return unwrap(res)
}

export async function updateCourse(id: number, body: CourseUpdateRequest) {
  const res = await api.put<ApiResponse<CourseResponse>>(`/v1/courses/${id}`, body)
  return unwrap(res)
}

export async function deleteCourse(id: number) {
  await api.delete(`/v1/courses/${id}`)
}
