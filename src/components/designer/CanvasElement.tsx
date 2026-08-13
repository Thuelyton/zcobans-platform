'use client'

/**
 * Canvas Element
 * ZCobans Visual Designer
 *
 * Renderiza um elemento no canvas (heading, text, button, image).
 * Permite seleção e edição inline.
 */

import { clsx } from 'clsx'
import { useDesigner } from '@/lib/designer/store'
import type { DesignerElement, Alignment } from '@/lib/designer/types'

interface CanvasElementProps {
  element: DesignerElement
  sectionId: string
  isSelected: boolean
  alignment?: Alignment
}

export function CanvasElement({ element, sectionId, isSelected, alignment }: CanvasElementProps) {
  const { selectElement } = useDesigner()

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectElement(sectionId, element.id)
  }

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

  const renderElement = () => {
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
        'relative cursor-pointer transition-all duration-200 rounded-lg',
        isSelected && 'ring-2 ring-emerald-500 ring-inset bg-emerald-500/5'
      )}
      onClick={handleSelect}
    >
      {/* Element content */}
      {renderElement()}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
      )}
    </div>
  )
}
