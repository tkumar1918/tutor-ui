import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
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
import { LEVEL, SUBJECT, type CourseResponse } from '@/types/api'
import {
  courseCreateSchema,
  type CourseCreateInput,
  type CourseCreateValues,
} from './schemas'
import { levelLabel, subjectLabel } from '@/lib/format'

interface Props {
  initial?: CourseResponse
  submitLabel: string
  pending: boolean
  onSubmit: (values: CourseCreateValues) => void
}

export function CourseForm({ initial, submitLabel, pending, onSubmit }: Props) {
  const form = useForm<CourseCreateInput, unknown, CourseCreateValues>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      subject: initial?.subject ?? 'MATH',
      level: initial?.level ?? 'BEGINNER',
      priceCents: initial?.priceCents ?? 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Intro to Calculus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="What will students learn?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUBJECT.map((s) => (
                      <SelectItem key={s} value={s}>
                        {subjectLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEVEL.map((l) => (
                      <SelectItem key={l} value={l}>
                        {levelLabel(l)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="priceCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (cents)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  value={field.value as number | string}
                />
              </FormControl>
              <FormDescription>e.g. 4999 = $49.99</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  )
}
