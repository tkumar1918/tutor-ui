import { format, parseISO } from 'date-fns'
import type { Expertise, Subject } from '@/types/api'

export function formatHourlyRate(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100) + '/hr'
}

export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'MMM d, yyyy')
  } catch {
    return iso
  }
}

export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return '—'
  try {
    return format(parseISO(iso), 'MMM d, yyyy · h:mm a')
  } catch {
    return iso
  }
}

const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split('_')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ')

export const subjectLabel = (s: Subject) => titleCase(s)
export const expertiseLabel = (e: Expertise) => titleCase(e)
