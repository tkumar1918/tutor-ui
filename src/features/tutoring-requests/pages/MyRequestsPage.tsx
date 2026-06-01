import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/common/page-header'
import { CardGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { usePageable } from '@/hooks/use-pageable'
import {
  TUTORING_REQUEST_STATUS,
  type TutoringRequestResponse,
  type TutoringRequestStatus,
} from '@/types/api'
import { useCancelTutoringRequest, useMyTutoringRequests } from '../hooks'
import { RequestCard } from '../request-card'

const ANY = '__ANY__'

export function MyRequestsPage() {
  const { pageable, setPage, setSize, resetPage } = usePageable({ size: 10 })
  const [status, setStatus] = useState<TutoringRequestStatus | undefined>()
  const [toCancel, setToCancel] = useState<TutoringRequestResponse | null>(null)

  const query = useMyTutoringRequests({ pageable, status })
  const cancel = useCancelTutoringRequest()

  return (
    <>
      <PageHeader title="My tutoring requests" description="1:1 sessions you've requested." />
      <div className="mb-4">
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
      </div>

      {query.isPending ? (
        <CardGridSkeleton count={3} />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : query.data.content.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="Visit a tutor's page and click 'Request session' to send one."
        />
      ) : (
        <>
          <div className="space-y-3">
            {query.data.content.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                perspective="student"
                actions={
                  r.status === 'PENDING' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setToCancel(r)}
                    >
                      <X className="size-4" />
                      Cancel request
                    </Button>
                  ) : null
                }
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

      <ConfirmDialog
        open={toCancel !== null}
        onOpenChange={(o) => !o && setToCancel(null)}
        title="Cancel this request?"
        description={
          toCancel
            ? `Cancel your request to ${toCancel.tutorName}? They won't be able to respond after this.`
            : ''
        }
        confirmLabel="Cancel request"
        destructive
        loading={cancel.isPending}
        onConfirm={() =>
          toCancel &&
          cancel.mutate(toCancel.id, { onSuccess: () => setToCancel(null) })
        }
      />
    </>
  )
}
