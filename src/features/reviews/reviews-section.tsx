import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/auth-store'
import { useMe } from '@/features/me/hooks'
import { useMyTutoringRequests } from '@/features/tutoring-requests/hooks'
import type { ReviewResponse } from '@/types/api'
import { useDeleteReview, useTutorReviews } from './hooks'
import { ReviewCard } from './review-card'
import { ReviewDialog } from './review-dialog'

interface Props {
  tutorId: number
  tutorUserId: number
  tutorName: string
}

export function ReviewsSection({ tutorId, tutorUserId, tutorName }: Props) {
  const token = useAuthStore((s) => s.token)
  const me = useMe(!!token)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ReviewResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReviewResponse | null>(null)

  const reviewsQuery = useTutorReviews({
    tutorId,
    pageable: { page, size, sort: ['createdAt,desc'] },
  })

  const isSelf = !!me.data && me.data.user.id === tutorUserId
  const acceptedRequests = useMyTutoringRequests({
    status: 'ACCEPTED',
    pageable: { page: 0, size: 100 },
  })
  const isEligible =
    !!token &&
    !isSelf &&
    !!acceptedRequests.data?.content.some((r) => r.tutorId === tutorId)

  const myReview =
    me.data && reviewsQuery.data?.content.find((r) => r.studentId === me.data!.user.id)

  const deleteMutation = useDeleteReview(tutorId)

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (review: ReviewResponse) => {
    setEditing(review)
    setDialogOpen(true)
  }

  return (
    <section className="mt-8">
      <Separator className="mb-6" />
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">Reviews</h2>
        {myReview ? (
          <Button variant="outline" onClick={() => openEdit(myReview)}>
            <Star className="size-4" />
            Edit your review
          </Button>
        ) : (
          isEligible && (
            <Button onClick={openCreate}>
              <Star className="size-4" />
              Write a review
            </Button>
          )
        )}
      </div>

      {reviewsQuery.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : reviewsQuery.isError ? (
        <ErrorState message={reviewsQuery.error.message} />
      ) : reviewsQuery.data.content.length === 0 ? (
        <EmptyState
          icon={<Star className="size-8" />}
          title="No reviews yet"
          description={
            isEligible
              ? `Be the first to review ${tutorName}.`
              : 'After a tutor accepts your session request, you can leave a review.'
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {reviewsQuery.data.content.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                canManage={!!me.data && review.studentId === me.data.user.id}
                onEdit={() => openEdit(review)}
                onDelete={() => setDeleteTarget(review)}
              />
            ))}
          </div>
          <div className="mt-4">
            <PaginationBar
              page={reviewsQuery.data.page}
              size={reviewsQuery.data.size}
              totalPages={reviewsQuery.data.totalPages}
              totalElements={reviewsQuery.data.totalElements}
              first={reviewsQuery.data.first}
              last={reviewsQuery.data.last}
              onPageChange={setPage}
              onSizeChange={(s) => {
                setSize(s)
                setPage(0)
              }}
            />
          </div>
        </>
      )}

      <ReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tutorId={tutorId}
        tutorName={tutorName}
        existing={editing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete your review?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }}
      />
    </section>
  )
}
