import { describe, it, expect } from 'vitest'
import { serviceSchema } from '@/lib/validations/service'

describe('Service Validation', () => {
  it('should validate a correct service', () => {
    const data = {
      name: 'Cloud Hosting',
      slug: 'cloud-hosting',
      category_id: '00000000-0000-0000-0000-000000000000',
      description: 'Reliable hosting',
      features: ['24/7 Support', 'SSD Storage'],
      price: 29.99,
      position: 1,
      active: true
    }
    const result = serviceSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should allow null category_id', () => {
    const data = {
      name: 'Managed Service',
      slug: 'managed',
      category_id: null,
    }
    const result = serviceSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should coerce string numbers', () => {
    const data = {
      name: 'Test',
      slug: 'test',
      category_id: null,
      price: '50.5',
      position: '2'
    }
    const result = serviceSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.price).toBe(50.5)
      expect(result.data.position).toBe(2)
    }
  })
})
