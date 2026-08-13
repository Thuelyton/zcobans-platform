'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { siteSettingsSchema, SiteSettingsFormData } from '@/lib/validations/settings'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation,
  success 
} from '@/lib/errors'

export async function getSiteSettings() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('site_settings').select('*').single()
  )
  
  // NOT_FOUND means no rows found, which is expected for settings
  if (!result.success && result.code === 'NOT_FOUND') {
    return success(null)
  }
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function updateSiteSettings(data: SiteSettingsFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(siteSettingsSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('site_settings').upsert({
      ...validationResult.data,
      id: data.id || '00000000-0000-0000-0000-000000000000'
    })
  )

  if (result.success) {
    revalidatePath('/admin/settings')
    revalidatePath('/')
  }

  return result
}
