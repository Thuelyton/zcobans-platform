'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { promotionSchema, PromotionFormData } from '@/lib/validations/promotion'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getPromotions() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('promotions').select('*').order('created_at', { ascending: false })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function createPromotion(data: PromotionFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(promotionSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('promotions').insert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/promotions')
  }

  return result
}

export async function updatePromotion(id: string, data: PromotionFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(promotionSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('promotions').update(validationResult.data).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/promotions')
  }

  return result
}

export async function deletePromotion(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('promotions').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/promotions')
  }

  return result
}
