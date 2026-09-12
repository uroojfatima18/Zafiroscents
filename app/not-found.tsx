import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
        404
      </p>
      <h1 className="font-display text-5xl text-[var(--text)] mb-4">
        Page not found
      </h1>
      <p className="text-[var(--text-muted)] text-sm max-w-xs mb-10">
        The page you are looking for does not exist, or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium uppercase tracking-widest bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      >
        Return home
      </Link>
    </div>
  )
}
