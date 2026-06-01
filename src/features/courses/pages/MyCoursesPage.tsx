import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { CardGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { Button } from '@/components/ui/button'
import { usePageable } from '@/hooks/use-pageable'
import { paths } from '@/routes/paths'
import { useMyCourses } from '../hooks'
import { CourseCard } from '../course-card'

export function MyCoursesPage() {
  const { pageable, setPage, setSize } = usePageable()
  const query = useMyCourses(pageable)

  return (
    <>
      <PageHeader
        title="My courses"
        description="Courses you teach."
        actions={
          <Button asChild>
            <Link to={paths.courseNew}>
              <Plus className="size-4" />
              New course
            </Link>
          </Button>
        }
      />

      {query.isPending ? (
        <CardGridSkeleton />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : query.data.content.length === 0 ? (
        <EmptyState title="You haven't created any courses yet" description="Create your first course to get started." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.content.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
          <div className="mt-6">
            <PaginationBar
              page={query.data.page}
              size={query.data.size}
              totalPages={query.data.totalPages}
              totalElements={query.data.totalElements}
              first={query.data.first}
              last={query.data.last}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          </div>
        </>
      )}
    </>
  )
}
