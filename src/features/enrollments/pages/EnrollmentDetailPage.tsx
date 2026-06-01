import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/common/page-header'
import { DetailSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { formatDateTime } from '@/lib/format'
import { paths } from '@/routes/paths'
import { useDeleteEnrollment, useEnrollment } from '../hooks'
import { StatusSelect } from '../status-select'
import { StatusBadge } from '../status-badge'

export function EnrollmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const enrollmentId = Number(id)
  const navigate = useNavigate()
  const query = useEnrollment(enrollmentId)
  const del = useDeleteEnrollment()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (query.isPending) return <DetailSkeleton />
  if (query.isError) return <ErrorState message={query.error.message} />

  const e = query.data

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.enrollments}>
          <ArrowLeft className="size-4" />
          All enrollments
        </Link>
      </Button>
      <PageHeader
        title={`Enrollment #${e.id}`}
        description={
          <span>
            {e.userName} in{' '}
            <Link to={paths.courseDetail(e.courseId)} className="hover:underline">
              {e.courseTitle}
            </Link>
          </span>
        }
        actions={
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-4" />
            Cancel enrollment
          </Button>
        }
      />
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="User" value={e.userName} />
          <Field
            label="Course"
            value={
              <Link to={paths.courseDetail(e.courseId)} className="hover:underline">
                {e.courseTitle}
              </Link>
            }
          />
          <Field label="Current status" value={<StatusBadge status={e.status} />} />
          <Field label="Update status" value={<StatusSelect id={e.id} current={e.status} />} />
          <Separator className="sm:col-span-2" />
          <Field label="Enrolled at" value={formatDateTime(e.enrolledAt)} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel this enrollment?"
        description="This removes the enrollment. It can be re-created later."
        confirmLabel="Cancel enrollment"
        destructive
        loading={del.isPending}
        onConfirm={() =>
          del.mutate(e.id, {
            onSuccess: () => {
              setConfirmOpen(false)
              navigate(paths.enrollments)
            },
          })
        }
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
