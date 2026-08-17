/**
 * CPFHub Provider Types
 * Etapa 9.19 - Integração CPFHub API
 *
 * Tipos para integração com a API CPFHub.io
 *
 * Documentação oficial: https://cpfhub.io/documentacao/referencia/cpf
 */

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Requisição de consulta CPF
 */
export interface CPFHubRequest {
  /** CPF com ou sem formatação */
  cpf: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Resposta de sucesso da API CPFHub
 */
export interface CPFHubSuccessResponse {
  /** Se a consulta foi bem-sucedida */
  success: true

  /** Dados do CPF */
  data: {
    /** CPF consultado (somente dígitos) */
    cpf: string

    /** Nome completo em capitalização normal */
    name: string

    /** Nome completo em maiúsculas */
    nameUpper: string

    /** Gênero - M masculino, F feminino */
    gender: 'M' | 'F'

    /** Data de nascimento no formato DD/MM/AAAA */
    birthDate: string

    /** Dia de nascimento */
    day: number

    /** Mês de nascimento */
    month: number

    /** Ano de nascimento */
    year: number
  }
}

/**
 * Resposta de erro da API CPFHub
 */
export interface CPFHubErrorResponse {
  /** Sucesso */
  success: false

  /** Dados do erro */
  error: {
    /** Código do erro */
    code: string

    /** Mensagem do erro */
    message: string
  }
}

/**
 * Resposta da API CPFHub
 */
export type CPFHubResponse = CPFHubSuccessResponse | CPFHubErrorResponse

// ============================================================================
// PROVIDER TYPES
// ============================================================================

/**
 * Configuração do provider CPFHub
 */
export interface CPFHubConfig {
  /** Se o provider está habilitado */
  enabled: boolean

  /** URL base da API */
  baseUrl: string

  /** API Key para autenticação */
  apiKey: string

  /** Timeout em ms */
  timeout: number

  /** Limite mensal de consultas */
  monthlyLimit: number

  /** Intervalo mínimo entre requisições em ms (2 segundos para free) */
  rateLimitInterval: number
}

/**
 * Status do rate limiting
 */
export interface RateLimitStatus {
  /** Última requisição */
  lastRequest: Date | null

  /** Próxima requisição permitida */
  nextAllowed: Date | null

  /** Se pode fazer requisição agora */
  canRequest: boolean
}

/**
 * Contador de consultas mensais
 */
export interface MonthlyCounter {
  /** Mês/Ano atual (YYYY-MM) */
  currentMonth: string

  /** Consultas realizadas */
  used: number

  /** Limite mensal */
  limit: number

  /** Consultas restantes */
  remaining: number

  /** Se pode fazer requisição (used < limit) */
  canRequest: boolean
}

/**
 * Status do provider
 */
export interface CPFHubProviderStatus {
  /** Se está habilitado */
  enabled: boolean

  /** Se tem API Key configurada */
  hasApiKey: boolean

  /** Status do rate limit */
  rateLimit: RateLimitStatus

  /** Contador mensal */
  monthly: MonthlyCounter

  /** Se pode fazer consultas */
  canQuery: boolean
}

// ============================================================================
// ERROR CODES
// ============================================================================

/**
 * Códigos de erro da API CPFHub
 */
export type CPFHubErrorCode =
  | 'CPF_NOT_FOUND'
  | 'CPF_INVALID_FORMAT'
  | 'CPF_INVALID_CHECK_DIGITS'
  | 'API_KEY_MISSING'
  | 'API_KEY_INVALID'
  | 'API_KEY_SUSPENDED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'MONTHLY_LIMIT_EXCEEDED'

/**
 * Mapeamento de códigos HTTP para códigos internos
 */
export const HTTP_STATUS_TO_ERROR_CODE: Record<number, CPFHubErrorCode> = {
  400: 'CPF_INVALID_FORMAT',
  401: 'API_KEY_INVALID',
  403: 'API_KEY_SUSPENDED',
  404: 'CPF_NOT_FOUND',
  422: 'CPF_INVALID_CHECK_DIGITS',
  429: 'RATE_LIMIT_EXCEEDED',
  500: 'INTERNAL_ERROR',
}
