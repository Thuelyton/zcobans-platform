/**
 * Consultation Service Tests
 * Etapa 9.16 - Motor de Consultas
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock do Supabase antes de importar o service
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

// Importar DEPOIS do mock
import { ConsultationService } from '@/lib/consultations/consultation.service'

describe('ConsultationService', () => {
  let service: ConsultationService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ConsultationService()
    ;(service as any).supabase = mockSupabaseInstance

    // Configurar mock padrão
    mockSupabaseInstance.from.mockReturnValue(mockQuery)
  })

  describe('createConsultation', () => {
    it('deve rejeitar documento inválido', async () => {
      await expect(
        service.createConsultation(
          {
            client_name: 'Cliente Teste',
            client_document: '12345',
            document_type: 'cpf',
            query_type: 'inss',
          },
          'user-123'
        )
      ).rejects.toThrow('Documento inválido')
    })

    it('deve rejeitar nome vazio', async () => {
      await expect(
        service.createConsultation(
          {
            client_name: '',
            client_document: '12345678901',
            document_type: 'cpf',
            query_type: 'inss',
          },
          'user-123'
        )
      ).rejects.toThrow('Nome do cliente é obrigatório')
    })
  })

  describe('getConsultation', () => {
    it('deve retornar null para consulta inexistente', async () => {
      mockQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      const result = await service.getConsultation('non-existent', 'user-123')

      expect(result).toBeNull()
    })
  })

  describe('getStats', () => {
    it('deve retornar estatísticas quando não há consultas', async () => {
      // Mock para retornar array vazio
      mockQuery.single.mockResolvedValue({
        data: [],
        error: null,
      })

      const stats = await service.getStats('user-123')

      expect(stats.total).toBe(0)
      expect(stats.pending).toBe(0)
      expect(stats.processing).toBe(0)
      expect(stats.completed).toBe(0)
      expect(stats.error).toBe(0)
      expect(stats.cancelled).toBe(0)
    })
  })

  describe('cancelConsultation', () => {
    it('deve retornar false para consulta não encontrada', async () => {
      mockQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } })

      const result = await service.cancelConsultation('consultation-123', 'user-123')

      expect(result).toBe(false)
    })

    it('deve retornar false para consulta já concluída', async () => {
      mockQuery.single.mockResolvedValue({ data: { status: 'completed' }, error: null })

      const result = await service.cancelConsultation('consultation-123', 'user-123')

      expect(result).toBe(false)
    })
  })
})
