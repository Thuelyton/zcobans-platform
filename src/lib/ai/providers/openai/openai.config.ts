/**
 * OpenAI Provider Configuration
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Configuração do provider OpenAI.
 * As chaves de API NUNCA são expostas no frontend.
 */

/**
 * Configuração do OpenAI
 */
export interface OpenAIConfig {
  /** Chave da API OpenAI */
  apiKey: string
  /** Modelo padrão a ser usado */
  model: string
  /** URL base da API (para proxies) */
  baseUrl?: string
  /** Máximo de tokens por requisição */
  maxTokens: number
  /** Temperatura padrão */
  temperature: number
}

/**
 * Obtém a configuração do OpenAI a partir das variáveis de ambiente
 *
 * @returns Configuração do OpenAI ou null se não configurado
 */
export function getOpenAIConfig(): OpenAIConfig | null {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return null
  }

  return {
    apiKey,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    baseUrl: process.env.OPENAI_BASE_URL,
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4096', 10),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  }
}

/**
 * Verifica se o OpenAI está configurado
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}
