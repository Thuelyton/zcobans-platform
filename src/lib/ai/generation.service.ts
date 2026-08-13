/**
 * Generation Service
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Service principal para geração de landing pages.
 * Coordena: validação → prompt → IA → validação → normalização → retorno
 */

import { randomUUID } from 'crypto'
import type {
  GenerateLandingPageInput,
  GenerateLandingPageResult,
  LandingPage,
  LandingPageSection,
  LandingPageElement,
} from './types'
import {
  generateLandingPageInputSchema,
  landingPageSchema,
  rawLandingPageSchema,
} from './schemas'
import { AIProviderFactory } from './providers/ai-provider.factory'
import { buildGenerationPrompt, buildCorrectionPrompt } from './prompt/prompt-builder'
import { checkRateLimit } from './rate-limit'
import type { ActionResult } from '../errors'

/**
 * Configuração do service
 */
interface GenerationServiceConfig {
  /** Máximo de tentativas de correção */
  maxRetries: number
  /** Limite de requisições por minuto por IP */
  rateLimitMax: number
  /** Janela de rate limit em ms */
  rateLimitWindowMs: number
}

const DEFAULT_CONFIG: GenerationServiceConfig = {
  maxRetries: 2,
  rateLimitMax: 10,
  rateLimitWindowMs: 60 * 1000, // 1 minuto
}

/**
 * GenerationService
 *
 * Service para geração de landing pages com IA.
 *
 * @example
 * ```typescript
 * const service = new GenerationService()
 *
 * const result = await service.generate({
 *   prompt: 'Crie uma landing page para clínica de estética',
 *   options: { style: 'modern' }
 * })
 *
 * if (result.success) {
 *   console.log(result.data.landingPage)
 * }
 * ```
 */
export class GenerationService {
  private config: GenerationServiceConfig

  constructor(config?: Partial<GenerationServiceConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Gera uma landing page a partir de um prompt
   *
   * @param input - Dados de entrada (prompt e opções)
   * @param rateLimitKey - Chave para rate limiting (geralmente IP)
   * @returns Resultado da geração ou erro
   */
  async generate(
    input: GenerateLandingPageInput,
    rateLimitKey?: string
  ): Promise<ActionResult<GenerateLandingPageResult>> {
    // 1. Validar input
    const inputValidation = generateLandingPageInputSchema.safeParse(input)
    if (!inputValidation.success) {
      const messages = inputValidation.error.issues.map((i) => i.message)
      return {
        success: false,
        error: messages.join(', '),
        code: 'VALIDATION_ERROR',
      }
    }

    const validatedInput = inputValidation.data

    // 2. Verificar rate limit
    if (rateLimitKey) {
      const rateCheck = checkRateLimit(rateLimitKey, {
        maxRequests: this.config.rateLimitMax,
        windowMs: this.config.rateLimitWindowMs,
      })

      if (!rateCheck.allowed) {
        return {
          success: false,
          error: 'Limite de requisições atingido. Aguarde alguns instantes e tente novamente.',
          code: 'RATE_LIMIT_EXCEEDED',
        }
      }
    }

    // 3. Construir prompt
    const prompt = buildGenerationPrompt({
      userPrompt: validatedInput.prompt,
      style: validatedInput.options?.style,
      sections: validatedInput.options?.sections,
    })

    // 4. Chamar IA com retry
    let lastError: string | null = null
    let rawResponse: string | null = null

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const factory = AIProviderFactory.getInstance()
        const aiResponse = await factory.generate(prompt)
        rawResponse = aiResponse.content

        // 5. Tentar parse e validação
        const parseResult = await this.parseAndValidate(rawResponse, validatedInput.prompt)

        if (parseResult.success) {
          return {
            success: true,
            data: {
              landingPage: parseResult.data,
              tokensUsed: aiResponse.tokensUsed,
              model: aiResponse.model,
            },
          }
        }

        lastError = parseResult.error

        // Se falhou, tenta com prompt de correção
        if (attempt < this.config.maxRetries) {
          const correctionPrompt = buildCorrectionPrompt(
            rawResponse,
            validatedInput.prompt
          )
          const correctionResponse = await factory.generate(correctionPrompt)
          rawResponse = correctionResponse.content

          const correctionResult = await this.parseAndValidate(
            rawResponse,
            validatedInput.prompt
          )

          if (correctionResult.success) {
            return {
              success: true,
              data: {
                landingPage: correctionResult.data,
                tokensUsed: (aiResponse.tokensUsed || 0) + (correctionResponse.tokensUsed || 0),
                model: aiResponse.model,
              },
            }
          }

          lastError = correctionResult.error
        }
      } catch (error) {
        lastError =
          error instanceof Error ? error.message : 'Erro desconhecido na geração'
      }
    }

    return {
      success: false,
      error: lastError || 'Falha ao gerar landing page após múltiplas tentativas',
      code: 'GENERATION_FAILED',
    }
  }

  /**
   * Faz parse do JSON e valida com o schema
   *
   * @param rawJson - JSON string da IA
   * @param originalPrompt - Prompt original (para normalização)
   * @returns Landing page validada ou erro
   */
  private async parseAndValidate(
    rawJson: string,
    _originalPrompt: string
  ): Promise<{ success: true; data: LandingPage } | { success: false; error: string }> {
    // 1. Parse do JSON
    let parsed: unknown
    try {
      parsed = JSON.parse(rawJson)
    } catch {
      return {
        success: false,
        error: 'Resposta da IA não é um JSON válido',
      }
    }

    // 2. Validação flexível primeiro (rawLandingPageSchema)
    const rawValidation = rawLandingPageSchema.safeParse(parsed)
    if (!rawValidation.success) {
      return {
        success: false,
        error: 'Estrutura da resposta não corresponde ao esperado',
      }
    }

    // 3. Normalizar dados
    const normalized = this.normalizeLandingPage(rawValidation.data)

    // 4. Validação rigorosa
    const fullValidation = landingPageSchema.safeParse(normalized)
    if (!fullValidation.success) {
      const issues = fullValidation.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ')
      return {
        success: false,
        error: `Dados inválidos: ${issues}`,
      }
    }

    return {
      success: true,
      data: fullValidation.data,
    }
  }

  /**
   * Normaliza os dados brutos da IA para o schema correto
   *
   * @param raw - Dados brutos da IA
   * @returns Landing page normalizada
   */
  private normalizeLandingPage(
    raw: ReturnType<typeof rawLandingPageSchema.parse>
  ): LandingPage {
    const now = new Date().toISOString()
    const title = raw.title || raw.settings?.title || 'Landing Page Sem Título'
    const slug = this.generateSlug(title)

    return {
      id: randomUUID(),
      title,
      description: raw.description,
      slug,
      sections: this.normalizeSections(raw.sections || []),
      settings: {
        title: raw.settings?.title || title,
        description: raw.description,
        primaryColor: raw.settings?.primaryColor,
        secondaryColor: raw.settings?.secondaryColor,
      },
      createdAt: now,
      updatedAt: now,
    }
  }

  /**
   * Normaliza as seções da landing page
   */
  private normalizeSections(
    rawSections: Array<{
      type?: string
      title?: string
      subtitle?: string
      content?: string
      elements?: Array<{ type?: string; content?: string; text?: string }>
    }>
  ): LandingPageSection[] {
    const validSectionTypes = [
      'hero', 'features', 'testimonial', 'cta',
      'faq', 'contact', 'pricing', 'gallery', 'about',
    ]
    const validElementTypes = [
      'heading', 'text', 'image', 'button',
      'input', 'video', 'divider', 'spacer', 'icon',
    ]

    return rawSections.map((section, sectionIndex) => {
      const sectionType = validSectionTypes.includes(section.type || '')
        ? section.type!
        : sectionIndex === 0
          ? 'hero'
          : 'features'

      // Normaliza elementos
      const rawElements = section.elements || []
      const elements: LandingPageElement[] =
        rawElements.length > 0
          ? rawElements.map((el) => ({
              id: randomUUID(),
              type: validElementTypes.includes(el.type || '')
                ? (el.type as LandingPageElement['type'])
                : 'text',
              content: el.content || el.text || '',
            }))
          : [
              {
                id: randomUUID(),
                type: 'heading' as const,
                content: section.title || section.content || 'Título da Seção',
              },
            ]

      return {
        id: randomUUID(),
        type: sectionType as LandingPageSection['type'],
        title: section.title,
        subtitle: section.subtitle,
        elements,
        settings: {
          alignment: 'center' as const,
          padding: 'md' as const,
        },
      }
    })
  }

  /**
   * Gera um slug a partir de um título
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 200)
  }
}

/**
 * Instância singleton do service para uso geral
 */
let serviceInstance: GenerationService | null = null

/**
 * Obtém a instância do GenerationService
 */
export function getGenerationService(): GenerationService {
  if (!serviceInstance) {
    serviceInstance = new GenerationService()
  }
  return serviceInstance
}

/**
 * Reseta a instância do service (para testes)
 */
export function resetGenerationService(): void {
  serviceInstance = null
}
