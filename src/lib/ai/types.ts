/**
 * AI Generation Module Types
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Tipos para o domínio de Landing Pages geradas por IA.
 * Nenhum HTML ou código React é gerado — apenas dados estruturados.
 */

// ============================================================================
// ENUMS / CONSTANTS
// ============================================================================

/**
 * Tipos de seção disponíveis para uma landing page
 */
export const SECTION_TYPES = [
  'hero',
  'features',
  'testimonial',
  'cta',
  'faq',
  'contact',
  'pricing',
  'gallery',
  'about',
] as const
export type SectionType = (typeof SECTION_TYPES)[number]

/**
 * Tipos de elemento disponíveis dentro de uma seção
 */
export const ELEMENT_TYPES = [
  'heading',
  'text',
  'image',
  'button',
  'input',
  'video',
  'divider',
  'spacer',
  'icon',
] as const
export type ElementType = (typeof ELEMENT_TYPES)[number]

/**
 * Alinhamento de conteúdo
 */
export const ALIGNMENTS = ['left', 'center', 'right'] as const
export type Alignment = (typeof ALIGNMENTS)[number]

/**
 * Variações de cor para seções
 */
export const COLOR_VARIANTS = [
  'primary',
  'secondary',
  'accent',
  'dark',
  'light',
  'gradient',
] as const
export type ColorVariant = (typeof COLOR_VARIANTS)[number]

/**
 * Estilos de landing page
 */
export const LP_STYLES = ['modern', 'classic', 'minimal'] as const
export type LPStyle = (typeof LP_STYLES)[number]

/**
 * Provider types para IA
 */
export const AI_PROVIDER_TYPES = ['openai', 'anthropic', 'mock'] as const
export type AIProviderType = (typeof AI_PROVIDER_TYPES)[number]

// ============================================================================
// LANDING PAGE TYPES
// ============================================================================

/**
 * Elemento de uma seção da landing page
 */
export interface LandingPageElement {
  /** ID único do elemento (UUID) */
  id: string
  /** Tipo do elemento */
  type: ElementType
  /** Conteúdo do elemento (texto, URL, etc.) */
  content: string
  /** Propriedades adicionais específicas do tipo */
  props?: Record<string, unknown>
}

/**
 * Configurações visuais de uma seção
 */
export interface SectionSettings {
  /** Cor de fundo da seção */
  backgroundColor?: ColorVariant
  /** Alinhamento do conteúdo */
  alignment?: Alignment
  /** Espaçamento vertical */
  padding?: 'sm' | 'md' | 'lg'
  /** Se a seção deve ocupar largura total */
  fullWidth?: boolean
}

/**
 * Seção da landing page
 */
export interface LandingPageSection {
  /** ID único da seção (UUID) */
  id: string
  /** Tipo da seção */
  type: SectionType
  /** Título da seção (opcional) */
  title?: string
  /** Subtítulo da seção (opcional) */
  subtitle?: string
  /** Elementos dentro da seção */
  elements: LandingPageElement[]
  /** Configurações visuais da seção */
  settings?: SectionSettings
}

/**
 * Configurações globais da landing page
 */
export interface LandingPageSettings {
  /** Título da landing page */
  title: string
  /** Descrição/meta description */
  description?: string
  /** Cor primária (hex) */
  primaryColor?: string
  /** Cor secundária (hex) */
  secondaryColor?: string
  /** Fonte principal */
  fontFamily?: string
  /** URL do favicon */
  favicon?: string
  /** URL da imagem Open Graph */
  ogImage?: string
}

/**
 * Landing Page completa (estrutura gerada pela IA)
 */
export interface LandingPage {
  /** ID único da landing page (UUID) */
  id: string
  /** Título da landing page */
  title: string
  /** Descrição opcional */
  description?: string
  /** Slug para URL */
  slug: string
  /** Seções da landing page */
  sections: LandingPageSection[]
  /** Configurações globais */
  settings: LandingPageSettings
  /** Data de criação (ISO string) */
  createdAt?: string
  /** Data de atualização (ISO string) */
  updatedAt?: string
}

// ============================================================================
// AI PROVIDER TYPES
// ============================================================================

/**
 * Mensagem de chat para o provedor de IA
 */
export interface ChatMessage {
  /** Papel da mensagem */
  role: 'system' | 'user' | 'assistant'
  /** Conteúdo da mensagem */
  content: string
}

/**
 * Parâmetros para geração de IA
 */
export interface AIGenerateParams {
  /** Mensagens do chat */
  messages: ChatMessage[]
  /** Formato de resposta esperado */
  responseFormat?: { type: 'json_object' }
  /** Temperatura (0-2) */
  temperature?: number
  /** Máximo de tokens */
  maxTokens?: number
  /** Modelo específico a usar */
  model?: string
}

/**
 * Resposta do provedor de IA
 */
export interface AIResponse {
  /** Conteúdo da resposta (JSON string) */
  content: string
  /** Tokens utilizados */
  tokensUsed?: number
  /** Modelo utilizado */
  model?: string
}

/**
 * Interface abstrata para provedores de IA
 */
export interface IAIProvider {
  /** Nome do provider */
  readonly name: string
  /** Tipo do provider */
  readonly type: AIProviderType

  /**
   * Gera uma resposta usando IA
   * @param params - Parâmetros para geração
   * @returns Resposta da IA
   */
  generate(params: AIGenerateParams): Promise<AIResponse>
}

// ============================================================================
// INPUT / OUTPUT TYPES
// ============================================================================

/**
 * Input para geração de landing page
 */
export interface GenerateLandingPageInput {
  /** Prompt/briefing do usuário */
  prompt: string
  /** Opções adicionais */
  options?: {
    /** Estilo visual */
    style?: LPStyle
    /** Seções específicas a incluir */
    sections?: SectionType[]
  }
}

/**
 * Resultado da geração de landing page
 */
export interface GenerateLandingPageResult {
  /** Landing page gerada */
  landingPage: LandingPage
  /** Tokens utilizados na geração */
  tokensUsed?: number
  /** Modelo utilizado */
  model?: string
}

/**
 * Configuração do provider de IA
 */
export interface AIProviderConfig {
  /** Chave da API */
  apiKey: string
  /** Modelo padrão */
  model?: string
  /** URL base (para provedores customizados) */
  baseUrl?: string
}
