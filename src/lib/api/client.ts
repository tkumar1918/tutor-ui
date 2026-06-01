import axios, { AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import type { ApiResponse, AuthErrorCode, ErrorResponse, Pageable } from '@/types/api'

export class ApiError extends Error {
  status: number
  code?: AuthErrorCode
  constructor(message: string, status: number, code?: AuthErrorCode) {
    super(message)
    this.status = status
    this.code = code
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

let onUnauthorized: (() => void) | null = null
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const status = error.response?.status ?? 0
    const data = error.response?.data
    const code = data?.code
    const message = data?.message ?? error.message ?? 'Request failed'

    if (status === 401) {
      // INVALID_CREDENTIALS happens on the login form — let the form render
      // the error inline, don't clear auth (there's nothing to clear) and
      // don't redirect (user is already on /login).
      if (code !== 'INVALID_CREDENTIALS') {
        useAuthStore.getState().clear()
        if (code === 'TOKEN_EXPIRED') {
          toast.error('Your session expired — please sign in again.')
        } else if (code === 'TOKEN_VERSION_MISMATCH') {
          toast.error('Your roles changed — please sign in again.')
        }
        // MISSING_TOKEN / INVALID_TOKEN / unknown: silent redirect.
        onUnauthorized?.()
      }
    } else if (status === 403) {
      toast.error(message || "You don't have access to this action.")
    }

    return Promise.reject(new ApiError(message, status, code))
  },
)

export function unwrap<T>(res: AxiosResponse<ApiResponse<T>>): T {
  return res.data.data
}

export function pageableToParams(p: Pageable) {
  const params: Record<string, string | number | string[]> = {
    page: p.page,
    size: p.size,
  }
  if (p.sort && p.sort.length > 0) {
    params.sort = p.sort
  }
  return params
}
