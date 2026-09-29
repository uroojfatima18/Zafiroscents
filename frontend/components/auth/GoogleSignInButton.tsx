'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

interface GoogleSignInButtonProps {
  callbackUrl?: string
  text?: string
}

export function GoogleSignInButton({
  callbackUrl = '/profile',
  text = 'Continue with Google',
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)

  const handleSignIn = async () => {
    try {
      setLoading(true)
      
      // Check if Google credentials are configured in backend
      const res = await fetch('/api/auth/google/status')
      const data = await res.json()

      if (!data.configured) {
        setLoading(false)
        setShowConfigModal(true)
        return
      }

      await signIn('google', { callbackUrl })
    } catch (err) {
      console.error('Google sign in error:', err)
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="w-full py-3 px-4 bg-white dark:bg-[#1E1714] hover:bg-[#FAF2EB] dark:hover:bg-[#2A201B] text-[var(--text)] border border-[var(--border)] text-xs uppercase tracking-wider font-semibold rounded-lg transition-all duration-200 shadow-xs flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>{loading ? 'Connecting to Google...' : text}</span>
      </button>

      {/* Helpful configuration guide modal if credentials are not in .env */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF2EB] dark:bg-[#1E1714] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1"
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3 className="font-display text-xl text-[var(--text)] mb-2">
              Google OAuth Setup Required
            </h3>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Google Sign-In requires an active <strong>Client ID</strong> and <strong>Client Secret</strong> from your Google Cloud Console. Without them, Google blocks the authorization request.
            </p>

            <div className="bg-white/80 dark:bg-black/30 border border-[var(--border)] rounded-xl p-3.5 text-xs text-[var(--text)] space-y-2 mb-5">
              <p className="font-semibold text-[var(--accent)] text-[11px] uppercase tracking-wider">
                How to enable in 2 minutes:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-[var(--text-muted)] leading-normal">
                <li>Create an OAuth 2.0 Client in <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-[var(--accent)] underline">Google Cloud Console</a></li>
                <li>Set Authorized Redirect URI to: <br /><code className="text-[10px] bg-[var(--bg)] px-1 py-0.5 rounded text-[var(--text)]">http://localhost:3000/api/auth/callback/google</code></li>
                <li>Add to your <code className="text-[10px] bg-[var(--bg)] px-1 py-0.5 rounded text-[var(--text)]">.env</code> file:</li>
              </ol>
              <pre className="text-[10px] font-mono bg-[var(--bg)] p-2 rounded overflow-x-auto text-[var(--text)] border border-[var(--border)]">
GOOGLE_CLIENT_ID=&quot;your-client-id.apps.googleusercontent.com&quot;
GOOGLE_CLIENT_SECRET=&quot;GOCSPX-your-secret&quot;
              </pre>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="w-full py-2.5 px-4 bg-[#2D1F17] hover:bg-[#C36F43] text-[#FDFBF7] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors"
            >
              Got it, thanks
            </button>
          </div>
        </div>
      )}
    </>
  )
}
