import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api/client'
import { useAuthStore } from '@/stores/auth-store'
import { qk } from '@/lib/api/query-keys'
import { login, register } from './api'
import type { AuthResponse } from '@/types/api'

function applyAuth(res: AuthResponse) {
  useAuthStore.getState().setAuth({
    token: res.token,
    username: res.username,
    authorities: res.authorities ?? [],
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      applyAuth(res)
      qc.invalidateQueries({ queryKey: qk.me.all })
      toast.success(`Welcome back, ${res.username}`)
    },
    onError: (err: ApiError) => {
      // INVALID_CREDENTIALS is rendered inline by the form, no toast.
      if (err.code !== 'INVALID_CREDENTIALS') toast.error(err.message)
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      applyAuth(res)
      qc.invalidateQueries({ queryKey: qk.me.all })
      toast.success(`Account created — welcome, ${res.username}`)
    },
    onError: (err: ApiError) => toast.error(err.message),
  })
}
