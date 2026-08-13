'use client'

/**
 * Canvas Element
 * ZCobans Visual Designer
 *
 * Renderiza um elemento no canvas (heading, text, button, image).
 * Permite seleção, edição inline de textos e Drag & Drop dentro da seção.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { useDesigner } from '@/lib/designer/store'
import { GripVertical } from 'lucide-react'
import type { DesignerElement, Alignment, ElementProps } from '@/lib/designer/types'

interface CanvasElementProps {
  element: DesignerElement
  sectionId: string
  isSelected: boolean
  alignment?: Alignment
  isDragged?: boolean
  onDragStart?: (elementId: string) => void
  onDragEnd?: () => void
  onDragOver?: (e: React.DragEvent) => void
  index?: number
}

// Check if element type has editable text
function hasEditableText(type: string): boolean {
  return type === 'heading' || type === 'text' || type === 'button'
}

// Get text from element props
function getTextFromProps(type: string, props: ElementProps): string {
  switch (type) {
    case 'heading':
      return (props as { text: string }).text
    case 'text':
      return (props as { text: string }).text
    case 'button':
      return (props as { text: string }).text
    default:
      return ''
  }
}

export function CanvasElement({ 
  element, 
  sectionId, 
  isSelected, 
  alignment,
  isDragged = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  index
}: CanvasElementProps) {
  const { selectElement, updateElementProps } = useDesigner()
  
  // Inline editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [originalValue, setOriginalValue] = useState('')
  const editRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Don't select if we're in edit mode
    if (!isEditing) {
      selectElement(sectionId, element.id)
    }
  }

  // Double-click to enter edit mode
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (!hasEditableText(element.type)) return
    
    const text = getTextFromProps(element.type, element.props)
    setOriginalValue(text)
    setEditValue(text)
    setIsEditing(true)
  }, [element.type, element.props])

  // Save edit
  const saveEdit = useCallback(() => {
    if (!isEditing) return
    
    // Only save if value changed
    if (editValue !== originalValue) {
      updateElementProps(sectionId, element.id, { text: editValue })
    }
    
    setIsEditing(false)
    setEditValue('')
    setOriginalValue('')
  }, [isEditing, editValue, originalValue, sectionId, element.id, updateElementProps])

  // Cancel edit
  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditValue('')
    setOriginalValue('')
  }, [])

  // Handle keyboard events during editing
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isEditing) return
    
    // Enter - save (but not for text areas with shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      saveEdit()
    }
    
    // Escape - cancel
    if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
    
    // Stop propagation to prevent canvas shortcuts
    e.stopPropagation()
  }, [isEditing, saveEdit, cancelEdit])

  // Handle blur - save on blur
  const handleBlur = useCallback(() => {
    // Small delay to allow click events to process first
    setTimeout(() => {
      if (isEditing) {
        saveEdit()
      }
    }, 100)
  }, [isEditing, saveEdit])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Select all text
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  // Drag handlers - prevent during editing
  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (isEditing) {
      e.preventDefault()
      return
    }
    
    e.stopPropagation() // Prevent section drag
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', element.id)
    
    // Set drag image with some opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
    }
    
    onDragStart?.(element.id)
  }, [element.id, onDragStart, isEditing])

  const handleDragEnd = useCallback(() => {
    onDragEnd?.()
  }, [onDragEnd])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragOver?.(e)
  }, [onDragOver])

  // Build inline styles from element styles
  const elementStyle: React.CSSProperties = {}

  if (element.styles.fontSize) {
    // Convert Tailwind font size to actual CSS
    const fontSizeMap: Record<string, string> = {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
      'text-4xl': '2.25rem',
      'text-5xl': '3rem',
      'text-6xl': '3.75rem',
    }
    elementStyle.fontSize = fontSizeMap[element.styles.fontSize] || '1rem'
  }

  if (element.styles.fontWeight) {
    const fontWeightMap: Record<string, string> = {
      'font-normal': '400',
      'font-medium': '500',
      'font-semibold': '600',
      'font-bold': '700',
    }
    elementStyle.fontWeight = fontWeightMap[element.styles.fontWeight] || '400'
  }

  if (element.styles.color) {
    elementStyle.color = element.styles.color
  }

  if (element.styles.backgroundColor) {
    elementStyle.backgroundColor = element.styles.backgroundColor
  }

  if (element.styles.alignment) {
    elementStyle.textAlign = element.styles.alignment
  } else if (alignment) {
    elementStyle.textAlign = alignment
  }

  if (element.styles.borderRadius) {
    elementStyle.borderRadius = element.styles.borderRadius
  }

  if (element.styles.maxWidth) {
    elementStyle.maxWidth = element.styles.maxWidth
  }

  if (element.styles.padding) {
    elementStyle.paddingTop = element.styles.padding.top
    elementStyle.paddingBottom = element.styles.padding.bottom
    elementStyle.paddingLeft = element.styles.padding.left
    elementStyle.paddingRight = element.styles.padding.right
  }

  if (element.styles.margin) {
    elementStyle.marginTop = element.styles.margin.top
    elementStyle.marginBottom = element.styles.margin.bottom
    elementStyle.marginLeft = element.styles.margin.left
    elementStyle.marginRight = element.styles.margin.right
  }

  // Render editable text input
  const renderEditableText = (
    value: string,
    className: string,
    style?: React.CSSProperties
  ) => {
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={clsx(
          className,
          'bg-transparent border-none outline-none ring-2 ring-emerald-500/50 rounded px-1 -mx-1 w-full',
          'placeholder:text-slate-400'
        )}
        style={style}
        placeholder="Digite o texto..."
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    )
  }

  // Render element content
  const renderElement = () => {
    // If editing, show input
    if (isEditing) {
      switch (element.type) {
        case 'heading': {
          const props = element.props as { text: string; level: 'h1' | 'h2' | 'h3' | 'h4' }
          const defaultStyles: Record<string, string> = {
            h1: 'text-5xl font-bold',
            h2: 'text-4xl font-bold',
            h3: 'text-3xl font-semibold',
            h4: 'text-2xl font-semibold',
          }
          return renderEditableText(editValue, clsx(defaultStyles[props.level], 'leading-tight'), elementStyle)
        }
        case 'text': {
          return renderEditableText(editValue, 'text-base leading-relaxed', elementStyle)
        }
        case 'button': {
          const props = element.props as { text: string; url: string; variant: string }
          const variantStyles: Record<string, string> = {
            primary: 'bg-emerald-600 text-white',
            secondary: 'bg-slate-700 text-white',
            outline: 'border-2 border-current',
            ghost: '',
          }
          return (
            <div style={{ textAlign: elementStyle.textAlign }}>
              <div
                className={clsx(
                  'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200',
                  variantStyles[props.variant] || variantStyles.primary
                )}
                style={{
                  color: elementStyle.color,
                  backgroundColor: elementStyle.backgroundColor,
                  borderRadius: elementStyle.borderRadius,
                }}
              >
                {renderEditableText(editValue, 'bg-transparent border-none outline-none text-inherit text-center')}
              </div>
            </div>
          )
        }
        default:
          return null
      }
    }

    // Normal (non-editing) render
    switch (element.type) {
      case 'heading': {
        const props = element.props as { text: string; level: 'h1' | 'h2' | 'h3' | 'h4' }
        const HeadingTag = props.level
        
        const defaultStyles: Record<string, string> = {
          h1: 'text-5xl font-bold',
          h2: 'text-4xl font-bold',
          h3: 'text-3xl font-semibold',
          h4: 'text-2xl font-semibold',
        }

        return (
          <HeadingTag
            className={clsx(defaultStyles[props.level], 'leading-tight')}
            style={elementStyle}
          >
            {props.text}
          </HeadingTag>
        )
      }

      case 'text': {
        const props = element.props as { text: string }
        return (
          <p
            className="text-base leading-relaxed"
            style={elementStyle}
          >
            {props.text}
          </p>
        )
      }

      case 'button': {
        const props = element.props as { text: string; url: string; variant: string }
        
        const variantStyles: Record<string, string> = {
          primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
          outline: 'border-2 border-current hover:bg-white/10',
          ghost: 'hover:bg-white/10',
        }

        return (
          <div style={{ textAlign: elementStyle.textAlign }}>
            <a
              href={props.url || '#'}
              onClick={(e) => e.preventDefault()}
              className={clsx(
                'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200',
                variantStyles[props.variant] || variantStyles.primary
              )}
              style={{
                color: elementStyle.color,
                backgroundColor: elementStyle.backgroundColor,
                borderRadius: elementStyle.borderRadius,
              }}
            >
              {props.text}
            </a>
          </div>
        )
      }

      case 'image': {
        const props = element.props as { url: string; alt: string }
        return (
          <div style={{ textAlign: elementStyle.textAlign }}>
            <img
              src={props.url}
              alt={props.alt}
              className="max-w-full h-auto rounded-lg"
              style={{
                borderRadius: elementStyle.borderRadius,
              }}
              onError={(e) => {
                // Fallback for broken images
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCBmaWxsPSIjMWUyOTNiIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IGZpbGw9IiM5NGEzYjgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMTUwIiB4PSIyMDAiPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+'
              }}
            />
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div
      className={clsx(
        'relative group/element rounded-lg transition-all duration-200',
        isSelected && !isEditing && 'ring-2 ring-emerald-500 ring-inset bg-emerald-500/5',
        isDragged && 'opacity-50 scale-[0.98]',
        isEditing && 'ring-2 ring-emerald-500 ring-inset',
        !isDragged && !isEditing && 'cursor-pointer'
      )}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      draggable={!isDragged && !isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      data-element-id={element.id}
      data-element-index={index}
      data-is-editing={isEditing}
    >
      {/* Drag handle - visible on hover, hidden during editing */}
      {!isEditing && (
        <div 
          className={clsx(
            "absolute -left-8 top-1/2 -translate-y-1/2 transition-opacity duration-200",
            "opacity-0 group-hover/element:opacity-100",
            isDragged && "opacity-100"
          )}
        >
          <div 
            className={clsx(
              "flex items-center justify-center w-6 h-6 rounded bg-slate-800/90 text-slate-400",
              !isDragged && "cursor-grab active:cursor-grabbing hover:bg-slate-700 hover:text-white"
            )}
            title="Arraste para reordenar"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Edit mode hint */}
      {isEditing && (
        <div className="absolute -top-6 left-0 text-xs text-emerald-400 flex items-center gap-1">
          <span>Editando</span>
          <span className="text-slate-500">• Enter para salvar • Esc para cancelar</span>
        </div>
      )}

      {/* Element content */}
      {renderElement()}

      {/* Selection indicator */}
      {isSelected && !isEditing && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
      )}
      
      {/* Double-click hint */}
      {isSelected && !isEditing && hasEditableText(element.type) && (
        <div className="absolute -bottom-5 left-0 text-xs text-slate-500 opacity-0 group-hover/element:opacity-100 transition-opacity">
          Duplo clique para editar
        </div>
      )}
    </div>
  )
}
