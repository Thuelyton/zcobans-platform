/**
 * Consultation Constants
 * ZCobans - Constantes do módulo de consultas
 */

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export const DOCUMENT_TYPES = ['cpf', 'cnpj', 'rg'] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]

// ============================================================================
// GENERAL QUERY TYPES (existentes)
// ============================================================================

export const QUERY_TYPES = ['cpf', 'inss', 'fgts', 'telefone', 'limpa_nome'] as const
export type QueryType = (typeof QUERY_TYPES)[number]

// ============================================================================
// CONSULTATION STATUS
// ============================================================================

export const CONSULTATION_STATUS = ['PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'ERRO', 'CANCELADO'] as const
export type ConsultationStatus = (typeof CONSULTATION_STATUS)[number]

// ============================================================================
// INSS QUERY TYPES
// ============================================================================

/**
 * Tipos de consulta INSS/CNIS
 */
export const INSS_QUERY_TYPES = [
  // Extratos CNIS
  'cnis_online',
  'cnis_online_qr',
  'cnis_online_sem_qr',
  'cnis_offline_cpf',
  'consulta_cnis',
  'atualizacao_cnis',
  // Documentos INSS
  'in100',
  'hiscre',
  'hismed',
  'hisatu',
  'titula',
  'infben',
  'carta_concessao',
  // Outros serviços
  'cras',
  'prova_vida',
  'subida_nivel',
  'desbloqueio_nb',
  'retirada_duas_etapas',
] as const

export type INSSQueryType = (typeof INSS_QUERY_TYPES)[number]

// ============================================================================
// INSS QUERY CATEGORIES
// ============================================================================

export const INSS_CATEGORIES = {
  EXTRATOS_CNIS: {
    label: 'Extratos CNIS',
    types: ['cnis_online', 'cnis_online_qr', 'cnis_online_sem_qr', 'cnis_offline_cpf', 'consulta_cnis', 'atualizacao_cnis'] as const,
  },
  DOCUMENTOS_INSS: {
    label: 'Documentos INSS',
    types: ['in100', 'hiscre', 'hismed', 'hisatu', 'titula', 'infben', 'carta_concessao'] as const,
  },
  OUTROS_SERVICOS: {
    label: 'Outros Serviços',
    types: ['cras', 'prova_vida', 'subida_nivel', 'desbloqueio_nb', 'retirada_duas_etapas'] as const,
  },
} as const

// ============================================================================
// INSS QUERY LABELS
// ============================================================================

export const INSS_QUERY_LABELS: Record<INSSQueryType, string> = {
  cnis_online: 'CNIS Online',
  cnis_online_qr: 'CNIS com QR Code',
  cnis_online_sem_qr: 'CNIS sem QR Code',
  cnis_offline_cpf: 'CNIS Offline CPF',
  consulta_cnis: 'Consulta CNIS',
  atualizacao_cnis: 'Atualização CNIS',
  in100: 'IN100',
  hiscre: 'HISCRE',
  hismed: 'HISMED',
  hisatu: 'HISATU',
  titula: 'TITULA',
  infben: 'INFBEN',
  carta_concessao: 'Carta de Concessão',
  cras: 'CRAS',
  prova_vida: 'Prova de Vida',
  subida_nivel: 'Subida de Nível',
  desbloqueio_nb: 'Desbloqueio de NB',
  retirada_duas_etapas: 'Retirada de Duas Etapas',
}

// ============================================================================
// INSS QUERY DESCRIPTIONS
// ============================================================================

export const INSS_QUERY_DESCRIPTIONS: Record<INSSQueryType, string> = {
  cnis_online: 'Extrato do CNIS online',
  cnis_online_qr: 'Extrato do CNIS online com QR Code',
  cnis_online_sem_qr: 'Extrato do CNIS online sem QR Code',
  cnis_offline_cpf: 'Extrato do CNIS offline por CPF',
  consulta_cnis: 'Consulta completa do CNIS',
  atualizacao_cnis: 'Atualização do CNIS',
  in100: 'Documento IN100',
  hiscre: 'Histórico de Contribuições',
  hismed: 'Histórico de Mediação',
  hisatu: 'Histórico Atualizado',
  titula: 'Títulacão de Benefícios',
  infben: 'Informações de Benefícios',
  carta_concessao: 'Carta de Concessão de Benefício',
  cras: 'Cadastro Único CRAS',
  prova_vida: 'Comprovação de Vida',
  subida_nivel: 'Subida de Nível de Benefício',
  desbloqueio_nb: 'Desbloqueio de Número de Benefício',
  retirada_duas_etapas: 'Retirada em Duas Etapas',
}

// ============================================================================
// QUERY TYPE LABELS (para tipos gerais)
// ============================================================================

export const QUERY_TYPE_LABELS: Record<QueryType, string> = {
  cpf: 'CPF/CNPJ',
  inss: 'INSS',
  fgts: 'FGTS',
  telefone: 'Telefone',
  limpa_nome: 'Limpa Nome',
}

// ============================================================================
// STATUS CONFIG
// ============================================================================

export const STATUS_CONFIG: Record<ConsultationStatus, { label: string; color: string }> = {
  PENDENTE: { label: 'Pendente', color: 'bg-amber-500/10 text-amber-400' },
  PROCESSANDO: { label: 'Processando', color: 'bg-blue-500/10 text-blue-400' },
  CONCLUIDO: { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400' },
  ERRO: { label: 'Erro', color: 'bg-red-500/10 text-red-400' },
  CANCELADO: { label: 'Cancelado', color: 'bg-slate-500/10 text-slate-400' },
}

// ============================================================================
// CONSULTATION COST
// ============================================================================

export const CONSULTATION_COST = 1 // 1 crédito por consulta

// ============================================================================
// CPF/CNPJ VALIDATION
// ============================================================================

export const CPF_LENGTH = 11
export const CNPJ_LENGTH = 14
