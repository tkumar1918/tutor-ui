import { Badge } from '@/components/ui/badge'
import type { TutoringRequestStatus } from '@/types/api'

const VARIANTS: Record<TutoringRequestStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  ACCEPTED: 'default',
  REJECTED: 'destructive',
  CANCELLED: 'outline',
}

export function RequestStatusBadge({ status }: { status: TutoringRequestStatus }) {
  return <Badge variant={VARIANTS[status]}>{status}</Badge>
}
