import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../auth-shell'
import { RegisterForm } from '../register-form'
import { paths } from '@/routes/paths'

export function RegisterPage() {
  const navigate = useNavigate()
  return (
    <AuthShell
      title="Create an account"
      description="Sign up to enroll in courses and manage your learning."
      footer={
        <>
          Already have an account?{' '}
          <Link to={paths.login} className="text-foreground font-medium hover:underline">
            Login
          </Link>
        </>
      }
    >
      <RegisterForm onSuccess={() => navigate(paths.home, { replace: true })} />
    </AuthShell>
  )
}
