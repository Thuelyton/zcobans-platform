import { Metadata } from 'next'
import Link from 'next/link'
import {
  getPublicBanners,
  getPublicServicesWithCategory,
  getPublicPromotions,
  getPublicTrustIndicators,
} from './actions'
import { HeroBanner } from '@/components/public/HeroBanner'
import { ServiceCard } from '@/components/public/ServiceCard'
import { PromotionCard } from '@/components/public/PromotionCard'
import { TrustIndicatorCard } from '@/components/public/TrustIndicatorCard'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Phone, Mail, Shield, Clock, TrendingUp, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ZCobans - Soluções em Cobrança e Recuperação de Créditos',
  description:
    'Gestão completa para sua empresa de cobranças. Eficiência, transparência e resultados comprovados.',
}

// Type definitions for the data
interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_url: string | null
  button_text: string | null
  position: number | null
}

interface ServiceCategory {
  id: string
  name: string
  slug: string
}

interface Service {
  id: string
  name: string
  slug: string
  short_description: string | null
  image_url: string | null
  price: number | null
  position: number | null
  category_id: string | null
  category: ServiceCategory | null
}

interface Promotion {
  id: string
  title: string
  description: string | null
  discount_type: string | null
  discount_value: number | null
  code: string | null
  starts_at: string | null
  ends_at: string | null
}

interface TrustIndicator {
  id: string
  type: string
  title: string | null
  description: string | null
  image_url: string | null
  position: number | null
}

// Diferenciais estáticos (neutros, substituíveis)
const differencials = [
  {
    icon: Shield,
    title: 'Segurança',
    description: 'Processos transparentes e em conformidade com a legislação vigente.',
  },
  {
    icon: Clock,
    title: 'Agilidade',
    description: 'Respostas rápidas e eficientes para suas necessidades.',
  },
  {
    icon: TrendingUp,
    title: 'Resultados',
    description: 'Foco em soluções que geram resultados concretos para sua empresa.',
  },
  {
    icon: CheckCircle,
    title: 'Transparência',
    description: 'Acompanhamento claro de cada etapa do processo.',
  },
]

export default async function HomePage() {
  // Fetch data in parallel
  const [bannersResult, servicesResult, promotionsResult, trustIndicatorsResult] =
    await Promise.all([
      getPublicBanners().catch(() => []),
      getPublicServicesWithCategory().catch(() => []),
      getPublicPromotions().catch(() => []),
      getPublicTrustIndicators().catch(() => []),
    ])

  const banners = (bannersResult || []) as Banner[]
  const services = (servicesResult || []) as Service[]
  const promotions = (promotionsResult || []) as Promotion[]
  const trustIndicators = (trustIndicatorsResult || []) as TrustIndicator[]

  const displayServices = services.slice(0, 6)
  const hasPromotions = promotions.length > 0
  const hasTrustIndicators = trustIndicators.length > 0

  return (
    <>
      {/* Hero Section */}
      <HeroBanner banners={banners} />

      {/* Differentials Section */}
      <section className="py-16 sm:py-20 bg-[var(--color-background)]">
        <Container>
          <SectionTitle
            title="Por que escolher o ZCobans"
            subtitle="Conheça nossos diferenciais e descubra como podemos ajudar sua empresa."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differencials.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-xl bg-[var(--color-muted)] p-6 transition-all duration-300 hover:bg-[var(--color-primary-50)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-100)] p-3 text-[var(--color-primary-600)] transition-colors group-hover:bg-[var(--color-primary-600)] group-hover:text-white">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Section */}
      {displayServices.length > 0 && (
        <section className="py-16 sm:py-20 bg-[var(--color-muted)]">
          <Container>
            <SectionTitle
              title="Nossos Serviços"
              subtitle="Soluções completas para gestão de cobranças e recuperação de créditos."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {services.length > 6 && (
              <div className="mt-12 text-center">
                <Link href="/servicos">
                  <Button variant="outline">
                    Ver todos os serviços
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Promotions Section */}
      {hasPromotions && (
        <section className="py-16 sm:py-20 bg-[var(--color-background)]">
          <Container>
            <SectionTitle
              title="Promoções"
              subtitle="Aproveite nossas ofertas especiais."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promotions.slice(0, 3).map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>

            {promotions.length > 3 && (
              <div className="mt-12 text-center">
                <Link href="/promocoes">
                  <Button variant="outline">
                    Ver todas as promoções
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Trust Indicators Section */}
      {hasTrustIndicators && (
        <section className="py-16 sm:py-20 bg-[var(--color-muted)]">
          <Container>
            <SectionTitle
              title="Por que nos escolher"
              subtitle="Conheça nossos indicadores de confiança."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trustIndicators.slice(0, 6).map((indicator) => (
                <TrustIndicatorCard key={indicator.id} indicator={indicator} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-[var(--color-primary-600)]">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Pronto para começar?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-primary-100)] sm:text-lg">
                Entre em contato conosco e descubra como podemos ajudar sua empresa a recuperar seus créditos de forma eficiente e transparente.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
                <Link href="/contato">
                  <Button variant="secondary" size="lg">
                    Fale Conosco
                  </Button>
                </Link>
                <Link href="/servicos">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    Conheça nossos serviços
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 bg-[var(--color-background)]">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email */}
            <a
              href="mailto:contato@zcobans.com.br"
              className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-[var(--color-muted)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                <Mail className="h-6 w-6 text-[var(--color-primary-600)]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Email</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">contato@zcobans.com.br</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+5511999999999"
              className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-[var(--color-muted)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                <Phone className="h-6 w-6 text-[var(--color-primary-600)]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Telefone</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">(11) 99999-9999</p>
              </div>
            </a>

            {/* Link to contact */}
            <Link
              href="/contato"
              className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-[var(--color-muted)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                <ArrowRight className="h-6 w-6 text-[var(--color-primary-600)]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Contato</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">Encontre nossa sede</p>
              </div>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
