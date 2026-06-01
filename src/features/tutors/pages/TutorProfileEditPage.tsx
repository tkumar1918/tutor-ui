import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { DetailSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { EmptyState } from '@/components/common/empty-state'
import { paths } from '@/routes/paths'
import { useMe } from '@/features/me/hooks'
import { TutorForm } from '../tutor-form'
import { useUpdateMyTutorProfile } from '../hooks'

export function TutorProfileEditPage() {
  const navigate = useNavigate()
  const me = useMe()
  const update = useUpdateMyTutorProfile()

  if (me.isPending) return <DetailSkeleton />
  if (me.isError) return <ErrorState message={me.error.message} />

  const profile = me.data.tutorProfile
  if (!profile || profile.status !== 'APPROVED') {
    return (
      <>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to={paths.me}>
            <ArrowLeft className="size-4" />
            Back to profile
          </Link>
        </Button>
        <EmptyState
          title="You don't have an approved tutor profile"
          description="Apply to become a tutor first."
        />
      </>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.me}>
          <ArrowLeft className="size-4" />
          Back to profile
        </Link>
      </Button>
      <PageHeader
        title="Edit my tutor profile"
        description={`${profile.firstName} ${profile.lastName}`}
      />
      <Card>
        <CardContent>
          <TutorForm
            initial={profile}
            submitLabel="Save changes"
            pending={update.isPending}
            onSubmit={({ hourlyRate, qualifications, ...rest }) =>
              update.mutate(
                {
                  ...rest,
                  qualifications: qualifications || undefined,
                  hourlyRateCents: Math.round(hourlyRate * 100),
                },
                { onSuccess: () => navigate(paths.me) },
              )
            }
          />
        </CardContent>
      </Card>
    </>
  )
}
