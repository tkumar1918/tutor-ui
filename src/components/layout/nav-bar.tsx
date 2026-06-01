import { Link, NavLink, useLocation } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'
import { isAdmin, isTutor, useAuthStore } from '@/stores/auth-store'
import { useNotificationCounts } from '@/features/me/hooks'
import { CountBadge } from '@/components/common/count-badge'
import { UserMenu } from './user-menu'
import { Button } from '@/components/ui/button'

interface TopItem {
  to: string
  label: string
  badge?: number
  /** Paths whose pathname should mark this top item as active (prefix-matched). */
  sectionPrefixes?: string[]
}

const linkClass = (isActive: boolean) =>
  cn(
    'inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
    isActive
      ? 'bg-accent text-accent-foreground'
      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
  )

const MY_SECTION_PREFIXES = [
  paths.me,
  paths.myCourses,
  paths.tutorInbox,
  paths.myEnrollments,
  paths.myRequests,
  paths.tutorEditMe,
  paths.mySection,
]

const ADMIN_SECTION_PREFIXES = [
  paths.enrollments,
  paths.adminApplications,
  paths.adminRequests,
  paths.adminSection,
]

function inSection(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function NavBar() {
  const token = useAuthStore((s) => s.token)
  const authorities = useAuthStore((s) => s.authorities)
  const admin = isAdmin(authorities)
  const tutor = isTutor(authorities)
  const location = useLocation()
  const notifications = useNotificationCounts()
  const inboxCount = notifications.data?.tutorPendingRequests ?? 0
  const applicationsCount = notifications.data?.adminPendingApplications ?? 0

  const items: TopItem[] = [
    { to: paths.courses, label: 'Courses' },
    { to: paths.tutors, label: 'Tutors' },
  ]
  if (token) {
    items.push({
      to: paths.mySection,
      label: 'Dashboard',
      badge: tutor ? inboxCount : 0,
      sectionPrefixes: MY_SECTION_PREFIXES,
    })
  }
  if (admin) {
    items.push({
      to: paths.adminSection,
      label: 'Admin',
      badge: applicationsCount,
      sectionPrefixes: ADMIN_SECTION_PREFIXES,
    })
  }

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto flex h-14 items-center gap-6 px-4">
        <Link to={paths.home} className="flex items-center gap-2 font-semibold">
          <GraduationCap className="size-5" />
          <span>Tutor</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {items.map((item) => {
            const sectionActive = item.sectionPrefixes
              ? inSection(location.pathname, item.sectionPrefixes)
              : false
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => linkClass(isActive || sectionActive)}
              >
                <span>{item.label}</span>
                {item.badge ? <CountBadge count={item.badge} /> : null}
              </NavLink>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {token ? (
            <UserMenu isAdmin={admin} isTutor={tutor} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={paths.login}>Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to={paths.register}>Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
