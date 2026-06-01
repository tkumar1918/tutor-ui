import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/page-header'
import { TableSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { DataTable, type Column } from '@/components/common/data-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePageable } from '@/hooks/use-pageable'
import { formatDateTime, statusLabel } from '@/lib/format'
import { paths } from '@/routes/paths'
import {
  ENROLLMENT_STATUS,
  type EnrollmentResponse,
  type EnrollmentStatus,
} from '@/types/api'
import { useMyEnrollments } from '../hooks'
import { StatusBadge } from '../status-badge'

const ANY = '__ANY__'

const columns: Column<EnrollmentResponse>[] = [
  {
    key: 'course',
    header: 'Course',
    cell: (e) => (
      <Link
        to={paths.courseDetail(e.courseId)}
        className="font-medium hover:underline"
        onClick={(ev) => ev.stopPropagation()}
      >
        {e.courseTitle}
      </Link>
    ),
  },
  { key: 'enrolled', header: 'Enrolled', cell: (e) => formatDateTime(e.enrolledAt) },
  { key: 'status', header: 'Status', cell: (e) => <StatusBadge status={e.status} /> },
]

export function MyEnrollmentsPage() {
  const navigate = useNavigate()
  const { pageable, setPage, setSize, resetPage } = usePageable()
  const [status, setStatus] = useState<EnrollmentStatus | undefined>()

  const query = useMyEnrollments({ pageable, status })

  return (
    <>
      <PageHeader title="My enrollments" description="Courses you're enrolled in." />
      <div className="mb-4">
        <Select
          value={status ?? ANY}
          onValueChange={(v) => {
            setStatus(v === ANY ? undefined : (v as EnrollmentStatus))
            resetPage()
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any status</SelectItem>
            {ENROLLMENT_STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                title="No enrollments yet"
                description="Browse courses and enroll to see them here."
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
