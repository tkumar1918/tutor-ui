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
import { EXPERTISE, type Expertise } from '@/types/api'
import { expertiseLabel } from '@/lib/format'

interface Props {
  search: string
  expertise: Expertise | undefined
  onSearchChange: (v: string) => void
  onExpertiseChange: (v: Expertise | undefined) => void
}

const ANY = '__ANY__'

export function TutorFilters({ search, expertise, onSearchChange, onExpertiseChange }: Props) {
  const hasFilters = !!search || !!expertise
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={expertise ?? ANY}
        onValueChange={(v) => onExpertiseChange(v === ANY ? undefined : (v as Expertise))}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Expertise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any expertise</SelectItem>
          {EXPERTISE.map((e) => (
            <SelectItem key={e} value={e}>
              {expertiseLabel(e)}
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
            onExpertiseChange(undefined)
          }}
        >
          <X className="size-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
