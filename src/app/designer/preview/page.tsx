'use client'

/**
 * Designer Preview Page
 * ZCobans Visual Designer
 *
 * Página de preview do projeto criado no Designer.
 * Renderiza o projeto como uma página final, sem controles de edição.
 */

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Monitor, Tablet, Smartphone, Loader2, AlertCircle } from 'lucide-react'
import { getProject } from '@/lib/designer/client-repository'
import { loadFromLocalStorage, DESIGNER_STORAGE_KEY } from '@/lib/designer/utils'
import type { DesignerPage, DesignerSection, DesignerElement, DeviceType, ElementStyles } from '@/lib/designer/types'

// ============================================================================
// STYLE UTILS
// ============================================================================

function getSpacingStyle(spacing: { top: string; bottom: string; left: string; right: string } | undefined, property: string): React.CSSProperties {
  if (!spacing) return {}
  return {
    [`${property}Top`]: spacing.top,
    [`${property}Bottom`]: spacing.bottom,
    [`${property}Left`]: spacing.left,
    [`${property}Right`]: spacing.right,
  }
}

function getElementStyles(styles: ElementStyles): React.CSSProperties {
  const css: React.CSSProperties = {}

  if (styles.fontSize) {
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
    css.fontSize = fontSizeMap[styles.fontSize as string] || '1rem'
  }

  if (styles.fontWeight) {
    const fontWeightMap: Record<string, string> = {
      'font-normal': '400',
      'font-medium': '500',
      'font-semibold': '600',
      'font-bold': '700',
    }
    css.fontWeight = fontWeightMap[styles.fontWeight as string] || '400'
  }

  if (styles.color) css.color = styles.color as string
  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor as string
  if (styles.borderRadius) css.borderRadius = styles.borderRadius as string
  if (styles.maxWidth) css.maxWidth = styles.maxWidth as string
  if (styles.alignment) css.textAlign = styles.alignment as React.CSSProperties['textAlign']

  if (styles.padding) {
    Object.assign(css, getSpacingStyle(styles.padding, 'padding'))
  }

  if (styles.margin) {
    Object.assign(css, getSpacingStyle(styles.margin, 'margin'))
  }

  return css
}

// ============================================================================
// ELEMENT RENDERER
// ============================================================================

function PreviewElement({ element, alignment }: { element: DesignerElement; alignment?: string }) {
  const elementStyle: React.CSSProperties = getElementStyles(element.styles)
  
  if (!elementStyle.textAlign && alignment) {
    elementStyle.textAlign = alignment as React.CSSProperties['textAlign']
  }

  switch (element.type) {
    case 'heading': {
      const props = element.props as { text: string; level: 'h1' | 'h2' | 'h3' | 'h4' }
      const HeadingTag = props.level
      return <HeadingTag style={elementStyle}>{props.text}</HeadingTag>
    }

    case 'text': {
      const props = element.props as { text: string }
      return <p style={elementStyle}>{props.text}</p>
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
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${variantStyles[props.variant] || variantStyles.primary}`}
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
            style={{ borderRadius: elementStyle.borderRadius }}
          />
        </div>
      )
    }

    case 'video': {
      const props = element.props as { url: string; poster?: string; controls?: boolean; muted?: boolean }
      return (
        <div style={{ textAlign: elementStyle.textAlign }}>
          <video
            src={props.url}
            poster={props.poster}
            controls={props.controls !== false}
            muted={props.muted}
            className="max-w-full h-auto rounded-lg"
            style={{ borderRadius: elementStyle.borderRadius }}
          />
        </div>
      )
    }

    case 'divider': {
      const props = element.props as { thickness?: string; width?: string; style?: string; color?: string }
      return (
        <hr
          style={{
            borderWidth: props.thickness || '1px',
            width: props.width || '100%',
            borderStyle: props.style || 'solid',
            borderColor: props.color || '#e2e8f0',
            ...elementStyle,
          }}
        />
      )
    }

    case 'spacer': {
      const props = element.props as { height?: string }
      return <div style={{ height: props.height || '2rem', ...elementStyle }} />
    }

    case 'icon': {
      const props = element.props as { name: string; size?: string; color?: string }
      return (
        <div style={{ fontSize: props.size || '2rem', color: props.color || '#64748b', textAlign: elementStyle.textAlign }}>
          {props.name || '★'}
        </div>
      )
    }

    case 'list': {
      const props = element.props as { items: string[]; marker?: string }
      return (
        <ul style={{ listStyleType: props.marker || 'disc', paddingLeft: '1.5rem', ...elementStyle }}>
          {(props.items || []).map((item, i) => (
            <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
          ))}
        </ul>
      )
    }

    case 'testimonial': {
      const props = element.props as { name: string; text: string; avatar?: string; role?: string; rating?: number }
      return (
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', ...elementStyle }}>
          {props.rating && <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>{'★'.repeat(props.rating)}</div>}
          <p style={{ fontStyle: 'italic', color: '#cbd5e1', marginBottom: '1rem' }}>&quot;{props.text}&quot;</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {props.avatar && <img src={props.avatar} alt={props.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
            <div>
              <div style={{ fontWeight: 500, color: 'white' }}>{props.name}</div>
              {props.role && <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{props.role}</div>}
            </div>
          </div>
        </div>
      )
    }

    case 'price': {
      const props = element.props as { price: string; currency?: string; period?: string; description?: string; buttonText?: string; buttonUrl?: string }
      return (
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center', ...elementStyle }}>
          {props.description && <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>{props.description}</div>}
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'white' }}>
            {props.currency || 'R$'} {props.price}
            {props.period && <span style={{ color: '#94a3b8' }}>/{props.period}</span>}
          </div>
          {props.buttonText && (
            <a href={props.buttonUrl || '#'} className="inline-block rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700 transition-colors" style={{ marginTop: '1rem' }}>
              {props.buttonText}
            </a>
          )}
        </div>
      )
    }

    case 'badge': {
      const props = element.props as { text: string; variant?: string; size?: string }
      const variantStyles: Record<string, string> = {
        primary: 'bg-emerald-500/10 text-emerald-400',
        secondary: 'bg-slate-500/10 text-slate-400',
        success: 'bg-green-500/10 text-green-400',
        warning: 'bg-amber-500/10 text-amber-400',
        danger: 'bg-red-500/10 text-red-400',
      }
      const sizeStyles: Record<string, string> = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      }
      return (
        <span className={`inline-block rounded-full font-medium ${variantStyles[props.variant || 'primary']} ${sizeStyles[props.size || 'md']}`} style={elementStyle}>
          {props.text}
        </span>
      )
    }

    default:
      return null
  }
}

// ============================================================================
// SECTION RENDERER
// ============================================================================

function PreviewSection({ section }: { section: DesignerSection }) {
  const sectionStyle: React.CSSProperties = {
    backgroundColor: section.styles.backgroundColor || '#ffffff',
    backgroundImage: section.styles.backgroundGradient,
    textAlign: section.styles.alignment || 'left',
    ...getSpacingStyle(section.styles.padding, 'padding'),
  }

  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: section.styles.maxWidth || '1200px', margin: '0 auto' }}>
        {section.elements
          .sort((a, b) => a.order - b.order)
          .map((element) => (
            <div key={element.id} style={{ marginBottom: '1rem' }}>
              <PreviewElement element={element} alignment={section.styles.alignment} />
            </div>
          ))}
      </div>
    </section>
  )
}

// ============================================================================
// DEVICE PREVIEW
// ============================================================================

function DevicePreview({ page, device }: { page: DesignerPage; device: DeviceType }) {
  const widthMap: Record<DeviceType, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <div className="flex justify-center py-8">
      <div
        className="bg-white shadow-2xl overflow-auto"
        style={{
          width: widthMap[device],
          maxWidth: '100%',
          borderRadius: device !== 'desktop' ? '1rem' : 0,
          border: device !== 'desktop' ? '8px solid #1e293b' : 'none',
        }}
      >
        {page.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <PreviewSection key={section.id} section={section} />
          ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PREVIEW COMPONENT
// ============================================================================

function PreviewContent() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('id')
  const [page, setPage] = useState<DesignerPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [device, setDevice] = useState<DeviceType>('desktop')

  useEffect(() => {
    async function loadPage() {
      setIsLoading(true)
      setError(null)

      try {
        if (projectId) {
          // Try to load from Supabase
          const project = await getProject(projectId)
          if (project) {
            setPage(project.page_data)
          } else {
            // Try localStorage fallback
            const localPage = loadFromLocalStorage<DesignerPage>(DESIGNER_STORAGE_KEY)
            if (localPage) {
              setPage(localPage)
            } else {
              setError('Projeto não encontrado')
            }
          }
        } else {
          // No project ID, try localStorage
          const localPage = loadFromLocalStorage<DesignerPage>(DESIGNER_STORAGE_KEY)
          if (localPage) {
            setPage(localPage)
          } else {
            setError('Nenhum projeto especificado')
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar projeto'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadPage()
  }, [projectId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando preview...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error || 'Projeto não encontrado'}</p>
          <Link href="/designer/projects" className="text-emerald-400 hover:text-emerald-300">
            Voltar para Meus Projetos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0d1117] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/designer?id=${projectId || ''}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Voltar ao Designer</span>
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-sm font-medium text-white">Preview: {page.title}</span>
          </div>

          {/* Device toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-800/50 p-1">
            {([
              { type: 'desktop' as const, icon: Monitor, label: 'Desktop' },
              { type: 'tablet' as const, icon: Tablet, label: 'Tablet' },
              { type: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
            ]).map((d) => {
              const Icon = d.icon
              const isActive = device === d.type
              return (
                <button
                  key={d.type}
                  onClick={() => setDevice(d.type)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={d.label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{d.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Preview content */}
      <main>
        <DevicePreview page={page} device={device} />
      </main>
    </div>
  )
}

// ============================================================================
// PAGE EXPORT
// ============================================================================

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
      </div>
    }>
      <PreviewContent />
    </Suspense>
  )
}
