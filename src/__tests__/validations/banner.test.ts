import { describe, it, expect } from 'vitest'
import { bannerSchema } from '@/lib/validations/banner'

describe('Banner Validation', () => {
  it('should validate a correct banner', () => {
    const data = {
      title: 'Promoção Verão',
      image_url: 'https://example.com/image.jpg',
      position: 1,
      active: true,
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should validate a banner without dates', () => {
    const data = {
      title: 'Banner sem datas',
      image_url: 'https://example.com/image.jpg',
      starts_at: null,
      ends_at: null,
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should validate a banner with empty date strings', () => {
    const data = {
      title: 'Banner com datas vazias',
      image_url: 'https://example.com/image.jpg',
      starts_at: '',
      ends_at: '',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should validate a banner with valid dates', () => {
    const data = {
      title: 'Banner com datas',
      image_url: 'https://example.com/image.jpg',
      starts_at: '2024-01-01T00:00:00.000Z',
      ends_at: '2024-12-31T23:59:59.000Z',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should validate a banner with only starts_at', () => {
    const data = {
      title: 'Banner com início',
      image_url: 'https://example.com/image.jpg',
      starts_at: '2024-01-01T00:00:00.000Z',
      ends_at: null,
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should validate a banner with only ends_at', () => {
    const data = {
      title: 'Banner com término',
      image_url: 'https://example.com/image.jpg',
      starts_at: null,
      ends_at: '2024-12-31T23:59:59.000Z',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should fail if starts_at is after ends_at', () => {
    const data = {
      title: 'Banner com datas invertidas',
      image_url: 'https://example.com/image.jpg',
      starts_at: '2024-12-31T23:59:59.000Z',
      ends_at: '2024-01-01T00:00:00.000Z',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Data de início deve ser anterior à data de término')
    }
  })

  it('should fail with invalid starts_at format', () => {
    const data = {
      title: 'Banner com data inválida',
      image_url: 'https://example.com/image.jpg',
      starts_at: 'not-a-date',
      ends_at: null,
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Data inválida')
    }
  })

  it('should fail with invalid ends_at format', () => {
    const data = {
      title: 'Banner com data inválida',
      image_url: 'https://example.com/image.jpg',
      starts_at: null,
      ends_at: 'invalid-date-format',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Data inválida')
    }
  })

  it('should fail if title is missing', () => {
    const data = {
      image_url: 'https://example.com/image.jpg',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title')
    }
  })

  it('should fail with invalid URL', () => {
    const data = {
      title: 'Test',
      image_url: 'not-a-url',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('image_url')
    }
  })

  it('should fail if title exceeds 255 characters', () => {
    const data = {
      title: 'a'.repeat(256),
      image_url: 'https://example.com/image.jpg',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Título deve ter no máximo 255 caracteres')
    }
  })

  it('should fail if subtitle exceeds 255 characters', () => {
    const data = {
      title: 'Test',
      image_url: 'https://example.com/image.jpg',
      subtitle: 'a'.repeat(256),
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Subtítulo deve ter no máximo 255 caracteres')
    }
  })

  it('should fail if button_text exceeds 100 characters', () => {
    const data = {
      title: 'Test',
      image_url: 'https://example.com/image.jpg',
      button_text: 'a'.repeat(101),
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Texto do botão deve ter no máximo 100 caracteres')
    }
  })

  it('should fail if position is negative', () => {
    const data = {
      title: 'Test',
      image_url: 'https://example.com/image.jpg',
      position: -1,
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Posição deve ser positiva')
    }
  })

  it('should accept valid dates in different formats', () => {
    const validDates = [
      '2024-01-01',
      '2024-01-01T00:00:00',
      '2024-01-01T00:00:00.000Z',
      '2024-01-01T12:30:00.000Z',
    ]

    for (const date of validDates) {
      const data = {
        title: 'Test',
        image_url: 'https://example.com/image.jpg',
        starts_at: date,
        ends_at: null,
      }
      const result = bannerSchema.safeParse(data)
      expect(result.success).toBe(true)
    }
  })

  it('should validate with all optional fields', () => {
    const data = {
      title: 'Banner completo',
      subtitle: 'Subtítulo do banner',
      image_url: 'https://example.com/image.jpg',
      link_url: 'https://example.com',
      button_text: 'Clique aqui',
      position: 5,
      active: true,
      starts_at: '2024-01-01T00:00:00.000Z',
      ends_at: '2024-12-31T23:59:59.000Z',
    }
    const result = bannerSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})
