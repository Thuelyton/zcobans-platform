import { Quote, Award, Handshake, Star, Shield } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/Card'

interface TrustIndicator {
  id: string
  type: string
  title: string | null
  description: string | null
  image_url: string | null
}

interface TrustIndicatorCardProps {
  indicator: TrustIndicator
}

/**
 * Card de indicador de confiança do ZCobans
 *
 * Tipos suportados:
 * - testimonial: Depoimento
 * - award: Prêmio/Certificação
 * - partner_logo: Parceiro
 * - guarantee: Garantia
 * - statistic: Estatística
 */
export function TrustIndicatorCard({ indicator }: TrustIndicatorCardProps) {
  const getIcon = () => {
    switch (indicator.type) {
      case 'testimonial':
        return <Quote className="h-6 w-6" />
      case 'award':
        return <Award className="h-6 w-6" />
      case 'partner_logo':
        return <Handshake className="h-6 w-6" />
      case 'guarantee':
        return <Shield className="h-6 w-6" />
      case 'statistic':
        return <Star className="h-6 w-6" />
      default:
        return <Quote className="h-6 w-6" />
    }
  }

  const getIconColor = () => {
    switch (indicator.type) {
      case 'testimonial':
        return 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]'
      case 'award':
        return 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]'
      case 'partner_logo':
        return 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]'
      case 'guarantee':
        return 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]'
      case 'statistic':
        return 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]'
      default:
        return 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]'
    }
  }

  const getTypeLabel = () => {
    switch (indicator.type) {
      case 'testimonial':
        return 'Depoimento'
      case 'award':
        return 'Prêmio'
      case 'partner_logo':
        return 'Parceiro'
      case 'guarantee':
        return 'Garantia'
      case 'statistic':
        return 'Resultado'
      default:
        return indicator.type
    }
  }

  return (
    <Card
      variant="default"
      padding="md"
      className="transition-all duration-300 hover:shadow-[var(--shadow-lg)]"
    >
      {/* Icon */}
      <div className={cn('mb-4 inline-flex items-center justify-center rounded-lg p-3', getIconColor())}>
        {getIcon()}
      </div>

      {/* Type label */}
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {getTypeLabel()}
      </span>

      {/* Title */}
      {indicator.title && (
        <h3 className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">
          {indicator.title}
        </h3>
      )}

      {/* Description */}
      {indicator.description && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {indicator.description}
        </p>
      )}

      {/* Image for partner logos */}
      {indicator.image_url && indicator.type === 'partner_logo' && (
        <div className="mt-4">
          <img
            src={indicator.image_url}
            alt={indicator.title || 'Parceiro'}
            className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            loading="lazy"
          />
        </div>
      )}
    </Card>
  )
}
