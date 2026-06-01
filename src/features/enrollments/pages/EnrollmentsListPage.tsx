import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/page-header'
import { TableSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { DataTable, type Column } from '@/components/common/data-table'
import { usePageable } from '@/hooks/use-pageable'
import { formatDateTime } from '@/lib/format'
import { paths } from '@/routes/paths'
import type { EnrollmentResponse, EnrollmentStatus } from '@/types/api'
import { useEnrollmentsList } from '../hooks'
import { EnrollmentFilters } from '../enrollment-filters'
import { StatusBadge } from '../status-badge'

const columns: Column<EnrollmentResponse>[] = [
  {
    key: 'user',
    header: 'User',
    cell: (e) => <span className="font-medium">{e.userName}</span>,
  },
  {
    key: 'course',
    header: 'Course',
    cell: (e) => (
      <Link
        to={paths.courseDetail(e.courseId)}
        className="hover:underline"
        onClick={(ev) => ev.stopPropagation()}
      >
        {e.courseTitle}
      </Link>
    ),
  },
  { key: 'enrolled', header: 'Enrolled', cell: (e) => formatDateTime(e.enrolledAt) },
  { key: 'status', header: 'Status', cell: (e) => <StatusBadge status={e.status} /> },
]

export function EnrollmentsListPage() {
  const navigate = useNavigate()
  const { pageable, setPage, setSize, resetPage } = usePageable()
  const [courseId, setCourseId] = useState('')
  const [status, setStatus] = useState<EnrollmentStatus | undefined>()

  const query = useEnrollmentsList({
    pageable,
    courseId: courseId ? Number(courseId) : undefined,
    status,
  })

  return (
    <>
      <PageHeader title="Enrollments" description="All course enrollments." />
      <EnrollmentFilters
        courseId={courseId}
        status={status}
        onCourseIdChange={(v) => {
          setCourseId(v)
          resetPage()
        }}
        onStatusChange={(v) => {
          setStatus(v)
          resetPage()
        }}
      />
      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={query.data.content}
            rowKey={(e) => e.id}
            onRowClick={(e) => navigate(paths.enrollmentDetail(e.id))}
            emptyContent={
              <EmptyState
                title="No enrollments found"
                description="Try adjusting your filters or enroll someone from a course page."
              />
            }
          />
          {query.data.content.length > 0 && (
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
      )}
    </>
  )
}
