'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { trustIndicatorSchema, TrustIndicatorFormData } from '@/lib/validations/trust'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getTrustIndicators() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('trust_indicators').select('*').order('position', { ascending: true })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function createTrustIndicator(data: TrustIndicatorFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(trustIndicatorSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('trust_indicators').insert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/settings/trust')
  }

  return result
}

export async function updateTrustIndicator(id: string, data: TrustIndicatorFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(trustIndicatorSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('trust_indicators').update(validationResult.data).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/settings/trust')
  }

  return result
}

export async function deleteTrustIndicator(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('trust_indicators').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/settings/trust')
  }

  return result
}
