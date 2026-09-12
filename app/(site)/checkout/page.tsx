'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@frontend/store/cart'
import { formatPrice } from '@frontend/utils'
import { Button } from '@frontend/components/ui/Button'
import { Input } from '@frontend/components/ui/Input'
import Link from 'next/link'

const checkoutSchema = z.object({
  shippingName: z.string().min(2, 'Full name is required'),
  shippingPhone: z
    .string()
    .regex(/^(\+92|0)[0-9]{10}$/, 'Enter a valid Pakistani phone number (e.g. 03001234567)'),
  shippingAddress: z.string().min(5, 'Full address is required'),
  shippingCity: z.string().min(2, 'City is required'),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const total = totalPrice()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  })

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-4xl text-[var(--text)] mb-4">Nothing to checkout</h1>
        <p className="text-[var(--text-muted)] text-sm mb-8">Your cart is empty.</p>
        <Button asChild href="/shop" size="lg">Browse fragrances</Button>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productVariantId: i.productVariantId,
            quantity: i.quantity,
            priceAtPurchase: i.price,
          })),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.')
        return
      }

      clearCart()
      router.push(`/order-confirmation/${json.order.orderNumber}`)
    } catch {
      setError('A network error occurred. Please check your connection and try again.')
    }
  }

  return (
    <div className="pt-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--text)] mb-12">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping */}
              <fieldset className="space-y-5">
                <legend className="font-display text-2xl text-[var(--text)] mb-6">
                  Shipping details
                </legend>

                <Input
                  id="shipping-name"
                  label="Full name"
                  placeholder="Muhammad Ahmed"
                  autoComplete="name"
                  error={errors.shippingName?.message}
                  {...register('shippingName')}
                />
                <Input
                  id="shipping-phone"
                  label="Phone number"
                  placeholder="03001234567"
                  type="tel"
                  autoComplete="tel"
                  error={errors.shippingPhone?.message}
                  {...register('shippingPhone')}
                />
                <Input
                  id="shipping-address"
                  label="Street address"
                  placeholder="House 5, Street 12, DHA Phase 5"
                  autoComplete="street-address"
                  error={errors.shippingAddress?.message}
                  {...register('shippingAddress')}
                />
                <Input
                  id="shipping-city"
                  label="City"
                  placeholder="Lahore"
                  autoComplete="address-level2"
                  error={errors.shippingCity?.message}
                  {...register('shippingCity')}
                />
              </fieldset>

              {/* Payment */}
              <fieldset className="space-y-4">
                <legend className="font-display text-2xl text-[var(--text)] mb-4">
                  Payment
                </legend>
                <div
                  className="flex items-center gap-4 p-4 border border-[var(--accent)] rounded-sm bg-[var(--bg-surface)]"
                  role="radiogroup"
                  aria-label="Payment method"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-[var(--accent)] flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Pay when your order arrives. Available across Pakistan.
                    </p>
                  </div>
                </div>
              </fieldset>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-sm" role="alert">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div
                className="sticky top-24 p-6 rounded-sm space-y-5"
                style={{ background: 'var(--bg-surface)' }}
              >
                <h2 className="font-display text-xl text-[var(--text)]">Order Summary</h2>

                <ul className="space-y-3" role="list">
                  {items.map((item) => (
                    <li key={item.productVariantId} className="flex justify-between text-sm gap-3">
                      <span className="text-[var(--text)] truncate flex-1">
                        {item.productName}
                        <span className="text-[var(--text-muted)] ml-1">×{item.quantity}</span>
                      </span>
                      <span className="text-[var(--text-muted)] flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm">
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-2">
                    <span className="text-[var(--text)]">Total</span>
                    <span className="text-[var(--accent)]">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                  id="place-order-btn"
                >
                  Place order
                </Button>

                <p className="text-[10px] text-center text-[var(--text-muted)] leading-relaxed">
                  By placing your order you agree to our terms of service. Payment is due on delivery.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
