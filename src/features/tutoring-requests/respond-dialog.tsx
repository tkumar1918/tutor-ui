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
import type { TutoringRequestResponse } from '@/types/api'
import {
  respondRequestSchema,
  type RespondRequestValues,
} from './schemas'
import { useRespondToTutoringRequest } from './hooks'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: TutoringRequestResponse | null
  action: 'ACCEPTED' | 'REJECTED' | null
}

export function RespondDialog({ open, onOpenChange, request, action }: Props) {
  const respond = useRespondToTutoringRequest(request?.id ?? -1)
  const form = useForm<RespondRequestValues>({
    resolver: zodResolver(respondRequestSchema),
    defaultValues: { status: action ?? 'ACCEPTED', tutorReply: '' },
    values: action ? { status: action, tutorReply: '' } : undefined,
  })

  if (!request || !action) return null

  const isAccept = action === 'ACCEPTED'

  const onSubmit = form.handleSubmit((values) => {
    respond.mutate(
      { ...values, tutorReply: values.tutorReply || undefined },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset({ status: action, tutorReply: '' })
        },
      },
    )
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) form.reset({ status: action, tutorReply: '' })
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAccept ? 'Accept' : 'Reject'} {request.studentName}'s request?
          </DialogTitle>
          <DialogDescription>
            {isAccept
              ? 'Optionally add a reply with next steps (e.g. scheduling).'
              : 'Optionally let them know why so they can adjust and re-apply.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="tutorReply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reply (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
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
                disabled={respond.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={isAccept ? 'default' : 'destructive'}
                disabled={respond.isPending}
              >
                {respond.isPending && <Loader2 className="size-4 animate-spin" />}
                {isAccept ? 'Accept' : 'Reject'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
