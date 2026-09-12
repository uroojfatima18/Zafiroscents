import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductGrid } from '@frontend/components/product/ProductGrid'
import { SortControl } from '@frontend/components/product/SortControl'
import { ProductGridSkeleton } from '@frontend/components/ui/Skeleton'
import { getProducts } from '@backend/services/product.service'

export const metadata: Metadata = {
  title: "Men's Fragrances",
  description:
    'Commanding, precise, unforgettable. Shop the Zafiro Scents men\'s collection — oud, leather, wood, and spice.',
  openGraph: {
    title: "Men's Fragrances | Zafiro Scents",
    description: 'Commanding fragrances for the discerning man.',
  },
}

async function getMensProducts(sort: string) {
  const data = await getProducts({ category: 'men', sort, limit: 24 })
  return data.products
}

interface PageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function MenPage({ searchParams }: PageProps) {
  const { sort = 'newest' } = await searchParams
  const products = await getMensProducts(sort)

  return (
    <div className="pt-20">
      {/* Page header */}
      <div
        className="py-20 px-5 sm:px-8 lg:px-12 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(201,163,86,0.06) 0%, transparent 100%)' }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-3">
          The collection
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-[var(--text)]">Men</h1>
        <p className="mt-4 text-[var(--text-muted)] max-w-md mx-auto text-sm leading-relaxed">
          Commanding. Precise. Unforgettable. Fragrances built to leave a presence long after you have gone.
        </p>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-24">
        <div className="flex items-center justify-between mb-10">
          <p className="text-sm text-[var(--text-muted)]">
            {products.length} fragrance{products.length !== 1 ? 's' : ''}
          </p>
          <Suspense>
            <SortControl currentSort={sort} />
          </Suspense>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} emptyMessage="No men's fragrances found." />
        </Suspense>
      </div>
    </div>
  )
}
