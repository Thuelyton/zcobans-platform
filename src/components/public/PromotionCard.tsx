import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Tag, Calendar } from 'lucide-react'

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

interface PromotionCardProps {
  promotion: Promotion
}

/**
 * Card de promoção do ZCobans
 *
 * Recursos:
 * - Badge de desconto
 * - Código promocional
 * - Validade
 */
export function PromotionCard({ promotion }: PromotionCardProps) {
  const formatDiscount = () => {
    if (!promotion.discount_type || promotion.discount_value === null) return null

    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}% OFF`
    }
    return `${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(promotion.discount_value)} OFF`
  }

  const discount = formatDiscount()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <Card
      variant="default"
      padding="md"
      className="relative overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-lg)]"
    >
      {/* Discount badge */}
      {discount && (
        <div className="absolute right-4 top-4">
          <Badge variant="success">{discount}</Badge>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-[var(--color-accent-100)] p-2">
        <Tag className="h-5 w-5 text-[var(--color-accent-600)]" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--color-foreground)] pr-20">
        {promotion.title}
      </h3>

      {/* Description */}
      {promotion.description && (
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
          {promotion.description}
        </p>
      )}

      {/* Code */}
      {promotion.code && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-muted)] px-3 py-1.5 text-sm font-medium text-[var(--color-foreground)]">
            Código: <span className="font-bold text-[var(--color-primary-600)]">{promotion.code}</span>
          </span>
        </div>
      )}

      {/* Validity */}
      {(promotion.starts_at || promotion.ends_at) && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span>
            {promotion.starts_at && (
              <>Válido de {formatDate(promotion.starts_at)}</>
            )}
            {promotion.starts_at && promotion.ends_at && <> até </>}
            {promotion.ends_at && <>{formatDate(promotion.ends_at)}</>}
          </span>
        </div>
      )}
    </Card>
  )
}
