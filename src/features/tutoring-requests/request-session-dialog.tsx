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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SUBJECT } from '@/types/api'
import { subjectLabel } from '@/lib/format'
import { createRequestSchema, type CreateRequestValues } from './schemas'
import { useCreateTutoringRequest } from './hooks'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutorId: number
  tutorName: string
}

export function RequestSessionDialog({ open, onOpenChange, tutorId, tutorName }: Props) {
  const create = useCreateTutoringRequest()
  const form = useForm<CreateRequestValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: { subject: 'MATH', message: '' },
  })

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(
      { tutorId, ...values },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset({ subject: 'MATH', message: '' })
        },
      },
    )
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) form.reset({ subject: 'MATH', message: '' })
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a session with {tutorName}</DialogTitle>
          <DialogDescription>
            Pick a subject and describe what you'd like help with. The tutor will accept or
            decline.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUBJECT.map((s) => (
                        <SelectItem key={s} value={s}>{subjectLabel(s)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="What do you want to learn? When are you available?"
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
                disabled={create.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Loader2 className="size-4 animate-spin" />}
                Send request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
