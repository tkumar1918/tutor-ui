import { Navigate } from 'react-router-dom'
import { isTutor, useAuthStore } from '@/stores/auth-store'
import { paths } from './paths'

export function MySectionRedirect() {
  const authorities = useAuthStore((s) => s.authorities)
  // Tutors land on their teaching workspace; everyone else on their profile.
  const target = isTutor(authorities) ? paths.myCourses : paths.me
  return <Navigate to={target} replace />
}

export function AdminSectionRedirect() {
  return <Navigate to={paths.adminApplications} replace />
}
