import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ENROLLMENT_STATUS, type EnrollmentStatus } from '@/types/api'
import { statusLabel } from '@/lib/format'

interface Props {
  courseId: string
  status: EnrollmentStatus | undefined
  onCourseIdChange: (v: string) => void
  onStatusChange: (v: EnrollmentStatus | undefined) => void
}

const ANY = '__ANY__'

export function EnrollmentFilters({
  courseId,
  status,
  onCourseIdChange,
  onStatusChange,
}: Props) {
  const hasFilters = !!courseId || !!status
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
      <Input
        type="number"
        min={1}
        placeholder="Course ID"
        className="sm:w-44"
        value={courseId}
        onChange={(e) => onCourseIdChange(e.target.value)}
      />
      <Select
        value={status ?? ANY}
        onValueChange={(v) => onStatusChange(v === ANY ? undefined : (v as EnrollmentStatus))}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any status</SelectItem>
          {ENROLLMENT_STATUS.map((s) => (
            <SelectItem key={s} value={s}>
              {statusLabel(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onCourseIdChange('')
            onStatusChange(undefined)
          }}
        >
          <X className="size-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
