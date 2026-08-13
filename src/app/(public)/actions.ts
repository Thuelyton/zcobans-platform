'use server'

import { createClient } from '@/lib/supabase/server'
import { createLeadSchema } from '@/lib/validations/lead'
import type { CreateLeadFormData } from '@/lib/validations/lead'
import {
  validateData,
  executeSupabaseOperation,
  executeSupabaseMutation,
  success,
} from '@/lib/errors'

// ============================================================
// Public Queries - Banners
// ============================================================

export async function getPublicBanners() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('banners')
      .select('id, title, subtitle, image_url, link_url, button_text, position')
      .eq('active', true)
      .order('position', { ascending: true })
  )

  if (!result.success) throw new Error(result.error)
  return result.data
}

// ============================================================
// Public Queries - Categories
// ============================================================

export async function getPublicCategories() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('service_categories')
      .select('id, name, slug, description, image_url, position')
      .eq('active', true)
      .order('position', { ascending: true })
  )

  if (!result.success) throw new Error(result.error)
  return result.data
}

// ============================================================
// Public Queries - Services
// ============================================================

export async function getPublicServices(categoryId?: string) {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () => {
    let query = supabase
      .from('services')
      .select('id, name, slug, short_description, image_url, price, position, category_id')
      .eq('active', true)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    return query.order('position', { ascending: true })
  })

  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function getPublicServiceBySlug(slug: string) {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('services')
      .select('id, name, slug, description, short_description, features, price, image_url, category_id')
      .eq('slug', slug)
      .eq('active', true)
      .single()
  )

  return result
}

export async function getPublicServicesWithCategory() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('services')
      .select('id, name, slug, short_description, image_url, price, position, category:service_categories(id, name, slug)')
      .eq('active', true)
      .order('position', { ascending: true })
  )

  if (!result.success) throw new Error(result.error)
  return result.data
}

// ============================================================
// Public Queries - Promotions
// ============================================================

export async function getPublicPromotions() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('promotions')
      .select('id, title, description, discount_type, discount_value, code, starts_at, ends_at')
      .eq('active', true)
      .order('created_at', { ascending: false })
  )

  if (!result.success) throw new Error(result.error)
  return result.data
}

// ============================================================
// Public Queries - FAQ
// ============================================================

export async function getPublicFaqItems() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('faq_items')
      .select('id, question, answer, category, position')
      .eq('active', true)
      .order('position', { ascending: true })
  )

  if (!result.success) throw new Error(result.error)
  return result.data
}

// ============================================================
// Public Queries - Trust Indicators
// ============================================================

export async function getPublicTrustIndicators() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('trust_indicators')
      .select('id, type, title, description, image_url, position')
      .eq('active', true)
      .order('position', { ascending: true })
  )

  if (!result.success) throw new Error(result.error)
  return result.data
}

// ============================================================
// Public Queries - Contact Settings
// ============================================================

export async function getPublicContactSettings() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('contact_settings')
      .select('email, phone, whatsapp, address, maps_url, business_hours')
      .limit(1)
      .single()
  )

  if (!result.success) return success(null)
  return result
}

// ============================================================
// Public Queries - Content Sections
// ============================================================

export async function getPublicContentSection(identifier: string) {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('content_sections')
      .select('id, identifier, title, content')
      .eq('identifier', identifier)
      .eq('active', true)
      .single()
  )

  return result
}

// ============================================================
// Public Queries - Site Settings
// ============================================================

export async function getPublicSiteSettings() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase
      .from('site_settings')
      .select('site_name, site_description, logo_url, social_links')
      .limit(1)
      .single()
  )

  if (!result.success) return success(null)
  return result
}

// ============================================================
// Public Mutations - Create Lead
// ============================================================

export async function createLead(data: CreateLeadFormData) {
  const supabase = await createClient()

  const validationResult = validateData(createLeadSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('leads').insert({
      name: validationResult.data.name,
      email: validationResult.data.email,
      phone: validationResult.data.phone || null,
      company: validationResult.data.company || null,
      message: validationResult.data.message || null,
      source: validationResult.data.source || null,
      status: 'new',
    })
  )

  return result
}

// ============================================================
// AI Generation - Landing Pages
// ============================================================

/**
 * Server Action para geração de landing pages com IA
 *
 * Esta action valida o input, chama o service de geração,
 * e retorna a landing page estruturada.
 *
 * @param data - Dados de entrada (prompt e opções)
 * @returns ActionResult com a landing page ou erro
 *
 * @example
 * ```typescript
 * const result = await generateLandingPage({
 *   prompt: 'Crie uma landing page para clínica de estética',
 *   options: { style: 'modern' }
 * })
 * ```
 */
export async function generateLandingPage(
  data: import('@/lib/ai/types').GenerateLandingPageInput
) {
  // Importa dinamicamente para evitar problemas de SSR
  const { GenerationService } = await import('@/lib/ai/generation.service')
  const { generateLandingPageInputSchema } = await import('@/lib/ai/schemas')

  // Valida o input
  const validationResult = generateLandingPageInputSchema.safeParse(data)
  if (!validationResult.success) {
    const messages = validationResult.error.issues.map((i) => i.message)
    return {
      success: false as const,
      error: messages.join(', '),
      code: 'VALIDATION_ERROR' as const,
    }
  }

  // Gera a landing page
  const service = new GenerationService()
  const result = await service.generate(
    validationResult.data,
    `public-${Date.now()}` // Rate limit key simplificado para anônimos
  )

  return result
}
