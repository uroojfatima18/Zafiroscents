'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Chip } from '@/components/ui/Chip'

interface SortControlProps {
  currentSort?: string
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export function SortControl({ currentSort = 'newest' }: SortControlProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const handleSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', value)
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams],
  )

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Sort products"
    >
      <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] mr-1">
        Sort
      </span>
      {SORT_OPTIONS.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          active={currentSort === opt.value}
          onClick={() => handleSort(opt.value)}
          id={`sort-${opt.value}`}
        />
      ))}
    </div>
  )
}
