import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useReviewApplication } from './hooks'
import type { TutorProfileResponse } from '@/types/api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: TutorProfileResponse | null
  action: 'APPROVED' | 'REJECTED' | null
}

export function ReviewDialog({ open, onOpenChange, application, action }: Props) {
  const review = useReviewApplication()
  const [rejectionReason, setRejectionReason] = useState('')

  const handleClose = (next: boolean) => {
    onOpenChange(next)
    if (!next) setRejectionReason('')
  }

  if (!application || !action) return null

  const isReject = action === 'REJECTED'

  const handleConfirm = () => {
    review.mutate(
      {
        id: application.id,
        body: { status: action, rejectionReason: isReject ? rejectionReason : undefined },
      },
      { onSuccess: () => handleClose(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isReject ? 'Reject' : 'Approve'} {application.firstName} {application.lastName}'s application?
          </DialogTitle>
          <DialogDescription>
            {isReject
              ? 'Provide a reason that will be visible to the applicant.'
              : 'This grants tutor privileges to this user.'}
          </DialogDescription>
        </DialogHeader>
        {isReject && (
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Reason</Label>
            <Textarea
              id="rejection-reason"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Optional — but useful for the applicant"
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={review.isPending}>
            Cancel
          </Button>
          <Button
            variant={isReject ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={review.isPending}
          >
            {review.isPending && <Loader2 className="size-4 animate-spin" />}
            {isReject ? 'Reject' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
