import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-transparent border border-[var(--border)] rounded-sm px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors duration-200',
            'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
