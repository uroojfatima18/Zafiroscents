import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductGrid } from '@frontend/components/product/ProductGrid'
import { SortControl } from '@frontend/components/product/SortControl'
import { ProductGridSkeleton } from '@frontend/components/ui/Skeleton'

export const metadata: Metadata = {
  title: "Women's Fragrances",
  description:
    'Sensuous, complex, enduring. Shop the Zafiro Scents women\'s collection — jasmine, rose, oud, and more.',
  openGraph: {
    title: "Women's Fragrances | Zafiro Scents",
    description: 'Deeply feminine fragrances with lasting power.',
  },
}

import { getProducts } from '@backend/services/product.service'

async function getWomensProducts(sort: string) {
  const data = await getProducts({ category: 'women', sort, limit: 24 })
  return data.products
}

interface PageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function WomenPage({ searchParams }: PageProps) {
  const { sort = 'newest' } = await searchParams
  const products = await getWomensProducts(sort)

  return (
    // Wine accent override for this route
    <div className="pt-20" style={{ '--route-accent': '#7A1F2B' } as React.CSSProperties}>
      {/* Page header */}
      <div
        className="py-20 px-5 sm:px-8 lg:px-12 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(122,31,43,0.06) 0%, transparent 100%)' }}
      >
        <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: '#7A1F2B' }}>
          The collection
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-[var(--text)]">Women</h1>
        <p className="mt-4 text-[var(--text-muted)] max-w-md mx-auto text-sm leading-relaxed">
          Sensuous. Complex. Enduring. A rose does not need to announce itself.
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
          <ProductGrid products={products} emptyMessage="No women's fragrances found." />
        </Suspense>
      </div>
    </div>
  )
}
