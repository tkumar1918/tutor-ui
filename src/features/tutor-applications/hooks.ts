import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { qk } from '@/lib/api/query-keys'
import {
  listApplications,
  reviewApplication,
  type ListApplicationsParams,
} from './api'
import type { TutorApplicationReviewRequest } from '@/types/api'

export function useApplicationsList(params: ListApplicationsParams) {
  return useQuery({
    queryKey: qk.tutorApplications.list(params),
    queryFn: () => listApplications(params),
    placeholderData: keepPreviousData,
  })
}

export function useReviewApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: TutorApplicationReviewRequest }) =>
      reviewApplication(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.tutorApplications.all })
      qc.invalidateQueries({ queryKey: qk.tutors.all })
      qc.invalidateQueries({ queryKey: qk.me.notifications() })
      toast.success('Application reviewed')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}
