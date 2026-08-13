'use client'

/**
 * Element Properties
 * ZCobans Visual Designer
 *
 * Propriedades de um elemento selecionado.
 */

import { useDesigner } from '@/lib/designer/store'
import { ColorPicker } from './ColorPicker'
import type { DesignerElement, ElementType, FontSize, FontWeight, ButtonVariant, Alignment } from '@/lib/designer/types'
import { FONT_SIZES, FONT_WEIGHTS, ALIGNMENTS, BUTTON_VARIANTS } from '@/lib/designer/types'
import { Type, Palette, AlignLeft, Box } from 'lucide-react'

interface ElementPropertiesProps {
  element: DesignerElement
  sectionId: string
}

export function ElementProperties({ element, sectionId }: ElementPropertiesProps) {
  const { updateElementProps, updateElementStyles } = useDesigner()

  const handlePropsChange = (key: string, value: string) => {
    updateElementProps(sectionId, element.id, { [key]: value })
  }

  const handleStyleChange = (key: string, value: string | undefined) => {
    updateElementStyles(sectionId, element.id, { [key]: value })
  }

  const handlePaddingChange = (side: 'top' | 'bottom' | 'left' | 'right', value: string) => {
    updateElementStyles(sectionId, element.id, {
      padding: {
        ...element.styles.padding,
        top: element.styles.padding?.top || '0',
        bottom: element.styles.padding?.bottom || '0',
        left: element.styles.padding?.left || '0',
        right: element.styles.padding?.right || '0',
        [side]: value,
      },
    })
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <Type className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-white">
          {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
        </h2>
      </div>

      {/* Content Properties */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Type className="h-3.5 w-3.5 text-slate-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Conteúdo
          </h3>
        </div>

        {/* Heading properties */}
        {element.type === 'heading' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Texto</label>
              <input
                type="text"
                value={(element.props as { text: string }).text}
                onChange={(e) => handlePropsChange('text', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nível</label>
              <select
                value={(element.props as { level: string }).level}
                onChange={(e) => handlePropsChange('level', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="h1">H1 - Principal</option>
                <option value="h2">H2 - Secundário</option>
                <option value="h3">H3 - Terciário</option>
                <option value="h4">H4 - Quaternário</option>
              </select>
            </div>
          </div>
        )}

        {/* Text properties */}
        {element.type === 'text' && (
          <div>
            <label className="block text-xs text-slate-400 mb-1">Texto</label>
            <textarea
              value={(element.props as { text: string }).text}
              onChange={(e) => handlePropsChange('text', e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>
        )}

        {/* Button properties */}
        {element.type === 'button' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Texto</label>
              <input
                type="text"
                value={(element.props as { text: string }).text}
                onChange={(e) => handlePropsChange('text', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL</label>
              <input
                type="url"
                value={(element.props as { url: string }).url}
                onChange={(e) => handlePropsChange('url', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Variante</label>
              <select
                value={(element.props as { variant: string }).variant}
                onChange={(e) => handlePropsChange('variant', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                {BUTTON_VARIANTS.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Image properties */}
        {element.type === 'image' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL da Imagem</label>
              <input
                type="url"
                value={(element.props as { url: string }).url}
                onChange={(e) => handlePropsChange('url', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Texto Alternativo</label>
              <input
                type="text"
                value={(element.props as { alt: string }).alt}
                onChange={(e) => handlePropsChange('alt', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Style Properties */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-slate-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estilo
          </h3>
        </div>

        <div className="space-y-3">
          {/* Font Size */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Tamanho da Fonte</label>
            <select
              value={element.styles.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Padrão</option>
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size.replace('text-', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Peso da Fonte</label>
            <select
              value={element.styles.fontWeight || ''}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Padrão</option>
              {FONT_WEIGHTS.map((weight) => (
                <option key={weight} value={weight}>
                  {weight.replace('font-', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Text Color */}
          <ColorPicker
            label="Cor do texto"
            value={element.styles.color || ''}
            onChange={(color) => handleStyleChange('color', color || undefined)}
          />

          {/* Background Color */}
          <ColorPicker
            label="Cor de fundo"
            value={element.styles.backgroundColor || ''}
            onChange={(color) => handleStyleChange('backgroundColor', color || undefined)}
          />

          {/* Border Radius */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Border Radius</label>
            <input
              type="text"
              value={element.styles.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="0.5rem"
            />
          </div>

          {/* Max Width */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Largura Máxima</label>
            <input
              type="text"
              value={element.styles.maxWidth || ''}
              onChange={(e) => handleStyleChange('maxWidth', e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="100%"
            />
          </div>
        </div>
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
              onClick={() => handleStyleChange('alignment', alignment)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                element.styles.alignment === alignment
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
      <div>
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
              value={element.styles.padding?.top || '0'}
              onChange={(e) => handlePaddingChange('top', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Baixo</label>
            <input
              type="text"
              value={element.styles.padding?.bottom || '0'}
              onChange={(e) => handlePaddingChange('bottom', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Esquerda</label>
            <input
              type="text"
              value={element.styles.padding?.left || '0'}
              onChange={(e) => handlePaddingChange('left', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Direita</label>
            <input
              type="text"
              value={element.styles.padding?.right || '0'}
              onChange={(e) => handlePaddingChange('right', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
