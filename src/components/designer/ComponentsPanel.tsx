'use client'

/**
 * Components Panel
 * ZCobans Visual Designer
 *
 * Painel esquerdo com lista de seções e elementos disponíveis.
 */

import { clsx } from 'clsx'
import {
  Layout,
  CheckCircle,
  MousePointer,
  Building,
  Mail,
  HelpCircle,
  LayoutTemplate,
  Heading1,
  Type,
  Image,
  Square,
} from 'lucide-react'
import { useDesigner } from '@/lib/designer/store'
import { createSectionFromTemplate } from '@/lib/designer/templates'
import { generateId } from '@/lib/designer/utils'
import type { SectionType, ElementType, DesignerElement } from '@/lib/designer/types'
import { SectionItem } from './SectionItem'
import { ElementItem } from './ElementItem'

// ============================================================================
// SECTION TYPES
// ============================================================================

const sectionTypes: { type: SectionType; name: string; icon: typeof Layout; description: string }[] = [
  { type: 'hero', name: 'Hero', icon: Layout, description: 'Seção principal' },
  { type: 'features', name: 'Features', icon: CheckCircle, description: 'Diferenciais' },
  { type: 'cta', name: 'CTA', icon: MousePointer, description: 'Chamada para ação' },
  { type: 'about', name: 'About', icon: Building, description: 'Sobre a empresa' },
  { type: 'contact', name: 'Contact', icon: Mail, description: 'Contato' },
  { type: 'faq', name: 'FAQ', icon: HelpCircle, description: 'Perguntas frequentes' },
  { type: 'footer', name: 'Footer', icon: LayoutTemplate, description: 'Rodapé' },
]

// ============================================================================
// ELEMENT TYPES
// ============================================================================

const elementTypes: { type: ElementType; name: string; icon: typeof Heading1 }[] = [
  { type: 'heading', name: 'Heading', icon: Heading1 },
  { type: 'text', name: 'Text', icon: Type },
  { type: 'image', name: 'Image', icon: Image },
  { type: 'button', name: 'Button', icon: Square },
]

// ============================================================================
// COMPONENT
// ============================================================================

export function ComponentsPanel() {
  const { state, addSection, dispatch } = useDesigner()

  const handleAddSection = (type: SectionType) => {
    const section = createSectionFromTemplate(type, state.page.sections.length)
    addSection(section)
  }

  const handleAddElement = (type: ElementType) => {
    // If no section selected, add to last section
    const targetSectionId = state.selectedSectionId || state.page.sections[state.page.sections.length - 1]?.id

    if (!targetSectionId) return

    const section = state.page.sections.find((s) => s.id === targetSectionId)
    if (!section) return

    const defaultProps = getDefaultProps(type)
    const element: DesignerElement = {
      id: generateId(),
      type,
      order: section.elements.length,
      props: defaultProps,
      styles: {},
    }

    dispatch({
      type: 'ADD_ELEMENT',
      payload: { sectionId: targetSectionId, element },
    })
  }

  return (
    <div className="p-4">
      {/* Sections */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Seções
        </h3>
        <div className="space-y-2">
          {sectionTypes.map((section) => (
            <SectionItem
              key={section.type}
              type={section.type}
              name={section.name}
              icon={section.icon}
              description={section.description}
              onClick={() => handleAddSection(section.type)}
            />
          ))}
        </div>
      </div>

      {/* Elements */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Elementos
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {elementTypes.map((element) => (
            <ElementItem
              key={element.type}
              type={element.type}
              name={element.name}
              icon={element.icon}
              onClick={() => handleAddElement(element.type)}
              disabled={state.page.sections.length === 0}
            />
          ))}
        </div>
      </div>

      {/* Page sections list */}
      {state.page.sections.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Seções na Página
          </h3>
          <div className="space-y-1">
            {state.page.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => dispatch({ type: 'SELECT_SECTION', payload: { sectionId: section.id } })}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  state.selectedSectionId === section.id
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )}
              >
                <span className="truncate">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// HELPERS
// ============================================================================

function getDefaultProps(type: ElementType) {
  switch (type) {
    case 'heading':
      return { text: 'Novo Título', level: 'h2' as const }
    case 'text':
      return { text: 'Novo texto' }
    case 'button':
      return { text: 'Clique Aqui', url: '#', variant: 'primary' as const }
    case 'image':
      return { url: 'https://via.placeholder.com/400x300', alt: 'Imagem' }
    default:
      return { text: '' }
  }
}
