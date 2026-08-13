'use client'

/**
 * Canvas Section
 * ZCobans Visual Designer
 *
 * Renderiza uma seção no canvas com seus elementos.
 * Permite seleção, movimentação, remoção e Drag & Drop.
 * Suporta Drag & Drop de elementos dentro da seção e entre seções.
 */

import { useState, useCallback } from 'react'
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
  const { state, selectSection, deselectAll, moveElement, moveElementCrossSection } = useDesigner()
  const { selectedElementId } = state

  // Element drag & drop state
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null)
  const [draggedElementSectionId, setDraggedElementSectionId] = useState<string | null>(null)
  const [elementDropTargetIndex, setElementDropTargetIndex] = useState<number | null>(null)
  const [isElementDragOver, setIsElementDragOver] = useState(false)

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectSection(section.id)
  }

  const handleDeselect = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      deselectAll()
    }
  }

  // Section drag handlers
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

  // Element drag handlers
  const handleElementDragStart = useCallback((elementId: string) => {
    setDraggedElementId(elementId)
    setDraggedElementSectionId(section.id)
  }, [section.id])

  const handleElementDragEnd = useCallback(() => {
    setDraggedElementId(null)
    setDraggedElementSectionId(null)
    setElementDropTargetIndex(null)
    setIsElementDragOver(false)
  }, [])

  const handleElementDragOver = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.stopPropagation() // Prevent section drag
    e.dataTransfer.dropEffect = 'move'
    
    // Calculate if we're in the top or bottom half of the target
    const rect = e.currentTarget.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const isTopHalf = e.clientY < midY
    
    // Adjust target index based on cursor position
    const adjustedIndex = isTopHalf ? targetIndex : targetIndex + 1
    
    if (adjustedIndex !== elementDropTargetIndex) {
      setElementDropTargetIndex(adjustedIndex)
    }
    setIsElementDragOver(true)
  }, [elementDropTargetIndex])

  const handleElementDragLeave = useCallback((e: React.DragEvent) => {
    // Only handle if leaving the elements container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setElementDropTargetIndex(null)
      setIsElementDragOver(false)
    }
  }, [])

  const handleElementDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent section drop
    
    if (!draggedElementId || elementDropTargetIndex === null) return
    
    const isCrossSection = draggedElementSectionId && draggedElementSectionId !== section.id
    
    if (isCrossSection && draggedElementSectionId) {
      // Cross-section drop
      moveElementCrossSection(
        draggedElementSectionId,
        section.id,
        draggedElementId,
        elementDropTargetIndex
      )
    } else {
      // Same-section drop
      const sourceIndex = section.elements.findIndex(el => el.id === draggedElementId)
      
      if (sourceIndex !== -1 && sourceIndex !== elementDropTargetIndex) {
        // Adjust target index if moving down (since removing from source shifts indices)
        const adjustedTargetIndex = sourceIndex < elementDropTargetIndex 
          ? elementDropTargetIndex - 1 
          : elementDropTargetIndex
        
        moveElement(section.id, draggedElementId, adjustedTargetIndex)
      }
    }
    
    setDraggedElementId(null)
    setDraggedElementSectionId(null)
    setElementDropTargetIndex(null)
    setIsElementDragOver(false)
  }, [draggedElementId, draggedElementSectionId, elementDropTargetIndex, section.id, section.elements, moveElement, moveElementCrossSection])

  // Handle drop on empty section
  const handleEmptySectionDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedElementId || !draggedElementSectionId) return
    
    const isCrossSection = draggedElementSectionId !== section.id
    
    if (isCrossSection) {
      // Cross-section drop to empty section
      moveElementCrossSection(
        draggedElementSectionId,
        section.id,
        draggedElementId,
        0
      )
    } else {
      // Same-section drop to empty section (shouldn't happen, but handle gracefully)
      moveElement(section.id, draggedElementId, 0)
    }
    
    setDraggedElementId(null)
    setDraggedElementSectionId(null)
    setElementDropTargetIndex(null)
    setIsElementDragOver(false)
  }, [draggedElementId, draggedElementSectionId, section.id, moveElement, moveElementCrossSection])

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
      draggable={!isDragged && !draggedElementId}
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
          <div 
            className={clsx(
              "flex flex-col items-center justify-center py-8 text-center transition-colors",
              isElementDragOver && "bg-emerald-500/10 rounded-lg"
            )}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsElementDragOver(true)
              setElementDropTargetIndex(0)
            }}
            onDragLeave={handleElementDragLeave}
            onDrop={handleEmptySectionDrop}
          >
            <p className="text-sm text-slate-400/70">
              {isElementDragOver ? 'Solte aqui para adicionar o elemento' : 'Clique para adicionar elementos ou selecione um tipo de elemento no painel'}
            </p>
          </div>
        ) : (
          // Render elements with drop indicators
          <div 
            className="flex flex-col gap-4 relative"
            onDragLeave={handleElementDragLeave}
          >
            {/* Top drop zone */}
            <div
              className={clsx(
                "h-1 transition-all duration-200 rounded-full",
                elementDropTargetIndex === 0 && isElementDragOver && draggedElementId
                  ? "bg-emerald-500" 
                  : ""
              )}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.dataTransfer.dropEffect = 'move'
                setElementDropTargetIndex(0)
                setIsElementDragOver(true)
              }}
              onDrop={handleElementDrop}
            />

            {section.elements.map((element, elIndex) => (
              <div key={element.id} className="relative">
                {/* Drop indicator above this element */}
                {elementDropTargetIndex === elIndex && isElementDragOver && draggedElementId && draggedElementId !== element.id && (
                  <div className="absolute -top-2 left-0 right-0 h-1 bg-emerald-500 z-30 rounded-full" />
                )}
                
                {/* Element */}
                <CanvasElement
                  element={element}
                  sectionId={section.id}
                  isSelected={selectedElementId === element.id}
                  alignment={section.styles.alignment}
                  isDragged={draggedElementId === element.id}
                  isBeingDraggedFromOtherSection={draggedElementId === element.id && draggedElementSectionId !== section.id}
                  onDragStart={handleElementDragStart}
                  onDragEnd={handleElementDragEnd}
                  onDragOver={(e) => handleElementDragOver(e, elIndex)}
                  index={elIndex}
                />

                {/* Drop indicator below last element */}
                {elIndex === section.elements.length - 1 && elementDropTargetIndex === section.elements.length && isElementDragOver && draggedElementId && (
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-emerald-500 z-30 rounded-full" />
                )}
              </div>
            ))}

            {/* Bottom drop zone */}
            <div
              className={clsx(
                "h-1 transition-all duration-200 rounded-full",
                elementDropTargetIndex === section.elements.length && isElementDragOver && draggedElementId
                  ? "bg-emerald-500" 
                  : ""
              )}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.dataTransfer.dropEffect = 'move'
                setElementDropTargetIndex(section.elements.length)
                setIsElementDragOver(true)
              }}
              onDrop={handleElementDrop}
            />
          </div>
        )}
      </div>
    </div>
  )
}
