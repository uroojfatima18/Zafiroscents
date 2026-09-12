import { cn } from '@/lib/utils'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label: string
}

export function Chip({ active, label, className, ...props }: ChipProps) {
  return (
    <button
      role="checkbox"
      aria-checked={active}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
        active
          ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]'
          : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
        className,
      )}
      {...props}
    >
      {label}
    </button>
  )
}
