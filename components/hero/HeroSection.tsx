'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@frontend/components/ui/Button'

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#07151B]"
      aria-label="Zafiro Scents — Haute Parfumerie"
    >
      {/* ── 1. Background Artwork: Petroleum Teal & Antique Bone 'ZAFIRO' Plinth ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/zafiro-plinth-bg.jpg"
          alt="Zafiro Scents luxury mineral teal background with carved stone pedestal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-100"
        />

        {/* Soft edge darkening to blend seamlessly into teal-noir page body */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#07151B] via-transparent to-[#051014]/50 z-10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#051014]/40 via-transparent to-[#07151B] z-10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(7,21,27,0.8)_100%)] z-10 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ── 2. Top Spacing (Clean - all top text removed per user request) ── */}
      <div className="relative z-20 pt-24 sm:pt-28 pointer-events-none" aria-hidden="true" />

      {/* ── 3. Center: 3D Rotating 'ZAFIRO SCENTS' Perfume Bottle ────────── */}
      <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none py-6">
        <div
          className="relative flex items-center justify-center"
          style={{ perspective: 1400 }}
        >
          {/* Ambient warm aura behind the bottle */}
          <div
            className="absolute w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #C89B53 0%, #C86432 50%, transparent 70%)',
              transform: 'translateY(20px)',
            }}
            aria-hidden="true"
          />

          {/* Pedestal contact shadow */}
          <div
            className="absolute bottom-6 w-52 h-10 rounded-full blur-md opacity-70 bg-black/90 pointer-events-none"
            aria-hidden="true"
          />

          {/* 3D Slow Turntable Rotating Bottle */}
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: [-20, 20, -20],
              y: [0, -8, 0],
              rotateZ: [-1, 1, -1],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: 'easeInOut',
            }}
            className="relative w-[280px] sm:w-[330px] md:w-[380px] aspect-square flex items-center justify-center cursor-pointer pointer-events-auto filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
          >
            <Link
              href="/product/noir-absolut"
              className="relative w-full h-full block group focus-visible:outline-none"
              aria-label="View Zafiro Scents signature fragrance"
            >
              <Image
                src="/hero/zafiro-real-bottle-v3.png"
                alt="Zafiro Scents Eau De Parfum physical luxury bottle rotating"
                fill
                priority
                sizes="(max-width: 768px) 330px, 380px"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── 4. Bottom Floating Controls & Navigation ────────────────────── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {/* Left: Headline & Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C89B53] font-medium mb-1 drop-shadow-md">
              The Alchemy of Scent
            </p>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#EDE6D6] leading-tight mb-2 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
              Crafted for quiet confidence.
            </h2>

            <p className="text-[#93A5AC] text-xs sm:text-sm leading-relaxed max-w-md mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Handcrafted in limited batches with rare aged resins, velvety saffron, and smoky woods.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                href="/shop"
                id="hero-explore-collection-btn"
                className="bg-[#C89B53] text-[#07151B] hover:bg-[#E5C287] font-semibold tracking-[0.2em] uppercase text-xs px-7 py-3.5 shadow-[0_4px_24px_rgba(200,155,83,0.35)] transition-all duration-300"
              >
                Explore Collection
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                href="/product/noir-absolut"
                id="hero-view-featured-btn"
                className="border-[#C89B53]/50 bg-[#07151B]/60 text-[#EDE6D6] hover:bg-[#C89B53]/20 hover:border-[#C89B53] backdrop-blur-md tracking-[0.15em] uppercase text-xs px-6 py-3.5 transition-all duration-300"
              >
                Discover Noir Absolut
              </Button>
            </div>
          </motion.div>

          {/* Center Spacer */}
          <div className="hidden lg:block lg:col-span-2 pointer-events-none" />

          {/* Right: Olfactory Family Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col lg:items-end justify-end gap-2.5"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#93A5AC] drop-shadow-md">
              Explore by universe:
            </span>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              <Link
                href="/men"
                className="group flex flex-col items-center justify-center px-3.5 py-2.5 rounded-sm bg-[#07151B]/80 border border-[#C89B53]/30 hover:border-[#C89B53] hover:bg-[#C89B53]/15 backdrop-blur-md transition-all text-center"
              >
                <span className="text-xs font-display tracking-wider text-[#EDE6D6] group-hover:text-[#C89B53] transition-colors">
                  Men
                </span>
                <span className="text-[8px] uppercase tracking-widest text-[#93A5AC] mt-0.5">
                  Commanding
                </span>
              </Link>

              <Link
                href="/women"
                className="group flex flex-col items-center justify-center px-3.5 py-2.5 rounded-sm bg-[#07151B]/80 border border-[#7A1F2B]/40 hover:border-[#7A1F2B] hover:bg-[#7A1F2B]/20 backdrop-blur-md transition-all text-center"
              >
                <span className="text-xs font-display tracking-wider text-[#EDE6D6] group-hover:text-[#E5C287] transition-colors">
                  Women
                </span>
                <span className="text-[8px] uppercase tracking-widest text-[#93A5AC] mt-0.5">
                  Sensuous
                </span>
              </Link>

              <Link
                href="/unisex"
                className="group flex flex-col items-center justify-center px-3.5 py-2.5 rounded-sm bg-[#07151B]/80 border border-[#144A4F]/50 hover:border-[#144A4F] hover:bg-[#144A4F]/25 backdrop-blur-md transition-all text-center"
              >
                <span className="text-xs font-display tracking-wider text-[#EDE6D6] group-hover:text-[#C89B53] transition-colors">
                  Unisex
                </span>
                <span className="text-[8px] uppercase tracking-widest text-[#93A5AC] mt-0.5">
                  Mineral Teal
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Subtle scroll link */}
        <div className="flex items-center justify-between mt-6 pt-3 border-t border-[#EDE6D6]/10 text-[10px] uppercase tracking-[0.25em] text-[#93A5AC]">
          <span className="hidden sm:inline">Complimentary delivery across Pakistan</span>
          <a
            href="#featured"
            className="inline-flex items-center gap-2 text-[#EDE6D6]/70 hover:text-[#C89B53] transition-colors ml-auto"
          >
            <span>Scroll to discover</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
