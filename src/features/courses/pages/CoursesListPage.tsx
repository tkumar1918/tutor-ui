import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { CardGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { Button } from '@/components/ui/button'
import { usePageable } from '@/hooks/use-pageable'
import { isTutor, isAdmin, useAuthStore } from '@/stores/auth-store'
import { paths } from '@/routes/paths'
import type { Level, Subject } from '@/types/api'
import { useCoursesList } from '../hooks'
import { CourseFilters } from '../course-filters'
import { CourseCard } from '../course-card'

export function CoursesListPage() {
  const authorities = useAuthStore((s) => s.authorities)
  const canCreate = isTutor(authorities) || isAdmin(authorities)
  const { pageable, setPage, setSize, resetPage } = usePageable()
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState<Subject | undefined>()
  const [level, setLevel] = useState<Level | undefined>()

  const query = useCoursesList({
    pageable,
    search: search || undefined,
    subject,
    level,
  })

  return (
    <>
      <PageHeader
        title="Courses"
        description="Browse all available courses."
        actions={
          canCreate && (
            <Button asChild>
              <Link to={paths.courseNew}>
                <Plus className="size-4" />
                New course
              </Link>
            </Button>
          )
        }
      />
      <CourseFilters
        search={search}
        subject={subject}
        level={level}
        onSearchChange={(v) => {
          setSearch(v)
          resetPage()
        }}
        onSubjectChange={(v) => {
          setSubject(v)
          resetPage()
        }}
        onLevelChange={(v) => {
          setLevel(v)
          resetPage()
        }}
      />

      {query.isPending ? (
        <CardGridSkeleton />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : query.data.content.length === 0 ? (
        <EmptyState title="No courses found" description="Try adjusting your filters." />
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
