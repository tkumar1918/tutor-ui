import { useState } from 'react'
import { PageHeader } from '@/components/common/page-header'
import { CardGridSkeleton } from '@/components/common/loading-skeleton'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { PaginationBar } from '@/components/common/pagination-bar'
import { usePageable } from '@/hooks/use-pageable'
import type { Expertise } from '@/types/api'
import { useTutorsList } from '../hooks'
import { TutorFilters } from '../tutor-filters'
import { TutorCard } from '../tutor-card'

export function TutorsListPage() {
  const { pageable, setPage, setSize, resetPage } = usePageable()
  const [search, setSearch] = useState('')
  const [expertise, setExpertise] = useState<Expertise | undefined>()

  const query = useTutorsList({
    pageable,
    search: search || undefined,
    expertise,
  })

  return (
    <>
      <PageHeader
        title="Tutors"
        description="Browse our roster of tutors."
      />
      <TutorFilters
        search={search}
        expertise={expertise}
        onSearchChange={(v) => {
          setSearch(v)
          resetPage()
        }}
        onExpertiseChange={(v) => {
          setExpertise(v)
          resetPage()
        }}
      />

      {query.isPending ? (
        <CardGridSkeleton />
      ) : query.isError ? (
        <ErrorState message={query.error.message} />
      ) : query.data.content.length === 0 ? (
        <EmptyState title="No tutors found" description="Try adjusting your filters." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.content.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </div>
          <div className="mt-6">
            <PaginationBar
              page={query.data.page}
              size={query.data.size}
              totalPages={query.data.totalPages}
              totalElements={query.data.totalElements}
              first={query.data.first}
              last={query.data.last}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          </div>
        </>
      )}
    </>
  )
}
