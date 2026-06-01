import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDateTime, subjectLabel } from '@/lib/format'
import { paths } from '@/routes/paths'
import type { TutoringRequestResponse } from '@/types/api'
import { RequestStatusBadge } from './request-status-badge'

type Perspective = 'student' | 'tutor' | 'admin'

interface Props {
  request: TutoringRequestResponse
  perspective: Perspective
  actions?: ReactNode
}

export function RequestCard({ request: r, perspective, actions }: Props) {
  // Student view: emphasize the tutor. Tutor view: emphasize the student.
  // Admin: show both.
  const headline =
    perspective === 'student' ? (
      <Link
        to={paths.tutorDetail(r.tutorId)}
        className="font-semibold hover:underline"
      >
        {r.tutorName}
      </Link>
    ) : perspective === 'tutor' ? (
      <span className="font-semibold">{r.studentName}</span>
    ) : (
      <span className="font-semibold">
        {r.studentName} → <Link to={paths.tutorDetail(r.tutorId)} className="hover:underline">{r.tutorName}</Link>
      </span>
    )

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            {headline}
            <p className="mt-1 text-sm text-muted-foreground">
              {subjectLabel(r.subject)} · {formatDateTime(r.createdAt)}
            </p>
          </div>
          <RequestStatusBadge status={r.status} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Message</p>
          <p className="mt-1 text-sm whitespace-pre-wrap">{r.message}</p>
        </div>

        {(r.tutorReply || r.respondedAt) && (
          <>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {perspective === 'tutor' ? 'Your reply' : 'Tutor reply'}
                {r.respondedAt ? ` · ${formatDateTime(r.respondedAt)}` : ''}
              </p>
              {r.tutorReply ? (
                <p className="mt-1 text-sm whitespace-pre-wrap">{r.tutorReply}</p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">No reply provided.</p>
              )}
            </div>
          </>
        )}

        {actions && <div className="flex justify-end gap-2 pt-2">{actions}</div>}
      </CardContent>
    </Card>
  )
}
