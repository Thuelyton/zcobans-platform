import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide'
}

/**
 * Container responsivo do ZCobans
 *
 * @param size - Largura máxima (default=1280px, narrow=768px, wide=1440px)
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'default', className, children, ...props }, ref) => {
    const sizeClasses = {
      default: 'max-w-7xl',
      narrow: 'max-w-3xl',
      wide: 'max-w-screen-2xl',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'
