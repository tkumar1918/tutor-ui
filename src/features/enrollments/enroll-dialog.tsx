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
import { useCreateEnrollment } from './hooks'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: number
  courseTitle: string
}

export function EnrollDialog({ open, onOpenChange, courseId, courseTitle }: Props) {
  const create = useCreateEnrollment()

  const handleConfirm = () => {
    create.mutate({ courseId }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in “{courseTitle}”?</DialogTitle>
          <DialogDescription>
            You'll be enrolled in this course with your current account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={create.isPending}>
            {create.isPending && <Loader2 className="size-4 animate-spin" />}
            Enroll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
