/**
 * Audit Log Tests
 * Etapa 9.16 - Motor de Consultas
 * 
 * Testes para verificar:
 * - Criação do audit log
 * - Isolamento por usuário
 * - Eventos completed/failed/cancelled
 * - Não exposição de CPF completo
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock do Supabase
const mockSupabaseInstance = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
}

const mockQuery = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
  order: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseInstance)),
}))

import { ConsultationService } from '@/lib/consultations/consultation.service'

describe('Audit Log', () => {
  let service: ConsultationService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ConsultationService()
    ;(service as any).supabase = mockSupabaseInstance
    mockSupabaseInstance.from.mockReturnValue(mockQuery)
  })

  describe('sanitizeAuditData', () => {
    it('deve mascarar CPF completo', () => {
      const sanitized = (service as any).sanitizeAuditData({
        cpf: '12345678901',
        name: 'João Silva',
      })

      expect(sanitized.cpf).toBe('***01')
      expect(sanitized.name).toBe('João Silva')
    })

    it('deve mascarar CNPJ completo', () => {
      const sanitized = (service as any).sanitizeAuditData({
        cnpj: '12345678000195',
      })

      expect(sanitized.cnpj).toBe('***95')
    })

    it('deve mascarar client_document', () => {
      const sanitized = (service as any).sanitizeAuditData({
        client_document: '12345678901',
      })

      expect(sanitized.client_document).toBe('***01')
    })

    it('deve mascarar document', () => {
      const sanitized = (service as any).sanitizeAuditData({
        document: '98765432100',
      })

      expect(sanitized.document).toBe('***00')
    })

    it('deve adicionar timestamp', () => {
      const sanitized = (service as any).sanitizeAuditData({
        query_type: 'inss',
      })

      expect(sanitized._timestamp).toBeDefined()
      expect(sanitized.query_type).toBe('inss')
    })

    it('deve retornar objeto vazio quando não há dados', () => {
      const sanitized = (service as any).sanitizeAuditData(undefined)

      expect(sanitized).toEqual({})
    })

    it('deve preservar outros dados', () => {
      const sanitized = (service as any).sanitizeAuditData({
        query_type: 'inss',
        status: 'completed',
        score: 85,
      })

      expect(sanitized.query_type).toBe('inss')
      expect(sanitized.status).toBe('completed')
      expect(sanitized.score).toBe(85)
    })

    it('deve mascarar documentos curtos', () => {
      const sanitized = (service as any).sanitizeAuditData({
        cpf: '123',
      })

      expect(sanitized.cpf).toBe('***')
    })
  })

  describe('logAudit', () => {
    it('deve registrar evento de criação', async () => {
      mockQuery.insert.mockResolvedValue({ data: null, error: null })

      await (service as any).logAudit('consultation-123', 'created', 'user-123', {
        query_type: 'inss',
      })

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          consultation_id: 'consultation-123',
          event_type: 'created',
          user_id: 'user-123',
        })
      )
    })

    it('deve registrar evento de processamento', async () => {
      mockQuery.insert.mockResolvedValue({ data: null, error: null })

      await (service as any).logAudit('consultation-123', 'processing')

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          consultation_id: 'consultation-123',
          event_type: 'processing',
        })
      )
    })

    it('deve registrar evento de conclusão', async () => {
      mockQuery.insert.mockResolvedValue({ data: null, error: null })

      await (service as any).logAudit('consultation-123', 'completed', undefined, {
        score: 85,
      })

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          consultation_id: 'consultation-123',
          event_type: 'completed',
        })
      )
    })

    it('deve registrar evento de erro', async () => {
      mockQuery.insert.mockResolvedValue({ data: null, error: null })

      await (service as any).logAudit('consultation-123', 'failed', undefined, {
        error_code: 'MOCK_ERROR',
      })

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          consultation_id: 'consultation-123',
          event_type: 'failed',
        })
      )
    })

    it('deve registrar evento de cancelamento', async () => {
      mockQuery.insert.mockResolvedValue({ data: null, error: null })

      await (service as any).logAudit('consultation-123', 'cancelled', 'user-123')

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          consultation_id: 'consultation-123',
          event_type: 'cancelled',
          user_id: 'user-123',
        })
      )
    })

    it('não deve falhar a operação principal se auditoria falhar', async () => {
      mockQuery.insert.mockRejectedValue(new Error('Database error'))

      // Não deve lançar erro
      await expect(
        (service as any).logAudit('consultation-123', 'created')
      ).resolves.toBeUndefined()
    })
  })

  describe('Isolamento por usuário', () => {
    it('deve incluir user_id no log quando fornecido', async () => {
      mockQuery.insert.mockResolvedValue({ data: null, error: null })

      await (service as any).logAudit('consultation-123', 'created', 'user-456')

      const insertCall = mockQuery.insert.mock.calls[0][0]
      expect(insertCall.user_id).toBe('user-456')
    })

    it('deve usar null para user_id quando não fornecido', async () => {
      mockQuery.insert.mockResolvedValue({ data: null, error: null })

      await (service as any).logAudit('consultation-123', 'processing')

      const insertCall = mockQuery.insert.mock.calls[0][0]
      expect(insertCall.user_id).toBeNull()
    })
  })
})
