'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { bannerSchema, BannerFormData } from '@/lib/validations/banner'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getBanners() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('banners').select('*').order('position', { ascending: true })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function createBanner(data: BannerFormData) {
  const supabase = await createClient()
  
  // Validate
  const validationResult = validateData(bannerSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('banners').insert(validationResult.data)
  )

  if (result.success) {
    revalidatePath('/admin/banners')
    revalidatePath('/')
  }

  return result
}

export async function updateBanner(id: string, data: BannerFormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(bannerSchema, data)
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('banners').update(validationResult.data).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/banners')
    revalidatePath('/')
  }

  return result
}

export async function deleteBanner(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('banners').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/banners')
    revalidatePath('/')
  }

  return result
}

export async function toggleBannerStatus(id: string, active: boolean) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('banners').update({ active }).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/banners')
    revalidatePath('/')
  }

  return result
}
