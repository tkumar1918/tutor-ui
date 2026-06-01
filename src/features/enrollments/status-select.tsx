import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ENROLLMENT_STATUS, type EnrollmentStatus } from '@/types/api'
import { statusLabel } from '@/lib/format'
import { useUpdateEnrollmentStatus } from './hooks'

interface Props {
  id: number
  current: EnrollmentStatus
}

export function StatusSelect({ id, current }: Props) {
  const mutation = useUpdateEnrollmentStatus(id)
  return (
    <Select
      value={current}
      disabled={mutation.isPending}
      onValueChange={(v) => mutation.mutate(v as EnrollmentStatus)}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ENROLLMENT_STATUS.map((s) => (
          <SelectItem key={s} value={s}>
            {statusLabel(s)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
