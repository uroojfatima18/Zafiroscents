import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FilterBar } from '@frontend/components/product/FilterBar'
import { ProductGrid } from '@frontend/components/product/ProductGrid'
import { ProductGridSkeleton } from '@frontend/components/ui/Skeleton'
import { getProducts } from '@backend/services/product.service'

export const metadata: Metadata = {
  title: 'Shop All Fragrances',
  description:
    'Browse the complete Zafiro Scents collection — men, women, and unisex luxury perfumes. Filter by category, price, and more.',
}

interface SearchParams {
  category?: string
  maxPrice?: string
  search?: string
  sort?: string
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { products, pagination } = await getProducts({
    category: params.category,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    search: params.search,
    sort: params.sort,
    page: params.page ? Number(params.page) : 1,
    limit: 24,
  })
  const total = pagination.total
  const currentPage = pagination.page

  return (
    <div className="pt-20">
      {/* Page header */}
      <div className="py-16 px-5 sm:px-8 lg:px-12 text-center border-b border-[var(--border)] animate-fade-up">
        <h1 className="font-display text-5xl sm:text-6xl text-[var(--text)]">
          Shop All
        </h1>
        <p className="mt-3 text-[var(--text-muted)] text-sm">
          {total} fragrance{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filter sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Suspense>
              <FilterBar />
            </Suspense>
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<ProductGridSkeleton count={12} />}>
              <ProductGrid
                products={products}
                emptyMessage="No fragrances match your filters. Try adjusting your search."
              />
            </Suspense>

            {/* Pagination */}
            {total > 24 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <a
                    href={`/shop?${new URLSearchParams({ ...params, page: String(currentPage - 1) }).toString()}`}
                    className="px-4 py-2 text-sm border border-[var(--border)] rounded-sm hover:border-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    ← Previous
                  </a>
                )}
                <span className="text-sm text-[var(--text-muted)] px-4">
                  Page {currentPage} of {Math.ceil(total / 24)}
                </span>
                {currentPage < Math.ceil(total / 24) && (
                  <a
                    href={`/shop?${new URLSearchParams({ ...params, page: String(currentPage + 1) }).toString()}`}
                    className="px-4 py-2 text-sm border border-[var(--border)] rounded-sm hover:border-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    Next →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
