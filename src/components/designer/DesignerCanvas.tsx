'use client'

/**
 * Designer Canvas
 * ZCobans Visual Designer
 *
 * Canvas principal que renderiza as seções do Designer.
 * Muda de largura conforme o device selecionado.
 */

import { useDesigner } from '@/lib/designer/store'
import { DEVICE_WIDTHS } from '@/lib/designer/types'
import { CanvasSection } from './CanvasSection'
import { Plus } from 'lucide-react'
import { createSectionFromTemplate } from '@/lib/designer/templates'

export function DesignerCanvas() {
  const { state, addSection, deselectAll } = useDesigner()
  const { page, device, selectedSectionId } = state

  const deviceWidth = DEVICE_WIDTHS[device]

  const handleAddSection = (type: 'hero' | 'features' | 'cta' | 'about' | 'contact' | 'faq' | 'footer') => {
    const section = createSectionFromTemplate(type, page.sections.length)
    addSection(section)
  }

  return (
    <div
      className="flex h-full flex-col items-center py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          deselectAll()
        }
      }}
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
        <div className="bg-[#111827] shadow-2xl shadow-black/50">
          {page.sections.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-24 px-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50">
                <Plus className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-300">
                Canvas vazio
              </h3>
              <p className="mb-6 text-center text-sm text-slate-500">
                Adicione uma seção pelo painel esquerdo para começar a construir sua landing page.
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
            // Render sections
            page.sections.map((section) => (
              <CanvasSection
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
