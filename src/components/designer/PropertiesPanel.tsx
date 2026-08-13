'use client'

/**
 * Properties Panel
 * ZCobans Visual Designer
 *
 * Painel direito com propriedades do elemento ou seção selecionada.
 */

import { useDesigner } from '@/lib/designer/store'
import { SectionProperties } from './SectionProperties'
import { ElementProperties } from './ElementProperties'
import { Layers, MousePointer } from 'lucide-react'

export function PropertiesPanel() {
  const { state } = useDesigner()
  const { selectedSectionId, selectedElementId, page } = state

  // Find selected section and element
  const selectedSection = selectedSectionId
    ? page.sections.find((s) => s.id === selectedSectionId)
    : null

  const selectedElement = selectedSection && selectedElementId
    ? selectedSection.elements.find((e) => e.id === selectedElementId)
    : null

  // Show element properties if element is selected
  if (selectedElement && selectedSection) {
    return (
      <ElementProperties
        element={selectedElement}
        sectionId={selectedSection.id}
      />
    )
  }

  // Show section properties if section is selected
  if (selectedSection) {
    return (
      <SectionProperties section={selectedSection} />
    )
  }

  // Show page settings when nothing is selected
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <Layers className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-white">Propriedades</h2>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/50">
          <MousePointer className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-sm text-slate-400">
          Selecione uma seção ou elemento no canvas para editar suas propriedades.
        </p>
      </div>

      {/* Page settings */}
      <div className="border-t border-slate-800 pt-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Configurações da Página
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Título
            </label>
            <div className="rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200">
              {page.settings.title}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Cor Primária
            </label>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg border border-slate-700"
                style={{ backgroundColor: page.settings.primaryColor }}
              />
              <div className="flex-1 rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200">
                {page.settings.primaryColor}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Cor Secundária
            </label>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg border border-slate-700"
                style={{ backgroundColor: page.settings.secondaryColor }}
              />
              <div className="flex-1 rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200">
                {page.settings.secondaryColor}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
