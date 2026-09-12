'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice } from '@frontend/utils'
import { useCartStore } from '@frontend/store/cart'
import { Button } from '@frontend/components/ui/Button'
import { Badge } from '@frontend/components/ui/Badge'
import { ProductGrid } from '@frontend/components/product/ProductGrid'

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
  description: string
  category: string
  images: string[]
  featured: boolean
  notesTop: string[]
  notesHeart: string[]
  notesBase: string[]
  variants: Variant[]
}

interface RelatedProduct {
  id: string
  slug: string
  name: string
  category: string
  images: string[]
  featured: boolean
  variants: Variant[]
}

interface ProductDetailClientProps {
  product: Product
  related: RelatedProduct[]
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0],
  )
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const inStock = selectedVariant.stock > 0

  const handleAddToCart = () => {
    addItem({
      productVariantId: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productImage: product.images[0] ?? '',
      sizeMl: selectedVariant.sizeMl,
      price: selectedVariant.price,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-[var(--text-muted)]" role="list">
            <li><Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={`/${product.category}`} className="hover:text-[var(--accent)] transition-colors capitalize">{product.category}</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-[var(--text)]">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-[var(--bg-surface)] rounded-sm overflow-hidden">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={`${product.name} — image ${selectedImage + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <FallbackBottleDisplay category={product.category} name={product.name} />
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3" role="list" aria-label="Product images">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    role="listitem"
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 aspect-square bg-[var(--bg-surface)] rounded-sm overflow-hidden border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      selectedImage === i ? 'border-[var(--accent)]' : 'border-transparent hover:border-[var(--border)]'
                    }`}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={selectedImage === i}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)] capitalize">
                  {product.category}
                </span>
                {product.featured && <Badge label="New" variant="new" />}
                {!inStock && <Badge label="Sold Out" variant="low-stock" />}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl text-[var(--text)] mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl text-[var(--accent)]">
                  {formatPrice(selectedVariant.price)}
                </span>
                {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                  <span className="text-lg text-[var(--text-muted)] line-through">
                    {formatPrice(selectedVariant.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[var(--text-muted)] leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
                Size
              </p>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Select size">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    role="radio"
                    aria-checked={selectedVariant.id === variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`px-5 py-3 text-sm border rounded-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant.id === variant.id
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                        : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]'
                    }`}
                  >
                    {variant.sizeMl}ml
                    {variant.stock === 0 && ' (sold out)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
                Quantity
              </p>
              <div className="inline-flex items-center border border-[var(--border)] rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-11 h-11 flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm tabular-nums" aria-live="polite" aria-label={`Quantity: ${quantity}`}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                  aria-label="Increase quantity"
                  disabled={quantity >= selectedVariant.stock}
                  className="w-11 h-11 flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              {selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                <p className="text-xs text-[var(--text-muted)]">
                  Only {selectedVariant.stock} left
                </p>
              )}
            </div>

            {/* Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock}
                id="add-to-cart-btn"
                className="flex-1"
              >
                {added ? '✓ Added to cart' : inStock ? 'Add to cart' : 'Sold out'}
              </Button>
              <Button variant="outline" size="lg" asChild href="/cart">View cart</Button>
            </div>

            {/* Notes pyramid */}
            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
                Fragrance Notes
              </p>
              <NotesPyramid
                top={product.notesTop}
                heart={product.notesHeart}
                base={product.notesBase}
              />
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24" aria-labelledby="related-heading">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
                You may also like
              </p>
              <h2 id="related-heading" className="font-display text-3xl text-[var(--text)]">
                From the same world
              </h2>
            </div>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </div>
  )
}

function NotesPyramid({
  top,
  heart,
  base,
}: {
  top: string[]
  heart: string[]
  base: string[]
}) {
  const tiers = [
    { label: 'Top', notes: top, delay: 0, width: '60%' },
    { label: 'Heart', notes: heart, delay: 0.1, width: '80%' },
    { label: 'Base', notes: base, delay: 0.2, width: '100%' },
  ]

  return (
    <div className="space-y-3" role="list" aria-label="Fragrance note pyramid">
      {tiers.map((tier) => (
        <motion.div
          key={tier.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: tier.delay }}
          className="flex items-start gap-4"
          role="listitem"
        >
          <div className="flex-shrink-0 w-12 pt-1">
            <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              {tier.label}
            </span>
          </div>
          <div className="flex-1">
            <div
              className="h-0.5 bg-[var(--accent)] opacity-40 mb-2 rounded-full"
              style={{ width: tier.width }}
              aria-hidden="true"
            />
            <p className="text-sm text-[var(--text)]">
              {tier.notes.join(', ')}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function FallbackBottleDisplay({ category, name }: { category: string; name: string }) {
  const colors: Record<string, string> = {
    men: '#C9A356',
    women: '#7A1F2B',
    unisex: '#1F5C4E',
  }
  const accent = colors[category] ?? '#C9A356'

  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-label={`${name} bottle`}>
      <div className="flex flex-col items-center" style={{ width: 140 }}>
        <div style={{ width: 50, height: 22, background: accent, borderRadius: '6px 6px 0 0', opacity: 0.9 }} />
        <div style={{ width: 32, height: 32, background: accent, opacity: 0.6 }} />
        <div
          style={{
            width: 110,
            height: 180,
            border: `2px solid ${accent}`,
            borderRadius: '8px 8px 18px 18px',
            opacity: 0.7,
            position: 'relative',
            overflow: 'hidden',
            background: `${accent}10`,
          }}
        >
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: `${accent}30`, borderRadius: '0 0 16px 16px' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: 10, color: accent, letterSpacing: '0.1em', lineHeight: 1.5, display: 'block' }}>
              ZAFIRO<br />SCENTS
            </span>
          </div>
        </div>
        <div style={{ width: 126, height: 14, background: accent, opacity: 0.8, borderRadius: '0 0 8px 8px' }} />
      </div>
    </div>
  )
}
