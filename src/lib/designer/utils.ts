/**
 * Designer Utilities
 * ZCobans Visual Designer
 *
 * Funções utilitárias para o Designer.
 */

/**
 * Gera um UUID único
 */
export function generateId(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto.randomUUID()
  }
  // Fallback for SSR/tests
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Converte cor hex para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Converte RGB para hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

/**
 * Mascara CPF: 000.000.000-00
 */
export function maskCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Mascara CNPJ: 00.000.000/0000-00
 */
export function maskCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '')
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Deep clone de um objeto
 */
export function deepClone<T>(obj: T): T {
  if (typeof window !== 'undefined' && window.structuredClone) {
    return window.structuredClone(obj)
  }
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Debounce simples
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Salva no localStorage
 */
export function saveToLocalStorage(key: string, data: unknown): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data))
    }
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error)
  }
}

/**
 * Lê do localStorage
 */
export function loadFromLocalStorage<T>(key: string): T | null {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    }
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error)
  }
  return null
}

/**
 * Remove do localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error)
  }
}

/**
 * Chave do localStorage para o Designer
 */
export const DESIGNER_STORAGE_KEY = 'zcobans-designer'

/**
 * Intervalo de auto-save em ms
 */
export const AUTO_SAVE_INTERVAL = 30000 // 30 segundos

/**
 * Máximo de snapshots no histórico
 */
export const MAX_HISTORY_SIZE = 50
