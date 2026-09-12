import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice } from '@frontend/utils'
import { Button } from '@frontend/components/ui/Button'
import { getOrderById } from '@backend/services/order.service'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your Zafiro Scents order has been received.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 lg:px-12 py-20 text-center">
        {/* Success icon */}
        <div
          className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(201,163,86,0.12)', border: '1px solid rgba(201,163,86,0.3)' }}
          aria-hidden="true"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-3">
          Order received
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--text)] mb-4">
          Thank you.
        </h1>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-sm mx-auto mb-8">
          Your order has been placed and will be delivered within 3–5 business days. Our team will contact you before dispatch.
        </p>

        {/* Order number */}
        <div
          className="inline-flex flex-col items-center gap-1 px-8 py-5 rounded-sm mb-10"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
            Order number
          </span>
          <span className="font-display text-3xl text-[var(--accent)]">
            {order.orderNumber}
          </span>
        </div>

        {/* Order details */}
        <div
          className="text-left rounded-sm overflow-hidden mb-10"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Shipping info */}
          <div className="p-6 space-y-3 border-b border-[var(--border)]">
            <h2 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
              Shipping to
            </h2>
            <div className="text-sm text-[var(--text)] space-y-1">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-[var(--text-muted)]">{order.shippingPhone}</p>
              <p className="text-[var(--text-muted)]">{order.shippingAddress}, {order.shippingCity}</p>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
              Items ordered
            </h2>
            <ul className="space-y-3" role="list">
              {order.items.map((item: {
                id: string
                quantity: number
                priceAtPurchase: number
                productVariant: { sizeMl: number; product: { name: string; slug: string } }
              }) => (
                <li key={item.id} className="flex justify-between text-sm gap-4">
                  <div>
                    <p className="text-[var(--text)]">
                      {item.productVariant.product.name}
                    </p>
                    <p className="text-[var(--text-muted)] text-xs">
                      {item.productVariant.sizeMl}ml × {item.quantity}
                    </p>
                  </div>
                  <span className="text-[var(--text-muted)] flex-shrink-0">
                    {formatPrice(item.priceAtPurchase * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-[var(--border)] flex justify-between font-medium">
              <span className="text-[var(--text)]">Total</span>
              <span className="text-[var(--accent)]">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="px-6 py-4 bg-[var(--bg-surface)] border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">
              Payment: <span className="text-[var(--text)] capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild href="/shop">Continue shopping</Button>
          <Button variant="outline" size="lg" asChild href="/">Back to home</Button>
        </div>
      </div>
    </div>
  )
}
