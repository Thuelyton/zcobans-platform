'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateLeadStatusSchema } from '@/lib/validations/lead'
import type { LeadStatus } from '@/lib/validations/lead'
import { 
  validateData, 
  executeSupabaseOperation, 
  executeSupabaseMutation 
} from '@/lib/errors'

export async function getLeads() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('leads').select('*').order('created_at', { ascending: false })
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient()
  
  const validationResult = validateData(updateLeadStatusSchema, { id, status })
  if (!validationResult.success) {
    return validationResult
  }

  const result = await executeSupabaseMutation(async () =>
    await supabase.from('leads').update({ status }).eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/leads')
  }

  return result
}

export async function deleteLead(id: string) {
  const supabase = await createClient()
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('leads').delete().eq('id', id)
  )

  if (result.success) {
    revalidatePath('/admin/leads')
  }

  return result
}
