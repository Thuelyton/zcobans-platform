'use client'

/**
 * Export Menu
 * ZCobans Visual Designer
 *
 * Menu de exportação para JSON e HTML.
 */

import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { Download, FileJson, FileText, Eye, ChevronDown, X } from 'lucide-react'
import { useDesigner } from '@/lib/designer/store'
import { 
  exportToJSONString, 
  exportToHTML, 
  validateHTML,
  downloadJSON, 
  downloadHTML,
  sanitizeFilename 
} from '@/lib/designer/export'

export function ExportMenu() {
  const { state } = useDesigner()
  const { page } = state
  
  const [isOpen, setIsOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [previewType, setPreviewType] = useState<'json' | 'html'>('html')
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExportJSON = () => {
    const jsonString = exportToJSONString(page)
    const filename = `${sanitizeFilename(page.title)}.json`
    downloadJSON(jsonString, filename)
    setIsOpen(false)
  }

  const handleExportHTML = () => {
    const htmlString = exportToHTML(page)
    const filename = `${sanitizeFilename(page.title)}.html`
    downloadHTML(htmlString, filename)
    setIsOpen(false)
  }

  const handlePreview = (type: 'json' | 'html') => {
    if (type === 'json') {
      setPreviewContent(exportToJSONString(page))
    } else {
      setPreviewContent(exportToHTML(page))
    }
    setPreviewType(type)
    setShowPreview(true)
    setIsOpen(false)
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            'text-slate-400 hover:bg-slate-800 hover:text-white'
          )}
          title="Exportar"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Exportar</span>
          <ChevronDown className={clsx(
            'h-3 w-3 transition-transform',
            isOpen && 'rotate-180'
          )} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-700 bg-[#1e293b] py-2 shadow-xl">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Exportar como
              </div>
              
              <button
                onClick={handleExportJSON}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <FileJson className="h-4 w-4 text-emerald-400" />
                <span>JSON</span>
                <span className="ml-auto text-xs text-slate-500">.json</span>
              </button>
              
              <button
                onClick={handleExportHTML}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4 text-blue-400" />
                <span>HTML</span>
                <span className="ml-auto text-xs text-slate-500">.html</span>
              </button>
              
              <div className="my-2 border-t border-slate-700" />
              
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Visualizar
              </div>
              
              <button
                onClick={() => handlePreview('json')}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Eye className="h-4 w-4 text-amber-400" />
                <span>Preview JSON</span>
              </button>
              
              <button
                onClick={() => handlePreview('html')}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Eye className="h-4 w-4 text-purple-400" />
                <span>Preview HTML</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-xl border border-slate-700 bg-[#0d1117] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
              <div className="flex items-center gap-3">
                {previewType === 'json' ? (
                  <FileJson className="h-5 w-5 text-emerald-400" />
                ) : (
                  <FileText className="h-5 w-5 text-blue-400" />
                )}
                <h3 className="text-sm font-medium text-white">
                  Preview {previewType.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {previewType === 'html' ? (
                <iframe
                  srcDoc={previewContent}
                  className="h-full w-full rounded-lg border border-slate-700 bg-white"
                  title="HTML Preview"
                />
              ) : (
                <pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-300">
                  <code>{previewContent}</code>
                </pre>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-700 px-4 py-3">
              <button
                onClick={() => {
                  if (previewType === 'json') {
                    handleExportJSON()
                  } else {
                    handleExportHTML()
                  }
                  setShowPreview(false)
                }}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download {previewType.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
