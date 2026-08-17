/**
 * Consultation Module
 * Etapa 9.3 - Motor de Consultas
 * Atualizado na Etapa 9.16
 *
 * Este módulo fornece funcionalidades para gestão de consultas
 * ao sistema de consulta de dados (CPF, INSS, FGTS, etc.)
 *
 * ARQUITETURA:
 * Dashboard → Server Action → ConsultationService → QueryProviderFactory → Provider → Supabase
 */

// Types e constants - usar exports explícitos para evitar conflitos
export {
  DOCUMENT_TYPES,
  QUERY_TYPES,
  PROVIDER_TYPES,
  CONSULTATION_STATUS,
  createConsultationSchema,
  consultationFiltersSchema,
} from './types'

export type {
  DocumentType,
  QueryType,
  ConsultationStatus,
  ProviderType,
  QueryRequest,
  QueryResult,
  ProviderCapability,
  IQueryProvider,
  QueryProvider,
  Consultation,
  ConsultationResult,
  CreateConsultationInput,
  ConsultationWithProvider,
  ConsultationWithResult,
  ConsultationFilters,
  ConsultationStats,
  CreateConsultationFormData,
  ConsultationFiltersFormData,
} from './types'

// Constants específicas do INSS
export {
  INSS_QUERY_TYPES,
  INSS_CATEGORIES,
  INSS_QUERY_LABELS,
  INSS_QUERY_DESCRIPTIONS,
  QUERY_TYPE_LABELS,
  STATUS_CONFIG,
  CONSULTATION_COST,
  CPF_LENGTH,
  CNPJ_LENGTH,
} from './constants'

export type { INSSQueryType } from './constants'

// INSS types e helpers
export {
  cpfSchema,
  cnpjSchema,
  documentSchema,
  createINSSInputSchema,
  QR_CODE_TYPES,
  supportsQRCode,
  maskCPF,
  maskCNPJ,
  maskDocument,
  maskDocumentForDisplay,
  detectDocumentType,
} from './inss-types'

export type {
  CreateINSSInput,
  ConsultaINSS,
  INSSConsultationFilters,
  INSSConsultationStats,
  CreateINSSFormData,
  QRCodeType,
} from './inss-types'

// Service layer
export {
  ConsultationService,
  getConsultationService,
  resetConsultationService,
} from './consultation.service'

export type {
  ConsultationWithProvider as ConsultationWithProviderFromService,
  ConsultationWithResult as ConsultationWithResultFromService,
  ConsultationStats as ConsultationStatsFromService,
  ConsultationFilters as ConsultationFiltersFromService,
} from './consultation.service'

// Server Actions
export {
  createConsultation,
  getConsultation,
  listConsultations,
  getConsultationStats,
  cancelConsultation,
} from './consultation.actions'

export type { ActionResult } from './consultation.actions'

// Providers
export * as Providers from './providers'

// Factory
export {
  QueryProviderFactory,
  executeQuery,
  isQueryTypeSupported,
} from './providers/query-provider.factory'

// Legacy service (para compatibilidade)
export {
  getINSSService,
  resetINSSService,
} from './inss-service'

// Credits system
export {
  CreditsService,
  getCreditsService,
  resetCreditsService,
} from './credits'

export type {
  CreditTransaction,
  CreditBalance,
  QueryCostConfig,
  CreditCheckResult,
  CreditTransactionStatus,
  CreditTransactionType,
} from './credits'
