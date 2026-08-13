'use client'

/**
 * Designer Layout
 * ZCobans Visual Designer
 *
 * Layout principal com 3 colunas: Painel Esquerdo, Canvas, Painel Direito.
 */

import { type ReactNode } from 'react'
import { DesignerHeader } from './DesignerHeader'
import { DesignerFooter } from './DesignerFooter'
import { useDesigner } from '@/lib/designer/store'

interface DesignerLayoutProps {
  children: ReactNode
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export function DesignerLayout({ children, leftPanel, rightPanel }: DesignerLayoutProps) {
  const { deselectAll } = useDesigner()

  return (
    <div className="flex h-screen flex-col bg-[#0a0f1a]">
      {/* Header */}
      <DesignerHeader />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Components */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-[#0d1117] overflow-y-auto">
          {leftPanel}
        </aside>

        {/* Canvas */}
        <main
          className="flex-1 overflow-auto bg-[#111827]"
          onClick={(e) => {
            // Deselect when clicking on canvas background
            if (e.target === e.currentTarget) {
              deselectAll()
            }
          }}
        >
          {children}
        </main>

        {/* Right Panel - Properties */}
        <aside className="w-72 flex-shrink-0 border-l border-slate-800 bg-[#0d1117] overflow-y-auto">
          {rightPanel}
        </aside>
      </div>

      {/* Footer */}
      <DesignerFooter />
    </div>
  )
}
