import { describe, it, expect } from 'vitest'
import {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  leadInsertSchema,
  leadUpdateSchema,
  leadStatusEnum,
} from '@/lib/validations/lead'

describe('Lead Validation', () => {
  describe('createLeadSchema', () => {
    it('should validate a correct lead', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '+55 11 99999-9999',
        company: 'Empresa ABC',
        message: 'Interessado nos serviços',
        source: 'website',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate a minimal lead with only required fields', () => {
      const data = {
        name: 'Maria Santos',
        email: 'maria@example.com',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail if name is missing', () => {
      const data = {
        email: 'test@example.com',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name')
      }
    })

    it('should fail if name is empty string', () => {
      const data = {
        name: '',
        email: 'test@example.com',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome é obrigatório')
      }
    })

    it('should fail if email is missing', () => {
      const data = {
        name: 'Test User',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email')
      }
    })

    it('should fail with invalid email', () => {
      const data = {
        name: 'Test User',
        email: 'not-an-email',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })

    it('should fail with email without @', () => {
      const data = {
        name: 'Test User',
        email: 'testexample.com',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail with invalid phone format', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        phone: 'abc123!@#',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Telefone inválido')
      }
    })

    it('should accept valid phone formats', () => {
      const validPhones = [
        '+55 11 99999-9999',
        '(11) 99999-9999',
        '11999999999',
        '+1-555-123-4567',
        '555 123 4567',
      ]

      for (const phone of validPhones) {
        const data = {
          name: 'Test User',
          email: 'test@example.com',
          phone,
        }
        const result = createLeadSchema.safeParse(data)
        expect(result.success).toBe(true)
      }
    })

    it('should accept empty phone', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept null phone', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        phone: null,
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail if name exceeds 255 characters', () => {
      const data = {
        name: 'a'.repeat(256),
        email: 'test@example.com',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome deve ter no máximo 255 caracteres')
      }
    })

    it('should fail if email exceeds 255 characters', () => {
      const data = {
        name: 'Test User',
        email: 'a'.repeat(246) + '@example.com',
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail if message exceeds 5000 characters', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'a'.repeat(5001),
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mensagem deve ter no máximo 5000 caracteres')
      }
    })

    it('should accept optional fields as undefined', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        phone: undefined,
        company: undefined,
        message: undefined,
        source: undefined,
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept optional fields as null', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        phone: null,
        company: null,
        message: null,
        source: null,
      }
      const result = createLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('updateLeadSchema', () => {
    it('should validate a correct update', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        email: 'joao@example.com',
        status: 'contacted',
      }
      const result = updateLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail with invalid UUID', () => {
      const data = {
        id: 'invalid-uuid',
        name: 'Test User',
      }
      const result = updateLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID inválido')
      }
    })

    it('should accept partial updates', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'qualified',
      }
      const result = updateLeadSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail with invalid status', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'invalid-status',
      }
      const result = updateLeadSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('updateLeadStatusSchema', () => {
    it('should validate a correct status update', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'new',
      }
      const result = updateLeadStatusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate all valid statuses', () => {
      const validStatuses = ['new', 'contacted', 'qualified', 'closed']

      for (const status of validStatuses) {
        const data = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          status,
        }
        const result = updateLeadStatusSchema.safeParse(data)
        expect(result.success).toBe(true)
      }
    })

    it('should fail with invalid status', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'pending',
      }
      const result = updateLeadStatusSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should fail without required fields', () => {
      const data = {}
      const result = updateLeadStatusSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('leadInsertSchema', () => {
    it('should validate a correct insert', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@example.com',
        status: 'new',
      }
      const result = leadInsertSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should apply default status', () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
      }
      const result = leadInsertSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('new')
      }
    })
  })

  describe('leadUpdateSchema', () => {
    it('should validate a correct update', () => {
      const data = {
        name: 'Updated Name',
        status: 'contacted',
      }
      const result = leadUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept empty update', () => {
      const data = {}
      const result = leadUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('leadStatusEnum', () => {
    it('should have all valid statuses', () => {
      const values = leadStatusEnum.options
      expect(values).toEqual(['new', 'contacted', 'qualified', 'closed'])
    })
  })
})
