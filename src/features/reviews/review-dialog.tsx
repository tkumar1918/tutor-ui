import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { ReviewResponse } from '@/types/api'
import { RatingStarsInput } from './rating-stars'
import { reviewSchema, type ReviewValues } from './schemas'
import { useCreateTutorReview, useUpdateReview } from './hooks'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutorId: number
  tutorName: string
  existing?: ReviewResponse | null
}

const blank: ReviewValues = { rating: 5, comment: '' }

export function ReviewDialog({ open, onOpenChange, tutorId, tutorName, existing }: Props) {
  const create = useCreateTutorReview(tutorId)
  const update = useUpdateReview(tutorId)
  const isEdit = !!existing
  const submitting = create.isPending || update.isPending

  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: blank,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      existing
        ? { rating: existing.rating, comment: existing.comment ?? '' }
        : blank,
    )
  }, [open, existing, form])

  const onSubmit = form.handleSubmit((values) => {
    const body = {
      rating: values.rating,
      comment: values.comment?.trim() ? values.comment.trim() : null,
    }
    const close = () => onOpenChange(false)
    if (isEdit) {
      update.mutate({ id: existing.id, body }, { onSuccess: close })
    } else {
      create.mutate(body, { onSuccess: close })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit your review' : `Review ${tutorName}`}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your rating or comment.'
              : 'Share your experience to help other students.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RatingStarsInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="What stood out about this tutor?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? 'Save changes' : 'Post review'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
