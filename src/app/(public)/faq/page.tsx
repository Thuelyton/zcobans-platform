import { Metadata } from 'next'
import { getPublicFaqItems } from '../actions'
import { FaqAccordion } from '@/components/public/FaqAccordion'
import { HelpCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Perguntas Frequentes',
  description:
    'Respostas para as dúvidas mais comuns sobre nossos serviços.',
}

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string | null
  position: number | null
}

export default async function FaqPage() {
  const faqResult = await getPublicFaqItems().catch(() => [])
  const faqItems = (faqResult || []) as FaqItem[]

  // Group by category if available
  const groupedByCategory = faqItems.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const category = item.category || 'Geral'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  const hasCategories = faqItems.some((item) => item.category)

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <div className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <Container>
          <div className="py-12 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              Perguntas Frequentes
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              Encontre respostas para as dúvidas mais comuns.
            </p>
          </div>
        </Container>
      </div>

      {/* FAQ content */}
      <Container size="narrow">
        <div className="py-12">
          {faqItems.length > 0 ? (
            <>
              {hasCategories ? (
                // Grouped by category
                <div className="space-y-8">
                  {Object.entries(groupedByCategory).map(([category, items]) => (
                    <div key={category}>
                      <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
                        {category}
                      </h2>
                      <FaqAccordion items={items} />
                    </div>
                  ))}
                </div>
              ) : (
                // Single list
                <FaqAccordion items={faqItems} />
              )}
            </>
          ) : (
            /* Empty state */
            <div className="rounded-xl bg-[var(--color-background)] p-12 text-center shadow-sm ring-1 ring-[var(--color-border)]">
              <HelpCircle className="mx-auto h-12 w-12 text-[var(--color-muted-foreground)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-foreground)]">
                Nenhuma pergunta disponível
              </h3>
              <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                No momento não temos perguntas frequentes cadastradas.
                Entre em contato para tirar suas dúvidas.
              </p>
              <Link href="/contato" className="mt-6 inline-block">
                <Button variant="primary">Fale Conosco</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
