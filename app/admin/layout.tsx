import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { AdminHeaderNav } from '@/components/admin/AdminHeaderNav'

export const metadata: Metadata = {
  title: 'Atelier Admin Console — Zafiro Scents',
  description: 'Zafiro Scents Administrative Dashboard and Order Management',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  if (session.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FAF2EB] dark:bg-[#1E1714] border border-[var(--border)] rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-[var(--text)] mb-2">
            Restricted Access
          </h1>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
            The Atelier Admin Console is strictly reserved for store administrators. Your current account (<span className="text-[var(--text)] font-semibold">{session.user.email}</span>) has client privileges.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/profile"
              className="flex-1 py-2.5 px-4 bg-[#2D1F17] hover:bg-[#C36F43] text-[#FDFBF7] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors text-center"
            >
              My Account
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors text-center"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      {/* Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF2EB]/95 dark:bg-[#1A1310]/95 backdrop-blur-md border-b border-[var(--border)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2 group">
                <span className="font-display text-lg text-[var(--text)] tracking-wider">
                  Fragsënce <span className="text-[var(--accent)] text-xs font-sans tracking-normal">| Atelier</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--accent)] text-white">
                  Admin
                </span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <AdminHeaderNav user={session.user} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-surface)]">
        Zafiro Scents Administrative Console • Pakistan
      </footer>
    </div>
  )
}
