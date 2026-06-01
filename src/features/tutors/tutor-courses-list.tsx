import { CardGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { CourseCard } from '@/features/courses/course-card'
import { usePageable } from '@/hooks/use-pageable'
import { useTutorCourses } from './hooks'

interface Props {
  tutorId: number
}

export function TutorCoursesList({ tutorId }: Props) {
  const { pageable, setPage, setSize } = usePageable({ size: 6 })
  const query = useTutorCourses(tutorId, pageable)

  if (query.isPending) return <CardGridSkeleton count={3} />
  if (query.isError) return <ErrorState message={query.error.message} />
  if (query.data.content.length === 0) {
    return <EmptyState title="No courses yet" description="This tutor hasn't created any courses." />
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.content.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
      {query.data.totalPages > 1 && (
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
      )}
    </>
  )
}
