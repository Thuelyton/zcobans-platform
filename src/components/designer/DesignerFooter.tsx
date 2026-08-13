'use client'

/**
 * Designer Footer
 * ZCobans Visual Designer
 *
 * Footer com informações de status e zoom.
 */

import { useDesigner } from '@/lib/designer/store'
import { DEVICE_WIDTHS } from '@/lib/designer/types'

export function DesignerFooter() {
  const { state } = useDesigner()
  const { device, hasUnsavedChanges, page } = state

  const deviceWidth = DEVICE_WIDTHS[device]

  return (
    <footer className="flex h-8 items-center justify-between border-t border-slate-800 bg-[#0d1117] px-4 text-xs text-slate-500">
      <div className="flex items-center gap-4">
        <span>Device: {device.charAt(0).toUpperCase() + device.slice(1)}</span>
        <span>Largura: {deviceWidth}</span>
        <span>Seções: {page.sections.length}</span>
      </div>

      <div className="flex items-center gap-4">
        {hasUnsavedChanges && (
          <span className="text-amber-400">Alterações não salvas</span>
        )}
        <span>ZCobans Visual Designer</span>
      </div>
    </footer>
  )
}
