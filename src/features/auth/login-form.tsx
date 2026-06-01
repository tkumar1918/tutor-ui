import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ApiError } from '@/lib/api/client'
import { loginSchema, type LoginValues } from './schemas'
import { useLogin } from './hooks'

interface Props {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: Props) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })
  const mutation = useLogin()

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, { onSuccess })
  })

  const credError =
    mutation.error instanceof ApiError && mutation.error.code === 'INVALID_CREDENTIALS'
      ? mutation.error.message
      : null

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {credError && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{credError}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input autoComplete="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  )
}
