import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { qk } from '@/lib/api/query-keys'
import { useAuthStore } from '@/stores/auth-store'
import { applyForTutor, getMe, getNotificationCounts, updateMe } from './api'
import type { TutorApplicationRequest, UserUpdateRequest } from '@/types/api'

export function useMe(enabled = true) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: qk.me.profile(),
    queryFn: () => getMe(),
    enabled: enabled && !!token,
  })
}

export function useNotificationCounts() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: qk.me.notifications(),
    queryFn: () => getNotificationCounts(),
    enabled: !!token,
    staleTime: 30_000,
  })
}

export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UserUpdateRequest) => updateMe(body),
    onSuccess: (data) => {
      qc.setQueryData(qk.me.profile(), data)
      toast.success('Profile updated')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}

export function useApplyForTutor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: TutorApplicationRequest) => applyForTutor(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me.all })
      toast.success('Application submitted')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}
