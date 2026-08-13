'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { faqSchema, FaqItemFormData } from '@/lib/validations/faq'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getFaqItems() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('faq_items').select('*').order('position', { ascending: true })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function createFaqItem(data: FaqItemFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(faqSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('faq_items').insert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/settings/faq')
  }

  return result
}

export async function updateFaqItem(id: string, data: FaqItemFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(faqSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('faq_items').update(validationResult.data).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/settings/faq')
  }

  return result
}

export async function deleteFaqItem(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('faq_items').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/settings/faq')
  }

  return result
}
