/**
 * AI Provider Factory
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Factory/Registry para gerenciar providers de IA.
 * Implementa o padrão Factory + Singleton para permitir:
 * - Seleção automática do provider correto
 * - Extensão fácil para novos providers
 * - Fallback entre providers
 */

import type { IAIProvider } from './ai-provider.interface'
import type { AIProviderType, AIGenerateParams, AIResponse } from '../types'
import { OpenAIProvider } from './openai/openai.provider'
import { MockAIProvider } from './mock/mock.provider'

/**
 * Informações sobre um provider registrado
 */
interface ProviderRegistration {
  /** Instância do provider */
  provider: IAIProvider
  /** Se o provider está ativo */
  active: boolean
  /** Prioridade (menor = mais prioritário) */
  priority: number
}

/**
 * AIProviderFactory
 *
 * Factory e Registry central para providers de IA.
 *
 * @example
 * ```typescript
 * // Obtém a instância
 * const factory = AIProviderFactory.getInstance()
 *
 * // Obtém o melhor provider disponível
 * const provider = factory.getActiveProvider()
 *
 * // Gera uma resposta
 * const response = await factory.generate({
 *   messages: [...],
 *   responseFormat: { type: 'json_object' },
 * })
 * ```
 */
export class AIProviderFactory {
  private static instance: AIProviderFactory | null = null
  private providers: Map<AIProviderType, ProviderRegistration> = new Map()

  private constructor() {
    // Singleton - inicializa com providers padrão
    this.registerDefaultProviders()
  }

  /**
   * Obtém a instância singleton do factory
   */
  static getInstance(): AIProviderFactory {
    if (!AIProviderFactory.instance) {
      AIProviderFactory.instance = new AIProviderFactory()
    }
    return AIProviderFactory.instance
  }

  /**
   * Reseta a instância (útil para testes)
   */
  static resetInstance(): void {
    AIProviderFactory.instance = null
  }

  // ============================================================================
  // REGISTRATION
  // ============================================================================

  /**
   * Registra um provider
   *
   * @param provider - Instância do provider
   * @param options - Opções de registro (active, priority)
   */
  register(
    provider: IAIProvider,
    options: { active?: boolean; priority?: number } = {}
  ): void {
    this.providers.set(provider.type, {
      provider,
      active: options.active ?? true,
      priority: options.priority ?? 10,
    })
  }

  /**
   * Remove um provider registrado
   *
   * @param type - Tipo do provider
   */
  unregister(type: AIProviderType): void {
    this.providers.delete(type)
  }

  /**
   * Ativa ou desativa um provider
   *
   * @param type - Tipo do provider
   * @param active - Se deve estar ativo
   */
  setActive(type: AIProviderType, active: boolean): void {
    const registration = this.providers.get(type)
    if (registration) {
      registration.active = active
    }
  }

  // ============================================================================
  // QUERY
  // ============================================================================

  /**
   * Obtém um provider pelo tipo
   *
   * @param type - Tipo do provider
   * @returns Provider ou null
   */
  getProvider(type: AIProviderType): IAIProvider | null {
    return this.providers.get(type)?.provider || null
  }

  /**
   * Verifica se um provider está registrado e ativo
   *
   * @param type - Tipo do provider
   */
  isProviderAvailable(type: AIProviderType): boolean {
    const registration = this.providers.get(type)
    return registration?.active ?? false
  }

  /**
   * Obtém o melhor provider disponível
   *
   * Prioridade:
   * 1. OpenAI (se configurado e ativo)
   * 2. Mock (se nenhum outro disponível)
   *
   * @returns Provider ativo ou Mock como fallback
   */
  getActiveProvider(): IAIProvider {
    // Tenta OpenAI primeiro
    const openaiReg = this.providers.get('openai')
    if (openaiReg?.active && openaiReg.provider instanceof OpenAIProvider) {
      if (openaiReg.provider.isConfigured()) {
        return openaiReg.provider
      }
    }

    // Fallback para mock
    const mockReg = this.providers.get('mock')
    if (mockReg?.active) {
      return mockReg.provider
    }

    throw new Error('Nenhum provider de IA disponível')
  }

  /**
   * Lista todos os providers registrados
   */
  listProviders(): Array<{
    type: AIProviderType
    name: string
    active: boolean
    priority: number
  }> {
    return Array.from(this.providers.entries()).map(([type, reg]) => ({
      type,
      name: reg.provider.name,
      active: reg.active,
      priority: reg.priority,
    }))
  }

  // ============================================================================
  // EXECUTION
  // ============================================================================

  /**
   * Gera uma resposta usando o melhor provider disponível
   *
   * @param params - Parâmetros para geração
   * @param preferredProvider - Provider preferido (opcional)
   * @returns Resposta da IA
   */
  async generate(
    params: AIGenerateParams,
    preferredProvider?: AIProviderType
  ): Promise<AIResponse> {
    // Se provider preferido especificado e disponível
    if (preferredProvider) {
      const provider = this.getProvider(preferredProvider)
      if (provider && this.isProviderAvailable(preferredProvider)) {
        return provider.generate(params)
      }
    }

    // Caso contrário, usa o melhor disponível
    const provider = this.getActiveProvider()
    return provider.generate(params)
  }

  // ============================================================================
  // DEFAULT PROVIDERS
  // ============================================================================

  /**
   * Registra providers padrão
   */
  private registerDefaultProviders(): void {
    // Registra Mock Provider (sempre disponível)
    const mockProvider = new MockAIProvider()
    this.register(mockProvider, { active: true, priority: 100 })

    // Registra OpenAI Provider (pode não estar configurado)
    const openaiProvider = new OpenAIProvider()
    this.register(openaiProvider, {
      active: openaiProvider.isConfigured(),
      priority: 1,
    })
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Função helper para gerar uma resposta de IA
 *
 * @param params - Parâmetros para geração
 * @returns Resposta da IA
 */
export async function generateWithAI(
  params: AIGenerateParams
): Promise<AIResponse> {
  const factory = AIProviderFactory.getInstance()
  return factory.generate(params)
}

/**
 * Função helper para verificar se há um provider disponível
 */
export function isAIProviderAvailable(): boolean {
  const factory = AIProviderFactory.getInstance()
  const provider = factory.getActiveProvider()
  return provider !== null
}
