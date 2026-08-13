/**
 * Visual Designer Schemas
 * ZCobans Visual Designer
 *
 * Schemas Zod para validação dos dados do Designer.
 */

import { z } from 'zod'
import {
  ELEMENT_TYPES,
  SECTION_TYPES,
  FONT_SIZES,
  FONT_WEIGHTS,
  ALIGNMENTS,
  BUTTON_VARIANTS,
} from './types'

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

export const elementTypeSchema = z.enum(ELEMENT_TYPES)
export const sectionTypeSchema = z.enum(SECTION_TYPES)
export const fontSizeSchema = z.enum(FONT_SIZES)
export const fontWeightSchema = z.enum(FONT_WEIGHTS)
export const alignmentSchema = z.enum(ALIGNMENTS)
export const buttonVariantSchema = z.enum(BUTTON_VARIANTS)

// ============================================================================
// SPACING SCHEMA
// ============================================================================

export const spacingSchema = z.object({
  top: z.string().default('0'),
  bottom: z.string().default('0'),
  left: z.string().default('0'),
  right: z.string().default('0'),
})

// ============================================================================
// ELEMENT SCHEMAS
// ============================================================================

export const headingPropsSchema = z.object({
  text: z.string().min(1).max(500),
  level: z.enum(['h1', 'h2', 'h3', 'h4']),
})

export const textPropsSchema = z.object({
  text: z.string().min(1).max(5000),
})

export const buttonPropsSchema = z.object({
  text: z.string().min(1).max(100),
  url: z.string().max(500),
  variant: buttonVariantSchema,
})

export const imagePropsSchema = z.object({
  url: z.string().url().max(2000),
  alt: z.string().max(500),
})

export const elementPropsSchema = z.union([
  headingPropsSchema,
  textPropsSchema,
  buttonPropsSchema,
  imagePropsSchema,
])

export const elementStylesSchema = z.object({
  fontSize: fontSizeSchema.optional(),
  fontWeight: fontWeightSchema.optional(),
  color: z.string().max(20).optional(),
  backgroundColor: z.string().max(20).optional(),
  padding: spacingSchema.optional(),
  margin: spacingSchema.optional(),
  alignment: alignmentSchema.optional(),
  borderRadius: z.string().max(20).optional(),
  maxWidth: z.string().max(20).optional(),
})

export const designerElementSchema = z.object({
  id: z.string().uuid(),
  type: elementTypeSchema,
  order: z.number().int().min(0),
  props: elementPropsSchema,
  styles: elementStylesSchema,
})

// ============================================================================
// SECTION SCHEMAS
// ============================================================================

export const sectionStylesSchema = z.object({
  backgroundColor: z.string().max(20),
  backgroundGradient: z.string().max(200).optional(),
  padding: spacingSchema,
  maxWidth: z.string().max(20).optional(),
  alignment: alignmentSchema,
})

export const designerSectionSchema = z.object({
  id: z.string().uuid(),
  type: sectionTypeSchema,
  order: z.number().int().min(0),
  title: z.string().min(1).max(200),
  elements: z.array(designerElementSchema),
  styles: sectionStylesSchema,
})

// ============================================================================
// PAGE SCHEMAS
// ============================================================================

export const pageSettingsSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  primaryColor: z.string().max(20),
  secondaryColor: z.string().max(20),
  fontFamily: z.string().max(100),
})

export const designerPageSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  sections: z.array(designerSectionSchema),
  settings: pageSettingsSchema,
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    version: z.number().int().min(1),
  }),
})

// ============================================================================
// INPUT SCHEMAS
// ============================================================================

export const savePageInputSchema = z.object({
  page: designerPageSchema,
})

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SpacingSchema = z.infer<typeof spacingSchema>
export type ElementPropsSchema = z.infer<typeof elementPropsSchema>
export type ElementStylesSchema = z.infer<typeof elementStylesSchema>
export type DesignerElementSchema = z.infer<typeof designerElementSchema>
export type SectionStylesSchema = z.infer<typeof sectionStylesSchema>
export type DesignerSectionSchema = z.infer<typeof designerSectionSchema>
export type PageSettingsSchema = z.infer<typeof pageSettingsSchema>
export type DesignerPageSchema = z.infer<typeof designerPageSchema>
