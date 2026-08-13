import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface Category {
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
  category: Category | null
}

interface ServiceCardProps {
  service: Service
}

/**
 * Card de serviço do ZCobans
 *
 * Recursos:
 * - Imagem ou fallback visual
 * - Informações do serviço
 * - Preço formatado
 * - Link para detalhes
 */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/servicos/${service.slug}`}
      className="group block"
    >
      <Card
        variant="default"
        padding="none"
        className="h-full overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
      >
        {/* Image */}
        {service.image_url ? (
          <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--color-muted)]">
            <img
              src={service.image_url}
              alt={service.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center">
            <span className="text-5xl font-bold text-white/20" aria-hidden="true">
              {service.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Category */}
          {service.category && (
            <span className="mb-2 text-xs font-medium text-[var(--color-primary-600)]">
              {service.category.name}
            </span>
          )}

          {/* Name */}
          <h3 className="text-lg font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary-600)] transition-colors">
            {service.name}
          </h3>

          {/* Description */}
          {service.short_description && (
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
              {service.short_description}
            </p>
          )}

          {/* Price */}
          {service.price !== null && service.price !== undefined && (
            <div className="mt-4">
              <span className="text-xl font-bold text-[var(--color-foreground)]">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(service.price)}
              </span>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary-600)] group-hover:gap-2 transition-all">
              Saiba mais
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
