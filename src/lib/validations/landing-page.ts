/**
 * Landing Page Validations
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Validações Zod para Landing Pages.
 * Re-exporta schemas do módulo AI com alias para compatibilidade.
 */

import { z } from 'zod'
import {
  landingPageSchema,
  generateLandingPageInputSchema,
  landingPageSectionSchema,
  landingPageElementSchema,
  landingPageSettingsSchema,
  sectionSettingsSchema,
  sectionTypeEnum,
  elementTypeEnum,
  alignmentEnum,
  colorVariantEnum,
  lpStyleEnum,
} from '../ai/schemas'

// Re-exporta todos os schemas
export {
  landingPageSchema,
  generateLandingPageInputSchema,
  landingPageSectionSchema,
  landingPageElementSchema,
  landingPageSettingsSchema,
  sectionSettingsSchema,
  sectionTypeEnum,
  elementTypeEnum,
  alignmentEnum,
  colorVariantEnum,
  lpStyleEnum,
}

// Re-exporta tipos
export type { LandingPage, GenerateLandingPageInput } from '../ai/schemas'

/**
 * Schema para atualização de landing page (para uso futuro com banco)
 */
export const updateLandingPageSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo')
    .optional(),
  description: z
    .string()
    .max(1000, 'Descrição muito longa')
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .max(200, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
    .optional(),
  sections: z
    .array(landingPageSectionSchema)
    .min(1, 'Landing page deve ter pelo menos 1 seção')
    .max(20, 'Landing page não pode ter mais de 20 seções')
    .optional(),
  settings: landingPageSettingsSchema.partial().optional(),
})

/**
 * Schema para filtros de busca de landing pages (para uso futuro)
 */
export const landingPageFiltersSchema = z.object({
  search: z.string().max(200).optional(),
  style: lpStyleEnum.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(10),
})

// Tipos inferidos
export type UpdateLandingPageInput = z.infer<typeof updateLandingPageSchema>
export type LandingPageFilters = z.infer<typeof landingPageFiltersSchema>
