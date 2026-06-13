import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'
import { isTutor, useAuthStore } from '@/stores/auth-store'
import { useNotificationCounts } from '@/features/me/hooks'
import { CountBadge } from '@/components/common/count-badge'

interface Tab {
  to: string
  label: string
  badge?: number
  matches?: string[]
}

const MY_PROFILE_PATHS = [paths.me, paths.meEdit, paths.applyTutor, paths.tutorEditMe]

const MY_SECTION_PREFIXES = [
  paths.me,
  paths.tutorInbox,
  paths.myRequests,
  paths.tutorEditMe,
  paths.mySection,
]

const ADMIN_SECTION_PREFIXES = [
  paths.adminApplications,
  paths.adminRequests,
  paths.adminSection,
]

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function SectionSubNav() {
  const location = useLocation()
  const token = useAuthStore((s) => s.token)
  const authorities = useAuthStore((s) => s.authorities)
  const tutor = isTutor(authorities)
  const notifications = useNotificationCounts()
  const inboxCount = notifications.data?.tutorPendingRequests ?? 0
  const applicationsCount = notifications.data?.adminPendingApplications ?? 0

  const inMy = matchesPrefix(location.pathname, MY_SECTION_PREFIXES)
  const inAdmin = matchesPrefix(location.pathname, ADMIN_SECTION_PREFIXES)

  if (!inMy && !inAdmin) return null

  const myTabs: Tab[] = []
  if (token) myTabs.push({ to: paths.me, label: 'Profile', matches: MY_PROFILE_PATHS })
  if (tutor) myTabs.push({ to: paths.tutorInbox, label: 'Inbox', badge: inboxCount })
  if (token) myTabs.push({ to: paths.myRequests, label: 'Requests' })

  const adminTabs: Tab[] = [
    { to: paths.adminApplications, label: 'Applications', badge: applicationsCount },
    { to: paths.adminRequests, label: 'Requests' },
  ]

  const tabs = inMy ? myTabs : adminTabs

  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="bg-muted/40 shadow-[0_1px_3px_-1px_rgb(0_0_0_/_0.06)] rounded-lg px-5">
        <nav className="flex gap-10 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const matches = tab.matches ?? [tab.to]
            const isActive = matches.includes(location.pathname)
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={cn(
                  'group relative inline-flex items-center py-2 text-sm whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span>{tab.label}</span>
                {tab.badge ? <CountBadge count={tab.badge} /> : null}
                <span
                  className={cn(
                    'absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full transition-all',
                    isActive ? 'bg-primary opacity-100 scale-x-100' : 'opacity-0 scale-x-0',
                  )}
                />
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
