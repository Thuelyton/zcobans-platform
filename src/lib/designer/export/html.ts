/**
 * HTML Exporter
 * ZCobans Visual Designer
 *
 * Exporta a página do Designer para HTML independente.
 * Inclui CSS responsivo para Desktop, Tablet e Mobile.
 */

import type { DesignerPage, DesignerSection, DesignerElement, ElementProps, ElementStyles, Spacing } from '../types'

// ============================================================================
// HTML ESCAPING
// ============================================================================

/**
 * Escapa caracteres HTML perigosos
 */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Valida URL para prevenir XSS
 */
function sanitizeURL(url: string): string {
  // Only allow http, https, and relative URLs
  if (/^(https?:\/\/|\/|#)/i.test(url)) {
    return escapeHTML(url)
  }
  return '#'
}

// ============================================================================
// CSS GENERATION
// ============================================================================

/**
 * Converte Spacing para CSS
 */
function spacingToCSS(spacing: Spacing | undefined, property: string): string {
  if (!spacing) return ''
  return `
    ${property}-top: ${spacing.top};
    ${property}-bottom: ${spacing.bottom};
    ${property}-left: ${spacing.left};
    ${property}-right: ${spacing.right};`
}

/**
 * Converte estilos de elemento para CSS inline
 */
function elementStylesToCSS(styles: ElementStyles | Record<string, unknown>): string {
  const css: string[] = []
  
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
    css.push(`font-size: ${fontSizeMap[styles.fontSize as string] || '1rem'};`)
  }
  
  if (styles.fontWeight) {
    const fontWeightMap: Record<string, string> = {
      'font-normal': '400',
      'font-medium': '500',
      'font-semibold': '600',
      'font-bold': '700',
    }
    css.push(`font-weight: ${fontWeightMap[styles.fontWeight as string] || '400'};`)
  }
  
  if (styles.color) css.push(`color: ${styles.color};`)
  if (styles.backgroundColor) css.push(`background-color: ${styles.backgroundColor};`)
  if (styles.borderRadius) css.push(`border-radius: ${styles.borderRadius};`)
  if (styles.maxWidth) css.push(`max-width: ${styles.maxWidth};`)
  if (styles.alignment) css.push(`text-align: ${styles.alignment};`)
  
  if (styles.padding) {
    css.push(spacingToCSS(styles.padding as Spacing, 'padding'))
  }
  
  if (styles.margin) {
    css.push(spacingToCSS(styles.margin as Spacing, 'margin'))
  }
  
  return css.join('\n    ')
}

// ============================================================================
// ELEMENT RENDERING
// ============================================================================

/**
 * Renderiza um elemento para HTML
 */
function renderElement(element: DesignerElement): string {
  const style = elementStylesToCSS(element.styles)
  const styleAttr = style ? ` style="${style.replace(/\n\s+/g, ' ').trim()}"` : ''
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = element.props as any
  
  switch (element.type) {
    case 'heading': {
      const level = (props.level as string) || 'h2'
      const text = escapeHTML((props.text as string) || '')
      return `<${level}${styleAttr}>${text}</${level}>`
    }
    
    case 'text': {
      const text = escapeHTML((props.text as string) || '')
      return `<p${styleAttr}>${text}</p>`
    }
    
    case 'button': {
      const text = escapeHTML((props.text as string) || '')
      const url = sanitizeURL((props.url as string) || '#')
      const variant = (props.variant as string) || 'primary'
      
      const variantClasses: Record<string, string> = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
      }
      
      const className = variantClasses[variant] || 'btn-primary'
      
      return `<a href="${url}" class="btn ${className}"${styleAttr}>${text}</a>`
    }
    
    case 'image': {
      const url = sanitizeURL((props.url as string) || '')
      const alt = escapeHTML((props.alt as string) || '')
      return `<img src="${url}" alt="${alt}" class="responsive-img"${styleAttr} />`
    }
    
    default:
      return ''
  }
}

// ============================================================================
// SECTION RENDERING
// ============================================================================

/**
 * Renderiza uma seção para HTML
 */
function renderSection(section: DesignerSection): string {
  const sectionStyle: Record<string, unknown> = {
    backgroundColor: section.styles.backgroundColor,
    backgroundImage: section.styles.backgroundGradient,
    textAlign: section.styles.alignment,
  }
  
  if (section.styles.padding) {
    sectionStyle.paddingTop = section.styles.padding.top
    sectionStyle.paddingBottom = section.styles.padding.bottom
    sectionStyle.paddingLeft = section.styles.padding.left
    sectionStyle.paddingRight = section.styles.padding.right
  }
  
  const style = elementStylesToCSS(sectionStyle)
  const styleAttr = style ? ` style="${style.replace(/\n\s+/g, ' ').trim()}"` : ''
  
  const elements = section.elements
    .sort((a, b) => a.order - b.order)
    .map(el => `      ${renderElement(el)}`)
    .join('\n')
  
  return `    <section class="section section-${section.type}" data-section-id="${section.id}"${styleAttr}>
      <div class="section-content">
${elements}
      </div>
    </section>`
}

// ============================================================================
// CSS TEMPLATE
// ============================================================================

const CSS_TEMPLATE = `
/* ZCobans Visual Designer - Exported Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  line-height: 1.6;
  color: #1e293b;
}

/* Sections */
.section {
  width: 100%;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #059669;
  color: white;
}

.btn-primary:hover {
  background-color: #047857;
}

.btn-secondary {
  background-color: #334155;
  color: white;
}

.btn-secondary:hover {
  background-color: #475569;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid currentColor;
  color: inherit;
}

.btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-ghost {
  background-color: transparent;
  color: inherit;
}

.btn-ghost:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Images */
.responsive-img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

/* Typography */
h1 { font-size: 3rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
h3 { font-size: 1.875rem; font-weight: 600; line-height: 1.2; }
h4 { font-size: 1.5rem; font-weight: 600; line-height: 1.2; }

/* Responsive */
@media (max-width: 768px) {
  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  
  .section-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 375px) {
  h1 { font-size: 1.875rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
  h4 { font-size: 1.125rem; }
}
`

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Exporta a página para HTML completo
 */
export function exportToHTML(page: DesignerPage): string {
  const sections = page.sections
    .sort((a, b) => a.order - b.order)
    .map(section => renderSection(section))
    .join('\n\n')
  
  const title = escapeHTML(page.title)
  const description = page.description ? escapeHTML(page.description) : ''
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${description ? `<meta name="description" content="${description}">` : ''}
  <style>${CSS_TEMPLATE}</style>
</head>
<body>
  <main class="landing-page" data-page-id="${page.id}">
${sections}
  </main>
</body>
</html>`
}

/**
 * Valida se o HTML gerado é seguro
 */
export function validateHTML(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check for script tags
  if (/<script[\s>]/i.test(html)) {
    errors.push('Script tags are not allowed')
  }
  
  // Check for event handlers
  if (/on\w+\s*=/i.test(html)) {
    errors.push('Event handlers are not allowed')
  }
  
  // Check for javascript: URLs
  if (/javascript:/i.test(html)) {
    errors.push('JavaScript URLs are not allowed')
  }
  
  // Check for data: URLs (potential XSS)
  if (/data:text\/html/i.test(html)) {
    errors.push('Data URLs with HTML content are not allowed')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
