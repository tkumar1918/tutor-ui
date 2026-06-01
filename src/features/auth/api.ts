import { api, unwrap } from '@/lib/api/client'
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '@/types/api'

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', body)
  return unwrap(res)
}

export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', body)
  return unwrap(res)
}
