import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { paths } from '@/routes/paths'
import { TutorForm } from '@/features/tutors/tutor-form'
import { useApplyForTutor } from '../hooks'

export function ApplyTutorPage() {
  const navigate = useNavigate()
  const apply = useApplyForTutor()

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.me}>
          <ArrowLeft className="size-4" />
          Back to profile
        </Link>
      </Button>
      <PageHeader
        title="Apply to be a tutor"
        description="Submit your application. An admin will review and approve."
      />
      <Card>
        <CardContent>
          <TutorForm
            submitLabel="Submit application"
            pending={apply.isPending}
            onSubmit={({ hourlyRate, qualifications, ...rest }) =>
              apply.mutate(
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
