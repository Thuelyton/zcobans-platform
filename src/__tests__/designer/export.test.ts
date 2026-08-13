import { describe, it, expect } from 'vitest'
import { 
  exportToJSON, 
  exportToJSONString, 
  isValidExportedJSON 
} from '@/lib/designer/export/json'
import { 
  exportToHTML, 
  validateHTML 
} from '@/lib/designer/export/html'
import { createDefaultPage, createSectionFromTemplate } from '@/lib/designer/templates'
import type { DesignerPage } from '@/lib/designer/types'

describe('JSON Export', () => {
  describe('exportToJSON', () => {
    it('should export page with version', () => {
      const page = createDefaultPage()
      const exported = exportToJSON(page)
      
      expect(exported.version).toBe('1.0')
      expect(exported.exportedAt).toBeDefined()
      expect(exported.page).toBeDefined()
    })

    it('should preserve page data', () => {
      const page = createDefaultPage()
      const exported = exportToJSON(page)
      
      expect(exported.page.id).toBe(page.id)
      expect(exported.page.title).toBe(page.title)
      expect(exported.page.sections).toHaveLength(page.sections.length)
    })

    it('should update metadata', () => {
      const page = createDefaultPage()
      const exported = exportToJSON(page)
      
      expect(exported.page.metadata.updatedAt).toBeDefined()
    })
  })

  describe('exportToJSONString', () => {
    it('should return valid JSON string', () => {
      const page = createDefaultPage()
      const jsonString = exportToJSONString(page)
      
      expect(() => JSON.parse(jsonString)).not.toThrow()
    })

    it('should be formatted with indentation', () => {
      const page = createDefaultPage()
      const jsonString = exportToJSONString(page)
      
      // Should have newlines and spaces from formatting
      expect(jsonString).toContain('\n')
      expect(jsonString).toContain('  ')
    })
  })

  describe('isValidExportedJSON', () => {
    it('should validate correct exported JSON', () => {
      const page = createDefaultPage()
      const exported = exportToJSON(page)
      
      expect(isValidExportedJSON(exported)).toBe(true)
    })

    it('should reject invalid data', () => {
      expect(isValidExportedJSON(null)).toBe(false)
      expect(isValidExportedJSON({})).toBe(false)
      expect(isValidExportedJSON({ version: '1.0' })).toBe(false)
    })

    it('should reject JSON without required page fields', () => {
      const invalid = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        page: {
          id: '123',
          // missing title, slug, etc.
        }
      }
      
      expect(isValidExportedJSON(invalid)).toBe(false)
    })
  })
})

describe('HTML Export', () => {
  describe('exportToHTML', () => {
    it('should export valid HTML document', () => {
      const page = createDefaultPage()
      const html = exportToHTML(page)
      
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('</html>')
      expect(html).toContain('<head>')
      expect(html).toContain('<body>')
    })

    it('should include page title', () => {
      const page = createDefaultPage()
      const html = exportToHTML(page)
      
      expect(html).toContain(`<title>${page.title}</title>`)
    })

    it('should include responsive meta tag', () => {
      const page = createDefaultPage()
      const html = exportToHTML(page)
      
      expect(html).toContain('viewport')
      expect(html).toContain('width=device-width')
    })

    it('should include sections', () => {
      const page = createDefaultPage()
      const html = exportToHTML(page)
      
      page.sections.forEach(section => {
        expect(html).toContain(`data-section-id="${section.id}"`)
      })
    })

    it('should include CSS', () => {
      const page = createDefaultPage()
      const html = exportToHTML(page)
      
      expect(html).toContain('<style>')
      expect(html).toContain('.section')
      expect(html).toContain('.btn')
    })

    it('should escape HTML in text content', () => {
      const page = createDefaultPage()
      const section = page.sections[0]
      
      // Add element with special characters
      section.elements[0].props = { text: '<script>alert("xss")</script>', level: 'h1' }
      
      const html = exportToHTML(page)
      
      expect(html).not.toContain('<script>alert')
      expect(html).toContain('&lt;script&gt;')
    })

    it('should sanitize URLs', () => {
      const page = createDefaultPage()
      
      // Add button with malicious URL
      const section = page.sections.find(s => s.type === 'hero')
      if (section) {
        const button = section.elements.find(e => e.type === 'button')
        if (button) {
          button.props = { 
            text: 'Click', 
            url: 'javascript:alert("xss")',
            variant: 'primary'
          }
        }
      }
      
      const html = exportToHTML(page)
      
      expect(html).not.toContain('javascript:')
      expect(html).toContain('href="#"')
    })

    it('should preserve colors', () => {
      const page = createDefaultPage()
      const html = exportToHTML(page)
      
      // Check if section background colors are included
      page.sections.forEach(section => {
        if (section.styles.backgroundColor) {
          expect(html).toContain(section.styles.backgroundColor)
        }
      })
    })
  })

  describe('validateHTML', () => {
    it('should validate safe HTML', () => {
      const safeHTML = '<html><body><p>Hello</p></body></html>'
      const result = validateHTML(safeHTML)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect script tags', () => {
      const unsafeHTML = '<html><body><script>alert("xss")</script></body></html>'
      const result = validateHTML(unsafeHTML)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Script tags are not allowed')
    })

    it('should detect event handlers', () => {
      const unsafeHTML = '<html><body><img onerror="alert(1)"></body></html>'
      const result = validateHTML(unsafeHTML)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Event handlers are not allowed')
    })

    it('should detect javascript: URLs', () => {
      const unsafeHTML = '<html><body><a href="javascript:alert(1)">Click</a></body></html>'
      const result = validateHTML(unsafeHTML)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('JavaScript URLs are not allowed')
    })
  })
})

describe('Export Integration', () => {
  it('should export page with multiple sections', () => {
    const page = createDefaultPage()
    
    // Add more sections
    page.sections.push(createSectionFromTemplate('about', page.sections.length))
    page.sections.push(createSectionFromTemplate('contact', page.sections.length))
    
    const html = exportToHTML(page)
    const json = exportToJSON(page)
    
    expect(html).toContain('data-section-id')
    expect(json.page.sections.length).toBe(5)
  })

  it('should preserve section order', () => {
    const page = createDefaultPage()
    const originalOrder = page.sections.map(s => s.id)
    
    const html = exportToHTML(page)
    
    // Check that sections appear in order in HTML
    let lastIndex = -1
    originalOrder.forEach(id => {
      const index = html.indexOf(`data-section-id="${id}"`)
      expect(index).toBeGreaterThan(lastIndex)
      lastIndex = index
    })
  })
})
