import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { CardGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { usePageable } from '@/hooks/use-pageable'
import {
  TUTORING_REQUEST_STATUS,
  type TutoringRequestStatus,
} from '@/types/api'
import { useAllTutoringRequests } from '../hooks'
import { RequestCard } from '../request-card'

const ANY = '__ANY__'

export function AdminRequestsPage() {
  const { pageable, setPage, setSize, resetPage } = usePageable({ size: 10 })
  const [studentId, setStudentId] = useState('')
  const [tutorId, setTutorId] = useState('')
  const [status, setStatus] = useState<TutoringRequestStatus | undefined>()

  const query = useAllTutoringRequests({
    pageable,
    studentId: studentId ? Number(studentId) : undefined,
    tutorId: tutorId ? Number(tutorId) : undefined,
    status,
  })

  const hasFilters = !!studentId || !!tutorId || !!status

  return (
    <>
      <PageHeader
        title="Tutoring requests"
        description="All 1:1 session requests across the platform."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
        <Input
          type="number"
          min={1}
          placeholder="Student ID"
          className="sm:w-36"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value)
            resetPage()
          }}
        />
        <Input
          type="number"
          min={1}
          placeholder="Tutor ID"
          className="sm:w-36"
          value={tutorId}
          onChange={(e) => {
            setTutorId(e.target.value)
            resetPage()
          }}
        />
        <Select
          value={status ?? ANY}
          onValueChange={(v) => {
            setStatus(v === ANY ? undefined : (v as TutoringRequestStatus))
            resetPage()
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any status</SelectItem>
            {TUTORING_REQUEST_STATUS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStudentId('')
              setTutorId('')
              setStatus(undefined)
              resetPage()
            }}
          >
            <X className="size-4" />
            Clear
          </Button>
        )}
      </div>

      {query.isPending ? (
        <CardGridSkeleton count={3} />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : query.data.content.length === 0 ? (
        <EmptyState title="No requests found" description="Try adjusting your filters." />
      ) : (
        <>
          <div className="space-y-3">
            {query.data.content.map((r) => (
              <RequestCard key={r.id} request={r} perspective="admin" />
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
