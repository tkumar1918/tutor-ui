import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DisplayProps {
  rating: number
  size?: 'sm' | 'md'
  className?: string
}

const SIZE_CLASS = { sm: 'size-3.5', md: 'size-4' } as const

export function RatingStars({ rating, size = 'md', className }: DisplayProps) {
  const rounded = Math.round(rating)
  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            SIZE_CLASS[size],
            n <= rounded ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </div>
  )
}

interface InputProps {
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
}

export function RatingStarsInput({ value, onChange, disabled }: InputProps) {
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          disabled={disabled}
          onClick={() => onChange(n)}
          className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          <Star
            className={cn(
              'size-6 transition-colors',
              n <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
            )}
          />
        </button>
      ))}
    </div>
  )
}
