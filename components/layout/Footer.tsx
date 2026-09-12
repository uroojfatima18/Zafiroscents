'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const footerNav = [
  {
    title: 'Explore',
    links: [
      { href: '/men', label: 'Men' },
      { href: '/women', label: 'Women' },
      { href: '/unisex', label: 'Unisex' },
      { href: '/shop', label: 'Shop All' },
    ],
  },
  {
    title: 'Information',
    links: [
      { href: '/cart', label: 'Cart' },
      { href: '/checkout', label: 'Checkout' },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('You are on the list.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-surface)] mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm">
              <span className="font-display text-2xl text-[var(--accent)] tracking-wider">
                Zafiro Scents
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Artisanal fragrances composed with intention. Each bottle holds a world — find yours.
            </p>
            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
                Stay in the story
              </p>
              {status === 'success' ? (
                <p className="text-sm text-[var(--accent)]">{message}</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2" noValidate>
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 min-w-0"
                    aria-label="Email address for newsletter"
                    error={status === 'error' ? message : undefined}
                  />
                  <Button
                    type="submit"
                    loading={status === 'loading'}
                    size="md"
                    aria-label="Subscribe to newsletter"
                    className="flex-shrink-0"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <div key={col.title} className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
                {col.title}
              </p>
              <ul className="space-y-3" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Zafiro Scents. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Crafted with care — Lahore, Pakistan
          </p>
        </div>
      </div>
    </footer>
  )
}
