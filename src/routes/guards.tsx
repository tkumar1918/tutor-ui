import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdmin, isTutor, useAuthStore } from '@/stores/auth-store'
import { paths } from './paths'
import { ForbiddenPage } from '@/components/common/forbidden-page'

export function RequireAuth() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  if (!token) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

export function RequireAdmin() {
  const token = useAuthStore((s) => s.token)
  const authorities = useAuthStore((s) => s.authorities)
  const location = useLocation()
  if (!token) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }
  if (!isAdmin(authorities)) {
    return <ForbiddenPage />
  }
  return <Outlet />
}

export function RequireTutor() {
  const token = useAuthStore((s) => s.token)
  const authorities = useAuthStore((s) => s.authorities)
  const location = useLocation()
  if (!token) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }
  if (!isTutor(authorities) && !isAdmin(authorities)) {
    return <ForbiddenPage />
  }
  return <Outlet />
}
