/**
 * INSS Conecta Provider Module
 * Etapa 9.17 - Investigação APIs Oficiais INSS
 *
 * Este módulo fornece o provider para integração com APIs oficiais do INSS
 * via plataforma ConectaGov.
 *
 * ⚠️ ATENÇÃO:
 * - Requer credenciamento no ConectaGov
 * - Requer certificado digital ICP-Brasil
 * - APIs são RESTritas a órgãos públicos credenciados
 * - NÃO disponível para empresas privadas
 *
 * @example
 * ```typescript
 * import {
 *   INSSConectaProvider,
 *   getINSSConectaConfig,
 *   isINSSConectaProviderReady,
 * } from '@/lib/consultations/providers/inss-conecta'
 *
 * // Verifica se o provider está pronto
 * if (isINSSConectaProviderReady()) {
 *   const provider = new INSSConectaProvider()
 *   await provider.initialize()
 *
 *   const result = await provider.execute({
 *     document: '12345678901',
 *     documentType: 'cpf',
 *     queryType: 'inss',
 *   })
 * }
 * ```
 */

// Provider
export { INSSConectaProvider } from './inss-conecta.provider'

// Config
export {
  getINSSConectaConfig,
  validateINSSConectaConfig,
  getINSSConectaConfigErrors,
  isINSSConectaProviderReady,
  getINSSConectaDiagnostics,
} from './inss-conecta.config'
export type { INSSConectaConfig } from './inss-conecta.config'

// Types
export type {
  INSSBenefitRequest,
  INSSCnisRequest,
  INSSBenefitResponse,
  INSSErrorResponse,
  INSSAuthResponse,
  INSSConectaProviderConfig,
  INSSAuthCache,
  INSSRequestLog,
  INSSConectaProvider as INSSConectaProviderInterface,
  INSSHttpClient,
  INSSStorage,
} from './inss-conecta.types'