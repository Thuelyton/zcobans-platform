/**
 * INSS Conecta Query Provider
 * Etapa 9.17 - Investigação APIs Oficiais INSS
 *
 * Implementação do provider para APIs oficiais do INSS via ConectaGov.
 *
 * ⚠️ ATENÇÃO:
 * - Este provider requer credenciamento no ConectaGov
 * - Requer certificado digital ICP-Brasil
 * - APIs são RESTritas a órgãos públicos credenciados
 * - NÃO disponível para empresas privadas
 *
 * Este provider NÃO será chamado quando:
 * - INSS_CONECTA_ENABLED=false (feature flag desligada)
 * - Credenciais não configuradas
 * - Certificado não encontrado
 */

import type {
  QueryRequest,
  QueryResult,
  ProviderCapability,
  ProviderType,
} from '../../types'
import type { IQueryProvider } from '../query-provider.interface'
import type {
  INSSBenefitResponse,
  INSSErrorResponse,
  INSSAuthCache,
  INSSRequestLog,
} from './inss-conecta.types'
import type { INSSConectaConfig } from './inss-conecta.config'
import {
  getINSSConectaConfig,
  validateINSSConectaConfig,
} from './inss-conecta.config'

/**
 * Storage padrão (pode ser substituído em testes)
 */
const createDefaultStorage = () => {
  if (typeof window === 'undefined') {
    // Server-side: usa Map como storage
    const storage = new Map<string, string>()
    return {
      get: (key: string) => storage.get(key) || null,
      set: (key: string, value: string) => storage.set(key, value),
      remove: (key: string) => storage.delete(key),
    }
  }
  // Client-side: usa localStorage
  return {
    get: (key: string) => {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    set: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value)
      } catch {
        // Ignora erros em testes
      }
    },
    remove: (key: string) => {
      try {
        localStorage.removeItem(key)
      } catch {
        // Ignora erros em testes
      }
    },
  }
}

/**
 * Cliente HTTP padrão (pode ser substituído em testes)
 */
const createDefaultHttpClient = () => ({
  get: async <T>(url: string, config?: Record<string, unknown>) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: config?.headers as Record<string, string>,
      signal: AbortSignal.timeout(config?.timeout as number || 30000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json() as T
    return { data, status: response.status }
  },

  post: async <T>(url: string, body?: unknown, config?: Record<string, unknown>) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config?.headers as Record<string, string> || {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(config?.timeout as number || 30000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json() as T
    return { data, status: response.status }
  },
})

/**
 * INSS Conecta Query Provider
 *
 * Implementa IQueryProvider para consulta via APIs oficiais do INSS.
 *
 * @example
 * ```typescript
 * const provider = new INSSConectaProvider()
 *
 * if (provider.isReady()) {
 *   const result = await provider.execute({
 *     document: '12345678901',
 *     documentType: 'cpf',
 *     queryType: 'inss',
 *   })
 * }
 * ```
 */
export class INSSConectaProvider implements IQueryProvider {
  readonly name: string = 'INSS Conecta Provider'
  readonly type: ProviderType = 'inss-conecta'
  readonly active: boolean = true  // Propriedade da interface IQueryProvider

  // Estado interno do provider (pode ser modificado)
  private _isActive: boolean = true

  private config: INSSConectaConfig
  private initialized: boolean = false
  private authCache: INSSAuthCache | null = null
  private stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalResponseTime: 0,
  }

  // Injeção de dependências para testes
  private httpClient: ReturnType<typeof createDefaultHttpClient>
  private storage: ReturnType<typeof createDefaultStorage>

  constructor(options?: {
    httpClient?: ReturnType<typeof createDefaultHttpClient>
    storage?: ReturnType<typeof createDefaultStorage>
    config?: INSSConectaConfig
  }) {
    this.config = options?.config || getINSSConectaConfig()
    this.httpClient = options?.httpClient || createDefaultHttpClient()
    this.storage = options?.storage || createDefaultStorage()
    this._isActive = this.config.enabled
  }

  /**
   * Retorna se o provider está ativo
   */
  get isActive(): boolean {
    return this._isActive
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
      this._isActive = false
      this.initialized = true
      return
    }

    // Valida configuração
    if (!validateINSSConectaConfig(this.config)) {
      this._isActive = false
      this.initialized = true
      return
    }

    this._isActive = true

    this.initialized = true
  }

  /**
   * Verifica se o provider está pronto
   */
  isReady(): boolean {
    return this.initialized && this._isActive
  }

  /**
   * Executa uma consulta
   *
   * @param request - Dados da consulta
   * @returns Resultado da consulta
   */
  async execute(request: QueryRequest): Promise<QueryResult> {
    const startTime = Date.now()

    this.stats.totalRequests++

    // Verifica se está pronto (antes de validar a requisição)
    if (!this.isReady()) {
      this.stats.failedRequests++
      return {
        success: false,
        rawData: {},
        error: 'Provider não está pronto. Verifique a configuração.',
        errorCode: 'PROVIDER_NOT_READY',
      }
    }

    // Valida a requisição
    if (!this.validate(request)) {
      this.stats.failedRequests++
      return {
        success: false,
        rawData: {},
        error: 'Requisição inválida para este provider',
        errorCode: 'INVALID_REQUEST',
      }
    }

    try {
      // Verifica se tem credenciais configuradas
      if (!this.config.clientId || !this.config.clientSecret) {
        this.stats.failedRequests++
        return {
          success: false,
          rawData: {
            _inssConecta: true,
            _environment: this.config.enabled ? 'production' : 'disabled',
            _warning: 'Provider INSS Conecta requer credenciais de produção',
          },
          error:
            'Provider INSS Conecta não está configurado. Requer credenciais no ConectaGov.',
          errorCode: 'PROVIDER_NOT_CONFIGURED',
        }
      }

      // Verifica se as credenciais são valores de teste/placeholder
      const isTestCredential =
        this.config.clientId.startsWith('test-') ||
        this.config.clientId.startsWith('your_') ||
        this.config.clientId === 'your_client_id_here'

      if (isTestCredential) {
        this.stats.failedRequests++
        return {
          success: false,
          rawData: {
            _inssConecta: true,
            _environment: 'development',
            _warning: 'Provider INSS Conecta requer credenciais reais de produção',
          },
          error:
            'Provider INSS Conecta não está configurado. Requer credenciais reais no ConectaGov.',
          errorCode: 'PROVIDER_NOT_CONFIGURED',
        }
      }

      // Obtém token de autenticação
      const token = await this.getAuthToken()
      if (!token) {
        this.stats.failedRequests++
        return {
          success: false,
          rawData: {},
          error: 'Não foi possível obter token de autenticação',
          errorCode: 'AUTH_FAILED',
        }
      }

      // Executa a consulta conforme o tipo
      let result: QueryResult

      switch (request.queryType) {
        case 'inss':
          result = await this.executeBenefitQuery(request, token)
          break

        case 'cpf':
          result = await this.executeCnisQuery(request, token)
          break

        default:
          result = {
            success: false,
            rawData: {},
            error: `Tipo de consulta não suportado: ${request.queryType}`,
            errorCode: 'UNSUPPORTED_QUERY_TYPE',
          }
      }

      const duration = Date.now() - startTime
      this.stats.totalResponseTime += duration

      if (result.success) {
        this.stats.successfulRequests++
      } else {
        this.stats.failedRequests++
      }

      // Log da requisição
      this.logRequest({
        timestamp: new Date().toISOString(),
        queryType: request.queryType,
        documentMasked: this.maskDocument(request.document, request.documentType),
        duration,
        status: result.success ? 'success' : 'error',
        errorMessage: result.error,
      })

      return result
    } catch (error) {
      const duration = Date.now() - startTime
      this.stats.totalResponseTime += duration
      this.stats.failedRequests++

      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

      this.logRequest({
        timestamp: new Date().toISOString(),
        queryType: request.queryType,
        documentMasked: this.maskDocument(request.document, request.documentType),
        duration,
        status: 'error',
        errorMessage,
      })

      return {
        success: false,
        rawData: {},
        error: `Erro ao executar consulta: ${errorMessage}`,
        errorCode: 'EXECUTION_ERROR',
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

    // Normaliza o documento
    const document = request.document.replace(/\D/g, '')

    // Valida por tipo de documento
    switch (request.documentType) {
      case 'cpf':
        return document.length === 11

      case 'cnpj':
        return document.length === 14

      case 'rg':
        return document.length >= 5 && document.length <= 12

      default:
        return false
    }
  }

  /**
   * Retorna as capacidades do provider
   */
  getCapabilities(): ProviderCapability[] {
    return [
      {
        queryType: 'inss',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de benefícios previdenciários via API oficial INSS',
      },
      {
        queryType: 'cpf',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta CNIS via API oficial INSS',
      },
    ]
  }

  /**
   * Obtém token de autenticação
   *
   * @returns Token ou null se não conseguir autenticar
   */
  async getAuthToken(): Promise<string | null> {
    // Verifica cache
    if (this.authCache && this.authCache.expiresAt > new Date()) {
      return this.authCache.token
    }

    try {
      // Em produção, aqui seria feita a autenticação via OAuth2
      // com certificado ICP-Brasil
      //
      // Por enquanto, retorna null pois não temos credenciais reais
      //
      // Exemplo de implementação futura:
      //
      // const response = await this.httpClient.post<INSSAuthResponse>(
      //   `${this.config.baseUrl}/oauth/token`,
      //   {
      //     grant_type: 'client_credentials',
      //     client_id: this.config.clientId,
      //     client_secret: this.config.clientSecret,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     timeout: this.config.timeout,
      //   }
      // )
      //
      // const { accessToken, expiresIn } = response.data
      //
      // this.authCache = {
      //   token: accessToken,
      //   expiresAt: new Date(Date.now() + (expiresIn - 300) * 1000), // 5 min antes
      //   scope: response.data.scope,
      // }
      //
      // return accessToken

      return null
    } catch (error) {
      console.error('Erro ao obter token de autenticação:', error)
      return null
    }
  }

  /**
   * Invalida o cache de autenticação
   */
  invalidateAuthCache(): void {
    this.authCache = null
  }

  /**
   * Obtém estatísticas de uso
   */
  getStats() {
    return {
      totalRequests: this.stats.totalRequests,
      successfulRequests: this.stats.successfulRequests,
      failedRequests: this.stats.failedRequests,
      averageResponseTime:
        this.stats.totalRequests > 0
          ? this.stats.totalResponseTime / this.stats.totalRequests
          : 0,
    }
  }

  /**
   * Executa consulta de benefício
   *
   * @param request - Dados da consulta
   * @param token - Token de autenticação
   * @returns Resultado da consulta
   */
  private async executeBenefitQuery(
    request: QueryRequest,
    token: string
  ): Promise<QueryResult> {
    // Em produção, aqui seria feita a chamada à API
    //
    // Exemplo de implementação futura:
    //
    // const response = await this.httpClient.get<INSSBenefitResponse>(
    //   `${this.config.baseUrl}/beneficios/consulta`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'X-API-Version': this.config.apiVersion,
    //     },
    //     params: {
    //       cpf: request.document,
    //       tipoConsulta: 'situacao',
    //     },
    //     timeout: this.config.timeout,
    //   }
    // )
    //
    // if (response.data.codigoRetorno !== '000') {
    //   return {
    //     success: false,
    //     rawData: response.data,
    //     error: response.data.mensagemRetorno,
    //     errorCode: response.data.codigoRetorno,
    //   }
    // }
    //
    // return {
    //   success: true,
    //   rawData: response.data,
    //   processedData: this.processBenefitData(response.data),
    //   score: 100,
    // }

    // Por enquanto, retorna erro indicando que não há credenciais
    return {
      success: false,
      rawData: {
        _inssConecta: true,
        _environment: this.config.enabled ? 'production' : 'disabled',
        _warning: 'Provider INSS Conecta requer credenciais de produção',
      },
      error:
        'Provider INSS Conecta não está configurado. Requer credenciais no ConectaGov.',
      errorCode: 'PROVIDER_NOT_CONFIGURED',
    }
  }

  /**
   * Executa consulta CNIS
   *
   * @param request - Dados da consulta
   * @param token - Token de autenticação
   * @returns Resultado da consulta
   */
  private async executeCnisQuery(
    request: QueryRequest,
    token: string
  ): Promise<QueryResult> {
    // Em produção, aqui seria feita a chamada à API
    //
    // Exemplo de implementação futura:
    //
    // const response = await this.httpClient.get<INSSBenefitResponse>(
    //   `${this.config.baseUrl}/cnis/consulta`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'X-API-Version': this.config.apiVersion,
    //     },
    //     params: {
    //       cpf: request.document,
    //       tipoExtrato: 'completo',
    //     },
    //     timeout: this.config.timeout,
    //   }
    // )
    //
    // if (response.data.codigoRetorno !== '000') {
    //   return {
    //     success: false,
    //     rawData: response.data,
    //     error: response.data.mensagemRetorno,
    //     errorCode: response.data.codigoRetorno,
    //   }
    // }
    //
    // return {
    //   success: true,
    //   rawData: response.data,
    //   processedData: this.processCnisData(response.data),
    //   score: 100,
    // }

    // Por enquanto, retorna erro indicando que não há credenciais
    return {
      success: false,
      rawData: {
        _inssConecta: true,
        _environment: this.config.enabled ? 'production' : 'disabled',
        _warning: 'Provider INSS Conecta requer credenciais de produção',
      },
      error:
        'Provider INSS Conecta não está configurado. Requer credenciais no ConectaGov.',
      errorCode: 'PROVIDER_NOT_CONFIGURED',
    }
  }

  /**
   * Processa dados de benefício
   *
   * @param data - Dados brutos da API
   * @returns Dados processados
   */
  private processBenefitData(data: INSSBenefitResponse): Record<string, unknown> {
    if (!data.dadosBeneficio) {
      return {}
    }

    const { dadosBeneficio } = data

    return {
      nb: dadosBeneficio.nb,
      nit: dadosBeneficio.nit,
      nome: dadosBeneficio.nomeTitular,
      cpf: dadosBeneficio.cpf,
      especie: dadosBeneficio.especie.descricao,
      dataInicio: dadosBeneficio.dataInicio,
      dataFim: dadosBeneficio.dataFim,
      valor: dadosBeneficio.valorBeneficio,
      valorFormatado: `R$ ${dadosBeneficio.valorBeneficio.toFixed(2).replace('.', ',')}`,
      situacao: dadosBeneficio.situacao.descricao,
      banco: dadosBeneficio.dadosPagamento?.banco,
      agencia: dadosBeneficio.dadosPagamento?.agencia,
      conta: dadosBeneficio.dadosPagamento?.conta,
      _provider: 'inss-conecta',
      _timestamp: new Date().toISOString(),
    }
  }

  /**
   * Processa dados do CNIS
   *
   * @param data - Dados brutos da API
   * @returns Dados processados
   */
  private processCnisData(data: INSSBenefitResponse): Record<string, unknown> {
    if (!data.dadosCnis) {
      return {}
    }

    const { dadosCnis } = data

    return {
      nit: dadosCnis.nit,
      nome: dadosCnis.nomeCompleto,
      dataNascimento: dadosCnis.dataNascimento,
      sexo: dadosCnis.sexo,
      situacaoCadastral: dadosCnis.situacaoCadastral,
      quantidadeVinculos: dadosCnis.vinculos?.length || 0,
      quantidadeContribuicoes: dadosCnis.contribuicoes?.length || 0,
      vinculos: dadosCnis.vinculos,
      contribuicoes: dadosCnis.contribuicoes,
      _provider: 'inss-conecta',
      _timestamp: new Date().toISOString(),
    }
  }

  /**
   * Mascara documento para logs
   *
   * @param document - Documento
   * @param documentType - Tipo do documento
   * @returns Documento mascarado
   */
  private maskDocument(document: string, documentType: string): string {
    const digits = document.replace(/\D/g, '')

    switch (documentType) {
      case 'cpf':
        return `${digits.slice(0, 3)}.***.***-${digits.slice(-2)}`

      case 'cnpj':
        return `**.${digits.slice(2, 5)}.***/****-${digits.slice(-2)}`

      case 'rg':
        return `***${digits.slice(-5)}`

      default:
        return '***'
    }
  }

  /**
   * Registra log da requisição
   *
   * @param log - Dados do log
   */
  private logRequest(log: INSSRequestLog): void {
    // Em produção, aqui seria enviado para sistema de logs
    // Por enquanto, apenas loga no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('[INSS Conecta]', log)
    }
  }
}