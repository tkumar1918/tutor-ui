import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { paths } from '@/routes/paths'

export function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <ShieldAlert className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">403 — Forbidden</h1>
      <p className="text-muted-foreground max-w-sm">
        You don&apos;t have permission to view this page. Admin access is required.
      </p>
      <Button asChild>
        <Link to={paths.home}>Back home</Link>
      </Button>
    </div>
  )
}
