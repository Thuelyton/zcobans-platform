/**
 * JSON Exporter
 * ZCobans Visual Designer
 *
 * Exporta a página do Designer para formato JSON.
 */

import type { DesignerPage } from '../types'

export interface ExportedJSON {
  version: string
  exportedAt: string
  page: DesignerPage
}

/**
 * Exporta a página para JSON
 */
export function exportToJSON(page: DesignerPage): ExportedJSON {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    page: {
      ...page,
      metadata: {
        ...page.metadata,
        updatedAt: new Date().toISOString(),
      },
    },
  }
}

/**
 * Converte JSON exportado para string formatada
 */
export function exportToJSONString(page: DesignerPage): string {
  const exported = exportToJSON(page)
  return JSON.stringify(exported, null, 2)
}

/**
 * Valida se um JSON é um DesignerPage válido
 */
export function isValidExportedJSON(data: unknown): data is ExportedJSON {
  if (typeof data !== 'object' || data === null) return false
  
  const obj = data as Record<string, unknown>
  
  if (typeof obj.version !== 'string') return false
  if (typeof obj.exportedAt !== 'string') return false
  if (typeof obj.page !== 'object' || obj.page === null) return false
  
  const page = obj.page as Record<string, unknown>
  
  if (typeof page.id !== 'string') return false
  if (typeof page.title !== 'string') return false
  if (typeof page.slug !== 'string') return false
  if (!Array.isArray(page.sections)) return false
  if (typeof page.settings !== 'object' || page.settings === null) return false
  if (typeof page.metadata !== 'object' || page.metadata === null) return false
  
  return true
}
