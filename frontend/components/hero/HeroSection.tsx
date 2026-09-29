'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Signature Rail Data
const signatureProducts = [
  { id: 'noir', name: 'Noir Absolut', notes: 'Smoky oud, aged leather', image: '/products/red-driftwood.jpg' },
  { id: 'mystic', name: 'Mystic Oud', notes: 'Rare cedar, black pepper', image: '/products/red-woodchips.jpg' },
  { id: 'ocean', name: 'Ocean Breeze', notes: 'Salty driftwood, grey amber', image: '/products/blue-bottle.jpg' },
  { id: 'blooms', name: 'Enchanted Blooms', notes: 'Night jasmine, rose dust', image: '/products/green-bottle.jpg' },
  { id: 'purple', name: 'Royal Amethyst', notes: 'Wild orchid, dark plum', image: '/products/purple-bottle.jpg' },
]

export function HeroSection() {
  const [activeCard, setActiveCard] = useState('noir')

  return (
    <section className="w-full flex flex-col items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 bg-page-bg pb-12">
      {/* Hero Container */}
      <div className="w-full max-w-[1200px] mx-auto rounded-t-2xl relative overflow-hidden bg-hero-bg aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/10]">
        {/* Layer 0: FULL BACKGROUND IMAGE */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src="/hero/zafiro-peach-duo-hero.jpg"
              alt="Zafiro Scents signature luxury perfume bottles with embossed ZAFIRO backdrop"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-right"
            />
          </motion.div>
          {/* Subtle vignette/gradient to ensure left text remains readable */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 bg-gradient-to-r from-page-bg/40 to-transparent mix-blend-multiply" />
        </div>

        {/* Layer 4: TEXT BLOCK */}
        <div className="absolute bottom-[16%] left-[5%] w-[90%] md:w-[40%] lg:w-[35%] pb-6 z-40 flex flex-col justify-end h-full pr-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <p className="text-[11px] tracking-[0.22em] text-ink-soft uppercase font-semibold">
              Limited Batch Atelier
            </p>
            
            <h1 className="font-display text-ink leading-[1.1] text-balance" style={{ fontSize: 'clamp(1.75rem, 3.2cqw + 0.5rem, 3rem)' }}>
              SCENTS <br/>
              <span className="italic font-light text-ink-italic">ZAFIRO</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link 
                href="/shop"
                className="bg-ink hover:bg-ink-soft text-on-ink px-[18px] py-[12px] rounded-[6px] text-[11px] tracking-[0.14em] uppercase font-semibold transition-all hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent flex items-center gap-2"
              >
                Explore Collection
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              
              <Link 
                href="/product/noir-absolut"
                className="text-ink text-[11px] tracking-[0.14em] uppercase font-semibold border-b border-ink hover:border-b-2 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                Noir Absolut
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Signature Rail */}
      <div className="w-full max-w-[1200px] mx-auto bg-rail-bg rounded-b-2xl p-[14px] sm:p-[16px] flex flex-col lg:flex-row items-start lg:items-center gap-3 relative z-20">
        <span className="text-[11px] tracking-[0.2em] text-[#F1C3A5] whitespace-nowrap flex-none font-semibold uppercase">
          Signature
        </span>

        {/* Continuous Marquee Container */}
        <div className="w-full overflow-hidden flex items-center gap-[10px]">
          <div className="animate-marquee flex gap-[10px]">
            {[...signatureProducts, ...signatureProducts].map((product, idx) => (
              <button
                key={`${product.id}-${idx}`}
                onClick={() => setActiveCard(product.id)}
                aria-pressed={activeCard === product.id}
                className={`flex-none w-[220px] lg:w-auto lg:flex-1 min-w-0 p-[8px] rounded-[8px] flex items-center gap-3 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                  activeCard === product.id ? 'bg-rail-card-active border border-hero-bg' : 'bg-rail-card border border-transparent hover:bg-rail-card-active'
                }`}
              >
                <div className="w-[32px] h-[32px] rounded-full overflow-hidden relative flex-none">
                  <Image src={product.image} alt={product.name} fill sizes="32px" className="object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] text-rail-text font-semibold truncate">{product.name}</span>
                  <span className="text-[11px] text-rail-muted truncate">{product.notes}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
