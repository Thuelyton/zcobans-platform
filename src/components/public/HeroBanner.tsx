import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_url: string | null
  button_text: string | null
}

interface HeroBannerProps {
  banners: Banner[]
}

/**
 * Hero Banner do ZCobans
 *
 * Recursos:
 * - Imagem de fundo com sobreposição
 * - Texto acessível com contraste adequado
 * - CTAs claros
 * - Fallback quando não há banner
 */
export function HeroBanner({ banners }: HeroBannerProps) {
  const banner = banners.length > 0 ? banners[0] : null

  return (
    <section
      className="relative overflow-hidden bg-[var(--color-primary-900)]"
      aria-label="Apresentação"
    >
      {/* Background image */}
      {banner?.image_url && (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={banner.image_url}
            alt=""
            className="h-full w-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-900)] via-[var(--color-primary-900)]/90 to-[var(--color-primary-900)]/70" />
        </div>
      )}

      {/* Decorative background pattern when no image */}
      {!banner?.image_url && (
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]" />
        </div>
      )}

      <Container>
        <div className="relative py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--color-secondary-400)]" />
              <span>Soluções em Cobrança e Recuperação</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              {banner?.title || (
                <>
                  Soluções em{' '}
                  <span className="text-[var(--color-secondary-400)]">Cobrança</span>{' '}
                  e Recuperação de Créditos
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300 sm:text-lg lg:text-xl">
              {banner?.subtitle ||
                'Gestão completa para sua empresa. Eficiência, transparência e resultados comprovados na recuperação do seu crédito.'}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-4">
              <Link href="/servicos">
                <Button variant="secondary" size="lg">
                  {banner?.button_text || 'Nossos Serviços'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>

              <Link href="/contato">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-background)] to-transparent"
        aria-hidden="true"
      />
    </section>
  )
}
