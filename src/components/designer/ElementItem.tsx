'use client'

/**
 * Element Item
 * ZCobans Visual Designer
 *
 * Item clicável para adicionar um elemento no canvas.
 */

import { clsx } from 'clsx'
import type { ElementType } from '@/lib/designer/types'

interface ElementItemProps {
  type: ElementType
  name: string
  icon: typeof import('lucide-react').Heading1
  onClick: () => void
  disabled?: boolean
}

export function ElementItem({ name, icon: Icon, onClick, disabled }: ElementItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex flex-col items-center gap-1.5 rounded-lg px-3 py-3 transition-colors',
        disabled
          ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
          : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{name}</span>
    </button>
  )
}
