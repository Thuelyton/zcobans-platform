import { Metadata } from 'next'
import Link from 'next/link'
import { getPublicContentSection, getPublicSiteSettings } from '../actions'
import { Building2, ArrowRight, Shield, Users, Target } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Conheça mais sobre a ZCobans e nossas soluções em cobrança e recuperação de créditos.',
}

interface ContentSection {
  id: string
  identifier: string
  title: string | null
  content: string | null
}

interface SiteSettings {
  site_name: string | null
  site_description: string | null
}

// Valores institucionais (neutros, substituíveis)
const values = [
  {
    icon: Shield,
    title: 'Ética',
    description: 'Atuamos com total transparência e respeito em todas as etapas do processo.',
  },
  {
    icon: Users,
    title: 'Compromisso',
    description: 'Dedicados a oferecer o melhor atendimento e resultado para nossos clientes.',
  },
  {
    icon: Target,
    title: 'Eficiência',
    description: 'Processos otimizados para agilizar a recuperação do seu crédito.',
  },
]

export default async function AboutPage() {
  const [contentResult, settingsResult] = await Promise.all([
    getPublicContentSection('about_us').catch(() => null),
    getPublicSiteSettings().catch(() => null),
  ])

  const content = (
    contentResult && 'data' in contentResult ? contentResult.data : null
  ) as ContentSection | null
  const settings = (
    settingsResult && 'data' in settingsResult ? settingsResult.data : null
  ) as SiteSettings | null

  const siteName = settings?.site_name || 'ZCobans'
  const siteDescription = settings?.site_description

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <div className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <Container>
          <div className="py-12 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              Sobre a {siteName}
            </h1>
            {siteDescription && (
              <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
                {siteDescription}
              </p>
            )}
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Main content */}
          {content ? (
            <Card padding="lg">
              {content.title && (
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">
                  {content.title}
                </h2>
              )}
              {content.content && (
                <div className="text-[var(--color-muted-foreground)] leading-relaxed whitespace-pre-wrap">
                  {content.content}
                </div>
              )}
            </Card>
          ) : (
            /* Default content */
            <Card padding="lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                  <Building2 className="h-6 w-6 text-[var(--color-primary-600)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
                  Sobre a {siteName}
                </h2>
              </div>
              <div className="text-[var(--color-muted-foreground)] leading-relaxed space-y-4">
                <p>
                  Somos uma empresa especializada em soluções de cobrança e recuperação de créditos.
                  Nossa missão é oferecer serviços eficientes, transparentes e éticos para ajudar
                  empresas a gerenciar seus recebíveis.
                </p>
                <p>
                  Com uma equipe experiente e processos otimizados, buscamos sempre os melhores
                  resultados para nossos clientes, mantendo o respeito e a dignidade em todas as
                  etapas do processo.
                </p>
                <p>
                  Para mais informações, entre em contato conosco.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link href="/contato">
                  <Button variant="primary">
                    Fale Conosco
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Values section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-8 text-center">
              Nossos Valores
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((value, index) => (
                <Card key={index} padding="md" className="text-center">
                  <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-[var(--color-primary-100)] p-3">
                    <value.icon className="h-6 w-6 text-[var(--color-primary-600)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
