'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface AdminHeaderNavProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function AdminHeaderNav({ user }: AdminHeaderNavProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)] rounded-lg transition-colors font-medium"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span>View Store</span>
      </Link>

      <div className="hidden md:flex flex-col text-right">
        <span className="text-xs font-semibold text-[var(--text)] leading-tight">
          {user.name || 'Admin'}
        </span>
        <span className="text-[10px] text-[var(--text-muted)] leading-tight truncate max-w-[150px]">
          {user.email}
        </span>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        title="Sign Out"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors font-medium"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  )
}
