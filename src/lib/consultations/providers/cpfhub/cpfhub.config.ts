/**
 * CPFHub Provider Configuration
 * Etapa 9.19 - Integração CPFHub API
 *
 * Configuração do provider para consulta de CPF via API CPFHub.io
 *
 * Documentação oficial: https://cpfhub.io/documentacao/referencia/cpf
 */

import type { CPFHubConfig } from './cpfhub.types'

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

/**
 * Configuração padrão
 */
const DEFAULT_CONFIG: CPFHubConfig = {
  enabled: false,
  baseUrl: 'https://api.cpfhub.io',
  apiKey: '',
  timeout: 30000,
  monthlyLimit: 50,
  rateLimitInterval: 2000, // 2 segundos para plano gratuito
}

// ============================================================================
// CONFIG FUNCTIONS
// ============================================================================

/**
 * Obtém a configuração do provider a partir das variáveis de ambiente
 *
 * @returns Configuração do provider
 */
export function getCPFHubConfig(): CPFHubConfig {
  return {
    enabled: process.env.CPFHUB_ENABLED === 'true',
    baseUrl: process.env.CPFHUB_BASE_URL || DEFAULT_CONFIG.baseUrl,
    apiKey: process.env.CPFHUB_API_KEY || '',
    timeout: parseInt(process.env.CPFHUB_TIMEOUT_MS || String(DEFAULT_CONFIG.timeout), 10),
    monthlyLimit: parseInt(process.env.CPFHUB_MONTHLY_LIMIT || String(DEFAULT_CONFIG.monthlyLimit), 10),
    rateLimitInterval: parseInt(process.env.CPFHUB_RATE_LIMIT_MS || String(DEFAULT_CONFIG.rateLimitInterval), 10),
  }
}

/**
 * Valida se a configuração está completa
 *
 * @param config - Configuração a ser validada
 * @returns true se a configuração é válida
 */
export function validateCPFHubConfig(config: CPFHubConfig): boolean {
  // Se desabilitado, não precisa de configuração
  if (!config.enabled) {
    return true
  }

  // Se habilitado, precisa de API Key
  if (!config.apiKey || config.apiKey.trim() === '') {
    return false
  }

  // URL base deve ser válida
  if (!config.baseUrl || !config.baseUrl.startsWith('http')) {
    return false
  }

  return true
}

/**
 * Obtém erros de configuração
 *
 * @param config - Configuração a ser verificada
 * @returns Array de campos faltantes ou vazio se válido
 */
export function getCPFHubConfigErrors(config: CPFHubConfig): string[] {
  const errors: string[] = []

  if (!config.enabled) {
    return errors // Não precisa de configuração se desabilitado
  }

  if (!config.apiKey) {
    errors.push('CPFHUB_API_KEY é obrigatório')
  }

  if (!config.baseUrl) {
    errors.push('CPFHUB_BASE_URL é obrigatório')
  }

  if (config.timeout <= 0) {
    errors.push('CPFHUB_TIMEOUT_MS deve ser maior que 0')
  }

  if (config.monthlyLimit <= 0) {
    errors.push('CPFHUB_MONTHLY_LIMIT deve ser maior que 0')
  }

  if (config.rateLimitInterval < 0) {
    errors.push('CPFHUB_RATE_LIMIT_MS deve ser maior ou igual a 0')
  }

  return errors
}

/**
 * Verifica se o provider pode ser utilizado
 *
 * @returns true se o provider está pronto para uso
 */
export function isCPFHubProviderReady(): boolean {
  const config = getCPFHubConfig()

  if (!config.enabled) {
    return false
  }

  return validateCPFHubConfig(config)
}

/**
 * Obtém informações sobre a configuração atual
 *
 * @returns Informações de diagnóstico
 */
export function getCPFHubDiagnostics() {
  const config = getCPFHubConfig()
  const errors = getCPFHubConfigErrors(config)
  const isValid = validateCPFHubConfig(config)

  return {
    enabled: config.enabled,
    isValid,
    errors,
    hasApiKey: !!config.apiKey,
    baseUrl: config.baseUrl ? '[CONFIGURADO]' : '[NÃO CONFIGURADO]',
    timeout: config.timeout,
    monthlyLimit: config.monthlyLimit,
    rateLimitInterval: config.rateLimitInterval,
  }
}
