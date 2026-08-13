'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { contentSchema, ContentFormData } from '@/lib/validations/content'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getContentSections() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('content_sections').select('*').order('identifier', { ascending: true })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function upsertContentSection(data: ContentFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(contentSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('content_sections').upsert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/content')
  }

  return result
}

export async function deleteContentSection(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('content_sections').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/content')
  }

  return result
}
