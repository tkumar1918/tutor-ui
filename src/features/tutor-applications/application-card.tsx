import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { expertiseLabel, formatDateTime, formatHourlyRate } from '@/lib/format'
import type { TutorProfileResponse } from '@/types/api'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
}

interface Props {
  application: TutorProfileResponse
  onAction: (action: 'APPROVED' | 'REJECTED') => void
}

export function ApplicationCard({ application: a, onAction }: Props) {
  const [open, setOpen] = useState(false)
  const initials = `${a.firstName[0] ?? ''}${a.lastName[0] ?? ''}`.toUpperCase()
  const expandable =
    !!a.bio || !!a.qualifications || !!a.reviewedAt || !!a.rejectionReason
  const pending = a.status === 'PENDING'

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="size-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">
                {a.firstName} {a.lastName}
              </span>
              <Badge variant={STATUS_VARIANTS[a.status] ?? 'secondary'}>{a.status}</Badge>
              <span className="text-xs text-muted-foreground">User #{a.userId}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {expertiseLabel(a.expertise)} · {formatHourlyRate(a.hourlyRateCents)} ·{' '}
              {a.yearsOfExperience} yr · Applied {formatDateTime(a.appliedAt)}
            </p>
          </div>
          {expandable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Collapse details' : 'Expand details'}
            >
              <ChevronDown
                className={cn('size-4 transition-transform', open && 'rotate-180')}
              />
            </Button>
          )}
        </div>

        {open && (
          <div className="space-y-3 border-t pt-4">
            {a.bio && (
              <Field label="Bio">
                <p className="text-sm whitespace-pre-wrap">{a.bio}</p>
              </Field>
            )}
            {a.qualifications && (
              <Field label="Qualifications">
                <p className="text-sm whitespace-pre-wrap">{a.qualifications}</p>
              </Field>
            )}
            {a.reviewedAt && (
              <Field label="Reviewed">
                <p className="text-sm">{formatDateTime(a.reviewedAt)}</p>
              </Field>
            )}
            {a.rejectionReason && (
              <Field label="Rejection reason">
                <p className="text-sm">{a.rejectionReason}</p>
              </Field>
            )}
          </div>
        )}

        {pending && (
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button size="sm" variant="outline" onClick={() => onAction('APPROVED')}>
              <Check className="size-4" />
              Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onAction('REJECTED')}>
              <X className="size-4" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}
