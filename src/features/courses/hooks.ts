import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { qk } from '@/lib/api/query-keys'
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  listMyCourses,
  updateCourse,
  type ListCoursesParams,
} from './api'
import type { CourseCreateRequest, CourseUpdateRequest, Pageable } from '@/types/api'

export function useCoursesList(params: ListCoursesParams) {
  return useQuery({
    queryKey: qk.courses.list(params),
    queryFn: () => listCourses(params),
    placeholderData: keepPreviousData,
  })
}

export function useMyCourses(pageable: Pageable) {
  return useQuery({
    queryKey: qk.courses.mine(pageable),
    queryFn: () => listMyCourses(pageable),
    placeholderData: keepPreviousData,
  })
}

export function useCourse(id: number | undefined) {
  return useQuery({
    queryKey: qk.courses.detail(id ?? -1),
    queryFn: () => getCourse(id as number),
    enabled: id !== undefined,
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CourseCreateRequest) => createCourse(body),
    onSuccess: (course) => {
      qc.invalidateQueries({ queryKey: qk.courses.all })
      toast.success(`Course "${course.title}" created`)
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}

export function useUpdateCourse(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CourseUpdateRequest) => updateCourse(id, body),
    onSuccess: (course) => {
      qc.invalidateQueries({ queryKey: qk.courses.all })
      qc.setQueryData(qk.courses.detail(id), course)
      toast.success(`Course "${course.title}" updated`)
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.courses.all })
      toast.success('Course deleted')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}
