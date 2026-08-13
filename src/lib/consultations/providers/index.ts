/**
 * Query Providers Module
 * Etapa 9.3.2 - Provider Interface & Mock
 *
 * Este módulo fornece o sistema de providers para consultas.
 * Utiliza o Provider/Adapter Pattern para permitir expansão fácil.
 */

// Interface
export type { IQueryProvider, ProviderConfig } from './query-provider.interface'

// Factory
export {
  QueryProviderFactory,
  executeQuery,
  isQueryTypeSupported,
} from './query-provider.factory'

// Types
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

// Mock Provider
export { MockQueryProvider } from './mock/mock-query.provider'
export type { MockProviderConfig } from './mock/mock-query.provider'
export { getMockData, simulateDelay, generateRandomScore, maskDocument } from './mock/mock-data'
