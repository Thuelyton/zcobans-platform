import { describe, it, expect } from 'vitest'
import { categorySchema } from '@/lib/validations/category'

describe('Category Validation', () => {
  it('should validate a correct category', () => {
    const data = {
      name: 'Hospedagem',
      slug: 'hospedagem',
      active: true
    }
    const result = categorySchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should fail if slug is too short', () => {
    const data = {
      name: 'Test',
      slug: '',
    }
    const result = categorySchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
