/**
 * INSS/CNIS Types
 * ZCobans - Tipos específicos para consultas INSS/CNIS
 */

import { z } from 'zod'
import type { INSSQueryType, DocumentType, ConsultationStatus } from './constants'

// ============================================================================
// INSS CONSULTATION TYPES
// ============================================================================

/**
 * Input para criação de consulta INSS
 */
export interface CreateINSSInput {
  /** CPF ou CNPJ do cliente (apenas dígitos) */
  document: string
  /** Tipo do documento */
  documentType: DocumentType
  /** Tipo de consulta INSS */
  queryType: INSSQueryType
  /** Se inclui QR Code (apenas para tipos CNIS) */
  qrCode?: boolean
  /** Nome do cliente (opcional - pode não existir) */
  clientName?: string
}

/**
 * Consulta INSS estruturada
 */
export interface ConsultaINSS {
  /** ID único da consulta */
  id: string
  /** CPF/CNPJ do cliente */
  document: string
  /** Tipo do documento */
  documentType: DocumentType
  /** Tipo de consulta */
  queryType: INSSQueryType
  /** Status da consulta */
  status: ConsultationStatus
  /** Custo em créditos */
  cost: number
  /** Se inclui QR Code */
  qrCode: boolean
  /** Nome do cliente (se disponível) */
  clientName?: string
  /** Data de criação */
  createdAt: string
  /** Data de conclusão */
  completedAt?: string
  /** URL do PDF (se disponível) */
  pdfUrl?: string | null
  /** Mensagem de erro (se houver) */
  errorMessage?: string
}

/**
 * Filtros para listagem de consultas INSS
 */
export interface INSSConsultationFilters {
  /** Filtrar por status */
  status?: ConsultationStatus
  /** Filtrar por tipo de consulta */
  queryType?: INSSQueryType
  /** Filtrar por tipo de documento */
  documentType?: DocumentType
  /** Busca por documento */
  search?: string
  /** Data início */
  dateFrom?: string
  /** Data fim */
  dateTo?: string
}

/**
 * Estatísticas de consultas INSS
 */
export interface INSSConsultationStats {
  total: number
  pending: number
  processing: number
  completed: number
  error: number
  cancelled: number
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Schema para validação de CPF
 */
export const cpfSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length === 11
    },
    { message: 'CPF deve ter 11 dígitos' }
  )

/**
 * Schema para validação de CNPJ
 */
export const cnpjSchema = z
  .string()
  .min(1, 'CNPJ é obrigatório')
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length === 14
    },
    { message: 'CNPJ deve ter 14 dígitos' }
  )

/**
 * Schema para validação de CPF ou CNPJ
 */
export const documentSchema = z
  .string()
  .min(1, 'Documento é obrigatório')
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length === 11 || digits.length === 14
    },
    { message: 'Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)' }
  )

/**
 * Schema para criação de consulta INSS
 */
export const createINSSInputSchema = z.object({
  document: documentSchema,
  documentType: z.enum(['cpf', 'cnpj', 'rg']),
  queryType: z.enum([
    'cnis_online', 'cnis_online_qr', 'cnis_online_sem_qr',
    'cnis_offline_cpf', 'consulta_cnis', 'atualizacao_cnis',
    'in100', 'hiscre', 'hismed', 'hisatu', 'titula', 'infben', 'carta_concessao',
    'cras', 'prova_vida', 'subida_nivel', 'desbloqueio_nb', 'retirada_duas_etapas',
  ]),
  qrCode: z.boolean().optional(),
  clientName: z.string().max(255).optional(),
})

/**
 * Tipo inferido do schema de criação
 */
export type CreateINSSFormData = z.infer<typeof createINSSInputSchema>

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Tipos de consulta que suportam QR Code
 */
export const QR_CODE_TYPES = ['cnis_online', 'cnis_online_qr', 'cnis_online_sem_qr', 'cnis_offline_cpf'] as const
export type QRCodeType = (typeof QR_CODE_TYPES)[number]

/**
 * Verifica se um tipo de consulta suporta QR Code
 */
export function supportsQRCode(queryType: INSSQueryType): boolean {
  return (QR_CODE_TYPES as readonly string[]).includes(queryType)
}

/**
 * Mascara CPF: 000.000.000-00
 */
export function maskCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Mascara CNPJ: 00.000.000/0000-00
 */
export function maskCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '')
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Mascara documento (CPF ou CNPJ)
 */
export function maskDocument(document: string): string {
  const digits = document.replace(/\D/g, '')
  if (digits.length === 11) {
    return maskCPF(digits)
  }
  if (digits.length === 14) {
    return maskCNPJ(digits)
  }
  return document
}

/**
 * Mascara documento para exibição (ocultar parte dos dígitos)
 * Exemplo: ***.***.789-00
 */
export function maskDocumentForDisplay(document: string): string {
  const digits = document.replace(/\D/g, '')
  if (digits.length === 11) {
    // CPF: mostrar apenas últimos 2 dígitos
    return `***.***.${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  if (digits.length === 14) {
    // CNPJ: mostrar apenas últimos 4 dígitos
    return `**.***.***/${digits.slice(8, 12)}-${digits.slice(12)}`
  }
  return document
}

/**
 * Detecta tipo de documento
 */
export function detectDocumentType(document: string): DocumentType {
  const digits = document.replace(/\D/g, '')
  if (digits.length === 11) return 'cpf'
  if (digits.length === 14) return 'cnpj'
  return 'rg'
}
