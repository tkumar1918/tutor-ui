import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, GraduationCap, Pencil, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/common/page-header'
import { DetailSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import {
  formatDateTime,
  formatPrice,
  levelLabel,
  statusLabel,
  subjectLabel,
} from '@/lib/format'
import { isAdmin, useAuthStore } from '@/stores/auth-store'
import { paths } from '@/routes/paths'
import { useCourse, useDeleteCourse } from '../hooks'
import { useMe } from '@/features/me/hooks'
import { useMyEnrollments } from '@/features/enrollments/hooks'
import { EnrollDialog } from '@/features/enrollments/enroll-dialog'
import { CourseStudentsList } from '@/features/enrollments/course-students-list'

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const authorities = useAuthStore((s) => s.authorities)

  const query = useCourse(courseId)
  const me = useMe(!!token)
  const myEnrollments = useMyEnrollments({ pageable: { page: 0, size: 200 } })
  const del = useDeleteCourse()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [enrollOpen, setEnrollOpen] = useState(false)

  if (query.isPending) return <DetailSkeleton />
  if (query.isError) return <ErrorState message={query.error.message} />

  const course = query.data
  const admin = isAdmin(authorities)
  const ownTutorProfileId = me.data?.tutorProfile?.id
  const isOwner = ownTutorProfileId !== undefined && ownTutorProfileId === course.tutorId
  const canEdit = isOwner || admin
  const myEnrollment = myEnrollments.data?.content.find((e) => e.courseId === course.id)

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.courses}>
          <ArrowLeft className="size-4" />
          All courses
        </Link>
      </Button>
      <PageHeader
        title={course.title}
        description={course.description || 'No description provided.'}
        actions={
          <div className="flex items-center gap-2">
            {token && !isOwner && (
              myEnrollment ? (
                <Badge variant="secondary" className="gap-1 px-2.5 py-1 text-sm">
                  <CheckCircle2 className="size-4" />
                  Enrolled · {statusLabel(myEnrollment.status)}
                </Badge>
              ) : (
                <Button onClick={() => setEnrollOpen(true)}>
                  <GraduationCap className="size-4" />
                  Enroll
                </Button>
              )
            )}
            {canEdit && (
              <>
                <Button variant="outline" asChild>
                  <Link to={paths.courseEdit(course.id)}>
                    <Pencil className="size-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        }
      />
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject" value={<Badge variant="secondary">{subjectLabel(course.subject)}</Badge>} />
          <Field label="Level" value={<Badge variant="outline">{levelLabel(course.level)}</Badge>} />
          <Field label="Price" value={formatPrice(course.priceCents)} />
          <Field
            label="Tutor"
            value={
              <Link to={paths.tutorDetail(course.tutorId)} className="hover:underline">
                {course.tutorName}
              </Link>
            }
          />
          <Separator className="sm:col-span-2" />
          <Field label="Created" value={formatDateTime(course.createdAt)} />
          <Field label="Updated" value={formatDateTime(course.updatedAt)} />
        </CardContent>
      </Card>

      {canEdit && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="size-5" />
            Students
          </h2>
          <CourseStudentsList courseId={course.id} />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this course?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={() =>
          del.mutate(course.id, {
            onSuccess: () => {
              setConfirmOpen(false)
              navigate(paths.courses)
            },
          })
        }
      />
      <EnrollDialog
        open={enrollOpen}
        onOpenChange={setEnrollOpen}
        courseId={course.id}
        courseTitle={course.title}
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
