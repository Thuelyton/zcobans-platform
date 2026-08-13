/**
 * OpenAI Provider
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Implementação do provider de IA usando a API OpenAI.
 * Suporta GPT-4o e outros modelos com response_format json_object.
 */

import type { IAIProvider } from '../ai-provider.interface'
import type { AIGenerateParams, AIResponse } from '../../types'
import { getOpenAIConfig, type OpenAIConfig } from './openai.config'

/**
 * Provider de IA usando OpenAI
 *
 * @example
 * ```typescript
 * const provider = new OpenAIProvider()
 * const response = await provider.generate({
 *   messages: [
 *     { role: 'system', content: 'Você é um especialista...' },
 *     { role: 'user', content: 'Crie uma landing page...' }
 *   ],
 *   responseFormat: { type: 'json_object' },
 * })
 * ```
 */
export class OpenAIProvider implements IAIProvider {
  readonly name = 'OpenAI'
  readonly type = 'openai' as const

  private config: OpenAIConfig | null
  private dynamicImport: typeof import('openai') | null = null

  constructor(config?: Partial<OpenAIConfig>) {
    const baseConfig = getOpenAIConfig()
    this.config = baseConfig ? { ...baseConfig, ...config } : null
  }

  /**
   * Verifica se o provider está configurado e pronto para uso
   */
  isConfigured(): boolean {
    return this.config !== null && !!this.config.apiKey
  }

  /**
   * Carrega dinamicamente a biblioteca openai
   */
  private async loadOpenAI() {
    if (!this.dynamicImport) {
      this.dynamicImport = await import('openai')
    }
    return this.dynamicImport
  }

  /**
   * Gera uma resposta usando a API OpenAI
   *
   * @param params - Parâmetros para geração
   * @returns Resposta da IA
   *
   * @throws Error - Se o provider não estiver configurado ou houver erro na API
   */
  async generate(params: AIGenerateParams): Promise<AIResponse> {
    if (!this.config || !this.config.apiKey) {
      throw new Error(
        'OpenAI não está configurado. Defina a variável de ambiente OPENAI_API_KEY.'
      )
    }

    const openaiModule = await this.loadOpenAI()
    const OpenAI = openaiModule.default

    const client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseUrl,
    })

    try {
      const response = await client.chat.completions.create({
        model: params.model || this.config.model,
        messages: params.messages,
        response_format: params.responseFormat,
        temperature: params.temperature ?? this.config.temperature,
        max_tokens: params.maxTokens ?? this.config.maxTokens,
      })

      const choice = response.choices[0]

      if (!choice?.message?.content) {
        throw new Error('Resposta vazia do OpenAI')
      }

      return {
        content: choice.message.content,
        tokensUsed: response.usage?.total_tokens,
        model: response.model,
      }
    } catch (error) {
      if (error instanceof Error) {
        // Erros conhecidos da OpenAI
        if (error.message.includes('API key')) {
          throw new Error('Chave de API OpenAI inválida ou expirada.')
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Limite de taxa da API OpenAI atingido. Tente novamente em instantes.')
        }
        if (error.message.includes('quota')) {
          throw new Error('Cota da API OpenAI esgotada. Verifique seu plano.')
        }
        throw error
      }
      throw new Error('Erro desconhecido ao comunicar com OpenAI')
    }
  }
}
