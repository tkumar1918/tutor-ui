import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { CardGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePageable } from '@/hooks/use-pageable'
import {
  TUTOR_APPLICATION_STATUS,
  type TutorApplicationStatus,
  type TutorProfileResponse,
} from '@/types/api'
import { useApplicationsList } from '../hooks'
import { ApplicationCard } from '../application-card'
import { ReviewDialog } from '../review-dialog'

const ANY = '__ANY__'

export function ApplicationsListPage() {
  const { pageable, setPage, setSize, resetPage } = usePageable({ size: 10 })
  const [status, setStatus] = useState<TutorApplicationStatus | undefined>('PENDING')
  const [target, setTarget] = useState<TutorProfileResponse | null>(null)
  const [action, setAction] = useState<'APPROVED' | 'REJECTED' | null>(null)

  const query = useApplicationsList({ pageable, status })

  return (
    <>
      <PageHeader
        title="Tutor applications"
        description="Review tutor applications submitted by users."
      />
      <div className="mb-4">
        <Select
          value={status ?? ANY}
          onValueChange={(v) => {
            setStatus(v === ANY ? undefined : (v as TutorApplicationStatus))
            resetPage()
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>All applications</SelectItem>
            {TUTOR_APPLICATION_STATUS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {query.isPending ? (
        <CardGridSkeleton count={3} />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : query.data.content.length === 0 ? (
        <EmptyState title="No applications" description="Nothing to review at the moment." />
      ) : (
        <>
          <div className="space-y-3">
            {query.data.content.map((a) => (
              <ApplicationCard
                key={a.id}
                application={a}
                onAction={(act) => {
                  setTarget(a)
                  setAction(act)
                }}
              />
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

      <ReviewDialog
        open={action !== null}
        onOpenChange={(o) => {
          if (!o) {
            setAction(null)
            setTarget(null)
          }
        }}
        application={target}
        action={action}
      />
    </>
  )
}
