import { Metadata } from 'next'
import { getPublicPromotions } from '../actions'
import { PromotionCard } from '@/components/public/PromotionCard'
import { Tag } from 'lucide-react'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Promoções',
  description:
    'Aproveite nossas promoções e descontos especiais em serviços de cobrança.',
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

export default async function PromotionsPage() {
  const promotionsResult = await getPublicPromotions().catch(() => [])
  const promotions = (promotionsResult || []) as Promotion[]

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <div className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <Container>
          <div className="py-12 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              Promoções
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              Aproveite nossas ofertas especiais e economize em nossos serviços.
            </p>
          </div>
        </Container>
      </div>

      {/* Promotions grid */}
      <Container>
        <div className="py-12">
          {promotions.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="rounded-xl bg-[var(--color-background)] p-12 text-center shadow-sm ring-1 ring-[var(--color-border)]">
              <Tag className="mx-auto h-12 w-12 text-[var(--color-muted-foreground)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-foreground)]">
                Nenhuma promoção disponível
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                No momento não temos promoções ativas. Volte em breve para conferir nossas ofertas.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
