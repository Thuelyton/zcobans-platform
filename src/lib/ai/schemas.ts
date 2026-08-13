/**
 * AI Generation Schemas
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Schemas Zod para validação das respostas da IA e inputs do usuário.
 * Todos os dados são validados antes de serem processados.
 */

import { z } from 'zod'
import {
  SECTION_TYPES,
  ELEMENT_TYPES,
  ALIGNMENTS,
  COLOR_VARIANTS,
  LP_STYLES,
} from './types'

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

/** Schema para tipo de seção */
export const sectionTypeEnum = z.enum(SECTION_TYPES)

/** Schema para tipo de elemento */
export const elementTypeEnum = z.enum(ELEMENT_TYPES)

/** Schema para alinhamento */
export const alignmentEnum = z.enum(ALIGNMENTS)

/** Schema para variante de cor */
export const colorVariantEnum = z.enum(COLOR_VARIANTS)

/** Schema para estilo de landing page */
export const lpStyleEnum = z.enum(LP_STYLES)

// ============================================================================
// ELEMENT SCHEMA
// ============================================================================

/**
 * Schema para validação de um elemento da landing page
 */
export const landingPageElementSchema = z.object({
  id: z.string().uuid('ID do elemento deve ser um UUID válido'),
  type: elementTypeEnum,
  content: z
    .string()
    .min(1, 'Elemento deve ter conteúdo')
    .max(5000, 'Conteúdo do elemento muito longo'),
  props: z.record(z.string(), z.unknown()).optional(),
})

// ============================================================================
// SECTION SETTINGS SCHEMA
// ============================================================================

/**
 * Schema para configurações visuais de uma seção
 */
export const sectionSettingsSchema = z.object({
  backgroundColor: colorVariantEnum.optional(),
  alignment: alignmentEnum.optional(),
  padding: z.enum(['sm', 'md', 'lg']).optional(),
  fullWidth: z.boolean().optional(),
})

// ============================================================================
// SECTION SCHEMA
// ============================================================================

/**
 * Schema para validação de uma seção da landing page
 */
export const landingPageSectionSchema = z.object({
  id: z.string().uuid('ID da seção deve ser um UUID válido'),
  type: sectionTypeEnum,
  title: z
    .string()
    .max(200, 'Título da seção muito longo')
    .optional(),
  subtitle: z
    .string()
    .max(500, 'Subtítulo da seção muito longo')
    .optional(),
  elements: z
    .array(landingPageElementSchema)
    .min(1, 'Seção deve ter pelo menos 1 elemento')
    .max(50, 'Seção não pode ter mais de 50 elementos'),
  settings: sectionSettingsSchema.optional(),
})

// ============================================================================
// SETTINGS SCHEMA
// ============================================================================

/**
 * Schema para configurações globais da landing page
 */
export const landingPageSettingsSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo'),
  description: z
    .string()
    .max(1000, 'Descrição muito longa')
    .optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor primária deve ser um hex válido')
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor secundária deve ser um hex válido')
    .optional(),
  fontFamily: z
    .string()
    .max(100, 'Nome da fonte muito longo')
    .optional(),
  favicon: z
    .string()
    .url('Favicon deve ser uma URL válida')
    .optional(),
  ogImage: z
    .string()
    .url('Imagem OG deve ser uma URL válida')
    .optional(),
})

// ============================================================================
// LANDING PAGE SCHEMA (FULL)
// ============================================================================

/**
 * Schema para validação completa de uma landing page
 * Usado para validar a resposta da IA
 */
export const landingPageSchema = z.object({
  id: z.string().uuid('ID da landing page deve ser um UUID válido'),
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo'),
  description: z
    .string()
    .max(1000, 'Descrição muito longa')
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .max(200, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  sections: z
    .array(landingPageSectionSchema)
    .min(1, 'Landing page deve ter pelo menos 1 seção')
    .max(20, 'Landing page não pode ter mais de 20 seções'),
  settings: landingPageSettingsSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

// ============================================================================
// INPUT SCHEMAS (for Server Action)
// ============================================================================

/**
 * Schema para validação do input de geração
 * Usado na Server Action antes de processar
 */
export const generateLandingPageInputSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt deve ter pelo menos 10 caracteres')
    .max(1000, 'Prompt deve ter no máximo 1000 caracteres')
    .trim(),
  options: z
    .object({
      style: lpStyleEnum.optional(),
      sections: z.array(sectionTypeEnum).min(1).max(9).optional(),
    })
    .optional(),
})

// ============================================================================
// RAW AI RESPONSE SCHEMA (flexible for initial parsing)
// ============================================================================

/**
 * Schema flexível para parsing inicial da resposta da IA
 * Aceita dados mais permissivos antes da normalização
 */
export const rawLandingPageSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  sections: z
    .array(
      z.object({
        type: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        content: z.string().optional(),
        elements: z
          .array(
            z.object({
              type: z.string().optional(),
              content: z.string().optional(),
              text: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  settings: z
    .object({
      title: z.string().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
    })
    .optional(),
})

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LandingPageElement = z.infer<typeof landingPageElementSchema>
export type LandingPageSection = z.infer<typeof landingPageSectionSchema>
export type LandingPageSettings = z.infer<typeof landingPageSettingsSchema>
export type LandingPage = z.infer<typeof landingPageSchema>
export type GenerateLandingPageInput = z.infer<typeof generateLandingPageInputSchema>
export type SectionSettings = z.infer<typeof sectionSettingsSchema>
