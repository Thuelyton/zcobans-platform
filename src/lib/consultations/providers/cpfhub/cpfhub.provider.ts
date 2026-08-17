/**
 * CPFHub Query Provider
 * Etapa 9.19 - Integração CPFHub API
 *
 * Implementação do provider para consulta de CPF via API CPFHub.io
 *
 * Documentação oficial: https://cpfhub.io/documentacao/referencia/cpf
 *
 * Endpoint: GET https://api.cpfhub.io/cpf/{cpf}
 * Autenticação: header x-api-key
 * Limite gratuito: 50 consultas/mês
 * Rate limit: 1 requisição a cada 2 segundos
 *
 * Este provider NÃO será chamado quando:
 * - CPFHUB_ENABLED=false (feature flag desligada)
 * - API Key não configurada
 */

import type {
  QueryRequest,
  QueryResult,
  ProviderCapability,
  ProviderType,
} from '../../types'
import type { IQueryProvider } from '../query-provider.interface'
import type {
  CPFHubConfig,
  CPFHubResponse,
  CPFHubSuccessResponse,
  RateLimitStatus,
  MonthlyCounter,
} from './cpfhub.types'
import { HTTP_STATUS_TO_ERROR_CODE } from './cpfhub.types'
import {
  getCPFHubConfig,
  validateCPFHubConfig,
} from './cpfhub.config'

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEY_MONTHLY_COUNTER = 'cpfhub_monthly_counter'
const STORAGE_KEY_LAST_REQUEST = 'cpfhub_last_request'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtém mês atual no formato YYYY-MM
 */
function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Normaliza CPF (remove formatação)
 */
function normalizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

/**
 * Valida se CPF tem 11 dígitos
 */
function isValidCPFFormat(cpf: string): boolean {
  const digits = normalizeCPF(cpf)
  return digits.length === 11
}

/**
 * Mascara CPF para logs
 */
function maskCPF(cpf: string): string {
  const digits = normalizeCPF(cpf)
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.***.***-${digits.slice(-2)}`
  }
  return '***'
}

// ============================================================================
// CPFHUB QUERY PROVIDER
// ============================================================================

/**
 * CPFHub Query Provider
 *
 * Implementa IQueryProvider para consulta de CPF via API CPFHub.io
 *
 * @example
 * ```typescript
 * const provider = new CPFHubProvider()
 *
 * if (provider.isReady()) {
 *   const result = await provider.execute({
 *     document: '12345678909',
 *     documentType: 'cpf',
 *     queryType: 'cpf',
 *   })
 * }
 * ```
 */
export class CPFHubProvider implements IQueryProvider {
  readonly name: string = 'CPFHub Provider'
  readonly type: ProviderType = 'mock' // Usamos 'mock' porque não temos tipo 'cpfhub' ainda
  readonly active: boolean = true

  private config: CPFHubConfig
  private initialized: boolean = false
  private lastRequestTime: Date | null = null

  constructor(config?: Partial<CPFHubConfig>) {
    this.config = {
      ...getCPFHubConfig(),
      ...config,
    }
  }

  /**
   * Inicializa o provider
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    // Verifica se o provider está habilitado
    if (!this.config.enabled) {
      this.initialized = true
      return
    }

    // Valida configuração
    if (!validateCPFHubConfig(this.config)) {
      this.initialized = true
      return
    }

    // Carrega contador mensal do storage
    this.loadMonthlyCounter()

    this.initialized = true
  }

  /**
   * Verifica se o provider está pronto
   */
  isReady(): boolean {
    if (!this.config.enabled) {
      return false
    }
    return this.initialized && validateCPFHubConfig(this.config)
  }

  /**
   * Executa uma consulta CPF
   *
   * @param request - Dados da consulta
   * @returns Resultado da consulta
   */
  async execute(request: QueryRequest): Promise<QueryResult> {
    const startTime = Date.now()

    // Valida a requisição primeiro
    if (!this.validate(request)) {
      return {
        success: false,
        rawData: {},
        error: 'Requisição inválida para este provider',
        errorCode: 'INVALID_REQUEST',
      }
    }

    // Verifica se está pronto
    if (!this.isReady()) {
      return {
        success: false,
        rawData: {},
        error: 'Provider não está pronto. Verifique a configuração.',
        errorCode: 'PROVIDER_NOT_READY',
      }
    }

    // Normaliza o CPF
    const cpf = normalizeCPF(request.document)

    // Verifica formato do CPF
    if (!isValidCPFFormat(cpf)) {
      return {
        success: false,
        rawData: {},
        error: 'CPF deve ter 11 dígitos',
        errorCode: 'CPF_INVALID_FORMAT',
      }
    }

    // Verifica limite mensal
    const monthlyCheck = this.checkMonthlyLimit()
    if (!monthlyCheck.canRequest) {
      return {
        success: false,
        rawData: {
          _cpfhub: true,
          _monthlyLimit: true,
          _used: monthlyCheck.used,
          _limit: monthlyCheck.limit,
        },
        error: `Limite mensal atingido. Consultas: ${monthlyCheck.used}/${monthlyCheck.limit}`,
        errorCode: 'MONTHLY_LIMIT_EXCEEDED',
      }
    }

    // Verifica rate limit
    const rateLimitCheck = this.checkRateLimit()
    if (!rateLimitCheck.canRequest) {
      const waitTime = rateLimitCheck.nextAllowed
        ? rateLimitCheck.nextAllowed.getTime() - Date.now()
        : 2000

      return {
        success: false,
        rawData: {
          _cpfhub: true,
          _rateLimit: true,
          _waitMs: waitTime,
        },
        error: `Rate limit excedido. Aguarde ${Math.ceil(waitTime / 1000)} segundos.`,
        errorCode: 'RATE_LIMIT_EXCEEDED',
      }
    }

    try {
      // Registra timestamp da requisição
      this.recordRequest()

      // Executa a consulta
      const response = await this.fetchCPF(cpf)

      // Processa a resposta
      return this.processResponse(response, cpf, Date.now() - startTime)
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

      // Identifica tipo de erro
      let errorCode: string = 'INTERNAL_ERROR'
      if (error instanceof TypeError && errorMessage.includes('fetch')) {
        errorCode = 'NETWORK_ERROR'
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        errorCode = 'TIMEOUT'
      }

      return {
        success: false,
        rawData: {
          _cpfhub: true,
          _error: true,
          _duration: duration,
        },
        error: errorMessage,
        errorCode,
      }
    }
  }

  /**
   * Valida se a requisição pode ser processada
   *
   * @param request - Dados da consulta
   * @returns true se válida
   */
  validate(request: QueryRequest): boolean {
    // Verifica campos obrigatórios
    if (!request.document || !request.documentType || !request.queryType) {
      return false
    }

    // Só aceita CPF
    if (request.documentType !== 'cpf') {
      return false
    }

    // Só aceita queryType cpf
    if (request.queryType !== 'cpf') {
      return false
    }

    return true
  }

  /**
   * Retorna as capacidades do provider
   */
  getCapabilities(): ProviderCapability[] {
    return [
      {
        queryType: 'cpf',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de dados cadastrais por CPF via CPFHub API',
      },
    ]
  }

  // ============================================================================
  // API CALL
  // ============================================================================

  /**
   * Chama a API CPFHub
   *
   * @param cpf - CPF normalizado (11 dígitos)
   * @returns Resposta da API
   */
  private async fetchCPF(cpf: string): Promise<CPFHubResponse> {
    const url = `${this.config.baseUrl}/cpf/${cpf}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': this.config.apiKey,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Se não for 200, tenta parsear o erro
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)

        // Se tem body com formato de erro
        if (errorBody && typeof errorBody === 'object' && 'error' in errorBody) {
          return {
            success: false,
            error: errorBody.error,
          }
        }

        // Erro genérico baseado no status
        const errorCode = HTTP_STATUS_TO_ERROR_CODE[response.status] || 'INTERNAL_ERROR'
        return {
          success: false,
          error: {
            code: errorCode,
            message: `Erro HTTP ${response.status}: ${response.statusText}`,
          },
        }
      }

      // Parseia resposta de sucesso
      const data = await response.json()
      return data as CPFHubSuccessResponse
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // ============================================================================
  // RESPONSE PROCESSING
  // ============================================================================

  /**
   * Processa a resposta da API
   *
   * @param response - Resposta da API
   * @param cpf - CPF consultado
   * @param duration - Duração da requisição em ms
   * @returns QueryResult
   */
  private processResponse(
    response: CPFHubResponse,
    cpf: string,
    duration: number
  ): QueryResult {
    // Se erro
    if (!response.success) {
      // CPF não encontrado não consome crédito
      if (response.error.code === 'CPF_NOT_FOUND') {
        return {
          success: false,
          rawData: {
            _cpfhub: true,
            _notFound: true,
            _duration: duration,
          },
          error: 'CPF não encontrado na base de dados',
          errorCode: 'CPF_NOT_FOUND',
        }
      }

      return {
        success: false,
        rawData: {
          _cpfhub: true,
          _error: true,
          _errorCode: response.error.code,
          _duration: duration,
        },
        error: response.error.message,
        errorCode: response.error.code,
      }
    }

    // Sucesso - incrementa contador mensal
    this.incrementMonthlyCounter()

    // Mapeia dados para formato interno
    const { data } = response

    return {
      success: true,
      rawData: {
        _cpfhub: true,
        _realData: true,
        _duration: duration,
        _timestamp: new Date().toISOString(),
        cpf: data.cpf,
        nome: data.name,
        nomeCompleto: data.nameUpper,
        sexo: data.gender === 'M' ? 'MASCULINO' : 'FEMININO',
        dataNascimento: data.birthDate,
        diaNascimento: data.day,
        mesNascimento: data.month,
        anoNascimento: data.year,
      },
      processedData: {
        cpf: data.cpf,
        nomeFormatado: data.name,
        nomeMaiusculo: data.nameUpper,
        genero: data.gender,
        dataNascimentoFormatada: data.birthDate,
        idade: this.calculateAge(data.year, data.month, data.day),
        _provider: 'cpfhub',
        _timestamp: new Date().toISOString(),
      },
      score: 100, // Dados reais = score máximo
    }
  }

  /**
   * Calcula idade a partir da data de nascimento
   */
  private calculateAge(year: number, month: number, day: number): number {
    const today = new Date()
    const birthDate = new Date(year, month - 1, day)

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // ============================================================================
  // RATE LIMITING
  // ============================================================================

  /**
   * Verifica se pode fazer requisição (rate limit)
   */
  private checkRateLimit(): RateLimitStatus {
    const now = new Date()
    const lastRequest = this.getLastRequestTime()

    if (!lastRequest) {
      return {
        lastRequest: null,
        nextAllowed: null,
        canRequest: true,
      }
    }

    const nextAllowed = new Date(lastRequest.getTime() + this.config.rateLimitInterval)
    const canRequest = now >= nextAllowed

    return {
      lastRequest,
      nextAllowed,
      canRequest,
    }
  }

  /**
   * Obtém timestamp da última requisição
   */
  private getLastRequestTime(): Date | null {
    if (this.lastRequestTime) {
      return this.lastRequestTime
    }

    // Tenta carregar do storage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_LAST_REQUEST)
        if (stored) {
          this.lastRequestTime = new Date(stored)
          return this.lastRequestTime
        }
      } catch {
        // Ignora erros em testes
      }
    }

    return null
  }

  /**
   * Registra timestamp da requisição
   */
  private recordRequest(): void {
    this.lastRequestTime = new Date()

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LAST_REQUEST, this.lastRequestTime.toISOString())
      } catch {
        // Ignora erros em testes
      }
    }
  }

  // ============================================================================
  // MONTHLY LIMIT
  // ============================================================================

  /**
   * Verifica limite mensal
   */
  private checkMonthlyLimit(): MonthlyCounter {
    const counter = this.getMonthlyCounter()
    return {
      ...counter,
      canRequest: counter.used < counter.limit,
    }
  }

  /**
   * Obtém contador mensal
   */
  private getMonthlyCounter(): MonthlyCounter {
    const currentMonth = getCurrentMonth()

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_MONTHLY_COUNTER)
        if (stored) {
          const parsed = JSON.parse(stored) as MonthlyCounter
          if (parsed.currentMonth === currentMonth) {
            return parsed
          }
        }
      } catch {
        // Ignora erros
      }
    }

    // Retorna contador novo
    return {
      currentMonth,
      used: 0,
      limit: this.config.monthlyLimit,
      remaining: this.config.monthlyLimit,
      canRequest: true,
    }
  }

  /**
   * Carrega contador mensal
   */
  private loadMonthlyCounter(): void {
    this.getMonthlyCounter()
  }

  /**
   * Incrementa contador mensal
   */
  private incrementMonthlyCounter(): void {
    const currentMonth = getCurrentMonth()
    const counter = this.getMonthlyCounter()

    const newUsed = counter.used + 1
    const newRemaining = Math.max(0, this.config.monthlyLimit - newUsed)

    const newCounter: MonthlyCounter = {
      currentMonth,
      used: newUsed,
      limit: this.config.monthlyLimit,
      remaining: newRemaining,
      canRequest: newUsed < this.config.monthlyLimit,
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_MONTHLY_COUNTER, JSON.stringify(newCounter))
      } catch {
        // Ignora erros
      }
    }
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Obtém status do provider
   */
  getStatus(): {
    enabled: boolean
    hasApiKey: boolean
    isReady: boolean
    monthly: MonthlyCounter
    rateLimit: RateLimitStatus
  } {
    return {
      enabled: this.config.enabled,
      hasApiKey: !!this.config.apiKey,
      isReady: this.isReady(),
      monthly: this.getMonthlyCounter(),
      rateLimit: this.checkRateLimit(),
    }
  }

  /**
   * Obtém config (sem expor API Key)
   */
  getConfig(): Omit<CPFHubConfig, 'apiKey'> & { hasApiKey: boolean } {
    return {
      enabled: this.config.enabled,
      baseUrl: this.config.baseUrl,
      hasApiKey: !!this.config.apiKey,
      timeout: this.config.timeout,
      monthlyLimit: this.config.monthlyLimit,
      rateLimitInterval: this.config.rateLimitInterval,
    }
  }

  /**
   * Reseta contador mensal (para testes)
   */
  resetMonthlyCounter(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_MONTHLY_COUNTER)
      } catch {
        // Ignora erros
      }
    }
  }

  /**
   * Reseta rate limit (para testes)
   */
  resetRateLimit(): void {
    this.lastRequestTime = null
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_LAST_REQUEST)
      } catch {
        // Ignora erros
      }
    }
  }
}
