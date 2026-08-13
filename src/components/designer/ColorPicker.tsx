'use client'

/**
 * Color Picker
 * ZCobans Visual Designer
 *
 * Seletor de cores com input de texto e preview.
 */

import { useState, useRef } from 'react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  presetColors?: string[]
}

const DEFAULT_PRESET_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
  '#020617',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
]

export function ColorPicker({ label, value, onChange, presetColors }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const colors = presetColors || DEFAULT_PRESET_COLORS

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Validate hex color format
    if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue) || newValue === '') {
      onChange(newValue)
    }
  }

  const handleColorSelect = (color: string) => {
    onChange(color)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 w-9 flex-shrink-0 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          style={{ backgroundColor: value || '#transparent' }}
          title="Selecionar cor"
        >
          {!value && (
            <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
              ×
            </div>
          )}
        </button>
        <input
          ref={inputRef}
          type="text"
          value={value || ''}
          onChange={handleInputChange}
          className="flex-1 rounded-lg border border-slate-700 bg-[#111827] px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
          placeholder="#000000"
        />
      </div>

      {/* Color palette dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-slate-700 bg-[#1e293b] p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Cores</span>
              <button
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Limpar
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`h-6 w-6 rounded-md border transition-transform hover:scale-110 ${
                    value === color
                      ? 'border-emerald-500 ring-2 ring-emerald-500/50'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="mt-3 border-t border-slate-700 pt-3">
              <label className="block text-xs text-slate-400 mb-1">Cor personalizada</label>
              <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => {
                  onChange(e.target.value)
                  setIsOpen(false)
                }}
                className="h-8 w-full cursor-pointer rounded-lg border border-slate-700"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
