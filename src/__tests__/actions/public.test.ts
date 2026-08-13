import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLead, getPublicServiceBySlug } from '@/app/(public)/actions'

// Mock Supabase client
const mockSingle = vi.fn()
const mockInsert = vi.fn()

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
        single: mockSingle,
      }),
      order: vi.fn().mockReturnValue({
        single: mockSingle,
      }),
      single: mockSingle,
    }),
    insert: mockInsert,
  })),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}))

describe('Public Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createLead', () => {
    it('should create a lead with valid data', async () => {
      mockInsert.mockResolvedValue({ error: null })

      const result = await createLead({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+5511999999999',
        company: 'Test Company',
        message: 'Test message',
        source: 'website',
      })

      expect(result.success).toBe(true)
    })

    it('should fail with invalid data', async () => {
      const result = await createLead({
        name: '',
        email: 'invalid-email',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe('VALIDATION_ERROR')
      }
    })

    it('should fail with invalid email', async () => {
      const result = await createLead({
        name: 'John Doe',
        email: 'not-an-email',
      })

      expect(result.success).toBe(false)
    })

    it('should fail with database error', async () => {
      mockInsert.mockResolvedValue({ error: { message: 'Database error' } })

      const result = await createLead({
        name: 'John Doe',
        email: 'john@example.com',
      })

      expect(result.success).toBe(false)
    })

    it('should accept optional fields as null', async () => {
      mockInsert.mockResolvedValue({ error: null })

      const result = await createLead({
        name: 'John Doe',
        email: 'john@example.com',
        phone: null,
        company: null,
        message: null,
        source: null,
      })

      expect(result.success).toBe(true)
    })

    it('should accept empty optional fields', async () => {
      mockInsert.mockResolvedValue({ error: null })

      const result = await createLead({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        company: '',
        message: '',
        source: '',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('getPublicServiceBySlug', () => {
    it('should return service for valid slug', async () => {
      const mockService = { id: '1', name: 'Service 1', slug: 'service-1' }
      mockSingle.mockResolvedValue({ data: mockService, error: null })

      const result = await getPublicServiceBySlug('service-1')
      expect(result.success).toBe(true)
    })

    it('should return error for invalid slug', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      const result = await getPublicServiceBySlug('invalid-slug')
      expect(result.success).toBe(false)
    })
  })
})
