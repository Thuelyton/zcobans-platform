'use server'

/**
 * Consultation Server Actions
 * Etapa 9.16 - Motor de Consultas
 *
 * Server Actions para operações de consultas.
 * Todas validam autenticação antes de executar.
 */

import { createClient } from '@/lib/supabase/server'
import { getConsultationService, type CreateConsultationInput } from './consultation.service'
import type { INSSQueryType } from './constants'
import type { DocumentType } from './types'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Resultado de uma Server Action
 */
export type ActionResult<T = void> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

// ============================================================================
// CREATE CONSULTATION
// ============================================================================

/**
 * Cria uma nova consulta
 *
 * @param input - Dados da consulta
 * @returns Resultado com a consulta criada
 */
export async function createConsultation(input: {
  clientName: string
  clientDocument: string
  documentType: DocumentType
  queryType: INSSQueryType
  metadata?: Record<string, unknown>
}): Promise<ActionResult<{
  id: string
  status: string
  createdAt: string
}>> {
  try {
    // 1. Verificar autenticação
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      }
    }

    // 2. Validar entrada
    if (!input.clientName || input.clientName.trim().length === 0) {
      return {
        success: false,
        error: 'Nome do cliente é obrigatório',
      }
    }

    const digits = input.clientDocument.replace(/\D/g, '')
    if (digits.length < 11) {
      return {
        success: false,
        error: 'Documento inválido',
      }
    }

    if (!input.queryType) {
      return {
        success: false,
        error: 'Tipo de consulta é obrigatório',
      }
    }

    // 3. Criar consulta via service
    const service = await getConsultationService()
    const consultation = await service.createConsultation(
      {
        client_name: input.clientName.trim(),
        client_document: input.clientDocument,
        document_type: input.documentType,
        query_type: input.queryType,
        metadata: input.metadata,
      },
      user.id
    )

    return {
      success: true,
      data: {
        id: consultation.id,
        status: consultation.status,
        createdAt: consultation.created_at || new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('[createConsultation] Erro:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar consulta',
    }
  }
}

// ============================================================================
// GET CONSULTATION
// ============================================================================

/**
 * Obtém uma consulta por ID
 */
export async function getConsultation(consultationId: string): Promise<ActionResult<{
  id: string
  clientName: string
  clientDocument: string
  queryType: string
  status: string
  errorMessage: string | null
  createdAt: string
  completedAt: string | null
  result: {
    processedData: Record<string, unknown> | null
    score: number | null
  } | null
}>> {
  try {
    // 1. Verificar autenticação
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      }
    }

    // 2. Buscar consulta
    const service = await getConsultationService()
    const consultation = await service.getConsultation(consultationId, user.id)

    if (!consultation) {
      return {
        success: false,
        error: 'Consulta não encontrada',
      }
    }

    return {
      success: true,
      data: {
        id: consultation.id,
        clientName: consultation.client_name,
        clientDocument: consultation.client_document,
        queryType: consultation.query_type,
        status: consultation.status,
        errorMessage: consultation.error_message,
        createdAt: consultation.created_at || new Date().toISOString(),
        completedAt: consultation.completed_at,
        result: consultation.result ? {
          processedData: consultation.result.processed_data,
          score: consultation.result.score,
        } : null,
      },
    }
  } catch (error) {
    console.error('[getConsultation] Erro:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar consulta',
    }
  }
}

// ============================================================================
// LIST CONSULTATIONS
// ============================================================================

/**
 * Lista consultas do usuário
 */
export async function listConsultations(filters?: {
  status?: string
  queryType?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<ActionResult<{
  consultations: Array<{
    id: string
    clientName: string
    clientDocument: string
    queryType: string
    status: string
    creditsUsed: number
    createdAt: string
    completedAt: string | null
    providerName: string | null
  }>
  total: number
}>> {
  try {
    // 1. Verificar autenticação
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      }
    }

    // 2. Listar consultas
    const service = await getConsultationService()
    const consultations = await service.listConsultations(user.id, {
      status: filters?.status as any,
      query_type: filters?.queryType,
      search: filters?.search,
      limit: filters?.limit,
      offset: filters?.offset,
    })

    return {
      success: true,
      data: {
        consultations: consultations.map(c => ({
          id: c.id,
          clientName: c.client_name,
          clientDocument: c.client_document,
          queryType: c.query_type,
          status: c.status,
          creditsUsed: c.credits_used,
          createdAt: c.created_at || new Date().toISOString(),
          completedAt: c.completed_at,
          providerName: c.provider_name,
        })),
        total: consultations.length,
      },
    }
  } catch (error) {
    console.error('[listConsultations] Erro:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar consultas',
    }
  }
}

// ============================================================================
// GET STATS
// ============================================================================

/**
 * Obtém estatísticas do usuário
 */
export async function getConsultationStats(): Promise<ActionResult<{
  total: number
  pending: number
  processing: number
  completed: number
  error: number
  cancelled: number
}>> {
  try {
    // 1. Verificar autenticação
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      }
    }

    // 2. Buscar estatísticas
    const service = await getConsultationService()
    const stats = await service.getStats(user.id)

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('[getConsultationStats] Erro:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas',
    }
  }
}

// ============================================================================
// CANCEL CONSULTATION
// ============================================================================

/**
 * Cancela uma consulta
 */
export async function cancelConsultation(consultationId: string): Promise<ActionResult<{ cancelled: boolean }>> {
  try {
    // 1. Verificar autenticação
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      }
    }

    // 2. Cancelar consulta
    const service = await getConsultationService()
    const cancelled = await service.cancelConsultation(consultationId, user.id)

    return {
      success: true,
      data: { cancelled },
    }
  } catch (error) {
    console.error('[cancelConsultation] Erro:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao cancelar consulta',
    }
  }
}
