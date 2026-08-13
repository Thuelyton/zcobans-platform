'use client'

/**
 * Undo Redo Buttons
 * ZCobans Visual Designer
 *
 * Botões de undo e redo com atalhos de teclado.
 */

import { clsx } from 'clsx'
import { Undo2, Redo2 } from 'lucide-react'
import { useDesigner } from '@/lib/designer/store'

export function UndoRedoButtons() {
  const { undo, redo, canUndo, canRedo } = useDesigner()

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={clsx(
          'flex items-center justify-center rounded-md p-1.5 transition-colors',
          canUndo
            ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
            : 'text-slate-600 cursor-not-allowed'
        )}
        title="Desfazer (Ctrl+Z)"
        aria-label="Desfazer"
      >
        <Undo2 className="h-4 w-4" />
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={clsx(
          'flex items-center justify-center rounded-md p-1.5 transition-colors',
          canRedo
            ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
            : 'text-slate-600 cursor-not-allowed'
        )}
        title="Refazer (Ctrl+Y)"
        aria-label="Refazer"
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  )
}
