'use client'

/**
 * Section Overlay
 * ZCobans Visual Designer
 *
 * Overlay com controles para cada seção no canvas.
 * Aparece ao hover ou quando a seção está selecionada.
 */

import { clsx } from 'clsx'
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  GripVertical,
} from 'lucide-react'
import { useDesigner } from '@/lib/designer/store'
import type { DesignerSection } from '@/lib/designer/types'

interface SectionOverlayProps {
  section: DesignerSection
  isSelected: boolean
}

export function SectionOverlay({ section, isSelected }: SectionOverlayProps) {
  const { state, moveSection, removeSection } = useDesigner()
  const { page } = state

  const sectionIndex = page.sections.findIndex((s) => s.id === section.id)
  const isFirst = sectionIndex === 0
  const isLast = sectionIndex === page.sections.length - 1

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveSection(section.id, 'up')
  }

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    moveSection(section.id, 'down')
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Remover esta seção?')) {
      removeSection(section.id)
    }
  }

  return (
    <div
      className={clsx(
        'absolute inset-0 z-20 transition-opacity duration-200',
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}
    >
      {/* Section label */}
      <div className="absolute top-2 left-2 flex items-center gap-1">
        <div className="flex items-center gap-1.5 rounded-md bg-slate-900/90 px-2 py-1 text-xs text-slate-300 backdrop-blur-sm">
          <GripVertical className="h-3 w-3 text-slate-500" />
          <span>{section.title}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <div className="flex items-center gap-0.5 rounded-md bg-slate-900/90 p-1 backdrop-blur-sm">
          <button
            onClick={handleMoveUp}
            disabled={isFirst}
            className={clsx(
              'flex h-6 w-6 items-center justify-center rounded transition-colors',
              isFirst
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            )}
            title="Mover para cima"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          <button
            onClick={handleMoveDown}
            disabled={isLast}
            className={clsx(
              'flex h-6 w-6 items-center justify-center rounded transition-colors',
              isLast
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            )}
            title="Mover para baixo"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          <div className="mx-0.5 h-4 w-px bg-slate-700" />

          <button
            onClick={handleRemove}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            title="Remover seção"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Highlight border when selected */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-emerald-500/50 pointer-events-none rounded" />
      )}
    </div>
  )
}
