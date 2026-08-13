'use client'

/**
 * Designer Canvas
 * ZCobans Visual Designer
 *
 * Canvas principal que renderiza as seções do Designer.
 * Muda de largura conforme o device selecionado.
 * Suporta Drag & Drop para reordenar seções.
 */

import { useState, useCallback } from 'react'
import { useDesigner } from '@/lib/designer/store'
import { DEVICE_WIDTHS } from '@/lib/designer/types'
import { CanvasSection } from './CanvasSection'
import { Plus } from 'lucide-react'
import { createSectionFromTemplate } from '@/lib/designer/templates'

export function DesignerCanvas() {
  const { state, addSection, deselectAll, reorderSection } = useDesigner()
  const { page, device, selectedSectionId } = state

  const deviceWidth = DEVICE_WIDTHS[device]

  // Drag & Drop state
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleAddSection = (type: 'hero' | 'features' | 'cta' | 'about' | 'contact' | 'faq' | 'footer') => {
    const section = createSectionFromTemplate(type, page.sections.length)
    addSection(section)
  }

  // Drag handlers
  const handleDragStart = useCallback((sectionId: string) => {
    setDraggedSectionId(sectionId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedSectionId(null)
    setDropTargetIndex(null)
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    // Calculate if we're in the top or bottom half of the target
    const rect = e.currentTarget.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const isTopHalf = e.clientY < midY
    
    // Adjust target index based on cursor position
    const adjustedIndex = isTopHalf ? targetIndex : targetIndex + 1
    
    if (adjustedIndex !== dropTargetIndex) {
      setDropTargetIndex(adjustedIndex)
    }
    setIsDragOver(true)
  }, [dropTargetIndex])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only handle if leaving the canvas entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTargetIndex(null)
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    if (draggedSectionId && dropTargetIndex !== null) {
      // Get source index
      const sourceIndex = page.sections.findIndex(s => s.id === draggedSectionId)
      
      if (sourceIndex !== -1 && sourceIndex !== dropTargetIndex) {
        // Adjust target index if moving down (since removing from source shifts indices)
        const adjustedTargetIndex = sourceIndex < dropTargetIndex 
          ? dropTargetIndex - 1 
          : dropTargetIndex
        
        reorderSection(draggedSectionId, adjustedTargetIndex)
      }
    }
    
    setDraggedSectionId(null)
    setDropTargetIndex(null)
    setIsDragOver(false)
  }, [draggedSectionId, dropTargetIndex, page.sections, reorderSection])

  // Calculate drop indicator position
  const getDropIndicatorStyle = (index: number): React.CSSProperties | undefined => {
    if (dropTargetIndex === null || dropTargetIndex !== index) return undefined
    
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      height: '4px',
      backgroundColor: '#10b981', // emerald-500
      borderRadius: '2px',
      zIndex: 30,
    }
  }

  return (
    <div
      className="flex h-full flex-col items-center py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          deselectAll()
        }
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Canvas container */}
      <div
        className="relative w-full transition-all duration-300"
        style={{ maxWidth: deviceWidth }}
      >
        {/* Device frame */}
        {device !== 'desktop' && (
          <div className="absolute inset-0 rounded-xl border border-slate-700/50 bg-slate-800/20 pointer-events-none" />
        )}

        {/* Canvas content */}
        <div className="bg-[#111827] shadow-2xl shadow-black/50 relative">
          {page.sections.length === 0 ? (
            // Empty state
            <div 
              className="flex flex-col items-center justify-center py-24 px-8"
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${isDragOver ? 'bg-emerald-500/20' : 'bg-slate-800/50'}`}>
                <Plus className={`h-8 w-8 ${isDragOver ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-300">
                Canvas vazio
              </h3>
              <p className="mb-6 text-center text-sm text-slate-500">
                {isDragOver ? 'Solte aqui para adicionar a seção' : 'Adicione uma seção pelo painel esquerdo ou arraste uma seção aqui'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(['hero', 'features', 'cta'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddSection(type)}
                    className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  >
                    + {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Render sections with drop indicators
            <div className="relative">
              {/* Top drop zone */}
              <div
                className={`h-2 transition-all duration-200 ${
                  dropTargetIndex === 0 && isDragOver 
                    ? 'bg-emerald-500/30' 
                    : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  setDropTargetIndex(0)
                  setIsDragOver(true)
                }}
              />

              {page.sections.map((section, index) => (
                <div key={section.id} className="relative">
                  {/* Drop indicator above this section */}
                  {dropTargetIndex === index && isDragOver && draggedSectionId !== section.id && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 z-30 rounded-full" />
                  )}
                  
                  {/* Section */}
                  <CanvasSection
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    isDragged={draggedSectionId === section.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    index={index}
                  />

                  {/* Drop indicator below last section */}
                  {index === page.sections.length - 1 && dropTargetIndex === page.sections.length && isDragOver && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 z-30 rounded-full" />
                  )}
                </div>
              ))}

              {/* Bottom drop zone */}
              <div
                className={`h-2 transition-all duration-200 ${
                  dropTargetIndex === page.sections.length && isDragOver 
                    ? 'bg-emerald-500/30' 
                    : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  setDropTargetIndex(page.sections.length)
                  setIsDragOver(true)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
