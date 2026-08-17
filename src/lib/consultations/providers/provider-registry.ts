/**
 * Provider Registry
 * Etapa 9.18 - Fortalecimento do Motor de Consultas
 *
 * Registry central para gerenciar múltiplos providers de consulta.
 * Permite:
 * - Registro dinâmico de providers
 * - Seleção por tipo de consulta
 * - Seleção por ambiente
 * - Prioridade entre providers
 * - Fallback configurável
 *
 * ARQUITETURA:
 * Cada tipo de consulta pode ter múltiplos providers.
 * O registry seleciona o provider correto baseado em:
 * 1. Tipo de consulta
 * 2. Ambiente (development/test/production)
 * 3. Prioridade do provider
 * 4. Disponibilidade (enabled/active)
 */

import type { QueryType, QueryRequest, QueryResult, ProviderType } from '../types'
import type { IQueryProvider } from './query-provider.interface'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Ambiente de execução
 */
export type Environment = 'development' | 'test' | 'production'

/**
 * Modo de operação do provider
 */
export type ProviderMode = 'mock' | 'real' | 'auto'

/**
 * Configuração de um provider no registry
 */
export interface ProviderRegistryEntry {
  /** Identificador único do provider */
  id: string

  /** Nome legível do provider */
  name: string

  /** Tipo do provider */
  type: ProviderType

  /** Instância do provider */
  provider: IQueryProvider

  /** Tipos de consulta suportados */
  supportedQueryTypes: QueryType[]

  /** Se o provider está habilitado */
  enabled: boolean

  /** Prioridade (menor = maior prioridade, 0 = mais prioritário) */
  priority: number

  /** Ambientes onde este provider pode ser usado */
  environments: Environment[]

  /** Se é um provider mock */
  isMock: boolean

  /** Custo estimado por consulta (em centavos, 0 = gratuito) */
  costPerQuery: number

  /** Metadata adicional */
  metadata?: Record<string, unknown>
}

/**
 * Opções de busca de provider
 */
export interface FindProviderOptions {
  /** Tipo de consulta */
  queryType: QueryType

  /** Ambiente atual */
  environment?: Environment

  /** Se deve incluir mocks */
  includeMock?: boolean

  /** Se deve incluir apenas providers ativos */
  onlyActive?: boolean

  /** Provider preferido (ID ou nome) */
  preferredProvider?: string
}

/**
 * Resultado da busca de provider
 */
export interface FindProviderResult {
  /** Provider encontrado */
  provider: IQueryProvider

  /** Informações do provider */
  entry: ProviderRegistryEntry

  /** Se é um provider mock */
  isMock: boolean

  /** Razão da seleção */
  reason: 'preferred' | 'priority' | 'fallback' | 'mock_fallback'
}

/**
 * Estatísticas do registry
 */
export interface RegistryStats {
  /** Total de providers registrados */
  totalProviders: number

  /** Providers ativos */
  activeProviders: number

  /** Providers mock */
  mockProviders: number

  /** Providers reais */
  realProviders: number

  /** Providers por tipo de consulta */
  byQueryType: Record<QueryType, number>

  /** Providers por ambiente */
  byEnvironment: Record<Environment, number>
}

// ============================================================================
// PROVIDER REGISTRY
// ============================================================================

/**
 * ProviderRegistry
 *
 * Registry central para providers de consulta.
 * Implementa padrão Registry + Strategy.
 *
 * @example
 * ```typescript
 * const registry = ProviderRegistry.getInstance()
 *
 * // Registrar provider
 * registry.register({
 *   id: 'serasa-cpf',
 *   name: 'Serasa CPF',
 *   type: 'serasa',
 *   provider: serasaProvider,
 *   supportedQueryTypes: ['cpf'],
 *   enabled: true,
 *   priority: 10,
 *   environments: ['production'],
 *   isMock: false,
 *   costPerQuery: 50, // R$ 0,50
 * })
 *
 * // Buscar provider para consulta
 * const result = registry.findProvider({
 *   queryType: 'cpf',
 *   environment: 'production',
 * })
 *
 * if (result) {
 *   const queryResult = await result.provider.execute(request)
 * }
 * ```
 */
export class ProviderRegistry {
  private static instance: ProviderRegistry | null = null

  /** Providers registrados */
  private providers: Map<string, ProviderRegistryEntry> = new Map()

  /** Índice: queryType -> provider IDs */
  private queryTypeIndex: Map<QueryType, string[]> = new Map()

  /** Ambiente atual */
  private currentEnvironment: Environment

  /** Se o fallback para mock está habilitado em produção */
  private allowMockFallbackInProduction: boolean = false

  private constructor() {
    this.currentEnvironment = this.detectEnvironment()
  }

  /**
   * Obtém instância singleton
   */
  static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry()
    }
    return ProviderRegistry.instance
  }

  /**
   * Reseta instância (para testes)
   */
  static resetInstance(): void {
    ProviderRegistry.instance = null
  }

  // ============================================================================
  // ENVIRONMENT
  // ============================================================================

  /**
   * Detecta ambiente atual
   */
  private detectEnvironment(): Environment {
    if (process.env.NODE_ENV === 'test') return 'test'
    if (process.env.NODE_ENV === 'production') return 'production'
    return 'development'
  }

  /**
   * Obtém ambiente atual
   */
  getEnvironment(): Environment {
    return this.currentEnvironment
  }

  /**
   * Define ambiente (para testes)
   */
  setEnvironment(env: Environment): void {
    this.currentEnvironment = env
  }

  /**
   * Configura se mock pode ser usado em produção
   *
   * ⚠️ ATENÇÃO: Em produção, o padrão é NÃO permitir mock.
   * Isso evita que clientes recebam dados simulados sem saber.
   */
  setAllowMockFallbackInProduction(allow: boolean): void {
    this.allowMockFallbackInProduction = allow
  }

  /**
   * Verifica se mock pode ser usado no ambiente atual
   */
  canUseMockInCurrentEnvironment(): boolean {
    if (this.currentEnvironment === 'production') {
      return this.allowMockFallbackInProduction
    }
    return true // development e test sempre permitem mock
  }

  // ============================================================================
  // REGISTRATION
  // ============================================================================

  /**
   * Registra um provider
   *
   * @param entry - Configuração do provider
   */
  register(entry: ProviderRegistryEntry): void {
    // Validação
    if (!entry.id || !entry.provider) {
      throw new Error('Provider entry must have id and provider')
    }

    // Remove registro anterior se existir
    if (this.providers.has(entry.id)) {
      this.unregister(entry.id)
    }

    // Registra
    this.providers.set(entry.id, entry)

    // Atualiza índice
    entry.supportedQueryTypes.forEach((queryType) => {
      const existing = this.queryTypeIndex.get(queryType) || []
      if (!existing.includes(entry.id)) {
        existing.push(entry.id)
        // Ordena por prioridade
        existing.sort((a, b) => {
          const entryA = this.providers.get(a)
          const entryB = this.providers.get(b)
          return (entryA?.priority || 999) - (entryB?.priority || 999)
        })
        this.queryTypeIndex.set(queryType, existing)
      }
    })
  }

  /**
   * Remove um provider
   *
   * @param id - ID do provider
   */
  unregister(id: string): void {
    const entry = this.providers.get(id)
    if (!entry) return

    // Remove do índice
    entry.supportedQueryTypes.forEach((queryType) => {
      const existing = this.queryTypeIndex.get(queryType) || []
      const index = existing.indexOf(id)
      if (index > -1) {
        existing.splice(index, 1)
      }
    })

    // Remove o provider
    this.providers.delete(id)
  }

  /**
   * Verifica se um provider está registrado
   */
  has(id: string): boolean {
    return this.providers.has(id)
  }

  /**
   * Obtém um provider por ID
   */
  get(id: string): ProviderRegistryEntry | undefined {
    return this.providers.get(id)
  }

  /**
   * Lista todos os providers
   */
  list(): ProviderRegistryEntry[] {
    return Array.from(this.providers.values())
  }

  // ============================================================================
  // FIND PROVIDER
  // ============================================================================

  /**
   * Encontra o melhor provider para uma consulta
   *
   * Algoritmo de seleção:
   * 1. Se preferredProvider especificado e disponível, usa ele
   * 2. Busca providers ativos para o queryType + ambiente
   * 3. Seleciona pelo menor priority (maior prioridade)
   * 4. Se nenhum real disponível e mock permitido, usa mock
   * 5. Se nada disponível, retorna null
   *
   * @param options - Opções de busca
   * @returns Provider encontrado ou null
   */
  findProvider(options: FindProviderOptions): FindProviderResult | null {
    const {
      queryType,
      environment = this.currentEnvironment,
      includeMock = true,
      onlyActive = true,
      preferredProvider,
    } = options

    // 1. Tenta provider preferido
    if (preferredProvider) {
      const preferred = this.providers.get(preferredProvider)
      if (preferred) {
        const canUse = this.canUseProvider(preferred, environment, onlyActive)
        if (canUse) {
          return {
            provider: preferred.provider,
            entry: preferred,
            isMock: preferred.isMock,
            reason: 'preferred',
          }
        }
      }
    }

    // 2. Busca providers para o queryType
    const providerIds = this.queryTypeIndex.get(queryType) || []

    // 3. Filtra e ordena por prioridade
    const candidates: ProviderRegistryEntry[] = []
    for (const id of providerIds) {
      const entry = this.providers.get(id)
      if (!entry) continue

      const canUse = this.canUseProvider(entry, environment, onlyActive)
      if (!canUse) continue

      // Se não quer mock e é mock, pula
      if (!includeMock && entry.isMock) continue

      candidates.push(entry)
    }

    // 4. Seleciona o de maior prioridade (menor número)
    if (candidates.length > 0) {
      const best = candidates[0] // Já ordenado por prioridade
      return {
        provider: best.provider,
        entry: best,
        isMock: best.isMock,
        reason: best.isMock ? 'mock_fallback' : 'priority',
      }
    }

    // 5. Fallback para mock se permitido
    if (includeMock && this.canUseMockInCurrentEnvironment()) {
      const mockEntry = this.findMockProvider(queryType)
      if (mockEntry) {
        return {
          provider: mockEntry.provider,
          entry: mockEntry,
          isMock: true,
          reason: 'mock_fallback',
        }
      }
    }

    // 6. Nenhum provider encontrado
    return null
  }

  /**
   * Verifica se um provider pode ser usado
   */
  private canUseProvider(
    entry: ProviderRegistryEntry,
    environment: Environment,
    onlyActive: boolean
  ): boolean {
    // Verifica se está ativo
    if (onlyActive && !entry.enabled) return false

    // Verifica se suporta o ambiente
    if (!entry.environments.includes(environment)) return false

    return true
  }

  /**
   * Encontra provider mock para um queryType
   */
  private findMockProvider(queryType: QueryType): ProviderRegistryEntry | undefined {
    for (const entry of this.providers.values()) {
      if (entry.isMock && entry.supportedQueryTypes.includes(queryType) && entry.enabled) {
        return entry
      }
    }
    return undefined
  }

  // ============================================================================
  // QUERY TYPES
  // ============================================================================

  /**
   * Obtém todos os tipos de consulta suportados
   */
  getSupportedQueryTypes(): QueryType[] {
    return Array.from(this.queryTypeIndex.keys())
  }

  /**
   * Verifica se um tipo de consulta é suportado
   */
  isQueryTypeSupported(queryType: QueryType, environment?: Environment): boolean {
    const env = environment || this.currentEnvironment
    const result = this.findProvider({ queryType, environment: env })
    return result !== null
  }

  /**
   * Lista providers para um tipo de consulta
   */
  getProvidersForQueryType(queryType: QueryType): ProviderRegistryEntry[] {
    const ids = this.queryTypeIndex.get(queryType) || []
    return ids
      .map((id) => this.providers.get(id))
      .filter((entry): entry is ProviderRegistryEntry => entry !== undefined)
  }

  // ============================================================================
  // STATS
  // ============================================================================

  /**
   * Obtém estatísticas do registry
   */
  getStats(): RegistryStats {
    const entries = Array.from(this.providers.values())

    const byQueryType: Record<string, number> = {}
    const byEnvironment: Record<string, number> = {
      development: 0,
      test: 0,
      production: 0,
    }

    entries.forEach((entry) => {
      // Por queryType
      entry.supportedQueryTypes.forEach((qt) => {
        byQueryType[qt] = (byQueryType[qt] || 0) + 1
      })

      // Por ambiente
      entry.environments.forEach((env) => {
        byEnvironment[env] = (byEnvironment[env] || 0) + 1
      })
    })

    return {
      totalProviders: entries.length,
      activeProviders: entries.filter((e) => e.enabled).length,
      mockProviders: entries.filter((e) => e.isMock).length,
      realProviders: entries.filter((e) => !e.isMock).length,
      byQueryType: byQueryType as Record<QueryType, number>,
      byEnvironment: byEnvironment as Record<Environment, number>,
    }
  }

  // ============================================================================
  // CLEAR
  // ============================================================================

  /**
   * Limpa todos os providers (para testes)
   */
  clear(): void {
    this.providers.clear()
    this.queryTypeIndex.clear()
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Função helper para obter o registry
 */
export function getProviderRegistry(): ProviderRegistry {
  return ProviderRegistry.getInstance()
}

/**
 * Função helper para encontrar provider
 */
export function findProviderForQuery(
  queryType: QueryType,
  options?: Partial<FindProviderOptions>
): FindProviderResult | null {
  const registry = getProviderRegistry()
  return registry.findProvider({ queryType, ...options })
}
