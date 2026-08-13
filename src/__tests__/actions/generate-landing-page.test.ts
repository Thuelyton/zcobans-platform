import { describe, it, expect, beforeEach } from 'vitest'
import { generateLandingPage } from '@/app/(public)/actions'
import { AIProviderFactory } from '@/lib/ai/providers/ai-provider.factory'
import { resetGenerationService } from '@/lib/ai/generation.service'

describe('generateLandingPage Server Action', () => {
  beforeEach(() => {
    // Reset singletons before each test
    AIProviderFactory.resetInstance()
    resetGenerationService()
  })

  it('should generate a landing page with valid prompt', async () => {
    const result = await generateLandingPage({
      prompt: 'Crie uma landing page para clínica de estética',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveProperty('landingPage')
      expect(result.data.landingPage).toHaveProperty('id')
      expect(result.data.landingPage).toHaveProperty('title')
      expect(result.data.landingPage).toHaveProperty('sections')
      expect(result.data.landingPage).toHaveProperty('settings')
    }
  })

  it('should fail with prompt too short', async () => {
    const result = await generateLandingPage({
      prompt: 'Short',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe('VALIDATION_ERROR')
      expect(result.error).toContain('10 caracteres')
    }
  })

  it('should fail with empty prompt', async () => {
    const result = await generateLandingPage({
      prompt: '',
    })

    expect(result.success).toBe(false)
  })

  it('should fail with prompt exceeding max length', async () => {
    const result = await generateLandingPage({
      prompt: 'a'.repeat(1001),
    })

    expect(result.success).toBe(false)
  })

  it('should accept valid options', async () => {
    const result = await generateLandingPage({
      prompt: 'Crie uma landing page para minha empresa',
      options: {
        style: 'modern',
        sections: ['hero', 'features', 'cta'],
      },
    })

    expect(result.success).toBe(true)
  })

  it('should fail with invalid style option', async () => {
    const result = await generateLandingPage({
      prompt: 'Crie uma landing page para minha empresa',
      options: {
        style: 'invalid' as 'modern',
      },
    })

    expect(result.success).toBe(false)
  })

  it('should return landing page with valid structure', async () => {
    const result = await generateLandingPage({
      prompt: 'Gere uma landing page profissional para empresa de tecnologia',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      const { landingPage } = result.data

      // Verify required fields
      expect(typeof landingPage.id).toBe('string')
      expect(typeof landingPage.title).toBe('string')
      expect(typeof landingPage.slug).toBe('string')
      expect(Array.isArray(landingPage.sections)).toBe(true)
      expect(landingPage.sections.length).toBeGreaterThanOrEqual(1)
      expect(landingPage.settings).toHaveProperty('title')

      // Verify sections have elements
      landingPage.sections.forEach((section) => {
        expect(section.elements.length).toBeGreaterThanOrEqual(1)
      })
    }
  })

  it('should include token usage in result', async () => {
    const result = await generateLandingPage({
      prompt: 'Crie uma landing page simples',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      // tokensUsed should be present (0 for mock)
      expect(result.data).toHaveProperty('tokensUsed')
      expect(result.data).toHaveProperty('model')
    }
  })

  it('should trim prompt before processing', async () => {
    const result = await generateLandingPage({
      prompt: '   Crie uma landing page para minha empresa   ',
    })

    // Should succeed because prompt is valid after trim
    expect(result.success).toBe(true)
  })

  it('should handle multiple concurrent requests', async () => {
    const promises = [
      generateLandingPage({ prompt: 'Primeira landing page para teste' }),
      generateLandingPage({ prompt: 'Segunda landing page para teste' }),
      generateLandingPage({ prompt: 'Terceira landing page para teste' }),
    ]

    const results = await Promise.all(promises)

    results.forEach((result) => {
      expect(result.success).toBe(true)
    })
  })
})
