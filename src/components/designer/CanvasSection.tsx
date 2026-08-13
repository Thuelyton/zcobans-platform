'use client'

/**
 * Canvas Section
 * ZCobans Visual Designer
 *
 * Renderiza uma seção no canvas com seus elementos.
 * Permite seleção, movimentação, remoção e Drag & Drop.
 */

import { useCallback } from 'react'
import { clsx } from 'clsx'
import { useDesigner } from '@/lib/designer/store'
import { SectionOverlay } from './SectionOverlay'
import { CanvasElement } from './CanvasElement'
import type { DesignerSection } from '@/lib/designer/types'

interface CanvasSectionProps {
  section: DesignerSection
  isSelected: boolean
  isDragged?: boolean
  onDragStart?: (sectionId: string) => void
  onDragEnd?: () => void
  onDragOver?: (e: React.DragEvent) => void
  index?: number
}

export function CanvasSection({ 
  section, 
  isSelected, 
  isDragged = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  index
}: CanvasSectionProps) {
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

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', section.id)
    
    // Set drag image with some opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
    }
    
    onDragStart?.(section.id)
  }, [section.id, onDragStart])

  const handleDragEnd = useCallback(() => {
    onDragEnd?.()
  }, [onDragEnd])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    onDragOver?.(e)
  }, [onDragOver])

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
        'relative group transition-all duration-200',
        isSelected && 'ring-2 ring-emerald-500 ring-inset',
        isDragged && 'opacity-50 scale-[0.98]',
        !isDragged && 'cursor-pointer'
      )}
      style={sectionStyle}
      onClick={handleSelect}
      draggable={!isDragged}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      data-section-id={section.id}
      data-section-index={index}
    >
      {/* Section overlay with controls */}
      <SectionOverlay
        section={section}
        isSelected={isSelected}
        isDragged={isDragged}
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
