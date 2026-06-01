import { Badge } from '@/components/ui/badge'
import { statusLabel } from '@/lib/format'
import type { EnrollmentStatus } from '@/types/api'

const variants: Record<EnrollmentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'outline',
}

export function StatusBadge({ status }: { status: EnrollmentStatus }) {
  return <Badge variant={variants[status]}>{statusLabel(status)}</Badge>
}
