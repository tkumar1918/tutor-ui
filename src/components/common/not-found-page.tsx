import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { paths } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Compass className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">404 — Not Found</h1>
      <p className="text-muted-foreground max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild>
        <Link to={paths.home}>Back home</Link>
      </Button>
    </div>
  )
}
