/**
 * Query Providers Module
 * Etapa 9.3.2 - Provider Interface & Mock
 * Atualizado na Etapa 9.18 - Fortalecimento do Motor de Consultas
 *
 * Este módulo fornece o sistema de providers para consultas.
 * Utiliza o Provider/Adapter Pattern + Registry Pattern.
 *
 * ARQUITETURA:
 * - IQueryProvider: Interface base para todos os providers
 * - ProviderRegistry: Registry central para gerenciar providers
 * - QueryProviderFactory: Factory para seleção e execução
 * - MockProvider: Provider para desenvolvimento/testes
 * - INSSConectaProvider: Provider para APIs oficiais INSS (futuro)
 */

// ============================================================================
// INTERFACE
// ============================================================================

export type { IQueryProvider, ProviderConfig } from './query-provider.interface'

// ============================================================================
// REGISTRY
// ============================================================================

export {
  ProviderRegistry,
  getProviderRegistry,
  findProviderForQuery,
} from './provider-registry'

export type {
  Environment,
  ProviderMode,
  ProviderRegistryEntry,
  FindProviderOptions,
  FindProviderResult,
  RegistryStats,
} from './provider-registry'

// ============================================================================
// FACTORY
// ============================================================================

export {
  QueryProviderFactory,
  executeQuery,
  isQueryTypeSupported,
} from './query-provider.factory'

export type {
  FactoryMode,
  FactoryConfig,
  DetailedQueryResult,
} from './query-provider.factory'

// ============================================================================
// TYPES
// ============================================================================

export type {
  ProviderConfig as ProviderSettings,
  ProviderInfo,
  RegistrationResult,
  ProviderFactory,
  FactoryOptions,
  IQueryProviderExtended,
  MockCpfData,
  MockInssData,
  MockFgtsData,
  MockTelefoneData,
  MockLimpaNomeData,
} from './query-provider.types'

// ============================================================================
// MOCK PROVIDER
// ============================================================================

export { MockQueryProvider } from './mock/mock-query.provider'
export type { MockProviderConfig, MockScenario } from './mock/mock-query.provider'

export {
  getMockData,
  simulateDelay,
  generateDeterministicScore,
  generateRandomScore,
  maskDocument,
} from './mock/mock-data'

// ============================================================================
// INSS CONECTA PROVIDER
// ============================================================================

export {
  INSSConectaProvider,
  getINSSConectaConfig,
  validateINSSConectaConfig,
  getINSSConectaConfigErrors,
  isINSSConectaProviderReady,
  getINSSConectaDiagnostics,
} from './inss-conecta'

export type {
  INSSConectaConfig,
  INSSConectaProviderConfig,
  INSSBenefitResponse,
  INSSErrorResponse,
} from './inss-conecta'

// ============================================================================
// CPFHUB PROVIDER
// ============================================================================

export {
  CPFHubProvider,
  getCPFHubConfig,
  validateCPFHubConfig,
  getCPFHubConfigErrors,
  isCPFHubProviderReady,
  getCPFHubDiagnostics,
} from './cpfhub'

export type {
  CPFHubConfig,
  CPFHubRequest,
  CPFHubResponse,
  CPFHubSuccessResponse,
  CPFHubErrorResponse,
  RateLimitStatus,
  MonthlyCounter,
  CPFHubProviderStatus,
  CPFHubErrorCode,
} from './cpfhub'
