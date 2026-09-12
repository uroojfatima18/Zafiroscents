import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'wine' | 'emerald'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
  href?: string
}

const base =
  'inline-flex items-center justify-center font-sans font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-sm'

const variantClasses = {
  primary:
    'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] active:scale-[0.98]',
  ghost:
    'text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--bg-surface)]',
  outline:
    'border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
  wine:
    'bg-wine text-ivory hover:bg-[#631926] active:scale-[0.98]',
  emerald:
    'bg-emerald text-ivory hover:bg-[#174d40] active:scale-[0.98]',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
}

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

// Link variant
interface ButtonLinkProps {
  variant?: 'primary' | 'ghost' | 'outline' | 'wine' | 'emerald'
  size?: 'sm' | 'md' | 'lg'
  href: string
  children: React.ReactNode
  className?: string
  id?: string
  'aria-label'?: string
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className,
  id,
  'aria-label': ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      id={id}
      aria-label={ariaLabel}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      children,
      className,
      disabled,
      asChild,
      href,
      ...props
    },
    ref,
  ) => {
    const classes = cn(base, variantClasses[variant], sizeClasses[size], className)

    if (asChild && href) {
      return (
        <Link href={href} className={classes} id={props.id} aria-label={props['aria-label']}>
          {children}
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
