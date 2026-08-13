'use client'

/**
 * Designer Projects Page
 * ZCobans Visual Designer
 *
 * Página de gerenciamento de projetos do Designer.
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Layers, 
  MoreVertical, 
  Pencil, 
  Copy, 
  Trash2, 
  ExternalLink,
  Loader2,
  AlertCircle,
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  listProjects, 
  createProject, 
  deleteProject, 
  updateProject,
  isAuthenticated 
} from '@/lib/designer/client-repository'
import { createDefaultPage } from '@/lib/designer/templates'
import type { DesignerProject } from '@/lib/designer/client-repository'

export default function ProjectsPage() {
  const router = useRouter()
  
  // State
  const [projects, setProjects] = useState<DesignerProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<DesignerProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Load projects
  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const auth = await isAuthenticated()
      setIsAuthenticatedUser(auth)
      
      if (!auth) {
        setIsLoading(false)
        return
      }
      
      const data = await listProjects()
      setProjects(data)
      setFilteredProjects(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar projetos'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // Filter projects by search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = projects.filter(p => 
        p.name.toLowerCase().includes(query)
      )
      setFilteredProjects(filtered)
    }
  }, [searchQuery, projects])

  // Create new project
  const handleCreateProject = async () => {
    setIsCreating(true)
    setError(null)
    
    try {
      const defaultPage = createDefaultPage()
      const project = await createProject({
        name: defaultPage.title,
        slug: defaultPage.slug,
        description: defaultPage.description,
        page_data: defaultPage,
      })
      
      // Navigate to designer with the new project
      router.push(`/designer?id=${project.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar projeto'
      setError(message)
    } finally {
      setIsCreating(false)
    }
  }

  // Open project
  const handleOpenProject = (project: DesignerProject) => {
    router.push(`/designer?id=${project.id}`)
  }

  // Duplicate project
  const handleDuplicateProject = async (project: DesignerProject) => {
    try {
      const newPage = {
        ...project.page_data,
        title: `${project.page_data.title} (Cópia)`,
        slug: `${project.page_data.slug}-copia-${Date.now()}`,
        metadata: {
          ...project.page_data.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
      
      await createProject({
        name: `${project.name} (Cópia)`,
        slug: `${project.slug}-copia-${Date.now()}`,
        description: project.description || undefined,
        page_data: newPage,
      })
      
      await loadProjects()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao duplicar projeto'
      setError(message)
    }
  }

  // Start rename
  const handleStartRename = (project: DesignerProject) => {
    setRenamingId(project.id)
    setRenameValue(project.name)
    setActiveMenu(null)
  }

  // Save rename
  const handleSaveRename = async (projectId: string) => {
    if (!renameValue.trim()) {
      setError('Nome não pode ser vazio')
      return
    }
    
    try {
      await updateProject(projectId, { name: renameValue.trim() })
      setRenamingId(null)
      setRenameValue('')
      await loadProjects()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao renomear projeto'
      setError(message)
    }
  }

  // Cancel rename
  const handleCancelRename = () => {
    setRenamingId(null)
    setRenameValue('')
  }

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      setDeleteConfirmId(null)
      await loadProjects()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir projeto'
      setError(message)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Not authenticated state
  if (!isLoading && !isAuthenticatedUser) {
    return (
      <div className="min-h-screen bg-[#0a0f1a]">
        <header className="border-b border-slate-800 bg-[#0d1117] px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Meus Projetos</span>
            </div>
          </div>
        </header>
        
        <main className="flex flex-col items-center justify-center py-24">
          <AlertCircle className="h-12 w-12 text-amber-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Acesso necessário
          </h2>
          <p className="text-slate-400 text-center max-w-md">
            Você precisa estar autenticado para gerenciar projetos.
            Faça login para continuar.
          </p>
          <Link href="/admin/login" className="mt-6">
            <Button>Fazer Login</Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0d1117] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/designer"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Designer</span>
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Meus Projetos</span>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateProject}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Novo Projeto
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#111827] pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mb-4" />
            <p className="text-slate-400">Carregando projetos...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24">
            <FolderOpen className="h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              {searchQuery ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
            </h3>
            <p className="text-slate-500 text-center max-w-md mb-6">
              {searchQuery 
                ? 'Tente buscar com outros termos.'
                : 'Crie seu primeiro projeto de landing page usando o Designer visual.'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateProject} disabled={isCreating}>
                <Plus className="h-4 w-4" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        ) : (
          /* Projects grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-xl border border-slate-800 bg-[#0d1117] p-5 transition-all hover:border-slate-700 hover:bg-[#111827]"
              >
                {/* Project info */}
                <div className="mb-4">
                  {renamingId === project.id ? (
                    /* Rename input */
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(project.id)
                          if (e.key === 'Escape') handleCancelRename()
                        }}
                        className="flex-1 rounded-lg border border-emerald-500 bg-[#111827] px-3 py-1.5 text-sm text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(project.id)}
                        className="text-emerald-400 hover:text-emerald-300 text-sm"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="text-slate-500 hover:text-slate-400 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    /* Project name */
                    <h3 className="text-lg font-semibold text-white mb-1 truncate">
                      {project.name}
                    </h3>
                  )}
                  
                  <p className="text-xs text-slate-500">
                    {project.page_data.sections.length} seções
                  </p>
                </div>

                {/* Dates */}
                <div className="mb-4 space-y-1">
                  <p className="text-xs text-slate-500">
                    Criado: {formatDate(project.created_at)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Atualizado: {formatDate(project.updated_at)}
                  </p>
                </div>

                {/* Status badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    project.published 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {project.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleOpenProject(project)}
                    className="flex-1"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir
                  </Button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === project.id ? null : project.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {/* Dropdown menu */}
                    {activeMenu === project.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setActiveMenu(null)}
                        />
                        <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-700 bg-[#1e293b] py-1 shadow-xl">
                          <button
                            onClick={() => {
                              handleOpenProject(project)
                              setActiveMenu(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Abrir
                          </button>
                          <button
                            onClick={() => handleStartRename(project)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                            Renomear
                          </button>
                          <button
                            onClick={() => {
                              handleDuplicateProject(project)
                              setActiveMenu(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <Copy className="h-4 w-4" />
                            Duplicar
                          </button>
                          <div className="my-1 border-t border-slate-700" />
                          <button
                            onClick={() => {
                              setDeleteConfirmId(project.id)
                              setActiveMenu(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Delete confirmation modal */}
                {deleteConfirmId === project.id && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#0d1117]/95 p-4 z-10">
                    <div className="text-center">
                      <Trash2 className="h-8 w-8 text-red-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-300 mb-1">
                        Excluir projeto?
                      </p>
                      <p className="text-xs text-slate-500 mb-4">
                        &quot;{project.name}&quot; será excluído permanentemente.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
