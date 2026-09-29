import { ProductCard } from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

interface Variant {
  id: string
  sizeMl: number
  price: number
  compareAtPrice: number | null
  stock: number
}

interface Product {
  id: string
  slug: string
  name: string
  category: string
  images: string[]
  featured: boolean
  variants: Variant[]
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
}

export function ProductGrid({ products, loading, emptyMessage = 'No fragrances found.' }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton />

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center" role="status" aria-live="polite">
        <div className="w-16 h-16 mb-6 text-[var(--text-muted)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.64-3.07l1.32-4.42A2.5 2.5 0 0 1 9.5 9H12M14.5 2A2.5 2.5 0 0 0 12 4.5M14.5 9h-2.5M15.5 13.5l1.32 4.42a2.5 2.5 0 0 1-1.64 3.07A2.5 2.5 0 0 1 12 19.5" />
          </svg>
        </div>
        <p className="font-display text-2xl text-[var(--text-muted)] mb-2">No results</p>
        <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
      {products.map((product, i) => (
        <div key={product.id} className="stagger-item" style={{ '--i': i } as React.CSSProperties}>
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  )
}
