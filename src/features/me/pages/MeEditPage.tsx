import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PageHeader } from '@/components/common/page-header'
import { DetailSkeleton } from '@/components/common/loading-skeleton'
import { ErrorState } from '@/components/common/error-state'
import { paths } from '@/routes/paths'
import { useMe, useUpdateMe } from '../hooks'
import { userUpdateSchema, type UserUpdateValues } from '../schemas'
import { emptyToUndefined } from '@/lib/schema-helpers'

export function MeEditPage() {
  const navigate = useNavigate()
  const me = useMe()
  const update = useUpdateMe()

  const form = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    values: me.data
      ? {
          firstName: me.data.user.firstName,
          lastName: me.data.user.lastName,
          dateOfBirth: me.data.user.dateOfBirth ?? '',
        }
      : undefined,
  })

  if (me.isPending) return <DetailSkeleton />
  if (me.isError) return <ErrorState message={me.error.message} />

  const onSubmit = form.handleSubmit((values) => {
    update.mutate(
      { ...values, dateOfBirth: emptyToUndefined(values.dateOfBirth) },
      { onSuccess: () => navigate(paths.me) },
    )
  })

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={paths.me}>
          <ArrowLeft className="size-4" />
          Back to profile
        </Link>
      </Button>
      <PageHeader title="Edit profile" />
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={update.isPending}>
                {update.isPending && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
