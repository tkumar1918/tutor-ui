import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { qk } from '@/lib/api/query-keys'
import { useAuthStore } from '@/stores/auth-store'
import {
  cancelTutoringRequest,
  createTutoringRequest,
  getTutoringRequest,
  listAllTutoringRequests,
  listIncomingTutoringRequests,
  listMyTutoringRequests,
  respondToTutoringRequest,
  type ListAllParams,
  type ListIncomingParams,
  type ListMyRequestsParams,
} from './api'
import type { TutoringRequestCreateRequest, TutoringRequestRespondRequest } from '@/types/api'

export function useMyTutoringRequests(params: ListMyRequestsParams) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: qk.tutoringRequests.mine(params),
    queryFn: () => listMyTutoringRequests(params),
    placeholderData: keepPreviousData,
    enabled: !!token,
  })
}

export function useIncomingTutoringRequests(params: ListIncomingParams) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: qk.tutoringRequests.incoming(params),
    queryFn: () => listIncomingTutoringRequests(params),
    placeholderData: keepPreviousData,
    enabled: !!token,
  })
}

export function useAllTutoringRequests(params: ListAllParams) {
  return useQuery({
    queryKey: qk.tutoringRequests.adminList(params),
    queryFn: () => listAllTutoringRequests(params),
    placeholderData: keepPreviousData,
  })
}

export function useTutoringRequest(id: number | undefined) {
  return useQuery({
    queryKey: qk.tutoringRequests.detail(id ?? -1),
    queryFn: () => getTutoringRequest(id as number),
    enabled: id !== undefined,
  })
}

export function useCreateTutoringRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: TutoringRequestCreateRequest) => createTutoringRequest(body),
    onSuccess: (req) => {
      qc.invalidateQueries({ queryKey: qk.tutoringRequests.all })
      toast.success(`Request sent to ${req.tutorName}`)
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}

export function useRespondToTutoringRequest(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: TutoringRequestRespondRequest) => respondToTutoringRequest(id, body),
    onSuccess: (req) => {
      qc.invalidateQueries({ queryKey: qk.tutoringRequests.all })
      qc.invalidateQueries({ queryKey: qk.me.notifications() })
      qc.setQueryData(qk.tutoringRequests.detail(id), req)
      toast.success(`Request ${req.status.toLowerCase()}`)
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}

export function useCancelTutoringRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cancelTutoringRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.tutoringRequests.all })
      toast.success('Request cancelled')
    },
    onError: (e: ApiError) => toast.error(e.message),
  })
}
