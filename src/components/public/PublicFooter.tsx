import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Container } from '@/components/ui/Container'

const footerNavigation = {
  servicos: [
    { name: 'Serviços', href: '/servicos' },
    { name: 'Promoções', href: '/promocoes' },
  ],
  empresa: [
    { name: 'Sobre', href: '/sobre' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contato', href: '/contato' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '/termos' },
    { name: 'Privacidade', href: '/privacidade' },
  ],
}

/**
 * Footer público do ZCobans
 *
 * Recursos:
 * - Layout responsivo
 * - Informações de contato
 * - Links de navegação
 * - Copyright
 */
export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-[var(--color-foreground)] text-white"
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Rodapé
      </h2>

      <Container>
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo variant="white" size="lg" />
              <p className="mt-4 text-sm text-gray-400 max-w-xs">
                Soluções completas para gestão de cobranças e recuperação de créditos.
                Eficiência, transparência e resultados.
              </p>

              {/* Contact info */}
              <div className="mt-6 space-y-3">
                <a
                  href="mailto:contato@zcobans.com.br"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  contato@zcobans.com.br
                </a>
                <a
                  href="tel:+5511999999999"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  (11) 99999-9999
                </a>
              </div>
            </div>

            {/* Services links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Serviços
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {footerNavigation.servicos.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Empresa
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {footerNavigation.empresa.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} ZCobans. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/termos"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Termos
              </Link>
              <Link
                href="/privacidade"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
