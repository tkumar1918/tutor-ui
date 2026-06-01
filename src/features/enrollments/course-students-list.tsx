import { useState } from 'react'
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
import {
  ENROLLMENT_STATUS,
  type EnrollmentResponse,
  type EnrollmentStatus,
} from '@/types/api'
import { useCourseEnrollments } from './hooks'
import { StatusBadge } from './status-badge'

const ANY = '__ANY__'

const columns: Column<EnrollmentResponse>[] = [
  { key: 'user', header: 'Student', cell: (e) => <span className="font-medium">{e.userName}</span> },
  { key: 'enrolled', header: 'Enrolled', cell: (e) => formatDateTime(e.enrolledAt) },
  { key: 'status', header: 'Status', cell: (e) => <StatusBadge status={e.status} /> },
]

interface Props {
  courseId: number
}

export function CourseStudentsList({ courseId }: Props) {
  const { pageable, setPage, setSize, resetPage } = usePageable({ size: 10 })
  const [status, setStatus] = useState<EnrollmentStatus | undefined>()

  const query = useCourseEnrollments(courseId, { pageable, status })

  return (
    <div className="space-y-4">
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

      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : query.data.content.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="No one has enrolled in this course."
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={query.data.content}
            rowKey={(e) => e.id}
          />
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
        </>
      )}
    </div>
  )
}
