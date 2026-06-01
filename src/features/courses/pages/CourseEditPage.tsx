import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { DetailSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { paths } from '@/routes/paths'
import { CourseForm } from '../course-form'
import { useCourse, useUpdateCourse } from '../hooks'

export function CourseEditPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const navigate = useNavigate()
  const query = useCourse(courseId)
  const update = useUpdateCourse(courseId)

  if (query.isPending) return <DetailSkeleton />
  if (query.isError) return <ErrorState message={query.error.message} />

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.courseDetail(courseId)}>
          <ArrowLeft className="size-4" />
          Back to course
        </Link>
      </Button>
      <PageHeader title="Edit course" description={query.data.title} />
      <Card>
        <CardContent>
          <CourseForm
            initial={query.data}
            submitLabel="Save changes"
            pending={update.isPending}
            onSubmit={(values) =>
              update.mutate(values, {
                onSuccess: (course) => navigate(paths.courseDetail(course.id)),
              })
            }
          />
        </CardContent>
      </Card>
    </>
  )
}
