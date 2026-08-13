import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GenerationService, resetGenerationService } from '@/lib/ai/generation.service'
import { AIProviderFactory } from '@/lib/ai/providers/ai-provider.factory'
import { clearAllRateLimits } from '@/lib/ai/rate-limit'

describe('GenerationService', () => {
  beforeEach(() => {
    // Reset singletons and rate limits before each test
    resetGenerationService()
    AIProviderFactory.resetInstance()
    clearAllRateLimits()
  })

  describe('generate', () => {
    it('should generate a landing page from valid prompt', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'Crie uma landing page para clínica de estética',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.landingPage).toHaveProperty('id')
        expect(result.data.landingPage).toHaveProperty('title')
        expect(result.data.landingPage).toHaveProperty('sections')
        expect(result.data.landingPage).toHaveProperty('settings')
        expect(result.data.landingPage.sections.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('should fail with prompt too short', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'Short',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe('VALIDATION_ERROR')
        expect(result.error).toContain('10 caracteres')
      }
    })

    it('should fail with prompt too long', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'a'.repeat(1001),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe('VALIDATION_ERROR')
      }
    })

    it('should validate response with Zod schema', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'Gere uma landing page profissional para empresa de tecnologia',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        // Verify structure matches schema
        const { landingPage } = result.data
        expect(typeof landingPage.id).toBe('string')
        expect(typeof landingPage.title).toBe('string')
        expect(typeof landingPage.slug).toBe('string')
        expect(Array.isArray(landingPage.sections)).toBe(true)
        expect(landingPage.settings).toHaveProperty('title')
      }
    })

    it('should normalize section types', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'Crie uma landing page com hero, features e contato',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const validTypes = ['hero', 'features', 'testimonial', 'cta', 'faq', 'contact', 'pricing', 'gallery', 'about']
        result.data.landingPage.sections.forEach((section) => {
          expect(validTypes).toContain(section.type)
        })
      }
    })

    it('should ensure each section has elements', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'Crie uma landing page completa',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        result.data.landingPage.sections.forEach((section) => {
          expect(Array.isArray(section.elements)).toBe(true)
          expect(section.elements.length).toBeGreaterThanOrEqual(1)
        })
      }
    })

    it('should generate valid slugs', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'Crie uma landing page para Minha Empresa!',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const { slug } = result.data.landingPage
        expect(slug).toMatch(/^[a-z0-9-]+$/)
        expect(slug.length).toBeGreaterThan(0)
        expect(slug.length).toBeLessThanOrEqual(200)
      }
    })

    it('should respect rate limiting', async () => {
      const service = new GenerationService({ rateLimitMax: 2, rateLimitWindowMs: 60000 })
      const rateLimitKey = 'test-ip-123'

      // First two requests should pass
      const result1 = await service.generate({ prompt: 'Primeira requisição válida' }, rateLimitKey)
      expect(result1.success).toBe(true)

      const result2 = await service.generate({ prompt: 'Segunda requisição válida' }, rateLimitKey)
      expect(result2.success).toBe(true)

      // Third request should be rate limited
      const result3 = await service.generate({ prompt: 'Terceira requisição ainda válida' }, rateLimitKey)
      expect(result3.success).toBe(false)
      if (!result3.success) {
        expect(result3.code).toBe('RATE_LIMIT_EXCEEDED')
      }
    })

    it('should use style options', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: 'Crie uma landing page minimalista',
        options: { style: 'minimal' },
      })

      expect(result.success).toBe(true)
    })

    it('should trim prompt whitespace', async () => {
      const service = new GenerationService()
      const result = await service.generate({
        prompt: '   Crie uma landing page para minha empresa   ',
      })

      // Should succeed because prompt is valid after trim
      expect(result.success).toBe(true)
    })
  })
})
