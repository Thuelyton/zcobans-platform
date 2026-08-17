/**
 * Query Provider Factory
 * Etapa 9.3.2 - Provider Interface & Mock
 * Atualizado na Etapa 9.18 - Fortalecimento do Motor de Consultas
 *
 * Factory/Registry para gerenciar providers de consulta.
 * Implementa o padrão Factory + Registry para permitir:
 * - Registro dinâmico de providers
 * - Seleção automática do provider correto
 * - Extensão fácil para novos providers
 * - Fallback configurável por ambiente
 * - Controle de Mock em produção
 *
 * SEGURANÇA:
 * - Em produção, NÃO faz fallback automático para Mock
 * - Isso evita que clientes recebam dados simulados sem saber
 */

import type {
  QueryType,
  ProviderType,
  QueryRequest,
  QueryResult,
  ProviderCapability,
} from '../types'
import type { IQueryProvider } from './query-provider.interface'
import { MockQueryProvider } from './mock/mock-query.provider'
import { INSSConectaProvider, isINSSConectaProviderReady } from './inss-conecta'
import {
  ProviderRegistry,
  type Environment,
  type FindProviderResult,
} from './provider-registry'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Modo de operação da factory
 */
export type FactoryMode = 'development' | 'test' | 'production'

/**
 * Configuração da factory
 */
export interface FactoryConfig {
  /** Modo de operação */
  mode: FactoryMode

  /** Se deve auto-registrar providers padrão */
  autoRegisterDefaults: boolean

  /** Se deve permitir mock em produção */
  allowMockInProduction: boolean

  /** Se deve logar seleção de provider */
  debugMode: boolean
}

/**
 * Resultado detalhado da execução
 */
export interface DetailedQueryResult extends QueryResult {
  /** Provider que processou a consulta */
  providerUsed?: string

  /** Tipo do provider (mock/real) */
  providerType?: ProviderType

  /** Se foi fallback para mock */
  wasFallback?: boolean

  /** Ambiente de execução */
  environment?: string
}

// ============================================================================
// QUERY PROVIDER FACTORY
// ============================================================================

/**
 * QueryProviderFactory
 *
 * Factory central para providers de consulta.
 * Utiliza ProviderRegistry internamente para gerenciar providers.
 *
 * COMPORTAMENTO POR AMBIENTE:
 *
 * development:
 * - Usa provider real se disponível
 * - Fallback automático para MockProvider
 *
 * test:
 * - Usa MockProvider sempre (para testes determinísticos)
 *
 * production:
 * - Usa provider real se disponível
 * - SEM fallback automático para Mock
 * - Retorna erro se não houver provider real
 *
 * @example
 * ```typescript
 * const factory = QueryProviderFactory.getInstance()
 *
 * // Executa consulta
 * const result = await factory.execute({
 *   document: '12345678901',
 *   documentType: 'cpf',
 *   queryType: 'cpf',
 * })
 *
 * // Verifica se usou mock
 * if (result.wasFallback) {
 *   console.log('Usando dados simulados')
 * }
 * ```
 */
export class QueryProviderFactory {
  private static instance: QueryProviderFactory | null = null
  private registry: ProviderRegistry
  private config: FactoryConfig

  private constructor(config?: Partial<FactoryConfig>) {
    this.registry = ProviderRegistry.getInstance()
    this.config = {
      mode: this.detectMode(),
      autoRegisterDefaults: true,
      allowMockInProduction: false,
      debugMode: false,
      ...config,
    }

    // Configura o registry
    this.registry.setAllowMockFallbackInProduction(
      this.config.allowMockInProduction
    )

    // Registra providers padrão
    if (this.config.autoRegisterDefaults) {
      this.registerDefaultProviders()
    }
  }

  /**
   * Obtém instância singleton
   */
  static getInstance(config?: Partial<FactoryConfig>): QueryProviderFactory {
    if (!QueryProviderFactory.instance) {
      QueryProviderFactory.instance = new QueryProviderFactory(config)
    }
    return QueryProviderFactory.instance
  }

  /**
   * Reseta instância (para testes)
   */
  static resetInstance(): void {
    ProviderRegistry.resetInstance()
    QueryProviderFactory.instance = null
  }

  /**
   * Detecta modo baseado no NODE_ENV
   */
  private detectMode(): FactoryMode {
    if (process.env.NODE_ENV === 'test') return 'test'
    if (process.env.NODE_ENV === 'production') return 'production'
    return 'development'
  }

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Obtém configuração atual
   */
  getConfig(): FactoryConfig {
    return { ...this.config }
  }

  /**
   * Define modo de operação
   */
  setMode(mode: FactoryMode): void {
    this.config.mode = mode

    // Atualiza ambiente no registry
    this.registry.setEnvironment(mode)

    // Em produção, desabilita mock por padrão
    if (mode === 'production') {
      this.registry.setAllowMockFallbackInProduction(
        this.config.allowMockInProduction
      )
    }
  }

  /**
   * Obtém modo atual
   */
  getMode(): FactoryMode {
    return this.config.mode
  }

  // ============================================================================
  // REGISTRATION
  // ============================================================================

  /**
   * Registra um provider
   *
   * @param name - Nome único do provider
   * @param provider - Instância do provider
   * @param config - Configuração do provider
   */
  register(
    name: string,
    provider: IQueryProvider,
    config: {
      id: string
      slug: string
      type: ProviderType
      active: boolean
      priority?: number
      environments?: Environment[]
      costPerQuery?: number
    }
  ): void {
    const capabilities = provider.getCapabilities()
    const supportedQueryTypes = capabilities.map((c) => c.queryType)

    this.registry.register({
      id: name,
      name: provider.name,
      type: config.type,
      provider,
      supportedQueryTypes,
      enabled: config.active,
      priority: config.priority ?? 100,
      environments: config.environments ?? ['development', 'test', 'production'],
      isMock: config.type === 'mock',
      costPerQuery: config.costPerQuery ?? 0,
    })
  }

  /**
   * Remove um provider
   *
   * @param name - Nome do provider
   */
  unregister(name: string): void {
    this.registry.unregister(name)
  }

  // ============================================================================
  // QUERY EXECUTION
  // ============================================================================

  /**
   * Executa uma consulta usando o provider apropriado
   *
   * @param request - Dados da consulta
   * @param preferredProvider - Provider preferido (opcional)
   * @returns Resultado da consulta
   */
  async execute(
    request: QueryRequest,
    preferredProvider?: string
  ): Promise<DetailedQueryResult> {
    // Em modo test, sempre usa mock se não houver preferido
    if (this.config.mode === 'test' && !preferredProvider) {
      const mockResult = this.registry.findProvider({
        queryType: request.queryType,
        environment: 'test',
        includeMock: true,
      })

      if (mockResult) {
        return this.executeWithProvider(request, mockResult)
      }
    }

    // Busca provider no registry
    const findResult = this.registry.findProvider({
      queryType: request.queryType,
      environment: this.config.mode,
      includeMock: true,
      preferredProvider,
    })

    if (!findResult) {
      // Nenhum provider encontrado
      if (this.config.mode === 'production') {
        // Em produção, retorna erro claro
        return {
          success: false,
          rawData: {},
          error: `Nenhum provider disponível para consulta ${request.queryType} em produção`,
          errorCode: 'NO_PROVIDER_AVAILABLE',
          providerUsed: undefined,
          providerType: undefined,
          wasFallback: false,
          environment: this.config.mode,
        }
      }

      // Em desenvolvimento/teste, tenta mock como último recurso
      const mockFallback = this.registry.findProvider({
        queryType: request.queryType,
        includeMock: true,
      })

      if (mockFallback) {
        return this.executeWithProvider(request, mockFallback)
      }

      return {
        success: false,
        rawData: {},
        error: `Nenhum provider disponível para o tipo de consulta: ${request.queryType}`,
        errorCode: 'NO_PROVIDER_AVAILABLE',
        providerUsed: undefined,
        providerType: undefined,
        wasFallback: false,
        environment: this.config.mode,
      }
    }

    return this.executeWithProvider(request, findResult)
  }

  /**
   * Executa consulta com um provider específico
   */
  private async executeWithProvider(
    request: QueryRequest,
    findResult: FindProviderResult
  ): Promise<DetailedQueryResult> {
    const { provider, entry, isMock, reason } = findResult

    if (this.config.debugMode) {
      console.log(
        `[QueryProviderFactory] Executando com: ${entry.name} (${entry.type}) - Razão: ${reason}`
      )
    }

    try {
      const result = await provider.execute(request)

      return {
        ...result,
        providerUsed: entry.name,
        providerType: entry.type,
        wasFallback: reason === 'mock_fallback' || reason === 'fallback',
        environment: this.config.mode,
      }
    } catch (error) {
      return {
        success: false,
        rawData: {},
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        errorCode: 'EXECUTION_ERROR',
        providerUsed: entry.name,
        providerType: entry.type,
        wasFallback: false,
        environment: this.config.mode,
      }
    }
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Obtém um provider capaz de processar o tipo de consulta
   *
   * @param queryType - Tipo da consulta
   * @returns Provider disponível ou null
   */
  getProviderForQuery(queryType: QueryType): IQueryProvider | null {
    const result = this.registry.findProvider({
      queryType,
      environment: this.config.mode,
    })

    return result?.provider || null
  }

  /**
   * Lista todos os providers registrados
   */
  listProviders(): Array<{
    name: string
    type: ProviderType
    active: boolean
    capabilities: ProviderCapability[]
  }> {
    const entries = this.registry.list()
    return entries.map((entry) => ({
      name: entry.name,
      type: entry.type,
      active: entry.enabled,
      capabilities: entry.provider.getCapabilities(),
    }))
  }

  /**
   * Obtém um provider pelo nome
   *
   * @param name - Nome do provider
   * @returns Instância do provider ou null
   */
  getProvider(name: string): IQueryProvider | null {
    const entry = this.registry.get(name)
    return entry?.provider || null
  }

  /**
   * Verifica se um provider está registrado
   *
   * @param name - Nome do provider
   */
  hasProvider(name: string): boolean {
    return this.registry.has(name)
  }

  /**
   * Obtém todos os tipos de consulta suportados
   */
  getSupportedQueryTypes(): QueryType[] {
    return this.registry.getSupportedQueryTypes()
  }

  /**
   * Verifica se um tipo de consulta é suportado
   *
   * @param queryType - Tipo da consulta
   */
  isQueryTypeSupported(queryType: QueryType): boolean {
    return this.registry.isQueryTypeSupported(queryType)
  }

  // ============================================================================
  // DEFAULT PROVIDERS
  // ============================================================================

  /**
   * Registra providers padrão
   *
   * Em produção:
   * - Mock NÃO é registrado automaticamente
   * - Apenas providers reais habilitados
   *
   * Em development/test:
   * - Mock é registrado sempre
   * - Providers reais são registrados se habilitados
   */
  private registerDefaultProviders(): void {
    // SEMPRE registra Mock Provider (para development/test)
    // Em produção, NÃO registra mock por padrão
    if (this.config.mode !== 'production' || this.config.allowMockInProduction) {
      const mockProvider = new MockQueryProvider({ simulatedDelay: 0 })
      this.register('mock', mockProvider, {
        id: 'mock-001',
        slug: 'mock-provider',
        type: 'mock',
        active: true,
        priority: 1000, // Baixa prioridade (fallback)
        environments: ['development', 'test'],
        costPerQuery: 0,
      })
    }

    // Registra INSS Conecta Provider se habilitado e pronto
    if (isINSSConectaProviderReady()) {
      const inssProvider = new INSSConectaProvider()
      this.register('inss-conecta', inssProvider, {
        id: 'inss-conecta-001',
        slug: 'inss-conecta',
        type: 'inss-conecta',
        active: true,
        priority: 10, // Alta prioridade
        environments: ['production'], // Apenas produção
        costPerQuery: 0,
      })
    }
  }

  // ============================================================================
  // STATS
  // ============================================================================

  /**
   * Obtém estatísticas da factory
   */
  getStats() {
    return {
      mode: this.config.mode,
      allowMockInProduction: this.config.allowMockInProduction,
      registry: this.registry.getStats(),
    }
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Função helper para executar uma consulta
 *
 * @param request - Dados da consulta
 * @param preferredProvider - Provider preferido
 * @returns Resultado da consulta
 */
export async function executeQuery(
  request: QueryRequest,
  preferredProvider?: string
): Promise<DetailedQueryResult> {
  const factory = QueryProviderFactory.getInstance()
  return factory.execute(request, preferredProvider)
}

/**
 * Função helper para verificar se um tipo de consulta é suportado
 *
 * @param queryType - Tipo da consulta
 */
export function isQueryTypeSupported(queryType: QueryType): boolean {
  const factory = QueryProviderFactory.getInstance()
  return factory.isQueryTypeSupported(queryType)
}
