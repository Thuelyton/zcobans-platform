/**
 * CPFHub Provider Module
 * Etapa 9.19 - Integração CPFHub API
 *
 * Este módulo fornece o provider para consulta de CPF via API CPFHub.io
 *
 * Documentação oficial: https://cpfhub.io/documentacao/referencia/cpf
 *
 * @example
 * ```typescript
 * import {
 *   CPFHubProvider,
 *   getCPFHubConfig,
 *   isCPFHubProviderReady,
 * } from '@/lib/consultations/providers/cpfhub'
 *
 * // Verifica se o provider está pronto
 * if (isCPFHubProviderReady()) {
 *   const provider = new CPFHubProvider()
 *   await provider.initialize()
 *
 *   const result = await provider.execute({
 *     document: '12345678909',
 *     documentType: 'cpf',
 *     queryType: 'cpf',
 *   })
 * }
 * ```
 */

// Provider
export { CPFHubProvider } from './cpfhub.provider'

// Config
export {
  getCPFHubConfig,
  validateCPFHubConfig,
  getCPFHubConfigErrors,
  isCPFHubProviderReady,
  getCPFHubDiagnostics,
} from './cpfhub.config'

// Types
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
} from './cpfhub.types'
