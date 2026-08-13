import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
}

/**
 * Badge reutilizável do ZCobans
 *
 * @param variant - Variante visual
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors'

    const variantClasses = {
      default:
        'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
      primary:
        'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
      secondary:
        'bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)]',
      success:
        'bg-[var(--color-success-light)] text-[var(--color-success)]',
      danger:
        'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
      warning:
        'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
    }

    return (
      <span
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
