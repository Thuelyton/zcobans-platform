'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string | null
}

interface FaqAccordionProps {
  items: FaqItem[]
}

/**
 * Accordion de FAQ do ZCobans
 *
 * Recursos:
 * - Acessibilidade completa
 * - Animação suave
 * - Teclado navegável
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleItem(id)
    }
  }

  return (
    <div className="divide-y divide-[var(--color-border)] rounded-xl bg-white shadow-sm ring-1 ring-[var(--color-border)]">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--color-muted)] sm:px-6"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
            >
              <span className="text-base font-medium text-[var(--color-foreground)] pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={`faq-answer-${item.id}`}
              role="region"
              aria-labelledby={`faq-question-${item.id}`}
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-5 pb-4 sm:px-6">
                <p className="text-[var(--color-muted-foreground)] leading-relaxed whitespace-pre-wrap">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
