/**
 * AI Generation Module
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Este módulo fornece funcionalidades para geração de landing pages
 * usando inteligência artificial.
 *
 * @example
 * ```typescript
 * import { GenerationService, AIProviderFactory } from '@/lib/ai'
 *
 * // Uso básico
 * const service = new GenerationService()
 * const result = await service.generate({
 *   prompt: 'Crie uma landing page para clínica de estética',
 *   options: { style: 'modern' }
 * })
 *
 * // Verificar provider ativo
 * const factory = AIProviderFactory.getInstance()
 * const provider = factory.getActiveProvider()
 * ```
 */

// Types
export type {
  SectionType,
  ElementType,
  Alignment,
  ColorVariant,
  LPStyle,
  AIProviderType,
  ChatMessage,
  AIGenerateParams,
  AIResponse,
  IAIProvider,
  LandingPageElement,
  SectionSettings,
  LandingPageSection,
  LandingPageSettings,
  LandingPage,
  GenerateLandingPageInput,
  GenerateLandingPageResult,
  AIProviderConfig,
} from './types'

export {
  SECTION_TYPES,
  ELEMENT_TYPES,
  ALIGNMENTS,
  COLOR_VARIANTS,
  LP_STYLES,
  AI_PROVIDER_TYPES,
} from './types'

// Schemas
export {
  sectionTypeEnum,
  elementTypeEnum,
  alignmentEnum,
  colorVariantEnum,
  lpStyleEnum,
  landingPageElementSchema,
  sectionSettingsSchema,
  landingPageSectionSchema,
  landingPageSettingsSchema,
  landingPageSchema,
  generateLandingPageInputSchema,
  rawLandingPageSchema,
} from './schemas'

export type {
  LandingPageElement as LandingPageElementSchema,
  LandingPageSection as LandingPageSectionSchema,
  LandingPageSettings as LandingPageSettingsSchema,
  LandingPage as LandingPageSchema,
  GenerateLandingPageInput as GenerateLandingPageInputSchema,
  SectionSettings as SectionSettingsSchema,
} from './schemas'

// Providers
export { AIProviderFactory, generateWithAI, isAIProviderAvailable } from './providers/ai-provider.factory'
export type { IAIProvider as IAIProviderInterface } from './providers/ai-provider.interface'
export { OpenAIProvider } from './providers/openai/openai.provider'
export { MockAIProvider } from './providers/mock/mock.provider'

// Prompt
export { buildGenerationPrompt, buildCorrectionPrompt } from './prompt/prompt-builder'
export type { PromptBuilderParams, BuiltPrompt } from './prompt/prompt-builder'

// Service
export { GenerationService, getGenerationService, resetGenerationService } from './generation.service'

// Rate Limiting
export { checkRateLimit, resetRateLimit, getRateLimitStatus, clearAllRateLimits } from './rate-limit'
export type { RateLimitConfig, RateLimitResult } from './rate-limit'
