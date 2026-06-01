import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/common/page-header'
import { DetailSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores/auth-store'
import {
  expertiseLabel,
  formatDateTime,
  formatHourlyRate,
} from '@/lib/format'
import { useMe } from '@/features/me/hooks'
import { RequestSessionDialog } from '@/features/tutoring-requests/request-session-dialog'
import { useTutor } from '../hooks'
import { TutorCoursesList } from '../tutor-courses-list'

export function TutorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const tutorId = Number(id)
  const token = useAuthStore((s) => s.token)
  const [requestOpen, setRequestOpen] = useState(false)

  const query = useTutor(tutorId)
  const me = useMe(!!token)

  if (query.isPending) return <DetailSkeleton />
  if (query.isError) return <ErrorState message={query.error.message} />

  const tutor = query.data
  const initials = `${tutor.firstName[0] ?? ''}${tutor.lastName[0] ?? ''}`.toUpperCase()
  const isSelf = me.data?.user.id === tutor.userId
  const canRequest = !!token && !isSelf

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.tutors}>
          <ArrowLeft className="size-4" />
          All tutors
        </Link>
      </Button>
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="size-16">
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <PageHeader
            title={`${tutor.firstName} ${tutor.lastName}`}
            description={`${expertiseLabel(tutor.expertise)} · ${formatHourlyRate(tutor.hourlyRateCents)}`}
            actions={
              canRequest && (
                <Button onClick={() => setRequestOpen(true)}>
                  <MessageSquare className="size-4" />
                  Request session
                </Button>
              )
            }
          />
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Field label="Expertise" value={<Badge variant="secondary">{expertiseLabel(tutor.expertise)}</Badge>} />
          <Field
            label="Experience"
            value={`${tutor.yearsOfExperience} year${tutor.yearsOfExperience === 1 ? '' : 's'}`}
          />
          <Field label="Hourly rate" value={formatHourlyRate(tutor.hourlyRateCents)} />
          <div className="sm:col-span-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Bio</p>
            <p className="mt-1 text-sm whitespace-pre-wrap">
              {tutor.bio || <span className="text-muted-foreground">No bio provided.</span>}
            </p>
          </div>
          {tutor.qualifications && (
            <div className="sm:col-span-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualifications</p>
              <p className="mt-1 text-sm whitespace-pre-wrap">{tutor.qualifications}</p>
            </div>
          )}
          <Separator className="sm:col-span-3" />
          <Field label="Applied" value={formatDateTime(tutor.appliedAt)} />
          {tutor.reviewedAt && <Field label="Reviewed" value={formatDateTime(tutor.reviewedAt)} />}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Courses by this tutor</h2>
        <TutorCoursesList tutorId={tutor.id} />
      </div>

      <RequestSessionDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        tutorId={tutor.id}
        tutorName={`${tutor.firstName} ${tutor.lastName}`}
      />
    </>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  )
}
