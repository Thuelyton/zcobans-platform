import { cn } from '@/lib/cn'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

/**
 * Título de seção padronizado para o ZCobans
 *
 * @param title - Título principal da seção
 * @param subtitle - Subtítulo opcional
 * @param align - Alinhamento (left ou center)
 * @param className - Classes adicionais
 */
export function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-12 sm:mb-16',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      <h2
        className={cn(
          'text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl',
          'text-[var(--color-foreground)]'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-base sm:text-lg',
            'text-[var(--color-muted-foreground)]',
            align === 'center' && 'mx-auto max-w-2xl',
            align === 'left' && 'max-w-2xl'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
