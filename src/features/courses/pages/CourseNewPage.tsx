import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/common/page-header'
import { paths } from '@/routes/paths'
import { CourseForm } from '../course-form'
import { useCreateCourse } from '../hooks'

export function CourseNewPage() {
  const navigate = useNavigate()
  const create = useCreateCourse()

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.courses}>
          <ArrowLeft className="size-4" />
          All courses
        </Link>
      </Button>
      <PageHeader title="New course" description="Create a new course offering." />
      <Card>
        <CardContent>
          <CourseForm
            submitLabel="Create course"
            pending={create.isPending}
            onSubmit={(values) =>
              create.mutate(values, {
                onSuccess: (course) => navigate(paths.courseDetail(course.id)),
              })
            }
          />
        </CardContent>
      </Card>
    </>
  )
}
