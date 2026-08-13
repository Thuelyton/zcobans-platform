import { describe, it, expect } from 'vitest'
import {
  SECTION_TEMPLATES,
  getSectionTemplate,
  createSectionFromTemplate,
  createDefaultPage,
} from '@/lib/designer/templates'
import type { SectionType } from '@/lib/designer/types'

describe('Designer Templates', () => {
  describe('SECTION_TEMPLATES', () => {
    it('should have templates for all section types', () => {
      expect(SECTION_TEMPLATES).toBeDefined()
      expect(SECTION_TEMPLATES.length).toBe(7)
    })

    it('should have hero template', () => {
      const hero = SECTION_TEMPLATES.find((t) => t.type === 'hero')
      expect(hero).toBeDefined()
      expect(hero?.name).toBe('Hero')
      expect(hero?.defaultElements.length).toBeGreaterThan(0)
    })

    it('should have features template', () => {
      const features = SECTION_TEMPLATES.find((t) => t.type === 'features')
      expect(features).toBeDefined()
      expect(features?.name).toBe('Features')
    })

    it('should have cta template', () => {
      const cta = SECTION_TEMPLATES.find((t) => t.type === 'cta')
      expect(cta).toBeDefined()
      expect(cta?.name).toBe('Call to Action')
    })
  })

  describe('getSectionTemplate', () => {
    it('should return template for valid type', () => {
      const hero = getSectionTemplate('hero')
      expect(hero).toBeDefined()
      expect(hero?.type).toBe('hero')
    })

    it('should return undefined for invalid type', () => {
      const invalid = getSectionTemplate('invalid' as SectionType)
      expect(invalid).toBeUndefined()
    })
  })

  describe('createSectionFromTemplate', () => {
    it('should create a section from template', () => {
      const section = createSectionFromTemplate('hero', 0)
      
      expect(section).toBeDefined()
      expect(section.id).toBeDefined()
      expect(section.type).toBe('hero')
      expect(section.order).toBe(0)
      expect(section.title).toBe('Hero')
      expect(section.elements).toBeDefined()
      expect(section.elements.length).toBeGreaterThan(0)
      expect(section.styles).toBeDefined()
    })

    it('should create section with unique IDs', () => {
      const section1 = createSectionFromTemplate('hero', 0)
      const section2 = createSectionFromTemplate('hero', 1)
      
      expect(section1.id).not.toBe(section2.id)
      expect(section1.elements[0].id).not.toBe(section2.elements[0].id)
    })

    it('should create section with correct order', () => {
      const section = createSectionFromTemplate('features', 5)
      expect(section.order).toBe(5)
    })

    it('should create fallback section for unknown type', () => {
      const section = createSectionFromTemplate('unknown' as SectionType, 0)
      
      expect(section).toBeDefined()
      expect(section.id).toBeDefined()
      expect(section.type).toBe('unknown')
      expect(section.elements.length).toBeGreaterThan(0)
    })
  })

  describe('createDefaultPage', () => {
    it('should create a default page', () => {
      const page = createDefaultPage()
      
      expect(page).toBeDefined()
      expect(page.id).toBeDefined()
      expect(page.title).toBe('Minha Landing Page')
      expect(page.slug).toBe('minha-landing-page')
      expect(page.sections).toBeDefined()
      expect(page.sections.length).toBe(3)
      expect(page.settings).toBeDefined()
      expect(page.metadata).toBeDefined()
    })

    it('should create page with hero, features, and cta sections', () => {
      const page = createDefaultPage()
      
      const sectionTypes = page.sections.map((s) => s.type)
      expect(sectionTypes).toContain('hero')
      expect(sectionTypes).toContain('features')
      expect(sectionTypes).toContain('cta')
    })

    it('should create page with valid metadata', () => {
      const page = createDefaultPage()
      
      expect(page.metadata.createdAt).toBeDefined()
      expect(page.metadata.updatedAt).toBeDefined()
      expect(page.metadata.version).toBe(1)
    })
  })
})
