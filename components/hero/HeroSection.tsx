'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const bottomPerfumeImages = [
  {
    id: 'perfume-1',
    image: '/products/noir-absolut.jpg',
    href: '/product/noir-absolut',
    alt: 'Zafiro Perfume 1',
  },
  {
    id: 'perfume-2',
    image: '/products/enchanted-blooms.jpg',
    href: '/women',
    alt: 'Zafiro Perfume 2',
  },
  {
    id: 'perfume-3',
    image: '/products/mystic-oud.jpg',
    href: '/men',
    alt: 'Zafiro Perfume 3',
  },
  {
    id: 'perfume-4',
    image: '/products/ocean-breeze.jpg',
    href: '/unisex',
    alt: 'Zafiro Perfume 4',
  },
]

export function HeroSection() {
  return (
    <section
      className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #EAA07B 0%, #E2936C 40%, #F5EBE1 100%)',
      }}
      aria-label="Zafiro Scents — Haute Parfumerie"
    >
      {/* Subtle ambient peach lighting glows */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: '#FFD3B6' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: '#F8B48F' }}
        aria-hidden="true"
      />

      {/* ── Main Framed Hero Card ─────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(110,45,20,0.28)] border border-white/25 bg-[#2B140C]">
        {/* Background Artwork: Tilted Duo Perfume Bottles with ZAFIRO Backdrop */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] w-full">
          <Image
            src="/hero/zafiro-peach-duo-hero.jpg"
            alt="Zafiro Scents signature luxury perfume bottles with embossed ZAFIRO backdrop"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />

          {/* Soft subtle bottom vignette to blend into bottom image dock */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* ── Bottom Segmented Perfume Images Dock (Clean, images only as requested) ── */}
        <div id="bestseller" className="relative z-20 border-t border-white/15 bg-black/40 backdrop-blur-md py-4 px-4 sm:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              {bottomPerfumeImages.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.08, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="group relative block w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-white/15 border border-white/25 hover:border-white/70 hover:bg-white/25 transition-all shadow-md"
                    aria-label={`View perfume ${idx + 1}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="96px"
                      className="object-contain p-1.5 transition-transform duration-300"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
