import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroSection } from '@frontend/components/hero/HeroSection'
import { ProductGrid } from '@frontend/components/product/ProductGrid'
import { getProducts } from '@backend/services/product.service'

export const metadata: Metadata = {
  title: 'Zafiro Scents — Artisanal Luxury Fragrances',
  description:
    'Discover Zafiro Scents — handcrafted luxury perfumes for men, women, and beyond. Rare ingredients, quiet confidence.',
}

async function getFeaturedProducts() {
  const data = await getProducts({ featured: true, limit: 8 })
  return data.products
}

async function getNewArrivals() {
  const data = await getProducts({ sort: 'newest', limit: 4 })
  return data.products
}



export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ])

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-[var(--accent)] text-[var(--bg)] px-4 py-2 rounded-sm text-sm font-medium"
      >
        Skip to content
      </a>

      <HeroSection />



      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-24" aria-labelledby="new-arrivals-heading">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
              Just in
            </p>
            <h2 id="new-arrivals-heading" className="font-display text-4xl text-[var(--text)]">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      {/* Under Rs. 2,000 banner */}
      <section className="mx-5 sm:mx-8 lg:mx-12 mb-24 rounded-sm overflow-hidden animate-fade-up" aria-labelledby="promo-heading">
        <div
          className="relative py-16 px-8 sm:px-16 flex flex-col sm:flex-row items-center justify-between gap-8"
          style={{
            background:
              'linear-gradient(135deg, #FDEFE5 0%, #F5E3D5 100%)',
            border: '1px solid rgba(195,111,67,0.2)',
          }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
              Accessible luxury
            </p>
            <h2 id="promo-heading" className="font-display text-3xl sm:text-4xl text-[var(--text)] mb-3">
              Fine fragrance under Rs. 2,000
            </h2>
            <p className="text-[var(--text-muted)] text-sm max-w-md">
              A scent this considered should not require a compromise. Our entry collection proves it.
            </p>
          </div>
          <Link
            href="/shop?maxPrice=2000"
            id="promo-shop-link"
            className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 text-sm font-medium uppercase tracking-widest bg-[#2D1F17] text-[#FDFBF7] hover:bg-[#C36F43] transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            Discover
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Featured Collection */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-24" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
                Curated
              </p>
              <h2 id="featured-heading" className="font-display text-4xl text-[var(--text)]">
                Featured
              </h2>
            </div>
            <Link
              href="/shop?featured=true"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
            >
              View all →
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}
    </>
  )
}

function MiniBottle({ accent }: { accent: string }) {
  return (
    <div style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 18, height: 8, background: accent, borderRadius: '3px 3px 0 0' }} />
      <div style={{ width: 12, height: 14, background: accent, opacity: 0.7 }} />
      <div style={{ width: 48, height: 72, background: accent, opacity: 0.5, borderRadius: '4px 4px 8px 8px' }} />
    </div>
  )
}
