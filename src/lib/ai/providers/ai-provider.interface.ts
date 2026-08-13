/**
 * AI Provider Interface
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Interface abstrata que todos os providers de IA devem implementar.
 * Segue o Provider/Adapter Pattern para permitir troca fácil de provedores.
 */

import type { AIProviderType, AIGenerateParams, AIResponse } from '../types'

/**
 * Interface base para todos os providers de IA
 *
 * Implementações devem:
 * 1. Implementar generate() para gerar respostas
 * 2. Implementar métodos de configuração se necessário
 *
 * @example
 * ```typescript
 * class MeuProvider implements IAIProvider {
 *   readonly name = 'Meu Provider'
 *   readonly type = 'openai'
 *
 *   async generate(params: AIGenerateParams): Promise<AIResponse> {
 *     // Lógica de geração
 *   }
 * }
 * ```
 */
export interface IAIProvider {
  /**
   * Nome legível do provider
   * @example 'OpenAI', 'Anthropic', 'Mock'
   */
  readonly name: string

  /**
   * Tipo do provider (usado para registro e seleção)
   */
  readonly type: AIProviderType

  /**
   * Gera uma resposta usando IA
   *
   * @param params - Parâmetros para geração (mensagens, configurações)
   * @returns Resposta da IA com conteúdo e metadados
   *
   * @throws Error - Se houver erro na geração
   *
   * @example
   * ```typescript
   * const response = await provider.generate({
   *   messages: [
   *     { role: 'system', content: 'Você é um especialista...' },
   *     { role: 'user', content: 'Crie uma landing page...' }
   *   ],
   *   responseFormat: { type: 'json_object' },
   *   temperature: 0.7,
   * })
   * ```
   */
  generate(params: AIGenerateParams): Promise<AIResponse>
}

/**
 * Factory function para criar providers
 */
export type IAIProviderFactory = () => IAIProvider

/**
 * Configuração para um provider
 */
export interface AIProviderRegistration {
  /** Instância do provider */
  provider: IAIProvider
  /** Se o provider está ativo */
  active: boolean
  /** Prioridade (menor = mais prioritário) */
  priority: number
}
