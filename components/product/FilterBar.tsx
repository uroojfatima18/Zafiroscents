'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition, useState, useEffect } from 'react'
import { Chip } from '@/components/ui/Chip'
import { Input } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'

const CATEGORIES = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
]

const MAX_PRICE = 10000
const UNDER_2K = 2000

export function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get('maxPrice') ?? MAX_PRICE),
  )

  const category = searchParams.get('category') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'
  const under2k = Number(searchParams.get('maxPrice')) === UNDER_2K

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === '') params.delete(k)
        else params.set(k, v)
      })
      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [router, pathname, searchParams],
  )

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      pushParams({ search: search || null, page: null })
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleCategory = (val: string) => {
    pushParams({ category: category === val ? null : val, page: null })
  }

  const handleMaxPrice = (val: number) => {
    setMaxPrice(val)
    pushParams({ maxPrice: val === MAX_PRICE ? null : String(val), page: null })
  }

  const handleUnder2k = () => {
    if (under2k) {
      setMaxPrice(MAX_PRICE)
      pushParams({ maxPrice: null, page: null })
    } else {
      setMaxPrice(UNDER_2K)
      pushParams({ maxPrice: String(UNDER_2K), page: null })
    }
  }

  const handleSort = (val: string) => {
    pushParams({ sort: val })
  }

  return (
    <aside className="space-y-7" aria-label="Product filters">
      {/* Search */}
      <div>
        <Input
          id="shop-search"
          type="search"
          placeholder="Search fragrances…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Search"
          aria-label="Search fragrances"
        />
      </div>

      {/* Category */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.value}
              label={c.label}
              active={category === c.value}
              onClick={() => handleCategory(c.value)}
              id={`filter-cat-${c.value}`}
            />
          ))}
        </div>
      </div>

      {/* Quick filter */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
          Quick Filters
        </p>
        <Chip
          label="Under Rs. 2,000"
          active={under2k}
          onClick={handleUnder2k}
          id="filter-under-2k"
        />
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
            Max price
          </p>
          <span className="text-xs text-[var(--accent)]">{formatPrice(maxPrice)}</span>
        </div>
        <input
          id="price-range"
          type="range"
          min={500}
          max={MAX_PRICE}
          step={100}
          value={maxPrice}
          onChange={(e) => handleMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--accent)] cursor-pointer"
          aria-label={`Maximum price: ${formatPrice(maxPrice)}`}
        />
        <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
          <span>Rs. 500</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
          Sort by
        </p>
        <div className="flex flex-col gap-2">
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'price_asc', label: 'Price: Low to High' },
            { value: 'price_desc', label: 'Price: High to Low' },
          ].map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={sort === opt.value}
              onClick={() => handleSort(opt.value)}
              id={`shop-sort-${opt.value}`}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
