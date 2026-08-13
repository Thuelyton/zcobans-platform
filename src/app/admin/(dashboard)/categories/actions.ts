'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { categorySchema, CategoryFormData } from '@/lib/validations/category'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getCategories() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('service_categories').select('*').order('position', { ascending: true })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function createCategory(data: CategoryFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(categorySchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('service_categories').insert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/categories')
  }

  return result
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(categorySchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('service_categories').update(validationResult.data).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/categories')
  }

  return result
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('service_categories').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/categories')
  }

  return result
}
