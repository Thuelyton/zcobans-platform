/**
 * Query Provider Types
 * Etapa 9.3.2 - Provider Interface & Mock
 *
 * Tipos específicos para o sistema de providers de consulta.
 */

import type {
  DocumentType,
  QueryType,
  ProviderType,
  QueryRequest,
  QueryResult,
  ProviderCapability,
  QueryProvider,
} from '../types'

// ============================================================================
// PROVIDER CONFIGURATION
// ============================================================================

/**
 * Configuração base de um provider
 */
export interface ProviderConfig {
  /** ID do provider no banco */
  id: string
  /** Slug do provider */
  slug: string
  /** Tipo do provider */
  type: ProviderType
  /** Se o provider está ativo */
  active: boolean
  /** Configurações específicas do provider */
  settings: Record<string, unknown>
}

/**
 * Configuração do Mock Provider
 */
export interface MockProviderConfig extends ProviderConfig {
  type: 'mock'
  settings: {
    /** Delay simulado em ms */
    simulatedDelay?: number
    /** Taxa de sucesso simulada (0-100) */
    successRate?: number
    /** Se deve gerar dados aleatórios */
    randomizeData?: boolean
  }
}

// ============================================================================
// PROVIDER EVENTS
// ============================================================================

/**
 * Eventos emitidos pelo provider
 */
export interface ProviderEvents {
  /** Chamado antes de executar a consulta */
  beforeExecute: (request: QueryRequest) => void | Promise<void>
  /** Chamado depois de executar a consulta */
  afterExecute: (request: QueryRequest, result: QueryResult) => void | Promise<void>
  /** Chamado quando ocorre um erro */
  onError: (request: QueryRequest, error: Error) => void | Promise<void>
}

// ============================================================================
// PROVIDER REGISTRY
// ============================================================================

/**
 * Informações sobre um provider registrado
 */
export interface ProviderInfo {
  /** Nome do provider */
  name: string
  /** Tipo do provider */
  type: ProviderType
  /** Se está ativo */
  active: boolean
  /** Capacidades do provider */
  capabilities: ProviderCapability[]
}

/**
 * Resultado do registro de um provider
 */
export interface RegistrationResult {
  /** Se o registro foi bem-sucedido */
  success: boolean
  /** Mensagem de erro, se houver */
  error?: string
}

// ============================================================================
// FACTORY TYPES
// ============================================================================

/**
 * Função factory para criar um provider
 */
export type ProviderFactory = (config: ProviderConfig) => IQueryProviderExtended

/**
 * Opções para o QueryProviderFactory
 */
export interface FactoryOptions {
  /** Se deve auto-registrar providers padrão */
  autoRegisterDefaults?: boolean
  /** Configurações para providers */
  providerConfigs?: Record<ProviderType, Partial<ProviderConfig>>
}

// ============================================================================
// EXTENDED PROVIDER INTERFACE
// ============================================================================

/**
 * Interface estendida do provider com funcionalidades adicionais
 */
export interface IQueryProviderExtended {
  /** Informações básicas do provider */
  readonly info: ProviderInfo

  /**
   * Inicializa o provider com configurações
   * @param config - Configuração do provider
   */
  initialize(config: ProviderConfig): Promise<void>

  /**
   * Executa uma consulta
   * @param request - Dados da consulta
   * @returns Resultado da consulta
   */
  execute(request: QueryRequest): Promise<QueryResult>

  /**
   * Valida se uma consulta pode ser executada
   * @param request - Dados da consulta
   * @returns true se válida
   */
  validate(request: QueryRequest): boolean

  /**
   * Retorna as capacidades do provider
   */
  getCapabilities(): ProviderCapability[]

  /**
   * Verifica se o provider está pronto para uso
   */
  isReady(): boolean

  /**
   * Limpa recursos do provider
   */
  dispose(): Promise<void>
}

// ============================================================================
// MOCK DATA TYPES
// ============================================================================

/**
 * Dados mockados de CPF
 */
export interface MockCpfData {
  cpf: string
  nome: string
  dataNascimento: string
  sexo: string
  situaçãoCadastral: string
  dataInscricao: string
  digitoVerificador: string
}

/**
 * Dados mockados de INSS
 */
export interface MockInssData {
  cpf: string
  nome: string
  nis: string
  dataNascimento: string
  valorBeneficio: number
  tipoBeneficio: string
  dataInicio: string
  situacao: string
}

/**
 * Dados mockados de FGTS
 */
export interface MockFgtsData {
  cpf: string
  nome: string
  pis: string
  empresa: string
  cnpjEmpresa: string
  saldoAtual: number
  saldoAnterior: number
  dataSaldo: string
  situacao: string
}

/**
 * Dados mockados de Telefone
 */
export interface MockTelefoneData {
  numero: string
  ddd: string
  operadora: string
  tipo: string
  portabilidade: boolean
  situacao: string
}

/**
 * Dados mockados de Limpa Nome
 */
export interface MockLimpaNomeData {
  cpf: string
  nome: string
  possuiRestricao: boolean
  quantidadeRestricao: number
  valorTotalRestricao: number
  fontes: Array<{
    fonte: string
    valor: number
    data: string
  }>
}
