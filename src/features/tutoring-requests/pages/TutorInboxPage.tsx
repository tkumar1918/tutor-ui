import { useState } from 'react'
import { Check, X } from 'lucide-react'
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
import { ApiError } from '@/lib/api/client'
import { usePageable } from '@/hooks/use-pageable'
import {
  TUTORING_REQUEST_STATUS,
  type TutoringRequestResponse,
  type TutoringRequestStatus,
} from '@/types/api'
import { useIncomingTutoringRequests } from '../hooks'
import { RequestCard } from '../request-card'
import { RespondDialog } from '../respond-dialog'

const ANY = '__ANY__'

export function TutorInboxPage() {
  const { pageable, setPage, setSize, resetPage } = usePageable({ size: 10 })
  const [status, setStatus] = useState<TutoringRequestStatus | undefined>('PENDING')
  const [target, setTarget] = useState<TutoringRequestResponse | null>(null)
  const [action, setAction] = useState<'ACCEPTED' | 'REJECTED' | null>(null)

  const query = useIncomingTutoringRequests({ pageable, status })

  // Two ApiError shapes to handle distinctly: 404 (no tutor profile) and 422
  // (applied but not approved). Anything else is a generic ErrorState.
  if (query.isError && query.error instanceof ApiError) {
    if (query.error.status === 404) {
      return (
        <>
          <PageHeader title="Tutor inbox" />
          <EmptyState
            title="You're not a tutor yet"
            description="Apply to become a tutor first. Once approved, student requests will show up here."
          />
        </>
      )
    }
    if (query.error.status === 422) {
      return (
        <>
          <PageHeader title="Tutor inbox" />
          <EmptyState
            title="Your tutor application is pending"
            description="An admin needs to approve your application before students can request sessions."
          />
        </>
      )
    }
  }

  return (
    <>
      <PageHeader
        title="Tutor inbox"
        description="Session requests from students. Accept or reject each one."
      />
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
            <SelectItem value={ANY}>All requests</SelectItem>
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
        <EmptyState title="No requests" description="Nothing to respond to right now." />
      ) : (
        <>
          <div className="space-y-3">
            {query.data.content.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                perspective="tutor"
                actions={
                  r.status === 'PENDING' ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTarget(r)
                          setAction('ACCEPTED')
                        }}
                      >
                        <Check className="size-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setTarget(r)
                          setAction('REJECTED')
                        }}
                      >
                        <X className="size-4" />
                        Reject
                      </Button>
                    </>
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

      <RespondDialog
        open={action !== null}
        onOpenChange={(o) => {
          if (!o) {
            setAction(null)
            setTarget(null)
          }
        }}
        request={target}
        action={action}
      />
    </>
  )
}
