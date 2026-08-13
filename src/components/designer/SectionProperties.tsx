'use client'

/**
 * Section Properties
 * ZCobans Visual Designer
 *
 * Propriedades de uma seção selecionada.
 */

import { useDesigner } from '@/lib/designer/store'
import { ColorPicker } from './ColorPicker'
import type { DesignerSection, Alignment } from '@/lib/designer/types'
import { ALIGNMENTS } from '@/lib/designer/types'
import { Box, Palette, AlignLeft } from 'lucide-react'

interface SectionPropertiesProps {
  section: DesignerSection
}

export function SectionProperties({ section }: SectionPropertiesProps) {
  const { updateSectionStyles } = useDesigner()

  const handlePaddingChange = (side: 'top' | 'bottom' | 'left' | 'right', value: string) => {
    updateSectionStyles(section.id, {
      padding: {
        ...section.styles.padding,
        [side]: value,
      },
    })
  }

  const handleBackgroundColorChange = (color: string) => {
    updateSectionStyles(section.id, { backgroundColor: color })
  }

  const handleAlignmentChange = (alignment: Alignment) => {
    updateSectionStyles(section.id, { alignment })
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <Box className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-white">Seção: {section.title}</h2>
      </div>

      {/* Background Color */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-slate-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Cores
          </h3>
        </div>
        <ColorPicker
          label="Cor de fundo"
          value={section.styles.backgroundColor}
          onChange={handleBackgroundColorChange}
        />
      </div>

      {/* Alignment */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Alinhamento
          </h3>
        </div>
        <div className="flex gap-2">
          {ALIGNMENTS.map((alignment) => (
            <button
              key={alignment}
              onClick={() => handleAlignmentChange(alignment)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                section.styles.alignment === alignment
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {alignment === 'left' && '← Esquerda'}
              {alignment === 'center' && '↔ Centro'}
              {alignment === 'right' && '→ Direita'}
            </button>
          ))}
        </div>
      </div>

      {/* Padding */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Box className="h-3.5 w-3.5 text-slate-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Padding
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Topo</label>
            <input
              type="text"
              value={section.styles.padding?.top || '0'}
              onChange={(e) => handlePaddingChange('top', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="4rem"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Baixo</label>
            <input
              type="text"
              value={section.styles.padding?.bottom || '0'}
              onChange={(e) => handlePaddingChange('bottom', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="4rem"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Esquerda</label>
            <input
              type="text"
              value={section.styles.padding?.left || '0'}
              onChange={(e) => handlePaddingChange('left', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="1.5rem"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Direita</label>
            <input
              type="text"
              value={section.styles.padding?.right || '0'}
              onChange={(e) => handlePaddingChange('right', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="1.5rem"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
