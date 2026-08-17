/**
 * Consultation Server Actions Tests
 * Etapa 9.16 - Motor de Consultas
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock do Supabase
const mockGetUser = vi.fn()
const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockInsert = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockOrder = vi.fn()
const mockRange = vi.fn()

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom.mockReturnValue({
    select: mockSelect.mockReturnValue({
      eq: mockEq.mockReturnValue({
        single: mockSingle,
        order: mockOrder.mockReturnValue({
          range: mockRange,
        }),
      }),
      insert: mockInsert,
    }),
    insert: mockInsert,
  }),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}))

// Mock do ConsultationService
const mockCreateConsultation = vi.fn()
const mockGetConsultation = vi.fn()
const mockListConsultations = vi.fn()
const mockGetStats = vi.fn()
const mockCancelConsultation = vi.fn()

vi.mock('@/lib/consultations/consultation.service', () => ({
  getConsultationService: vi.fn(() =>
    Promise.resolve({
      createConsultation: mockCreateConsultation,
      getConsultation: mockGetConsultation,
      listConsultations: mockListConsultations,
      getStats: mockGetStats,
      cancelConsultation: mockCancelConsultation,
    })
  ),
}))

import {
  createConsultation,
  getConsultation,
  listConsultations,
  getConsultationStats,
  cancelConsultation,
} from '@/lib/consultations/consultation.actions'

describe('Consultation Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createConsultation', () => {
    it('deve retornar erro para usuário não autenticado', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Not authenticated' } })

      const result = await createConsultation({
        clientName: 'Cliente Teste',
        clientDocument: '12345678901',
        documentType: 'cpf',
        queryType: 'cnis_online',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Usuário não autenticado')
      }
    })

    it('deve criar consulta com sucesso', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
      mockCreateConsultation.mockResolvedValue({
        id: 'consultation-123',
        status: 'pending',
        created_at: new Date().toISOString(),
      })

      const result = await createConsultation({
        clientName: 'Cliente Teste',
        clientDocument: '12345678901',
        documentType: 'cpf',
        queryType: 'cnis_online',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('consultation-123')
      }
    })

    it('deve rejeitar documento inválido', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })

      const result = await createConsultation({
        clientName: 'Cliente Teste',
        clientDocument: '12345',
        documentType: 'cpf',
        queryType: 'cnis_online',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('inválido')
      }
    })
  })

  describe('getConsultationStats', () => {
    it('deve retornar erro para usuário não autenticado', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Not authenticated' } })

      const result = await getConsultationStats()

      expect(result.success).toBe(false)
    })

    it('deve retornar estatísticas com sucesso', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
      mockGetStats.mockResolvedValue({
        total: 10,
        pending: 2,
        processing: 1,
        completed: 5,
        error: 1,
        cancelled: 1,
      })

      const result = await getConsultationStats()

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.total).toBe(10)
      }
    })
  })

  describe('listConsultations', () => {
    it('deve listar consultas do usuário', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
      mockListConsultations.mockResolvedValue([
        {
          id: 'c1',
          client_name: 'Cliente 1',
          client_document: '12345678901',
          query_type: 'cnis_online',
          status: 'completed',
          credits_used: 1,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          provider_name: 'Mock Provider',
        },
      ])

      const result = await listConsultations()

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.consultations).toHaveLength(1)
      }
    })
  })

  describe('cancelConsultation', () => {
    it('deve cancelar consulta com sucesso', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
      mockCancelConsultation.mockResolvedValue(true)

      const result = await cancelConsultation('consultation-123')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.cancelled).toBe(true)
      }
    })
  })
})
