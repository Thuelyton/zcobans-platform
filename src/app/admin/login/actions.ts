'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  // 1. Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Check if the user is an active admin in our admin_users table
  // Since we have RLS enabled and is_admin function, we can query admin_users.
  // We'll bypass RLS for this specific check if needed, or if the policy "Admins have full access" includes themselves.
  // Actually, wait, the policy `is_admin()` checks if `auth.uid()` is in `admin_users` and active.
  // So if they are an admin, they can read the row.
  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('id, active')
    .eq('id', authData.user.id)
    .single()

  if (adminError || !adminData || !adminData.active) {
    // Not an admin or not active, sign them out immediately
    await supabase.auth.signOut()
    return { error: 'Unauthorized: You do not have active admin privileges.' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}
