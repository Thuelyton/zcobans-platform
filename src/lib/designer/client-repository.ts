/**
 * Designer Client Repository
 * ZCobans Visual Designer
 *
 * Camada de persistência client-side para projetos do Designer.
 * Utiliza Supabase Browser Client para armazenamento.
 */

import { createClient } from '@/lib/supabase/client'
import type { DesignerPage } from './types'

// ============================================================================
// TYPES
// ============================================================================

export interface DesignerProject {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  page_data: DesignerPage
  published: boolean
  created_at: string
  updated_at: string
}

export interface CreateProjectInput {
  name: string
  slug: string
  description?: string
  page_data: DesignerPage
}

export interface UpdateProjectInput {
  name?: string
  slug?: string
  description?: string
  page_data?: DesignerPage
  published?: boolean
}

export interface SaveResult {
  success: boolean
  project?: DesignerProject
  error?: string
}

// ============================================================================
// HELPERS
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertToProject(data: any): DesignerProject {
  return {
    ...data,
    page_data: typeof data.page_data === 'string' 
      ? JSON.parse(data.page_data) 
      : data.page_data,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertToProjectList(data: any[]): DesignerProject[] {
  return data.map(convertToProject)
}

// ============================================================================
// REPOSITORY
// ============================================================================

/**
 * Verifica se o usuário está autenticado
 */
async function checkAuth(): Promise<string> {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('Usuário não autenticado')
  }
  
  return user.id
}

/**
 * Cria um novo projeto
 */
export async function createProject(input: CreateProjectInput): Promise<DesignerProject> {
  const supabase = createClient()
  const userId = await checkAuth()
  
  const { data, error } = await supabase
    .from('designer_projects')
    .insert({
      user_id: userId,
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      page_data: JSON.parse(JSON.stringify(input.page_data)),
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`Erro ao criar projeto: ${error.message}`)
  }
  
  return convertToProject(data)
}

/**
 * Lista projetos do usuário atual
 */
export async function listProjects(): Promise<DesignerProject[]> {
  const supabase = createClient()
  const userId = await checkAuth()
  
  const { data, error } = await supabase
    .from('designer_projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) {
    throw new Error(`Erro ao listar projetos: ${error.message}`)
  }
  
  return convertToProjectList(data || [])
}

/**
 * Obtém um projeto pelo ID
 */
export async function getProject(id: string): Promise<DesignerProject | null> {
  const supabase = createClient()
  const userId = await checkAuth()
  
  const { data, error } = await supabase
    .from('designer_projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Erro ao buscar projeto: ${error.message}`)
  }
  
  return convertToProject(data)
}

/**
 * Obtém um projeto pelo slug
 */
export async function getProjectBySlug(slug: string): Promise<DesignerProject | null> {
  const supabase = createClient()
  const userId = await checkAuth()
  
  const { data, error } = await supabase
    .from('designer_projects')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', userId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Erro ao buscar projeto: ${error.message}`)
  }
  
  return convertToProject(data)
}

/**
 * Atualiza um projeto
 */
export async function updateProject(
  id: string, 
  input: UpdateProjectInput
): Promise<DesignerProject> {
  const supabase = createClient()
  const userId = await checkAuth()
  
  const updateData: Record<string, unknown> = {}
  
  if (input.name !== undefined) updateData.name = input.name
  if (input.slug !== undefined) updateData.slug = input.slug
  if (input.description !== undefined) updateData.description = input.description
  if (input.page_data !== undefined) updateData.page_data = JSON.parse(JSON.stringify(input.page_data))
  if (input.published !== undefined) updateData.published = input.published
  
  const { data, error } = await supabase
    .from('designer_projects')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Erro ao atualizar projeto: ${error.message}`)
  }
  
  return convertToProject(data)
}

/**
 * Deleta um projeto
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient()
  const userId = await checkAuth()
  
  const { error } = await supabase
    .from('designer_projects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  
  if (error) {
    throw new Error(`Erro ao deletar projeto: ${error.message}`)
  }
}

/**
 * Salva o projeto (upsert) com tratamento de erro
 */
export async function saveProject(
  id: string | null,
  page: DesignerPage
): Promise<SaveResult> {
  try {
    let project: DesignerProject
    
    if (id) {
      // Update existing project
      project = await updateProject(id, { page_data: page })
    } else {
      // Create new project
      project = await createProject({
        name: page.title,
        slug: page.slug,
        description: page.description,
        page_data: page,
      })
    }
    
    return { success: true, project }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('Erro ao salvar projeto:', message)
    return { success: false, error: message }
  }
}

/**
 * Verifica se o usuário está logado
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}
