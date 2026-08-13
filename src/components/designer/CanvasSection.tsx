'use client'

/**
 * Canvas Section
 * ZCobans Visual Designer
 *
 * Renderiza uma seção no canvas com seus elementos.
 * Permite seleção, movimentação e remoção.
 */

import { clsx } from 'clsx'
import { useDesigner } from '@/lib/designer/store'
import { SectionOverlay } from './SectionOverlay'
import { CanvasElement } from './CanvasElement'
import type { DesignerSection } from '@/lib/designer/types'

interface CanvasSectionProps {
  section: DesignerSection
  isSelected: boolean
}

export function CanvasSection({ section, isSelected }: CanvasSectionProps) {
  const { state, selectSection, deselectAll } = useDesigner()
  const { selectedElementId } = state

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectSection(section.id)
  }

  const handleDeselect = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      deselectAll()
    }
  }

  // Build inline styles from section styles
  const sectionStyle: React.CSSProperties = {
    backgroundColor: section.styles.backgroundColor || '#ffffff',
    paddingTop: section.styles.padding?.top || '4rem',
    paddingBottom: section.styles.padding?.bottom || '4rem',
    paddingLeft: section.styles.padding?.left || '1.5rem',
    paddingRight: section.styles.padding?.right || '1.5rem',
    backgroundImage: section.styles.backgroundGradient,
    textAlign: section.styles.alignment || 'left',
  }

  return (
    <div
      className={clsx(
        'relative group cursor-pointer transition-all duration-200',
        isSelected && 'ring-2 ring-emerald-500 ring-inset'
      )}
      style={sectionStyle}
      onClick={handleSelect}
    >
      {/* Section overlay with controls */}
      <SectionOverlay
        section={section}
        isSelected={isSelected}
      />

      {/* Section content */}
      <div
        className="relative z-10"
        style={{ maxWidth: section.styles.maxWidth || '1200px', margin: '0 auto' }}
        onClick={handleDeselect}
      >
        {section.elements.length === 0 ? (
          // Empty section placeholder
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-slate-400/70">
              Clique para adicionar elementos ou selecione um tipo de elemento no painel
            </p>
          </div>
        ) : (
          // Render elements
          <div className="flex flex-col gap-4">
            {section.elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                sectionId={section.id}
                isSelected={selectedElementId === element.id}
                alignment={section.styles.alignment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
