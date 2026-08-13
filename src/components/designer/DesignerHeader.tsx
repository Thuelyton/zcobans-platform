'use client'

/**
 * Designer Header
 * ZCobans Visual Designer
 *
 * Header com logo, título e botões de ação.
 */

import Link from 'next/link'
import { ArrowLeft, Layers, FolderOpen } from 'lucide-react'
import { DesignerToolbar } from './DesignerToolbar'
import { ExportMenu } from './ExportMenu'

export function DesignerHeader() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-slate-800 bg-[#0d1117] px-4">
      {/* Left: Logo and back link */}
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
          <span className="text-sm font-medium text-white">ZCobans Designer</span>
        </div>
      </div>

      {/* Center: Toolbar */}
      <DesignerToolbar />

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/designer/projects"
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Meus Projetos"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Projetos</span>
        </Link>
        <ExportMenu />
      </div>
    </header>
  )
}
