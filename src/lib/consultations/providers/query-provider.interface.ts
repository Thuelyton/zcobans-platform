/**
 * Query Provider Interface
 * Etapa 9.3.2 - Provider Interface & Mock
 *
 * Interface abstrata que todos os providers devem implementar.
 * Segue o Provider/Adapter Pattern para permitir expansão fácil.
 */

import type {
  QueryRequest,
  QueryResult,
  ProviderCapability,
  ProviderType,
} from '../types'

/**
 * Interface base para todos os providers de consulta
 *
 * Implementações devem:
 * 1. Implementar execute() para realizar a consulta
 * 2. Implementar validate() para validar a requisição
 * 3. Implementar getCapabilities() para declarar capacidades
 *
 * @example
 * ```typescript
 * class MeuProvider implements IQueryProvider {
 *   readonly name = 'Meu Provider'
 *   readonly type = 'mock'
 *   readonly active = true
 *
 *   async execute(request: QueryRequest): Promise<QueryResult> {
 *     // Lógica da consulta
 *   }
 *
 *   validate(request: QueryRequest): boolean {
 *     // Validação
 *   }
 *
 *   getCapabilities(): ProviderCapability[] {
 *     // Capacidades
 *   }
 * }
 * ```
 */
export interface IQueryProvider {
  /**
   * Nome legível do provider
   * @example 'Mock Provider', 'Serasa Provider'
   */
  readonly name: string

  /**
   * Tipo do provider (usado para registro e seleção)
   */
  readonly type: ProviderType

  /**
   * Se o provider está ativo e pode processar consultas
   */
  readonly active: boolean

  /**
   * Executa uma consulta
   *
   * @param request - Dados da consulta a ser executada
   * @returns Resultado da consulta com dados brutos e processados
   *
   * @throws Error - Se houver erro na execução
   *
   * @example
   * ```typescript
   * const result = await provider.execute({
   *   document: '12345678901',
   *   documentType: 'cpf',
   *   queryType: 'cpf',
   * })
   * ```
   */
  execute(request: QueryRequest): Promise<QueryResult>

  /**
   * Valida se uma requisição pode ser executada por este provider
   *
   * Deve verificar:
   * - Formato do documento
   * - Tipo de consulta suportado
   * - Requisitos específicos do provider
   *
   * @param request - Dados da consulta a ser validada
   * @returns true se a requisição é válida, false caso contrário
   *
   * @example
   * ```typescript
   * const isValid = provider.validate({
   *   document: '12345678901',
   *   documentType: 'cpf',
   *   queryType: 'cpf',
   * })
   * // isValid: true
   * ```
   */
  validate(request: QueryRequest): boolean

  /**
   * Retorna as capacidades deste provider
   *
   * Usado para:
   * - Selecionar o provider correto para cada consulta
   * - Validação de compatibilidade
   * - UI de seleção de provider
   *
   * @returns Lista de capacidades suportadas
   *
   * @example
   * ```typescript
   * const capabilities = provider.getCapabilities()
   * // [{ queryType: 'cpf', supportedDocumentTypes: ['cpf'], description: '...' }]
   * ```
   */
  getCapabilities(): ProviderCapability[]
}

/**
 * Factory function para criar providers
 */
export type IQueryProviderFactory = () => IQueryProvider

/**
 * Configuração para um provider
 */
export interface ProviderConfig {
  /** ID único do provider */
  id: string
  /** Nome legível */
  name: string
  /** Slug para URLs */
  slug: string
  /** Tipo do provider */
  type: ProviderType
  /** Configurações específicas */
  config?: Record<string, unknown>
  /** Se está ativo */
  active: boolean
}
