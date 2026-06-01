import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  page: number
  size: number
  totalPages: number
  totalElements: number
  first: boolean
  last: boolean
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

const SIZE_OPTIONS = [10, 20, 50, 100]

export function PaginationBar({
  page,
  size,
  totalPages,
  totalElements,
  first,
  last,
  onPageChange,
  onSizeChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-muted-foreground">
        {totalElements === 0
          ? 'No results'
          : `Page ${page + 1} of ${Math.max(totalPages, 1)} · ${totalElements} total`}
      </p>
      <div className="flex items-center gap-2">
        <Select value={String(size)} onValueChange={(v) => onSizeChange(Number(v))}>
          <SelectTrigger size="sm" className="w-28" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={first}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={last}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
