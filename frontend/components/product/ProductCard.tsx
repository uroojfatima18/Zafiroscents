'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'
import { Badge } from '@/components/ui/Badge'

interface ProductVariant {
  id: string
  sizeMl: number
  price: number
  compareAtPrice: number | null
  stock: number
}

interface ProductCardProps {
  id: string
  slug: string
  name: string
  category: string
  images: string[]
  featured: boolean
  variants: ProductVariant[]
}

export function ProductCard({ id, slug, name, category, images, featured, variants }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  // Default to cheapest variant
  const lowestVariant = variants.reduce((a, b) => (a.price < b.price ? a : b))
  const inStock = variants.some((v) => v.stock > 0)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productVariantId: lowestVariant.id,
      productId: id,
      productSlug: slug,
      productName: name,
      productImage: images[0] ?? '',
      sizeMl: lowestVariant.sizeMl,
      price: lowestVariant.price,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const [imgError, setImgError] = useState(false)

  const imageUrl = images[0] || null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <Link
        href={`/product/${slug}`}
        className="flex flex-col h-full focus-visible:outline-none"
        aria-label={`View ${name}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[var(--bg-surface)] rounded-sm overflow-hidden card-lift">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {featured && <Badge label="New" variant="new" />}
            {!inStock && <Badge label="Sold Out" variant="low-stock" />}
            {lowestVariant.compareAtPrice && lowestVariant.compareAtPrice > lowestVariant.price && (
              <Badge label="Sale" variant="sale" />
            )}
          </div>

          {/* Bottle illustration fallback */}
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <CssBottle category={category} />
          )}

          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              aria-label={`Add ${name} to cart`}
              className="w-full py-2.5 text-xs font-medium uppercase tracking-widest bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 rounded-sm shadow-sm"
            >
              {added ? 'Added' : inStock ? 'Add to cart' : 'Sold out'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2 px-1 space-y-1">
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            {category}
          </p>
          <h3 className="font-display text-[var(--text)] leading-snug text-lg">
            {name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-[var(--text)]">
              {formatPrice(lowestVariant.price)}
            </span>
            {lowestVariant.compareAtPrice && lowestVariant.compareAtPrice > lowestVariant.price && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                {formatPrice(lowestVariant.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// CSS fallback bottle when no product image is available
function CssBottle({ category }: { category: string }) {
  const colors: Record<string, { body: string; cap: string; liquid: string }> = {
    men: { body: 'rgba(201,163,86,0.15)', cap: '#C9A356', liquid: 'rgba(201,163,86,0.4)' },
    women: { body: 'rgba(122,31,43,0.12)', cap: '#7A1F2B', liquid: 'rgba(122,31,43,0.35)' },
    unisex: { body: 'rgba(31,92,78,0.12)', cap: '#1F5C4E', liquid: 'rgba(31,92,78,0.35)' },
  }
  const c = colors[category] ?? colors.unisex

  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="flex flex-col items-center" style={{ width: 80 }}>
        {/* Cap */}
        <div
          style={{
            width: 28,
            height: 14,
            background: c.cap,
            borderRadius: '3px 3px 0 0',
            marginBottom: 2,
          }}
        />
        {/* Neck */}
        <div
          style={{
            width: 18,
            height: 20,
            background: `linear-gradient(180deg, ${c.cap} 0%, ${c.body} 100%)`,
            borderRadius: 2,
          }}
        />
        {/* Body */}
        <div
          style={{
            width: 60,
            height: 96,
            background: c.body,
            border: `1.5px solid ${c.cap}30`,
            borderRadius: '6px 6px 10px 10px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: c.liquid,
              borderRadius: '0 0 8px 8px',
            }}
          />
        </div>
      </div>
    </div>
  )
}
