import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  landingPageSchema,
  landingPageElementSchema,
  landingPageSectionSchema,
  landingPageSettingsSchema,
  generateLandingPageInputSchema,
  rawLandingPageSchema,
  sectionTypeEnum,
  elementTypeEnum,
} from '@/lib/ai/schemas'

describe('AI Generation Schemas', () => {
  // ============================================================
  // Enums
  // ============================================================

  describe('Enums', () => {
    it('should validate valid section types', () => {
      const validTypes = ['hero', 'features', 'testimonial', 'cta', 'faq', 'contact', 'pricing', 'gallery', 'about']
      validTypes.forEach((type) => {
        expect(sectionTypeEnum.safeParse(type).success).toBe(true)
      })
    })

    it('should reject invalid section type', () => {
      expect(sectionTypeEnum.safeParse('invalid').success).toBe(false)
    })

    it('should validate valid element types', () => {
      const validTypes = ['heading', 'text', 'image', 'button', 'input', 'video', 'divider', 'spacer', 'icon']
      validTypes.forEach((type) => {
        expect(elementTypeEnum.safeParse(type).success).toBe(true)
      })
    })

    it('should reject invalid element type', () => {
      expect(elementTypeEnum.safeParse('invalid').success).toBe(false)
    })
  })

  // ============================================================
  // Element Schema
  // ============================================================

  describe('landingPageElementSchema', () => {
    it('should validate a correct element', () => {
      const result = landingPageElementSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'heading',
        content: 'Título Principal',
      })
      expect(result.success).toBe(true)
    })

    it('should validate element with props', () => {
      const result = landingPageElementSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'button',
        content: 'Clique Aqui',
        props: { url: '#contato', variant: 'primary' },
      })
      expect(result.success).toBe(true)
    })

    it('should fail without id', () => {
      const result = landingPageElementSchema.safeParse({
        type: 'heading',
        content: 'Título',
      })
      expect(result.success).toBe(false)
    })

    it('should fail with invalid UUID', () => {
      const result = landingPageElementSchema.safeParse({
        id: 'not-a-uuid',
        type: 'heading',
        content: 'Título',
      })
      expect(result.success).toBe(false)
    })

    it('should fail without content', () => {
      const result = landingPageElementSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'heading',
      })
      expect(result.success).toBe(false)
    })

    it('should fail with empty content', () => {
      const result = landingPageElementSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'heading',
        content: '',
      })
      expect(result.success).toBe(false)
    })
  })

  // ============================================================
  // Section Schema
  // ============================================================

  describe('landingPageSectionSchema', () => {
    it('should validate a correct section', () => {
      const result = landingPageSectionSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'hero',
        title: 'Seção Hero',
        elements: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            type: 'heading',
            content: 'Título',
          },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('should validate section with settings', () => {
      const result = landingPageSectionSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'hero',
        title: 'Seção Hero',
        elements: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            type: 'heading',
            content: 'Título',
          },
        ],
        settings: {
          backgroundColor: 'primary',
          alignment: 'center',
          padding: 'lg',
        },
      })
      expect(result.success).toBe(true)
    })

    it('should fail without elements', () => {
      const result = landingPageSectionSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'hero',
        elements: [],
      })
      expect(result.success).toBe(false)
    })

    it('should fail with more than 50 elements', () => {
      const elements = Array.from({ length: 51 }, (_, i) => ({
        id: `550e8400-e29b-41d4-a716-44665544000${i.toString().padStart(1, '0')}`,
        type: 'text',
        content: `Element ${i}`,
      }))
      const result = landingPageSectionSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'hero',
        elements,
      })
      expect(result.success).toBe(false)
    })
  })

  // ============================================================
  // Settings Schema
  // ============================================================

  describe('landingPageSettingsSchema', () => {
    it('should validate minimal settings', () => {
      const result = landingPageSettingsSchema.safeParse({
        title: 'Minha Landing Page',
      })
      expect(result.success).toBe(true)
    })

    it('should validate full settings', () => {
      const result = landingPageSettingsSchema.safeParse({
        title: 'Minha Landing Page',
        description: 'Descrição da página',
        primaryColor: '#1e40af',
        secondaryColor: '#16a34a',
        fontFamily: 'Inter',
      })
      expect(result.success).toBe(true)
    })

    it('should fail without title', () => {
      const result = landingPageSettingsSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should fail with invalid hex color', () => {
      const result = landingPageSettingsSchema.safeParse({
        title: 'Test',
        primaryColor: 'not-a-color',
      })
      expect(result.success).toBe(false)
    })

    it('should validate valid hex colors', () => {
      const validColors = ['#000000', '#ffffff', '#1e40af', '#16a34a']
      validColors.forEach((color) => {
        const result = landingPageSettingsSchema.safeParse({
          title: 'Test',
          primaryColor: color,
        })
        expect(result.success).toBe(true)
      })
    })
  })

  // ============================================================
  // Landing Page Schema (Full)
  // ============================================================

  describe('landingPageSchema', () => {
    it('should validate a complete landing page', () => {
      const result = landingPageSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Landing Page Completa',
        slug: 'landing-page-completa',
        sections: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            type: 'hero',
            title: 'Hero Section',
            elements: [
              {
                id: '550e8400-e29b-41d4-a716-446655440002',
                type: 'heading',
                content: 'Bem-vindo',
              },
            ],
          },
        ],
        settings: {
          title: 'Landing Page',
        },
      })
      expect(result.success).toBe(true)
    })

    it('should fail without sections', () => {
      const result = landingPageSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test',
        slug: 'test',
        sections: [],
        settings: { title: 'Test' },
      })
      expect(result.success).toBe(false)
    })

    it('should fail with more than 20 sections', () => {
      const sections = Array.from({ length: 21 }, (_, i) => ({
        id: `550e8400-e29b-41d4-a716-44665544000${i}`,
        type: 'hero',
        elements: [
          {
            id: `550e8400-e29b-41d4-a716-4466554401${i.toString().padStart(2, '0')}`,
            type: 'heading',
            content: `Section ${i}`,
          },
        ],
      }))
      const result = landingPageSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test',
        slug: 'test',
        sections,
        settings: { title: 'Test' },
      })
      expect(result.success).toBe(false)
    })

    it('should fail with invalid slug format', () => {
      const result = landingPageSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Test',
        slug: 'Invalid Slug!',
        sections: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            type: 'hero',
            elements: [
              {
                id: '550e8400-e29b-41d4-a716-446655440002',
                type: 'heading',
                content: 'Test',
              },
            ],
          },
        ],
        settings: { title: 'Test' },
      })
      expect(result.success).toBe(false)
    })
  })

  // ============================================================
  // Input Schema
  // ============================================================

  describe('generateLandingPageInputSchema', () => {
    it('should validate a valid prompt', () => {
      const result = generateLandingPageInputSchema.safeParse({
        prompt: 'Crie uma landing page para minha empresa',
      })
      expect(result.success).toBe(true)
    })

    it('should validate with options', () => {
      const result = generateLandingPageInputSchema.safeParse({
        prompt: 'Crie uma landing page para minha empresa',
        options: {
          style: 'modern',
          sections: ['hero', 'features', 'cta'],
        },
      })
      expect(result.success).toBe(true)
    })

    it('should fail with prompt < 10 chars', () => {
      const result = generateLandingPageInputSchema.safeParse({
        prompt: 'Short',
      })
      expect(result.success).toBe(false)
    })

    it('should fail with prompt > 1000 chars', () => {
      const result = generateLandingPageInputSchema.safeParse({
        prompt: 'a'.repeat(1001),
      })
      expect(result.success).toBe(false)
    })

    it('should trim whitespace from prompt', () => {
      const result = generateLandingPageInputSchema.safeParse({
        prompt: '   Crie uma landing page   ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.prompt).toBe('Crie uma landing page')
      }
    })

    it('should fail with invalid style', () => {
      const result = generateLandingPageInputSchema.safeParse({
        prompt: 'Crie uma landing page',
        options: { style: 'invalid' },
      })
      expect(result.success).toBe(false)
    })
  })

  // ============================================================
  // Raw Schema (flexible for AI responses)
  // ============================================================

  describe('rawLandingPageSchema', () => {
    it('should validate flexible AI response', () => {
      const result = rawLandingPageSchema.safeParse({
        title: 'Test Page',
        sections: [
          {
            type: 'hero',
            title: 'Hero',
            elements: [
              { type: 'heading', content: 'Welcome' },
            ],
          },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('should validate minimal response', () => {
      const result = rawLandingPageSchema.safeParse({
        title: 'Test',
      })
      expect(result.success).toBe(true)
    })

    it('should validate response with text instead of content', () => {
      const result = rawLandingPageSchema.safeParse({
        sections: [
          {
            elements: [
              { type: 'heading', text: 'Welcome' },
            ],
          },
        ],
      })
      expect(result.success).toBe(true)
    })
  })
})
