import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'new' | 'sale' | 'low-stock' | 'featured'
  className?: string
}

export function Badge({ label, variant = 'new', className }: BadgeProps) {
  const variants = {
    new: 'bg-[var(--accent)] text-[var(--bg)]',
    sale: 'bg-wine text-ivory',
    'low-stock': 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)]',
    featured: 'bg-emerald text-ivory',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-widest',
        variants[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
