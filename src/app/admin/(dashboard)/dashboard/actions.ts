'use server'

import { createClient } from '@/lib/supabase/server'
import { executeSupabaseOperation } from '@/lib/errors'

export interface DashboardStats {
  totalLeads: number
  activeBanners: number
  totalServices: number
  totalStatuses: number
  outageCount: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  // Execute all queries in parallel
  const [leadsResult, bannersResult, servicesResult, statusesResult] = await Promise.all([
    executeSupabaseOperation(async () =>
      await supabase.from('leads').select('id', { count: 'exact', head: true })
    ),
    executeSupabaseOperation(async () =>
      await supabase.from('banners').select('id', { count: 'exact', head: true }).eq('active', true)
    ),
    executeSupabaseOperation(async () =>
      await supabase.from('services').select('id', { count: 'exact', head: true })
    ),
    executeSupabaseOperation(async () =>
      await supabase.from('service_status').select('id', { count: 'exact', head: true })
    ),
  ])

  // Get outage count from statuses
  const outageResult = await executeSupabaseOperation(async () =>
    await supabase.from('service_status').select('id', { count: 'exact', head: true }).eq('status', 'outage')
  )

  return {
    totalLeads: leadsResult.success ? (leadsResult.data as unknown as { count: number }[])?.length ?? 0 : 0,
    activeBanners: bannersResult.success ? (bannersResult.data as unknown as { count: number }[])?.length ?? 0 : 0,
    totalServices: servicesResult.success ? (servicesResult.data as unknown as { count: number }[])?.length ?? 0 : 0,
    totalStatuses: statusesResult.success ? (statusesResult.data as unknown as { count: number }[])?.length ?? 0 : 0,
    outageCount: outageResult.success ? (outageResult.data as unknown as { count: number }[])?.length ?? 0 : 0,
  }
}
