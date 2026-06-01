import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { expertiseLabel, formatHourlyRate } from '@/lib/format'
import { paths } from '@/routes/paths'
import type { TutorProfileResponse } from '@/types/api'

interface Props {
  tutor: TutorProfileResponse
}

export function TutorCard({ tutor }: Props) {
  const initials = `${tutor.firstName[0] ?? ''}${tutor.lastName[0] ?? ''}`.toUpperCase()
  return (
    <Link to={paths.tutorDetail(tutor.id)}>
      <Card className="h-full transition-colors hover:border-foreground/30">
        <CardHeader className="flex flex-row items-start gap-3">
          <Avatar className="size-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">
              {tutor.firstName} {tutor.lastName}
            </CardTitle>
            <CardDescription className="line-clamp-2 min-h-[2.5em]">
              {tutor.bio || 'No bio provided.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{expertiseLabel(tutor.expertise)}</Badge>
          <span className="text-sm font-medium">{formatHourlyRate(tutor.hourlyRateCents)}</span>
        </CardContent>
      </Card>
    </Link>
  )
}
