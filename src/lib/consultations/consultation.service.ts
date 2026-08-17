/**
 * Consultation Service
 * Etapa 9.16 - Motor de Consultas
 *
 * Service layer central para gerenciamento de consultas.
 * Integra QueryProviderFactory com Supabase.
 *
 * ARQUITETURA:
 * Dashboard → Server Action → ConsultationService → QueryProviderFactory → Provider → Supabase
 */

import { createClient } from '@/lib/supabase/server'
import { QueryProviderFactory } from './providers/query-provider.factory'
import type {
  QueryRequest,
  QueryResult,
  ConsultationStatus,
  DocumentType,
  QueryType,
} from './types'
import type { Json } from '@/lib/supabase/types'

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * Input para criação de consulta
 */
export interface CreateConsultationInput {
  client_name: string
  client_document: string
  document_type: DocumentType
  query_type: string // Aceita tanto QueryType quanto INSSQueryType
  metadata?: Record<string, unknown>
}

/**
 * Consulta com dados do provider
 */
export interface ConsultationWithProvider {
  id: string
  user_id: string | null
  provider_id: string | null
  provider_name: string | null
  provider_type: string | null
  client_name: string
  client_document: string
  document_type: string
  query_type: string
  status: ConsultationStatus
  error_message: string | null
  credits_used: number
  provider_request_id: string | null
  protocol: string | null
  provider_cost: number | null
  requested_at: string | null
  started_at: string | null
  completed_at: string | null
  document_path: string | null
  metadata: Record<string, unknown> | null
  created_at: string | null
  updated_at: string | null
}

/**
 * Consulta com resultado
 */
export interface ConsultationWithResult extends ConsultationWithProvider {
  result: {
    id: string
    raw_data: Record<string, unknown>
    processed_data: Record<string, unknown> | null
    score: number | null
  } | null
}

/**
 * Estatísticas de consultas
 */
export interface ConsultationStats {
  total: number
  pending: number
  processing: number
  completed: number
  error: number
  cancelled: number
}

/**
 * Filtros para listagem
 */
export interface ConsultationFilters {
  status?: ConsultationStatus
  query_type?: string
  search?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

// ============================================================================
// CONSULTATION SERVICE
// ============================================================================

/**
 * ConsultationService
 *
 * Service central para consultas.
 * Usa QueryProviderFactory para executar consultas.
 * Usa Supabase para persistência.
 */
export class ConsultationService {
  private supabase: Awaited<ReturnType<typeof createClient>> | null = null

  /**
   * Inicializa o service com cliente Supabase
   */
  async initialize(): Promise<void> {
    this.supabase = await createClient()
  }

  /**
   * Garante que o Supabase está inicializado
   */
  private async ensureSupabase() {
    if (!this.supabase) {
      await this.initialize()
    }
    return this.supabase!
  }

  // ============================================================================
  // CREATE CONSULTATION
  // ============================================================================

  /**
   * Cria uma nova consulta
   *
   * @param input - Dados da consulta
   * @param userId - ID do usuário autenticado
   * @returns Consulta criada
   */
  async createConsultation(
    input: CreateConsultationInput,
    userId: string
  ): Promise<ConsultationWithProvider> {
    const supabase = await this.ensureSupabase()

    // 1. Validar entrada
    this.validateInput(input)

    // 2. Normalizar documento
    const documentDigits = input.client_document.replace(/\D/g, '')

    // 3. Verificar se há provider disponível
    const factory = QueryProviderFactory.getInstance()
    const queryRequest: QueryRequest = {
      document: documentDigits,
      documentType: input.document_type,
      queryType: input.query_type as QueryType,
    }

    const provider = factory.getProviderForQuery(queryRequest.queryType as any)
    if (!provider) {
      throw new Error(`Nenhum provider disponível para o tipo: ${input.query_type}`)
    }

    // 4. Obter provider_id do banco
    const { data: providerData } = await supabase
      .from('query_providers')
      .select('id')
      .eq('type', 'mock')
      .eq('active', true)
      .single()

    // 5. Criar consulta no banco
    const { data: consultation, error } = await supabase
      .from('consultations')
      .insert({
        user_id: userId,
        provider_id: providerData?.id || null,
        client_name: input.client_name,
        client_document: documentDigits,
        document_type: input.document_type,
        query_type: input.query_type,
        status: 'pending',
        credits_used: 1,
        provider_cost: 0, // Mock não tem custo
        requested_at: new Date().toISOString(),
        metadata: (input.metadata || {}) as Json,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar consulta: ${error.message}`)
    }

    // 6. Registrar auditoria
    await this.logAudit(consultation.id, 'created', userId, {
      query_type: input.query_type,
      document_type: input.document_type,
    })

    // 7. Processar com provider (assíncrono)
    this.processConsultation(consultation.id, queryRequest).catch(console.error)

    // 8. Retornar consulta com dados do provider
    return this.mapConsultation(consultation, providerData)
  }

  // ============================================================================
  // PROCESS CONSULTATION
  // ============================================================================

  /**
   * Processa uma consulta com o provider
   * Executa assincronamente após criação
   */
  private async processConsultation(
    consultationId: string,
    queryRequest: QueryRequest
  ): Promise<void> {
    const supabase = await this.ensureSupabase()

    try {
      // 1. Atualizar para PROCESSING
      await supabase
        .from('consultations')
        .update({
          status: 'processing',
          started_at: new Date().toISOString(),
        })
        .eq('id', consultationId)

      await this.logAudit(consultationId, 'processing')

      // 2. Executar com provider
      const factory = QueryProviderFactory.getInstance()
      const result = await factory.execute(queryRequest)

      // 3. Processar resultado
      if (result.success) {
        await this.handleSuccess(consultationId, result)
      } else {
        await this.handleError(consultationId, result)
      }
    } catch (error) {
      await this.handleError(consultationId, {
        success: false,
        rawData: {},
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        errorCode: 'INTERNAL_ERROR',
      })
    }
  }

  /**
   * Trata sucesso do provider
   */
  private async handleSuccess(
    consultationId: string,
    result: QueryResult
  ): Promise<void> {
    const supabase = await this.ensureSupabase()

    // 1. Atualizar consulta
    await supabase
      .from('consultations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', consultationId)

    // 2. Salvar resultado
    await supabase
      .from('consultation_results')
      .insert({
        consultation_id: consultationId,
        raw_data: result.rawData as Json,
        processed_data: (result.processedData || null) as Json,
        score: result.score || null,
      })

    // 3. Registrar auditoria
    await this.logAudit(consultationId, 'completed', undefined, {
      score: result.score,
    })
  }

  /**
   * Trata erro do provider
   */
  private async handleError(
    consultationId: string,
    result: QueryResult
  ): Promise<void> {
    const supabase = await this.ensureSupabase()

    // 1. Atualizar consulta
    await supabase
      .from('consultations')
      .update({
        status: 'failed',
        error_message: result.error || 'Erro desconhecido',
        completed_at: new Date().toISOString(),
      })
      .eq('id', consultationId)

    // 2. Registrar auditoria
    await this.logAudit(consultationId, 'failed', undefined, {
      error_code: result.errorCode,
      error_message: result.error,
    })
  }

  // ============================================================================
  // GET CONSULTATION
  // ============================================================================

  /**
   * Obtém uma consulta por ID
   */
  async getConsultation(
    consultationId: string,
    userId: string
  ): Promise<ConsultationWithResult | null> {
    const supabase = await this.ensureSupabase()

    const { data: consultation, error } = await supabase
      .from('consultations')
      .select(`
        *,
        query_providers(name, type),
        consultation_results(
          id,
          raw_data,
          processed_data,
          score
        )
      `)
      .eq('id', consultationId)
      .eq('user_id', userId)
      .single()

    if (error || !consultation) {
      return null
    }

    return this.mapConsultationWithResult(consultation)
  }

  // ============================================================================
  // LIST CONSULTATIONS
  // ============================================================================

  /**
   * Lista consultas do usuário
   */
  async listConsultations(
    userId: string,
    filters?: ConsultationFilters
  ): Promise<ConsultationWithProvider[]> {
    const supabase = await this.ensureSupabase()

    let query = supabase
      .from('consultations')
      .select(`
        *,
        query_providers(name, type)
      `)
      .eq('user_id', userId)

    // Aplicar filtros
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.query_type) {
      query = query.eq('query_type', filters.query_type)
    }
    if (filters?.search) {
      query = query.or(`client_name.ilike.%${filters.search}%,client_document.ilike.%${filters.search}%`)
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    // Paginação
    const limit = filters?.limit || 50
    const offset = filters?.offset || 0

    const { data: consultations, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Erro ao listar consultas: ${error.message}`)
    }

    return (consultations || []).map(c => this.mapConsultation(c, c.query_providers))
  }

  // ============================================================================
  // GET STATS
  // ============================================================================

  /**
   * Obtém estatísticas do usuário
   */
  async getStats(userId: string): Promise<ConsultationStats> {
    const supabase = await this.ensureSupabase()

    const { data, error } = await supabase
      .from('consultations')
      .select('status')
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`)
    }

    const consultations = data || []

    return {
      total: consultations.length,
      pending: consultations.filter(c => c.status === 'pending').length,
      processing: consultations.filter(c => c.status === 'processing').length,
      completed: consultations.filter(c => c.status === 'completed').length,
      error: consultations.filter(c => c.status === 'failed').length,
      cancelled: consultations.filter(c => c.status === 'cancelled').length,
    }
  }

  // ============================================================================
  // CANCEL CONSULTATION
  // ============================================================================

  /**
   * Cancela uma consulta
   */
  async cancelConsultation(
    consultationId: string,
    userId: string
  ): Promise<boolean> {
    const supabase = await this.ensureSupabase()

    // Verificar se a consulta pertence ao usuário e pode ser cancelada
    const { data: consultation } = await supabase
      .from('consultations')
      .select('status')
      .eq('id', consultationId)
      .eq('user_id', userId)
      .single()

    if (!consultation) {
      return false
    }

    // Só pode cancelar se estiver pending ou processing
    if (consultation.status !== 'pending' && consultation.status !== 'processing') {
      return false
    }

    // Cancelar
    const { error } = await supabase
      .from('consultations')
      .update({
        status: 'cancelled',
        completed_at: new Date().toISOString(),
      })
      .eq('id', consultationId)

    if (error) {
      throw new Error(`Erro ao cancelar consulta: ${error.message}`)
    }

    // Registrar auditoria
    await this.logAudit(consultationId, 'cancelled', userId)

    return true
  }

  // ============================================================================
  // AUDIT LOG
  // ============================================================================

  /**
   * Registra evento de auditoria
   * 
   * IMPORTANTE: Nunca armazena CPF completo no event_data.
   * O event_data deve conter apenas dados de rastreamento, nunca dados pessoais sensíveis.
   */
  private async logAudit(
    consultationId: string,
    eventType: string,
    userId?: string,
    eventData?: Record<string, unknown>
  ): Promise<void> {
    try {
      const supabase = await this.ensureSupabase()

      // Sanitizar event_data - remover dados sensíveis
      const sanitizedData = this.sanitizeAuditData(eventData)

      await supabase
        .from('consultation_audit_log')
        .insert({
          consultation_id: consultationId,
          event_type: eventType,
          event_data: sanitizedData as Json,
          user_id: userId || null,
        })
    } catch (error) {
      // Log de auditoria não deve falhar a operação principal
      console.error('[AUDIT] Erro ao registrar auditoria:', error)
    }
  }

  /**
   * Remove dados sensíveis do event_data antes de persistir
   * Nunca deve armazenar CPF completo ou outros dados pessoais
   */
  private sanitizeAuditData(data?: Record<string, unknown>): Record<string, unknown> {
    if (!data) return {}

    const sanitized = { ...data }

    // Remover campos sensíveis
    const sensitiveFields = ['cpf', 'cnpj', 'document', 'client_document', 'clientDocument']
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        // Mascara o documento: mostra apenas os últimos 2 dígitos
        const value = String(sanitized[field])
        const digits = value.replace(/\D/g, '')
        if (digits.length >= 4) {
          sanitized[field] = `***${digits.slice(-2)}`
        } else {
          sanitized[field] = '***'
        }
      }
    }

    // Adicionar timestamp
    sanitized._timestamp = new Date().toISOString()

    return sanitized
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  /**
   * Valida input da consulta
   */
  private validateInput(input: CreateConsultationInput): void {
    if (!input.client_name || input.client_name.trim().length === 0) {
      throw new Error('Nome do cliente é obrigatório')
    }

    if (!input.client_document) {
      throw new Error('Documento é obrigatório')
    }

    const digits = input.client_document.replace(/\D/g, '')
    if (digits.length < 11) {
      throw new Error('Documento inválido')
    }

    if (!input.query_type) {
      throw new Error('Tipo de consulta é obrigatório')
    }
  }

  // ============================================================================
  // MAPPING
  // ============================================================================

  /**
   * Mapeia consulta do banco para o formato da aplicação
   */
  private mapConsultation(
    consultation: Record<string, unknown>,
    provider?: Record<string, unknown> | null
  ): ConsultationWithProvider {
    return {
      id: consultation.id as string,
      user_id: consultation.user_id as string | null,
      provider_id: consultation.provider_id as string | null,
      provider_name: provider?.name as string | null || null,
      provider_type: provider?.type as string | null || null,
      client_name: consultation.client_name as string,
      client_document: consultation.client_document as string,
      document_type: consultation.document_type as string,
      query_type: consultation.query_type as string,
      status: consultation.status as ConsultationStatus,
      error_message: consultation.error_message as string | null,
      credits_used: consultation.credits_used as number,
      provider_request_id: consultation.provider_request_id as string | null,
      protocol: consultation.protocol as string | null,
      provider_cost: consultation.provider_cost as number | null,
      requested_at: consultation.requested_at as string | null,
      started_at: consultation.started_at as string | null,
      completed_at: consultation.completed_at as string | null,
      document_path: consultation.document_path as string | null,
      metadata: consultation.metadata as Record<string, unknown> | null,
      created_at: consultation.created_at as string | null,
      updated_at: consultation.updated_at as string | null,
    }
  }

  /**
   * Mapeia consulta com resultado
   */
  private mapConsultationWithResult(
    consultation: Record<string, unknown>
  ): ConsultationWithResult {
    const provider = consultation.query_providers as Record<string, unknown> | null
    const results = consultation.consultation_results as Array<Record<string, unknown>> | null
    const result = results && results.length > 0 ? results[0] : null

    return {
      ...this.mapConsultation(consultation, provider),
      result: result ? {
        id: result.id as string,
        raw_data: result.raw_data as Record<string, unknown>,
        processed_data: result.processed_data as Record<string, unknown> | null,
        score: result.score as number | null,
      } : null,
    }
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let serviceInstance: ConsultationService | null = null

/**
 * Obtém instância do ConsultationService
 */
export async function getConsultationService(): Promise<ConsultationService> {
  if (!serviceInstance) {
    serviceInstance = new ConsultationService()
    await serviceInstance.initialize()
  }
  return serviceInstance
}

/**
 * Reseta instância (para testes)
 */
export function resetConsultationService(): void {
  serviceInstance = null
}
