import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LEVEL, SUBJECT, type Level, type Subject } from '@/types/api'
import { levelLabel, subjectLabel } from '@/lib/format'

interface Props {
  search: string
  subject: Subject | undefined
  level: Level | undefined
  onSearchChange: (v: string) => void
  onSubjectChange: (v: Subject | undefined) => void
  onLevelChange: (v: Level | undefined) => void
}

const ANY = '__ANY__'

export function CourseFilters({
  search,
  subject,
  level,
  onSearchChange,
  onSubjectChange,
  onLevelChange,
}: Props) {
  const hasFilters = !!search || !!subject || !!level
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search title or description"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={subject ?? ANY}
        onValueChange={(v) => onSubjectChange(v === ANY ? undefined : (v as Subject))}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any subject</SelectItem>
          {SUBJECT.map((s) => (
            <SelectItem key={s} value={s}>
              {subjectLabel(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={level ?? ANY}
        onValueChange={(v) => onLevelChange(v === ANY ? undefined : (v as Level))}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any level</SelectItem>
          {LEVEL.map((l) => (
            <SelectItem key={l} value={l}>
              {levelLabel(l)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onSearchChange('')
            onSubjectChange(undefined)
            onLevelChange(undefined)
          }}
        >
          <X className="size-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
