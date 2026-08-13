'use client'

/**
 * Section Item
 * ZCobans Visual Designer
 *
 * Item clicável para adicionar uma seção no canvas.
 */

import { clsx } from 'clsx'
import type { SectionType } from '@/lib/designer/types'

interface SectionItemProps {
  type: SectionType
  name: string
  icon: typeof import('lucide-react').Layout
  description: string
  onClick: () => void
}

export function SectionItem({ name, icon: Icon, description, onClick }: SectionItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        'bg-slate-800/50 hover:bg-slate-800',
        'text-slate-300 hover:text-white',
        'group'
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-700/50 group-hover:bg-emerald-500/10">
        <Icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-slate-500 truncate">{description}</div>
      </div>
    </button>
  )
}
