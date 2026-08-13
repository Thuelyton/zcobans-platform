'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { statusSchema, StatusFormData } from '@/lib/validations/status'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getStatuses() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('service_status').select('*, service:services(name)').order('created_at', { ascending: false })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function updateServiceStatus(data: StatusFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(statusSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('service_status').upsert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/status')
  }

  return result
}

export async function deleteStatus(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('service_status').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/status')
  }

  return result
}
