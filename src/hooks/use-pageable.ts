import { useState } from 'react'
import type { Pageable } from '@/types/api'

export function usePageable(initial: Partial<Pageable> = {}) {
  const [pageable, setPageable] = useState<Pageable>({
    page: 0,
    size: 20,
    ...initial,
  })

  const setPage = (page: number) => setPageable((p) => ({ ...p, page }))
  const setSize = (size: number) => setPageable({ ...pageable, size, page: 0 })
  const resetPage = () => setPageable((p) => ({ ...p, page: 0 }))

  return { pageable, setPage, setSize, resetPage }
}
