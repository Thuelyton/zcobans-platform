import { describe, it, expect } from 'vitest'
import { MockAIProvider } from '@/lib/ai/providers/mock/mock.provider'

describe('MockAIProvider', () => {
  it('should have correct name and type', () => {
    const provider = new MockAIProvider()
    expect(provider.name).toBe('Mock')
    expect(provider.type).toBe('mock')
  })

  it('should implement IAIProvider interface', () => {
    const provider = new MockAIProvider()
    expect(typeof provider.generate).toBe('function')
  })

  it('should return a valid AI response', async () => {
    const provider = new MockAIProvider()
    const response = await provider.generate({
      messages: [{ role: 'user', content: 'Test' }],
    })

    expect(response).toHaveProperty('content')
    expect(response).toHaveProperty('tokensUsed')
    expect(response).toHaveProperty('model')
    expect(response.model).toBe('mock')
    expect(response.tokensUsed).toBe(0)
  })

  it('should return parseable JSON', async () => {
    const provider = new MockAIProvider()
    const response = await provider.generate({
      messages: [{ role: 'user', content: 'Test' }],
    })

    const parsed = JSON.parse(response.content)
    expect(parsed).toHaveProperty('id')
    expect(parsed).toHaveProperty('title')
    expect(parsed).toHaveProperty('sections')
    expect(parsed).toHaveProperty('settings')
  })

  it('should return landing page with valid structure', async () => {
    const provider = new MockAIProvider()
    const response = await provider.generate({
      messages: [{ role: 'user', content: 'Test' }],
    })

    const landingPage = JSON.parse(response.content)

    // Check sections exist and have elements
    expect(Array.isArray(landingPage.sections)).toBe(true)
    expect(landingPage.sections.length).toBeGreaterThanOrEqual(1)

    // Check first section has elements
    const firstSection = landingPage.sections[0]
    expect(firstSection).toHaveProperty('id')
    expect(firstSection).toHaveProperty('type')
    expect(Array.isArray(firstSection.elements)).toBe(true)
    expect(firstSection.elements.length).toBeGreaterThanOrEqual(1)

    // Check settings
    expect(landingPage.settings).toHaveProperty('title')
  })

  it('should return consistent results on multiple calls', async () => {
    const provider = new MockAIProvider()

    const response1 = await provider.generate({
      messages: [{ role: 'user', content: 'Test' }],
    })
    const response2 = await provider.generate({
      messages: [{ role: 'user', content: 'Test' }],
    })

    const page1 = JSON.parse(response1.content)
    const page2 = JSON.parse(response2.content)

    // Same structure but different IDs
    expect(page1.title).toBe(page2.title)
    expect(page1.sections.length).toBe(page2.sections.length)
    expect(page1.id).not.toBe(page2.id) // Different UUIDs
  })

  it('should have delay to simulate real API', async () => {
    const provider = new MockAIProvider()
    const start = Date.now()

    await provider.generate({
      messages: [{ role: 'user', content: 'Test' }],
    })

    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(40) // At least ~50ms delay
  })
})
