import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { EXPERTISE, type TutorProfileResponse } from '@/types/api'
import {
  tutorProfileSchema,
  type TutorProfileInput,
  type TutorProfileValues,
} from './schemas'
import { expertiseLabel } from '@/lib/format'

interface Props {
  initial?: Pick<
    TutorProfileResponse,
    'bio' | 'expertise' | 'hourlyRateCents' | 'qualifications' | 'yearsOfExperience'
  >
  submitLabel: string
  pending: boolean
  onSubmit: (values: TutorProfileValues) => void
}

export function TutorForm({ initial, submitLabel, pending, onSubmit }: Props) {
  const form = useForm<TutorProfileInput, unknown, TutorProfileValues>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      bio: initial?.bio ?? '',
      qualifications: initial?.qualifications ?? '',
      yearsOfExperience: initial?.yearsOfExperience ?? 0,
      expertise: initial?.expertise ?? 'OTHER',
      hourlyRate: initial ? initial.hourlyRateCents / 100 : 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Background, teaching style…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qualifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualifications</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Degrees, certifications…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expertise</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXPERTISE.map((e) => (
                      <SelectItem key={e} value={e}>{expertiseLabel(e)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={60}
                    {...field}
                    value={field.value as number | string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly rate (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    {...field}
                    value={field.value as number | string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  )
}
