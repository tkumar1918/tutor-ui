import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { qk } from '@/lib/api/query-keys'
import {
  getTutor,
  getTutorCourses,
  listTutors,
  updateMyTutorProfile,
  type ListTutorsParams,
} from './api'
import type { Pageable, TutorUpdateRequest } from '@/types/api'

export function useTutorsList(params: ListTutorsParams) {
  return useQuery({
    queryKey: qk.tutors.list(params),
    queryFn: () => listTutors(params),
    placeholderData: keepPreviousData,
  })
}

export function useTutor(id: number | undefined) {
  return useQuery({
    queryKey: qk.tutors.detail(id ?? -1),
    queryFn: () => getTutor(id as number),
    enabled: id !== undefined,
  })
}

export function useTutorCourses(id: number | undefined, pageable: Pageable) {
  return useQuery({
    queryKey: qk.tutors.courses(id ?? -1, pageable),
    queryFn: () => getTutorCourses(id as number, pageable),
    enabled: id !== undefined,
    placeholderData: keepPreviousData,
  })
}

export function useUpdateMyTutorProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: TutorUpdateRequest) => updateMyTutorProfile(body),
    onSuccess: (profile) => {
      qc.invalidateQueries({ queryKey: qk.tutors.all })
      qc.invalidateQueries({ queryKey: qk.me.all })
      qc.setQueryData(qk.tutors.detail(profile.id), profile)
      toast.success('Tutor profile updated')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}
