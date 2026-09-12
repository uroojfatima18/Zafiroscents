import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductGrid } from '@frontend/components/product/ProductGrid'
import { SortControl } from '@frontend/components/product/SortControl'
import { ProductGridSkeleton } from '@frontend/components/ui/Skeleton'
import { getProducts } from '@backend/services/product.service'

export const metadata: Metadata = {
  title: 'Unisex Fragrances',
  description:
    'Beyond convention. Zafiro Scents unisex fragrances — oud blanche, sea salt, sacred wood and more.',
  openGraph: {
    title: 'Unisex Fragrances | Zafiro Scents',
    description: 'Gender-free luxury fragrances for the open-minded.',
  },
}

async function getUnisexProducts(sort: string) {
  const data = await getProducts({ category: 'unisex', sort, limit: 24 })
  return data.products
}

interface PageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function UnisexPage({ searchParams }: PageProps) {
  const { sort = 'newest' } = await searchParams
  const products = await getUnisexProducts(sort)

  return (
    <div className="pt-20">
      {/* Page header */}
      <div
        className="py-20 px-5 sm:px-8 lg:px-12 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(31,92,78,0.06) 0%, transparent 100%)' }}
      >
        <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: '#1F5C4E' }}>
          The collection
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-[var(--text)]">Unisex</h1>
        <p className="mt-4 text-[var(--text-muted)] max-w-md mx-auto text-sm leading-relaxed">
          Beyond convention. These compositions belong to no one gender — and therefore to everyone.
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
          <ProductGrid products={products} emptyMessage="No unisex fragrances found." />
        </Suspense>
      </div>
    </div>
  )
}
