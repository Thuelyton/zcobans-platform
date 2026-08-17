/**
 * INSS Conecta Provider Types
 * Etapa 9.17 - Investigação APIs Oficiais INSS
 *
 * Tipos específicos para integração com APIs oficiais do INSS.
 *
 * ⚠️ ATENÇÃO:
 * - Estes tipos são baseados na documentação do ConectaGov
 * - Podem variar conforme a versão da API
 * - Requerem credenciamento oficial para uso
 */

import type {
  DocumentType,
  QueryType,
  QueryRequest,
  QueryResult,
  ProviderCapability,
} from '../../types'
import type { IQueryProvider } from '../query-provider.interface'

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Requisição de consulta de benefício previdenciário
 */
export interface INSSBenefitRequest {
  /** Número do benefício (NB) */
  nb?: string

  /** CPF do titular */
  cpf: string

  /** Tipo de consulta */
  tipoConsulta: 'beneficio' | 'cnis' | 'situacao'

  /** Data de referência (opcional) */
  dataReferencia?: string
}

/**
 * Requisição de consulta CNIS
 */
export interface INSSCnisRequest {
  /** CPF do titular */
  cpf: string

  /** NIT/PIS (opcional) */
  nit?: string

  /** Tipo de extrato */
  tipoExtrato: 'completo' | 'resumido'
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Resposta da API de benefícios INSS
 */
export interface INSSBenefitResponse {
  /** Código de retorno */
  codigoRetorno: string

  /** Mensagem de retorno */
  mensagemRetorno: string

  /** Dados do benefício */
  dadosBeneficio?: {
    /** Número do benefício */
    nb: string

    /** NIT/PIS do titular */
    nit: string

    /** Nome do titular */
    nomeTitular: string

    /** CPF do titular (mascarado) */
    cpf: string

    /** Espécie do benefício */
    especie: {
      codigo: string
      descricao: string
    }

    /** Data de início do benefício */
    dataInicio: string

    /** Data de fim (se aplicável) */
    dataFim?: string

    /** Valor do benefício */
    valorBeneficio: number

    /** Situação do benefício */
    situacao: {
      codigo: string
      descricao: string
    }

    /** Dados de pagamento */
    dadosPagamento?: {
      /** Banco */
      banco?: string

      /** Agência */
      agencia?: string

      /** Conta */
      conta?: string

      /** Tipo de conta */
      tipoConta?: string
    }
  }

  /** Dados do CNIS (se consulta CNIS) */
  dadosCnis?: {
    /** NIT/PIS */
    nit: string

    /** Nome completo */
    nomeCompleto: string

    /** Data de nascimento */
    dataNascimento: string

    /** Sexo */
    sexo: string

    /** Situação cadastral */
    situacaoCadastral: string

    /** Vínculos empregatícios */
    vinculos?: Array<{
      /** Empregador */
      empregador: {
        cnpj: string
        razaoSocial: string
      }

      /** Data de admissão */
      dataAdmissao: string

      /** Data de desligamento */
      dataDesligamento?: string

      /** Remuneração */
      remuneracao: number

      /** Tipo de vínculo */
      tipoVinculo: string
    }>

    /** Contribuições */
    contribuicoes?: Array<{
      /** Competência (MM/AAAA) */
      competencia: string

      /** Tipo de contribuição */
      tipoContribuicao: string

      /** Valor */
      valor: number

      /** Origem */
      origem: string
    }>
  }
}

/**
 * Resposta de erro da API
 */
export interface INSSErrorResponse {
  /** Código de erro */
  codigoErro: string

  /** Mensagem de erro */
  mensagemErro: string

  /** Detalhes adicionais */
  detalhes?: Record<string, unknown>

  /** Timestamp do erro */
  timestamp: string

  /** ID da requisição (para rastreabilidade) */
  requestId?: string
}

/**
 * Resposta de autenticação
 */
export interface INSSAuthResponse {
  /** Token de acesso */
  accessToken: string

  /** Tipo do token */
  tokenType: string

  /** Tempo de expiração em segundos */
  expiresIn: number

  /** Escopo */
  scope: string
}

// ============================================================================
// PROVIDER TYPES
// ============================================================================

/**
 * Configuração do provider INSS Conecta
 */
export interface INSSConectaProviderConfig {
  /** Se o provider está habilitado */
  enabled: boolean

  /** URL base da API */
  baseUrl: string

  /** Client ID */
  clientId: string

  /** Client Secret */
  clientSecret: string

  /** Caminho do certificado */
  certificatePath: string

  /** Senha do certificado */
  certificatePassword: string

  /** Timeout em ms */
  timeout: number

  /** Número de tentativas */
  retryAttempts: number

  /** Delay entre tentativas em ms */
  retryDelay: number

  // Versão da API
  apiVersion: string
}

/**
 * Cache de autenticação
 */
export interface INSSAuthCache {
  /** Token */
  token: string

  /** Data de expiração */
  expiresAt: Date

  /** Escopo */
  scope: string
}

/**
 * Log de requisição
 */
export interface INSSRequestLog {
  /** Timestamp */
  timestamp: string

  /** Tipo de consulta */
  queryType: string

  /** Documento (mascarado) */
  documentMasked: string

  /** Duração em ms */
  duration: number

  /** Status */
  status: 'success' | 'error' | 'timeout'

  /** Código de retorno */
  responseCode?: string

  /** Mensagem de erro */
  errorMessage?: string
}

/**
 * Provider INSS Conecta
 */
export interface INSSConectaProvider extends IQueryProvider {
  /** Configuração do provider */
  readonly config: INSSConectaProviderConfig

  /**
   * Obtém token de autenticação
   * @returns Token ou null se não conseguir autenticar
   */
  getAuthToken(): Promise<string | null>

  /**
   * Invalida o cache de autenticação
   */
  invalidateAuthCache(): void

  /**
   * Obtém estatísticas de uso
   */
  getStats(): {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageResponseTime: number
  }
}

/**
 * Interface para cliente HTTP (abstração para testes)
 */
export interface INSSHttpClient {
  /**
   * Realiza requisição GET
   */
  get<T>(url: string, config?: Record<string, unknown>): Promise<{ data: T; status: number }>

  /**
   * Realiza requisição POST
   */
  post<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<{ data: T; status: number }>
}

/**
 * Interface para storage (abstração para testes)
 */
export interface INSSStorage {
  /**
   * Obtém valor do storage
   */
  get(key: string): string | null

  /**
   * Armazena valor no storage
   */
  set(key: string, value: string): void

  /**
   * Remove valor do storage
   */
  remove(key: string): void
}