import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ROLE_ADMIN, ROLE_TUTOR } from '@/types/api'

interface AuthSlice {
  token: string | null
  username: string | null
  authorities: string[]
  setAuth: (auth: { token: string; username: string; authorities: string[] }) => void
  clear: () => void
}

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      authorities: [],
      setAuth: ({ token, username, authorities }) => set({ token, username, authorities }),
      clear: () => set({ token: null, username: null, authorities: [] }),
    }),
    { name: 'tutor-ui-auth' },
  ),
)

const hasRole = (authorities: string[], role: string) => authorities.includes(role)
export const isAdmin = (authorities: string[]) => hasRole(authorities, ROLE_ADMIN)
export const isTutor = (authorities: string[]) => hasRole(authorities, ROLE_TUTOR)
