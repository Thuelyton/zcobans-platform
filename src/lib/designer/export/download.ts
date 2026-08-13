/**
 * Download Utility
 * ZCobans Visual Designer
 *
 * Utilitários para download de arquivos exportados.
 */

/**
 * Cria e dispara um download de arquivo
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  // Create blob
  const blob = new Blob([content], { type: mimeType })
  
  // Create download URL
  const url = URL.createObjectURL(blob)
  
  // Create temporary link
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  
  // Append to body, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Download como JSON
 */
export function downloadJSON(jsonString: string, filename: string = 'zcobans-page.json'): void {
  downloadFile(jsonString, filename, 'application/json')
}

/**
 * Download como HTML
 */
export function downloadHTML(htmlString: string, filename: string = 'zcobans-page.html'): void {
  downloadFile(htmlString, filename, 'text/html')
}

/**
 * Sanitiza o slug para uso em nomes de arquivo
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
