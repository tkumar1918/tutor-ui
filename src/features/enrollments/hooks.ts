import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { qk } from '@/lib/api/query-keys'
import { useAuthStore } from '@/stores/auth-store'
import {
  createEnrollment,
  deleteEnrollment,
  getEnrollment,
  listCourseEnrollments,
  listEnrollments,
  listMyEnrollments,
  updateEnrollmentStatus,
  type ListEnrollmentsParams,
} from './api'
import type { EnrollmentCreateRequest, EnrollmentStatus, Pageable } from '@/types/api'

export function useEnrollmentsList(params: ListEnrollmentsParams) {
  return useQuery({
    queryKey: qk.enrollments.list(params),
    queryFn: () => listEnrollments(params),
    placeholderData: keepPreviousData,
  })
}

export function useMyEnrollments(params: { status?: EnrollmentStatus; pageable: Pageable }) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: qk.enrollments.mine(params),
    queryFn: () => listMyEnrollments(params),
    placeholderData: keepPreviousData,
    enabled: !!token,
  })
}

export function useCourseEnrollments(
  courseId: number | undefined,
  params: { status?: EnrollmentStatus; pageable: Pageable },
  enabled = true,
) {
  return useQuery({
    queryKey: qk.courses.enrollments(courseId ?? -1, params),
    queryFn: () => listCourseEnrollments(courseId as number, params),
    placeholderData: keepPreviousData,
    enabled: enabled && courseId !== undefined,
  })
}

export function useEnrollment(id: number | undefined) {
  return useQuery({
    queryKey: qk.enrollments.detail(id ?? -1),
    queryFn: () => getEnrollment(id as number),
    enabled: id !== undefined,
  })
}

export function useCreateEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: EnrollmentCreateRequest) => createEnrollment(body),
    onSuccess: (enr) => {
      qc.invalidateQueries({ queryKey: qk.enrollments.all })
      toast.success(`Enrolled in "${enr.courseTitle}"`)
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}

export function useUpdateEnrollmentStatus(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status: EnrollmentStatus) => updateEnrollmentStatus(id, { status }),
    onSuccess: (enr) => {
      qc.invalidateQueries({ queryKey: qk.enrollments.all })
      qc.setQueryData(qk.enrollments.detail(id), enr)
      toast.success('Status updated')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}

export function useDeleteEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEnrollment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.enrollments.all })
      toast.success('Enrollment cancelled')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}
