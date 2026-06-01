import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, levelLabel, subjectLabel } from '@/lib/format'
import { paths } from '@/routes/paths'
import type { CourseResponse } from '@/types/api'

interface Props {
  course: CourseResponse
}

export function CourseCard({ course }: Props) {
  return (
    <Link to={paths.courseDetail(course.id)}>
      <Card className="h-full transition-colors hover:border-foreground/30">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
            <span className="text-sm font-semibold whitespace-nowrap">
              {formatPrice(course.priceCents)}
            </span>
          </div>
          <CardDescription className="line-clamp-2 min-h-[2.5em]">
            {course.description || 'No description provided.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary">{subjectLabel(course.subject)}</Badge>
          <Badge variant="outline">{levelLabel(course.level)}</Badge>
          <span className="text-muted-foreground ml-auto truncate">by {course.tutorName}</span>
        </CardContent>
      </Card>
    </Link>
  )
}
