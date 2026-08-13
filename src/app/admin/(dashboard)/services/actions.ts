'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { serviceSchema, ServiceFormData } from '@/lib/validations/service'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getServices() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('services').select('*, category:service_categories(name)').order('position', { ascending: true })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function createService(data: ServiceFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(serviceSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('services').insert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/services')
  }

  return result
}

export async function updateService(id: string, data: ServiceFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(serviceSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('services').update(validationResult.data).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/services')
  }

  return result
}

export async function deleteService(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('services').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/services')
  }

  return result
}
