import { Link } from 'react-router-dom'
import { Inbox, Pencil, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/common/page-header'
import { DetailSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { paths } from '@/routes/paths'
import { isAdmin } from '@/stores/auth-store'
import { expertiseLabel, formatDate, formatDateTime, formatHourlyRate } from '@/lib/format'
import { useMe } from '../hooks'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
}

export function MePage() {
  const query = useMe()

  if (query.isPending) return <DetailSkeleton />
  if (query.isError) return <ErrorState message={query.error.message} />

  const { user, authorities, tutorProfile } = query.data
  const canApply = !tutorProfile && !isAdmin(authorities)

  return (
    <>
      <PageHeader
        title="My profile"
        description={`@${user.username}`}
        actions={
          <Button variant="outline" asChild>
            <Link to={paths.meEdit}>
              <Pencil className="size-4" />
              Edit profile
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" value={user.firstName} />
          <Field label="Last name" value={user.lastName} />
          <Field label="Email" value={user.email} />
          {user.dateOfBirth && <Field label="Date of birth" value={formatDate(user.dateOfBirth)} />}
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Roles</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {authorities.length === 0 ? (
                <span className="text-sm text-muted-foreground">None</span>
              ) : (
                authorities.map((r) => (
                  <Badge key={r} variant="secondary">
                    {r.replace('ROLE_', '')}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <Separator className="sm:col-span-2" />
          <Field label="Created" value={formatDateTime(user.createdAt)} />
          <Field label="Updated" value={formatDateTime(user.updatedAt)} />
        </CardContent>
      </Card>

      {(tutorProfile || canApply) && (
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="size-5" />
          Tutor application
        </h2>
        {tutorProfile ? (
          <Card>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Status"
                value={
                  <Badge variant={STATUS_VARIANTS[tutorProfile.status] ?? 'secondary'}>
                    {tutorProfile.status}
                  </Badge>
                }
              />
              <Field label="Expertise" value={expertiseLabel(tutorProfile.expertise)} />
              <Field label="Hourly rate" value={formatHourlyRate(tutorProfile.hourlyRateCents)} />
              <Field
                label="Experience"
                value={`${tutorProfile.yearsOfExperience} year${tutorProfile.yearsOfExperience === 1 ? '' : 's'}`}
              />
              <Field label="Applied" value={formatDateTime(tutorProfile.appliedAt)} />
              {tutorProfile.reviewedAt && (
                <Field label="Reviewed" value={formatDateTime(tutorProfile.reviewedAt)} />
              )}
              {tutorProfile.qualifications && (
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualifications</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{tutorProfile.qualifications}</p>
                </div>
              )}
              {tutorProfile.rejectionReason && (
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Rejection reason</p>
                  <p className="mt-1 text-sm">{tutorProfile.rejectionReason}</p>
                </div>
              )}
              {tutorProfile.bio && (
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Bio</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{tutorProfile.bio}</p>
                </div>
              )}
              {tutorProfile.status === 'APPROVED' && (
                <div className="sm:col-span-2 flex gap-2">
                  <Button variant="outline" asChild>
                    <Link to={paths.tutorEditMe}>
                      <Pencil className="size-4" />
                      Edit tutor profile
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to={paths.tutorInbox}>
                      <Inbox className="size-4" />
                      Tutor inbox
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">
                You haven't applied to become a tutor yet.
              </p>
              <Button asChild>
                <Link to={paths.applyTutor}>Apply to be a tutor</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      )}
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
