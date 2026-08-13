/**
 * Query Provider Factory
 * Etapa 9.3.2 - Provider Interface & Mock
 *
 * Factory/Registry para gerenciar providers de consulta.
 * Implementa o padrão Factory + Registry para permitir:
 * - Registro dinâmico de providers
 * - Seleção automática do provider correto
 * - Extensão fácil para novos providers
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

// ============================================================================
// PROVIDER REGISTRY
// ============================================================================

/**
 * Informações sobre um provider registrado
 */
interface ProviderRegistration {
  /** Instância do provider */
  provider: IQueryProvider
  /** Configuração do provider */
  config: {
    id: string
    slug: string
    type: ProviderType
    active: boolean
  }
  /** Capacidades do provider */
  capabilities: ProviderCapability[]
}

/**
 * QueryProviderFactory
 *
 * Factory e Registry central para providers de consulta.
 *
 * @example
 * ```typescript
 * // Obtém o factory
 * const factory = QueryProviderFactory.getInstance()
 *
 * // Registra um provider
 * factory.register('my-provider', myProvider, { id: '1', slug: 'my', type: 'mock', active: true })
 *
 * // Obtém provider para um tipo de consulta
 * const provider = factory.getProviderForQuery('cpf')
 *
 * // Executa uma consulta
 * const result = await factory.execute({
 *   document: '12345678901',
 *   documentType: 'cpf',
 *   queryType: 'cpf',
 * })
 * ```
 */
export class QueryProviderFactory {
  private static instance: QueryProviderFactory | null = null
  private providers: Map<string, ProviderRegistration> = new Map()
  private queryTypeMap: Map<QueryType, string[]> = new Map()

  private constructor() {
    // Singleton - inicializa com providers padrão
    this.registerDefaultProviders()
  }

  /**
   * Obtém a instância singleton do factory
   */
  static getInstance(): QueryProviderFactory {
    if (!QueryProviderFactory.instance) {
      QueryProviderFactory.instance = new QueryProviderFactory()
    }
    return QueryProviderFactory.instance
  }

  /**
   * Reseta a instância (útil para testes)
   */
  static resetInstance(): void {
    QueryProviderFactory.instance = null
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
    config: { id: string; slug: string; type: ProviderType; active: boolean }
  ): void {
    const capabilities = provider.getCapabilities()

    this.providers.set(name, {
      provider,
      config,
      capabilities,
    })

    // Atualiza o mapa de queryType -> providers
    capabilities.forEach((cap) => {
      const existing = this.queryTypeMap.get(cap.queryType) || []
      if (!existing.includes(name)) {
        existing.push(name)
        this.queryTypeMap.set(cap.queryType, existing)
      }
    })
  }

  /**
   * Remove um provider registrado
   *
   * @param name - Nome do provider
   */
  unregister(name: string): void {
    const registration = this.providers.get(name)
    if (registration) {
      // Remove do queryTypeMap
      registration.capabilities.forEach((cap) => {
        const existing = this.queryTypeMap.get(cap.queryType) || []
        const index = existing.indexOf(name)
        if (index > -1) {
          existing.splice(index, 1)
        }
      })

      this.providers.delete(name)
    }
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
  ): Promise<QueryResult> {
    // Se provider preferido especificado, tenta usá-lo
    if (preferredProvider) {
      const registration = this.providers.get(preferredProvider)
      if (registration && registration.config.active) {
        return registration.provider.execute(request)
      }
    }

    // Caso contrário, seleciona o primeiro provider disponível
    const provider = this.getProviderForQuery(request.queryType)

    if (!provider) {
      return {
        success: false,
        rawData: {},
        error: `Nenhum provider disponível para o tipo de consulta: ${request.queryType}`,
        errorCode: 'NO_PROVIDER_AVAILABLE',
      }
    }

    return provider.execute(request)
  }

  /**
   * Obtém um provider capaz de processar o tipo de consulta
   *
   * @param queryType - Tipo da consulta
   * @returns Provider disponível ou null
   */
  getProviderForQuery(queryType: QueryType): IQueryProvider | null {
    const providerNames = this.queryTypeMap.get(queryType) || []

    // Encontra o primeiro provider ativo
    for (const name of providerNames) {
      const registration = this.providers.get(name)
      if (registration && registration.config.active) {
        return registration.provider
      }
    }

    return null
  }

  // ============================================================================
  // QUERIES
  // ============================================================================

  /**
   * Lista todos os providers registrados
   */
  listProviders(): Array<{
    name: string
    type: ProviderType
    active: boolean
    capabilities: ProviderCapability[]
  }> {
    return Array.from(this.providers.entries()).map(([name, reg]) => ({
      name,
      type: reg.config.type,
      active: reg.config.active,
      capabilities: reg.capabilities,
    }))
  }

  /**
   * Obtém um provider pelo nome
   *
   * @param name - Nome do provider
   * @returns Instância do provider ou null
   */
  getProvider(name: string): IQueryProvider | null {
    return this.providers.get(name)?.provider || null
  }

  /**
   * Verifica se um provider está registrado
   *
   * @param name - Nome do provider
   */
  hasProvider(name: string): boolean {
    return this.providers.has(name)
  }

  /**
   * Obtém todos os tipos de consulta suportados
   */
  getSupportedQueryTypes(): QueryType[] {
    return Array.from(this.queryTypeMap.keys())
  }

  /**
   * Verifica se um tipo de consulta é suportado
   *
   * @param queryType - Tipo da consulta
   */
  isQueryTypeSupported(queryType: QueryType): boolean {
    const providers = this.queryTypeMap.get(queryType) || []
    return providers.some((name) => {
      const reg = this.providers.get(name)
      return reg?.config.active
    })
  }

  // ============================================================================
  // DEFAULT PROVIDERS
  // ============================================================================

  /**
   * Registra providers padrão (Mock)
   */
  private registerDefaultProviders(): void {
    // Registra Mock Provider
    const mockProvider = new MockQueryProvider()
    this.register('mock', mockProvider, {
      id: 'mock-001',
      slug: 'mock-provider',
      type: 'mock',
      active: true,
    })
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
): Promise<QueryResult> {
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
