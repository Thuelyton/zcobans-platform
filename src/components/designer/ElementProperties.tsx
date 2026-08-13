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

        {/* Video properties */}
        {element.type === 'video' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL do Vídeo</label>
              <input
                type="url"
                value={(element.props as { url: string }).url}
                onChange={(e) => handlePropsChange('url', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL do Poster</label>
              <input
                type="url"
                value={(element.props as { poster?: string }).poster || ''}
                onChange={(e) => handlePropsChange('poster', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(element.props as { controls?: boolean }).controls !== false}
                  onChange={(e) => handlePropsChange('controls', String(e.target.checked))}
                  className="rounded border-slate-700 bg-[#111827] text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-400">Controles</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(element.props as { muted?: boolean }).muted || false}
                  onChange={(e) => handlePropsChange('muted', String(e.target.checked))}
                  className="rounded border-slate-700 bg-[#111827] text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-400">Mudo</span>
              </label>
            </div>
          </div>
        )}

        {/* Divider properties */}
        {element.type === 'divider' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Espessura</label>
              <input
                type="text"
                value={(element.props as { thickness?: string }).thickness || '1px'}
                onChange={(e) => handlePropsChange('thickness', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="1px"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Largura</label>
              <input
                type="text"
                value={(element.props as { width?: string }).width || '100%'}
                onChange={(e) => handlePropsChange('width', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="100%"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Estilo</label>
              <select
                value={(element.props as { style?: string }).style || 'solid'}
                onChange={(e) => handlePropsChange('style', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="solid">Sólido</option>
                <option value="dashed">Tracejado</option>
                <option value="dotted">Pontilhado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cor</label>
              <input
                type="color"
                value={(element.props as { color?: string }).color || '#e2e8f0'}
                onChange={(e) => handlePropsChange('color', e.target.value)}
                className="h-8 w-full rounded-lg border border-slate-700 bg-[#111827]"
              />
            </div>
          </div>
        )}

        {/* Spacer properties */}
        {element.type === 'spacer' && (
          <div>
            <label className="block text-xs text-slate-400 mb-1">Altura</label>
            <input
              type="text"
              value={(element.props as { height?: string }).height || '2rem'}
              onChange={(e) => handlePropsChange('height', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="2rem"
            />
          </div>
        )}

        {/* Icon properties */}
        {element.type === 'icon' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Ícone (emoji/símbolo)</label>
              <input
                type="text"
                value={(element.props as { name: string }).name}
                onChange={(e) => handlePropsChange('name', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="★"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tamanho</label>
              <input
                type="text"
                value={(element.props as { size?: string }).size || '2rem'}
                onChange={(e) => handlePropsChange('size', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="2rem"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cor</label>
              <input
                type="color"
                value={(element.props as { color?: string }).color || '#64748b'}
                onChange={(e) => handlePropsChange('color', e.target.value)}
                className="h-8 w-full rounded-lg border border-slate-700 bg-[#111827]"
              />
            </div>
          </div>
        )}

        {/* List properties */}
        {element.type === 'list' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Itens (um por linha)</label>
              <textarea
                value={((element.props as { items?: string[] }).items || []).join('\n')}
                onChange={(e) => {
                  const items = e.target.value.split('\n')
                  updateElementProps(sectionId, element.id, { items })
                }}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none resize-none"
                placeholder="Item 1\nItem 2\nItem 3"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Marcador</label>
              <select
                value={(element.props as { marker?: string }).marker || 'disc'}
                onChange={(e) => handlePropsChange('marker', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="disc">Disco</option>
                <option value="circle">Círculo</option>
                <option value="square">Quadrado</option>
                <option value="none">Nenhum</option>
              </select>
            </div>
          </div>
        )}

        {/* Testimonial properties */}
        {element.type === 'testimonial' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nome</label>
              <input
                type="text"
                value={(element.props as { name: string }).name}
                onChange={(e) => handlePropsChange('name', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Depoimento</label>
              <textarea
                value={(element.props as { text: string }).text}
                onChange={(e) => handlePropsChange('text', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cargo</label>
              <input
                type="text"
                value={(element.props as { role?: string }).role || ''}
                onChange={(e) => handlePropsChange('role', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL do Avatar</label>
              <input
                type="url"
                value={(element.props as { avatar?: string }).avatar || ''}
                onChange={(e) => handlePropsChange('avatar', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Avaliação (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={(element.props as { rating?: number }).rating || 5}
                onChange={(e) => updateElementProps(sectionId, element.id, { rating: parseInt(e.target.value) || 5 })}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Price properties */}
        {element.type === 'price' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Preço</label>
              <input
                type="text"
                value={(element.props as { price: string }).price}
                onChange={(e) => handlePropsChange('price', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="97"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Moeda</label>
              <input
                type="text"
                value={(element.props as { currency?: string }).currency || 'R$'}
                onChange={(e) => handlePropsChange('currency', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="R$"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Período</label>
              <input
                type="text"
                value={(element.props as { period?: string }).period || ''}
                onChange={(e) => handlePropsChange('period', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="mês"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Descrição</label>
              <input
                type="text"
                value={(element.props as { description?: string }).description || ''}
                onChange={(e) => handlePropsChange('description', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Texto do Botão</label>
              <input
                type="text"
                value={(element.props as { buttonText?: string }).buttonText || ''}
                onChange={(e) => handlePropsChange('buttonText', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL do Botão</label>
              <input
                type="url"
                value={(element.props as { buttonUrl?: string }).buttonUrl || ''}
                onChange={(e) => handlePropsChange('buttonUrl', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {/* Badge properties */}
        {element.type === 'badge' && (
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
              <label className="block text-xs text-slate-400 mb-1">Variante</label>
              <select
                value={(element.props as { variant?: string }).variant || 'primary'}
                onChange={(e) => handlePropsChange('variant', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="primary">Primário</option>
                <option value="secondary">Secundário</option>
                <option value="success">Sucesso</option>
                <option value="warning">Aviso</option>
                <option value="danger">Perigo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tamanho</label>
              <select
                value={(element.props as { size?: string }).size || 'md'}
                onChange={(e) => handlePropsChange('size', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="sm">Pequeno</option>
                <option value="md">Médio</option>
                <option value="lg">Grande</option>
              </select>
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
