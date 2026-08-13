import { describe, it, expect } from 'vitest'
import {
  statusSchema,
  serviceStatusInsertSchema,
  serviceStatusUpdateSchema,
  serviceStatusEnum,
} from '@/lib/validations/status'

describe('Status Validation', () => {
  describe('statusSchema', () => {
    it('should validate a correct status', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
        message: 'Sistema funcionando normalmente',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate a minimal status with only required fields', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'degraded',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate with id field', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'outage',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail if service_id is missing', () => {
      const data = {
        status: 'operational',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('service_id')
      }
    })

    it('should fail if service_id is empty string', () => {
      const data = {
        service_id: '',
        status: 'operational',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        // Zod validates UUID format first, then min length
        expect(result.error.issues[0].message).toBe('Serviço inválido')
      }
    })

    it('should fail with invalid service_id UUID', () => {
      const data = {
        service_id: 'invalid-uuid',
        status: 'operational',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Serviço inválido')
      }
    })

    it('should fail if status is missing', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('status')
      }
    })

    it('should fail with invalid status value', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'invalid-status',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should validate all valid status values', () => {
      const validStatuses = ['operational', 'degraded', 'outage', 'maintenance']

      for (const status of validStatuses) {
        const data = {
          service_id: '123e4567-e89b-12d3-a456-426614174000',
          status,
        }
        const result = statusSchema.safeParse(data)
        expect(result.success).toBe(true)
      }
    })

    it('should fail if message exceeds 1000 characters', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
        message: 'a'.repeat(1001),
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mensagem deve ter no máximo 1000 caracteres')
      }
    })

    it('should accept message with exactly 1000 characters', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
        message: 'a'.repeat(1000),
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept null message', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
        message: null,
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept undefined message', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
        message: undefined,
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept empty string message', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
        message: '',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should fail with invalid id UUID', () => {
      const data = {
        id: 'invalid-uuid',
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
      }
      const result = statusSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID inválido')
      }
    })
  })

  describe('serviceStatusInsertSchema', () => {
    it('should validate a correct insert', () => {
      const data = {
        service_id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'operational',
        message: 'Sistema operacional',
      }
      const result = serviceStatusInsertSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate minimal insert', () => {
      const data = {
        status: 'degraded',
      }
      const result = serviceStatusInsertSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept null service_id', () => {
      const data = {
        service_id: null,
        status: 'operational',
      }
      const result = serviceStatusInsertSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept undefined service_id', () => {
      const data = {
        status: 'operational',
      }
      const result = serviceStatusInsertSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('serviceStatusUpdateSchema', () => {
    it('should validate a correct update', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'outage',
        message: 'Fora do ar temporariamente',
      }
      const result = serviceStatusUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept empty update', () => {
      const data = {}
      const result = serviceStatusUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept partial update with only status', () => {
      const data = {
        status: 'maintenance',
      }
      const result = serviceStatusUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept partial update with only message', () => {
      const data = {
        message: 'Atualização de mensagem',
      }
      const result = serviceStatusUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('serviceStatusEnum', () => {
    it('should have all valid statuses', () => {
      const values = serviceStatusEnum.options
      expect(values).toEqual(['operational', 'degraded', 'outage', 'maintenance'])
    })

    it('should have exactly 4 statuses', () => {
      expect(serviceStatusEnum.options.length).toBe(4)
    })
  })
})
