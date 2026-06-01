import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, UserCog, ShieldCheck } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'
import { paths } from '@/routes/paths'

interface Props {
  isAdmin: boolean
  isTutor: boolean
}

export function UserMenu({ isAdmin, isTutor }: Props) {
  const username = useAuthStore((s) => s.username) ?? ''
  const clear = useAuthStore((s) => s.clear)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const handleLogout = () => {
    clear()
    qc.clear()
    navigate(paths.login)
  }

  const initials = username.slice(0, 2).toUpperCase()
  const roleLabel = isAdmin ? 'Administrator' : isTutor ? 'Tutor' : 'User'
  const roleBadge = isAdmin ? 'Admin' : isTutor ? 'Tutor' : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-sm transition-colors hover:bg-accent/60 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Account menu"
      >
        <Avatar className="size-7">
          <AvatarFallback className="text-xs font-medium">
            {initials || <User className="size-3.5" />}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline max-w-[10rem] truncate font-medium">{username}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs font-medium">
                {initials || <User className="size-3.5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{username}</span>
              <div className="flex items-center gap-1.5">
                {roleBadge ? (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-normal">
                    {roleBadge}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">{roleLabel}</span>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={paths.me}>
            <UserCog className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to={paths.adminApplications}>
              <ShieldCheck className="size-4" />
              Tutor applications
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
