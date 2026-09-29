'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserDropdownProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
        className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-semibold text-xs uppercase"
        title={`Account: ${user.name || user.email}`}
      >
        {initial}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 rounded-xl bg-[#FAF2EB] dark:bg-[#1E1714] border border-[var(--border)] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          {/* Header info */}
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                Signed In
              </p>
              {user.role === 'admin' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent)] text-white">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[var(--text)] truncate">
              {user.name || 'Valued Client'}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {user.email}
            </p>
          </div>

          {/* Links */}
          <div className="py-1 text-xs">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[var(--accent)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/15 transition-colors font-medium border-b border-[var(--border)]/50"
                role="menuitem"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Admin Dashboard</span>
              </Link>
            )}

            <Link
              href="/profile?tab=profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[var(--text)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile & Address</span>
            </Link>

            <Link
              href="/profile?tab=orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[var(--text)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>My Orders</span>
            </Link>

            <Link
              href="/profile?tab=security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[var(--text)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Security & Password</span>
            </Link>
          </div>

          {/* Footer action */}
          <div className="pt-1 mt-1 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: '/' })
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors font-medium text-left"
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
