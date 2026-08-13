'use client'

/**
 * Designer Page
 * ZCobans Visual Designer
 *
 * Página principal do Visual Designer.
 * Suporta carregamento de projeto via query string ?id=xxx
 */

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DesignerProvider, useDesigner } from '@/lib/designer/store'
import { DesignerLayout } from '@/components/designer/DesignerLayout'
import { ComponentsPanel } from '@/components/designer/ComponentsPanel'
import { DesignerCanvas } from '@/components/designer/DesignerCanvas'
import { PropertiesPanel } from '@/components/designer/PropertiesPanel'
import { getProject } from '@/lib/designer/client-repository'
import { Loader2 } from 'lucide-react'

function DesignerContent() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('id')
  const { loadProject, state } = useDesigner()
  const [isLoadingProject, setIsLoadingProject] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId && state.projectId !== projectId) {
      setIsLoadingProject(true)
      setLoadError(null)
      
      getProject(projectId)
        .then((project) => {
          if (project) {
            loadProject(projectId)
          } else {
            setLoadError('Projeto não encontrado')
          }
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : 'Erro ao carregar projeto'
          setLoadError(message)
        })
        .finally(() => {
          setIsLoadingProject(false)
        })
    }
  }, [projectId, state.projectId, loadProject])

  // Loading state
  if (isLoadingProject) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1a]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1a]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{loadError}</p>
          <a 
            href="/designer/projects" 
            className="text-emerald-400 hover:text-emerald-300 text-sm"
          >
            Voltar para Meus Projetos
          </a>
        </div>
      </div>
    )
  }

  return (
    <DesignerLayout
      leftPanel={<ComponentsPanel />}
      rightPanel={<PropertiesPanel />}
    >
      <DesignerCanvas />
    </DesignerLayout>
  )
}

function DesignerLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0f1a]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Carregando...</p>
      </div>
    </div>
  )
}

export default function DesignerPage() {
  return (
    <DesignerProvider>
      <Suspense fallback={<DesignerLoading />}>
        <DesignerContent />
      </Suspense>
    </DesignerProvider>
  )
}
