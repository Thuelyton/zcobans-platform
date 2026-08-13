import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicServiceBySlug } from '../../actions'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  features: string[] | null
  price: number | null
  image_url: string | null
  category_id: string | null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getPublicServiceBySlug(slug)

  if (!result.success || !result.data) {
    return { title: 'Serviço não encontrado' }
  }

  const service = result.data as Service

  return {
    title: service.name,
    description: service.short_description || service.description?.slice(0, 160) || undefined,
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getPublicServiceBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  const service = result.data as Service

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Container>
        {/* Back link */}
        <div className="py-6">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-primary-600)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para serviços
          </Link>
        </div>

        {/* Service content */}
        <div className="pb-16">
          <Card padding="none" className="overflow-hidden">
            {/* Image */}
            {service.image_url && (
              <div className="aspect-[21/9] w-full bg-[var(--color-muted)]">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            <div className="p-6 sm:p-8 lg:p-10">
              {/* Name */}
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-3xl lg:text-4xl">
                {service.name}
              </h1>

              {/* Price */}
              {service.price !== null && service.price !== undefined && (
                <div className="mt-4">
                  <span className="text-2xl font-bold text-[var(--color-primary-600)]">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(service.price)}
                  </span>
                </div>
              )}

              {/* Short description */}
              {service.short_description && (
                <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">
                  {service.short_description}
                </p>
              )}

              {/* Divider */}
              <div className="my-8 border-t border-[var(--color-border)]" />

              {/* Description */}
              {service.description && (
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                    Sobre o serviço
                  </h2>
                  <div className="mt-4 whitespace-pre-wrap text-[var(--color-muted-foreground)] leading-relaxed">
                    {service.description}
                  </div>
                </div>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                    Características
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-[var(--color-secondary-500)] mt-0.5 shrink-0" />
                        <span className="text-[var(--color-muted-foreground)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-x-4">
                <Link href="/contato">
                  <Button variant="primary" size="lg">
                    Solicitar orçamento
                  </Button>
                </Link>
                <Link href="/servicos">
                  <Button variant="outline" size="lg">
                    Ver outros serviços
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  )
}
