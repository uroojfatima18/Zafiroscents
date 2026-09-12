'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@frontend/store/cart'
import { formatPrice } from '@frontend/utils'
import { Button } from '@frontend/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()
  const total = totalPrice()
  const count = totalItems()

  if (count === 0) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <div className="w-20 h-20 mb-8 text-[var(--text-muted)]" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h1 className="font-display text-4xl text-[var(--text)] mb-3">Your cart is empty</h1>
        <p className="text-[var(--text-muted)] text-sm mb-8 max-w-xs">
          You haven't added anything yet. Explore the collection and find your signature scent.
        </p>
        <Button size="lg" asChild href="/shop">
          Explore fragrances
        </Button>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--text)] mb-12">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Line items */}
          <div className="lg:col-span-2 space-y-1">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.productVariantId}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-5 py-6 border-b border-[var(--border)]">
                    {/* Image */}
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="flex-shrink-0 w-24 h-24 bg-[var(--bg-surface)] rounded-sm overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      aria-label={`View ${item.productName}`}
                    >
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15" />
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="font-display text-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors block truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {item.sizeMl}ml
                      </p>
                      <p className="text-sm text-[var(--accent)] mt-2">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity + remove */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.productVariantId)}
                        aria-label={`Remove ${item.productName} from cart`}
                        className="text-[var(--text-muted)] hover:text-red-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                      </button>
                      <div className="inline-flex items-center border border-[var(--border)] rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums" aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 p-6 rounded-sm space-y-5"
              style={{ background: 'var(--bg-surface)' }}
            >
              <h2 className="font-display text-xl text-[var(--text)]">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Subtotal ({count} item{count !== 1 ? 's' : ''})</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Shipping</span>
                  <span className="text-[var(--accent)]">Calculated at checkout</span>
                </div>
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex justify-between font-medium">
                <span className="text-[var(--text)]">Total</span>
                <span className="text-[var(--accent)] text-lg">{formatPrice(total)}</span>
              </div>
              <Button size="lg" className="w-full" asChild href="/checkout" id="proceed-to-checkout">
                Proceed to Checkout
              </Button>
              <Link
                href="/shop"
                className="block text-center text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
