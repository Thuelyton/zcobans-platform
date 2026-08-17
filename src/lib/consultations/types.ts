/**
 * Consultation Module Types
 * Etapa 9.3 - Motor de Consultas
 *
 * Este arquivo contém todos os tipos e interfaces do módulo de consultas.
 * Nenhum dado sensível (CPF, documentos) deve ser exposto diretamente.
 */

import { z } from 'zod'

// ============================================================================
// ENUMS / CONSTANTS
// ============================================================================

/**
 * Tipos de documento aceitos
 */
export const DOCUMENT_TYPES = ['cpf', 'cnpj', 'rg'] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]

/**
 * Tipos de consulta disponíveis
 */
export const QUERY_TYPES = ['cpf', 'inss', 'fgts', 'telefone', 'limpa_nome'] as const
export type QueryType = (typeof QUERY_TYPES)[number]

/**
 * Status possíveis de uma consulta
 */
export const CONSULTATION_STATUS = [
  'pending',
  'processing',
  'completed',
  'error',
  'cancelled',
] as const
export type ConsultationStatus = (typeof CONSULTATION_STATUS)[number]

/**
 * Tipos de provider disponíveis
 * Atualizado na Etapa 9.17 - Adicionado 'inss-conecta'
 */
export const PROVIDER_TYPES = ['mock', 'serasa', 'sivec', 'detran', 'inss-conecta'] as const
export type ProviderType = (typeof PROVIDER_TYPES)[number]

// ============================================================================
// QUERY PROVIDER TYPES
// ============================================================================

/**
 * Requisição de consulta enviada ao provider
 */
export interface QueryRequest {
  /** Documento a ser consultado (mascarado no frontend) */
  document: string
  /** Tipo do documento */
  documentType: DocumentType
  /** Tipo da consulta a ser realizada */
  queryType: QueryType
  /** Metadata adicional da consulta */
  metadata?: Record<string, unknown>
}

/**
 * Resultado retornado pelo provider
 */
export interface QueryResult {
  /** Se a consulta foi bem-sucedida */
  success: boolean
  /** Dados brutos da consulta (pode conter dados sensíveis) */
  rawData: Record<string, unknown>
  /** Dados processados/formatados para exibição */
  processedData?: Record<string, unknown>
  /** Score de confiança do resultado (0-100) */
  score?: number
  /** Mensagem de erro, se houver */
  error?: string
  /** Código do erro, se houver */
  errorCode?: string
}

/**
 * Capacidades de um provider
 */
export interface ProviderCapability {
  /** Tipo de consulta suportado */
  queryType: QueryType
  /** Tipos de documento aceitos */
  supportedDocumentTypes: DocumentType[]
  /** Descrição da capacidade */
  description: string
}

/**
 * Interface abstrata para todos os providers de consulta
 */
export interface IQueryProvider {
  /** Nome do provider */
  readonly name: string
  /** Tipo do provider */
  readonly type: ProviderType
  /** Se o provider está ativo */
  readonly active: boolean

  /**
   * Executa uma consulta
   * @param request - Dados da consulta
   * @returns Resultado da consulta
   */
  execute(request: QueryRequest): Promise<QueryResult>

  /**
   * Valida se uma consulta pode ser executada
   * @param request - Dados da consulta
   * @returns true se válida, false caso contrário
   */
  validate(request: QueryRequest): boolean

  /**
   * Retorna as capacidades do provider
   */
  getCapabilities(): ProviderCapability[]
}

// ============================================================================
// DATABASE TYPES (re-export for convenience)
// ============================================================================

/**
 * Query Provider row from database
 */
export interface QueryProvider {
  id: string
  name: string
  slug: string
  type: ProviderType
  description: string | null
  config: Record<string, unknown> | null
  credits_per_query: number
  active: boolean
  created_at: string | null
  updated_at: string | null
}

/**
 * Consultation row from database
 */
export interface Consultation {
  id: string
  user_id: string | null
  provider_id: string | null
  client_name: string
  client_document: string
  document_type: DocumentType
  query_type: QueryType
  status: ConsultationStatus
  error_message: string | null
  credits_used: number
  metadata: Record<string, unknown> | null
  created_at: string | null
  updated_at: string | null
}

/**
 * Consultation Result row from database
 */
export interface ConsultationResult {
  id: string
  consultation_id: string | null
  provider_id: string | null
  raw_data: Record<string, unknown>
  processed_data: Record<string, unknown> | null
  score: number | null
  created_at: string | null
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Dados para criar uma nova consulta
 * NOTA: user_id NÃO é incluído aqui - será obtido via auth.uid() no servidor
 */
export interface CreateConsultationInput {
  client_name: string
  client_document: string
  document_type: DocumentType
  query_type: QueryType
  metadata?: Record<string, unknown>
}

/**
 * Consulta com dados do provider (para exibição)
 */
export interface ConsultationWithProvider extends Consultation {
  provider: Pick<QueryProvider, 'id' | 'name' | 'type'> | null
}

/**
 * Consulta com resultado (para detalhe)
 */
export interface ConsultationWithResult extends ConsultationWithProvider {
  result: ConsultationResult | null
}

/**
 * Filtros para listagem de consultas
 */
export interface ConsultationFilters {
  status?: ConsultationStatus
  query_type?: QueryType
  user_id?: string
  date_from?: string
  date_to?: string
  search?: string
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

// ============================================================================
// VALIDATION SCHEMAS (Zod)
// ============================================================================

/**
 * Schema para validação de documento
 */
const cpfCnpjRegex = /^\d{11}$|^\d{14}$/
const rgRegex = /^\d{5,12}$/

/**
 * Schema para criação de consulta
 */
export const createConsultationSchema = z.object({
  client_name: z
    .string()
    .min(1, 'Nome do cliente é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  client_document: z
    .string()
    .min(1, 'Documento é obrigatório')
    .refine(
      (val) => {
        // Remove non-digits for validation
        const digits = val.replace(/\D/g, '')
        return digits.length >= 5 && digits.length <= 14
      },
      { message: 'Documento inválido' }
    ),
  document_type: z.enum(['cpf', 'cnpj', 'rg']),
  query_type: z.enum(['cpf', 'inss', 'fgts', 'telefone', 'limpa_nome']),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

/**
 * Tipo inferido do schema de criação
 */
export type CreateConsultationFormData = z.infer<typeof createConsultationSchema>

/**
 * Schema para filtros de consulta
 */
export const consultationFiltersSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'error', 'cancelled']).optional(),
  query_type: z.enum(['cpf', 'inss', 'fgts', 'telefone', 'limpa_nome']).optional(),
  user_id: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  search: z.string().max(100).optional(),
})

/**
 * Tipo inferido dos filtros
 */
export type ConsultationFiltersFormData = z.infer<typeof consultationFiltersSchema>
