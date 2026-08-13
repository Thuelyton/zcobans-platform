import Link from 'next/link'
import { cn } from '@/lib/cn'

interface LogoProps {
  variant?: 'default' | 'white' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
}

/**
 * Logo do ZCobans - Solução provisória reutilizável
 *
 * NOTA: Este é um logo de texto estilizado para uso temporário.
 * Substitua por um logo oficial quando disponível.
 *
 * @param variant - Cores do logo (default=azul, white=branco, dark=preto)
 * @param size - Tamanho do logo (sm, md, lg)
 * @param href - Link do logo (padrão: '/')
 * @param className - Classes adicionais
 */
export function Logo({
  variant = 'default',
  size = 'md',
  href = '/',
  className,
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const variantClasses = {
    default: 'text-[var(--color-primary-600)]',
    white: 'text-white',
    dark: 'text-[var(--color-foreground)]',
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1 font-bold tracking-tight transition-opacity hover:opacity-80',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label="ZCobans - Página inicial"
    >
      <span aria-hidden="true">Z</span>
      <span className="font-semibold" aria-hidden="true">Cobans</span>
    </Link>
  )
}
