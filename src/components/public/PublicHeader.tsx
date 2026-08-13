'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Promoções', href: '/promocoes' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contato', href: '/contato' },
]

/**
 * Header público do ZCobans
 *
 * Recursos:
 * - Navegação responsiva
 * - Menu mobile com transição suave
 * - Efeito de scroll (sticky com sombra)
 * - Acessibilidade completa
 */
export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Detectar scroll para mudar estilo do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Use useMemo ou callback para evitar setState direto no effect
  // O menu será fechado ao clicar nos links (onClick handler)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-white/95 backdrop-blur-sm',
        isScrolled
          ? 'shadow-[var(--shadow-md)] border-b border-[var(--color-border-light)]'
          : 'shadow-none'
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Logo size="md" />
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                pathname === item.href
                  ? 'text-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
              )}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Admin link + Mobile menu button */}
        <div className="flex items-center gap-3 lg:flex-1 lg:justify-end">
          {/* Admin link (desktop) */}
          <Link
            href="/admin/login"
            className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-primary-600)] transition-colors px-3 py-2 rounded-lg hover:bg-[var(--color-muted)]"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Admin
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <Logo size="sm" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            <div className="px-4 py-6">
              {/* Navigation links */}
              <nav className="space-y-1" aria-label="Navegação mobile">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                      pathname === item.href
                        ? 'text-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                        : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-6 border-t border-[var(--color-border)]" />

              {/* Admin link */}
              <Link
                href="/admin/login"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--color-foreground)] rounded-lg hover:bg-[var(--color-muted)] transition-colors"
              >
                <ShieldCheck className="h-5 w-5 text-[var(--color-muted-foreground)]" aria-hidden="true" />
                Área Administrativa
              </Link>

              {/* Contact CTA */}
              <div className="mt-6 px-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/contato">Fale Conosco</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
