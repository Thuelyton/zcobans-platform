'use client'

/**
 * Save Button
 * ZCobans Visual Designer
 *
 * Botão de salvar com indicador de estado.
 */

import { clsx } from 'clsx'
import { Save, Check, Loader2 } from 'lucide-react'
import { useDesigner } from '@/lib/designer/store'

export function SaveButton() {
  const { save, state } = useDesigner()
  const { isSaving, hasUnsavedChanges } = state

  return (
    <button
      onClick={save}
      disabled={isSaving || !hasUnsavedChanges}
      className={clsx(
        'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
        hasUnsavedChanges && !isSaving
          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
          : 'text-slate-500 cursor-not-allowed'
      )}
      title={hasUnsavedChanges ? 'Salvar (Ctrl+S)' : 'Salvo'}
      aria-label={hasUnsavedChanges ? 'Salvar alterações' : 'Sem alterações'}
    >
      {isSaving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : hasUnsavedChanges ? (
        <Save className="h-3.5 w-3.5" />
      ) : (
        <Check className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">
        {isSaving ? 'Salvando...' : hasUnsavedChanges ? 'Salvar' : 'Salvo'}
      </span>
    </button>
  )
}
