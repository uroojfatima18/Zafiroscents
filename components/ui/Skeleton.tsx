import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading product" role="status">
      <Skeleton className="aspect-[3/4] w-full rounded-sm" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10"
      aria-live="polite"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
