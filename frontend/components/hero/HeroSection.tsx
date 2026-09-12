'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero — Zafiro Scents"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--bg)]">
        {/* Subtle radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(201,163,86,0.08) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Fine grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: '256px 256px',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-32 lg:py-0 lg:min-h-screen">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-6"
            >
              Artisanal Fragrances
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[var(--text)] leading-[1.05] mb-8"
            >
              Wear a{' '}
              <em className="not-italic text-gold-gradient">memory</em>
              <br />
              not a scent.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-[var(--text-muted)] text-lg leading-relaxed max-w-md mb-10"
            >
              Each Zafiro fragrance is composed with rare ingredients and slow intention — for those who understand that a scent is a second skin.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" asChild href="/shop" id="hero-shop-cta">
                Explore the collection
              </Button>
              <Button variant="ghost" size="lg" asChild href="/unisex" id="hero-unisex-cta">
                Unisex fragrances
              </Button>
            </motion.div>
          </div>

          {/* 3D Bottle */}
          <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <HeroBottle />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[var(--accent)] to-transparent"
        />
      </motion.div>
    </section>
  )
}

function HeroBottle() {
  return (
    <div className="relative" style={{ width: 280, height: 420 }} aria-label="Zafiro Scents signature bottle">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #C9A356 0%, transparent 70%)',
          transform: 'scale(1.2)',
        }}
        aria-hidden="true"
      />

      {/* Bottle body */}
      <motion.div
        animate={{ rotateY: [0, 8, 0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden="true"
      >
        {/* Cap */}
        <div
          style={{
            width: 60,
            height: 24,
            background: 'linear-gradient(135deg, #d4b46e 0%, #C9A356 50%, #a87d2e 100%)',
            borderRadius: '6px 6px 0 0',
            boxShadow: '0 -2px 12px rgba(201,163,86,0.3)',
            marginBottom: 4,
          }}
        />
        {/* Neck */}
        <div
          style={{
            width: 32,
            height: 36,
            background: 'linear-gradient(180deg, rgba(201,163,86,0.6) 0%, rgba(245,241,232,0.2) 100%)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(201,163,86,0.4)',
          }}
        />
        {/* Main body */}
        <div
          style={{
            width: 140,
            height: 220,
            background:
              'linear-gradient(135deg, rgba(245,241,232,0.25) 0%, rgba(201,163,86,0.15) 30%, rgba(245,241,232,0.1) 60%, rgba(201,163,86,0.2) 100%)',
            border: '1.5px solid rgba(201,163,86,0.35)',
            borderRadius: '10px 10px 20px 20px',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 20px 60px rgba(201,163,86,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Liquid */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background:
                'linear-gradient(180deg, rgba(201,163,86,0.3) 0%, rgba(201,163,86,0.5) 100%)',
              borderRadius: '0 0 18px 18px',
            }}
          />
          {/* Label area */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              right: '10%',
              bottom: '45%',
              border: '1px solid rgba(201,163,86,0.4)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 11,
                color: 'rgba(201,163,86,0.9)',
                letterSpacing: '0.15em',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              ZAFIRO<br />SCENTS
            </span>
          </div>
          {/* Shine */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              width: '20%',
              bottom: 0,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
              borderRadius: '0 0 2px 2px',
            }}
          />
        </div>
        {/* Base */}
        <div
          style={{
            width: 160,
            height: 12,
            background: 'linear-gradient(135deg, #a87d2e 0%, #C9A356 100%)',
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 8px 24px rgba(201,163,86,0.25)',
          }}
        />
      </motion.div>
    </div>
  )
}
