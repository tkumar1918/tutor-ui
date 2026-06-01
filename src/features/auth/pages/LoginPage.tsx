import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthShell } from '../auth-shell'
import { LoginForm } from '../login-form'
import { paths } from '@/routes/paths'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromState = (location.state as { from?: string } | null)?.from
  const fromQuery = new URLSearchParams(location.search).get('from')
  const target = fromState ?? fromQuery ?? paths.home

  return (
    <AuthShell
      title="Login"
      description="Welcome back. Sign in to your account."
      footer={
        <>
          New here?{' '}
          <Link to={paths.register} className="text-foreground font-medium hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm onSuccess={() => navigate(target, { replace: true })} />
    </AuthShell>
  )
}
