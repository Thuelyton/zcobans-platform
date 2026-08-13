import { describe, it, expect } from 'vitest'
import { generateSlug, isValidSlug } from '@/lib/slug'

describe('Slug Utilities', () => {
  describe('generateSlug', () => {
    it('should generate a valid slug from a simple name', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
    })

    it('should convert to lowercase', () => {
      expect(generateSlug('HELLO WORLD')).toBe('hello-world')
    })

    it('should handle names with spaces', () => {
      expect(generateSlug('Multiple   Spaces   Here')).toBe('multiple-spaces-here')
    })

    it('should handle names with accents', () => {
      expect(generateSlug('Serviço de Qualidade')).toBe('servico-de-qualidade')
      expect(generateSlug('Café com Açúcar')).toBe('cafe-com-acucar')
      expect(generateSlug('João da Silva')).toBe('joao-da-silva')
    })

    it('should remove special characters', () => {
      expect(generateSlug('Hello! @World# $Test%')).toBe('hello-world-test')
    })

    it('should handle multiple hyphens', () => {
      expect(generateSlug('Hello---World')).toBe('hello-world')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(generateSlug('-Hello World-')).toBe('hello-world')
    })

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('')
    })

    it('should handle null/undefined', () => {
      expect(generateSlug(null as unknown as string)).toBe('')
      expect(generateSlug(undefined as unknown as string)).toBe('')
    })

    it('should handle string with only special characters', () => {
      expect(generateSlug('!@#$%^&*()')).toBe('')
    })

    it('should handle mixed content', () => {
      expect(generateSlug('Serviço 100% Profissional!')).toBe('servico-100-profissional')
    })

    it('should handle Portuguese characters', () => {
      expect(generateSlug('São Paulo')).toBe('sao-paulo')
      expect(generateSlug('Florianópolis')).toBe('florianopolis')
      expect(generateSlug('Niterói')).toBe('niteroi')
    })

    it('should handle numbers', () => {
      expect(generateSlug('Product 123')).toBe('product-123')
      expect(generateSlug('123 Product')).toBe('123-product')
    })

    it('should handle already valid slug', () => {
      expect(generateSlug('hello-world')).toBe('hello-world')
    })

    it('should trim whitespace', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world')
    })
  })

  describe('isValidSlug', () => {
    it('should validate a correct slug', () => {
      expect(isValidSlug('hello-world')).toBe(true)
    })

    it('should validate slug with numbers', () => {
      expect(isValidSlug('hello-world-123')).toBe(true)
    })

    it('should reject empty slug', () => {
      expect(isValidSlug('')).toBe(false)
    })

    it('should reject slug with uppercase', () => {
      expect(isValidSlug('Hello-World')).toBe(false)
    })

    it('should reject slug with spaces', () => {
      expect(isValidSlug('hello world')).toBe(false)
    })

    it('should reject slug with special characters', () => {
      expect(isValidSlug('hello!world')).toBe(false)
      expect(isValidSlug('hello@world')).toBe(false)
    })

    it('should reject slug starting with hyphen', () => {
      expect(isValidSlug('-hello-world')).toBe(false)
    })

    it('should reject slug ending with hyphen', () => {
      expect(isValidSlug('hello-world-')).toBe(false)
    })

    it('should reject slug with consecutive hyphens', () => {
      expect(isValidSlug('hello--world')).toBe(false)
    })

    it('should reject null/undefined', () => {
      expect(isValidSlug(null as unknown as string)).toBe(false)
      expect(isValidSlug(undefined as unknown as string)).toBe(false)
    })

    it('should reject slug with accents', () => {
      expect(isValidSlug('serviço')).toBe(false)
    })

    it('should validate single word slug', () => {
      expect(isValidSlug('hello')).toBe(true)
    })

    it('should validate slug with only numbers', () => {
      expect(isValidSlug('123')).toBe(true)
    })
  })
})
