import { MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/format'
import type { ReviewResponse } from '@/types/api'
import { RatingStars } from './rating-stars'

interface Props {
  review: ReviewResponse
  canManage: boolean
  onEdit: () => void
  onDelete: () => void
}

export function ReviewCard({ review, canManage, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">{review.studentName}</p>
            <div className="flex items-center gap-2">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
                {review.updatedAt !== review.createdAt && ' · edited'}
              </span>
            </div>
          </div>
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Review actions">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {review.comment && (
          <p className="text-sm whitespace-pre-wrap">{review.comment}</p>
        )}
      </CardContent>
    </Card>
  )
}
