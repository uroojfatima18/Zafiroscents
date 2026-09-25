'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useCartStore } from '@/lib/store/cart'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?sort=newest', label: 'New Release' },
  { href: '/men', label: 'Men' },
  { href: '/women', label: 'Women' },
  { href: '/unisex', label: 'Unisex' },
]

export function Header() {
  const pathname = usePathname()
  const totalItems = useCartStore((s) => s.totalItems())
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname])

  const { data: session } = useSession()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF2EB]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm'
          : 'bg-[#FAF2EB]/80 backdrop-blur-md border-b border-[var(--border)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm" aria-label="Zafiro Scents — Home">
            <span className="font-display text-xl md:text-2xl text-[var(--text)] tracking-wider">
              Fragsënce <span className="text-[var(--accent)] text-xs font-sans tracking-normal">| Zafiro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-sm px-1 ${
                  pathname.startsWith(link.href)
                    ? 'text-[var(--accent)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* User Account / Profile link */}
            {session ? (
              <Link
                href="/profile"
                aria-label="My Account and Orders"
                className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] group bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-xs uppercase"
                title={`Logged in as ${session.user?.name || session.user?.email}`}
              >
                {session.user?.name ? session.user.name.charAt(0) : 'U'}
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Sign In"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                title="Sign In / Register"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            {/* Cart link */}
            <Link
              href="/cart"
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
              className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[var(--accent)] text-[var(--bg)] rounded-full text-[10px] font-medium flex items-center justify-center px-1 tabular-nums">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {menuOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav
            className="md:hidden border-t border-[var(--border)] py-4 space-y-1"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-3 text-sm font-sans tracking-wide rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  pathname.startsWith(link.href)
                    ? 'text-[var(--accent)] bg-[var(--bg-surface)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-[var(--border)]/60 mt-2">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2.5 text-sm font-medium text-[var(--accent)]"
                  >
                    My Account & Orders ({session.user?.name || 'Client'})
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-3 py-2 text-xs uppercase tracking-wider text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2.5 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)]"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
