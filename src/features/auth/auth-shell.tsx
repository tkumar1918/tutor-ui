import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { paths } from '@/routes/paths'

interface Props {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthShell({ title, description, children, footer }: Props) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link to={paths.home} className="flex items-center gap-2 font-semibold text-lg mb-6">
        <GraduationCap className="size-6" />
        Tutor
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      <div className="mt-4 text-sm text-muted-foreground">{footer}</div>
    </div>
  )
}
