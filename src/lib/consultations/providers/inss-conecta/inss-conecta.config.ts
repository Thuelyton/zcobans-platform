/**
 * INSS Conecta Provider Configuration
 * Etapa 9.17 - Investigação APIs Oficiais INSS
 *
 * Configuração do provider para APIs oficiais do INSS via ConectaGov.
 *
 * ⚠️ ATENÇÃO:
 * - Requer credenciamento no ConectaGov
 * - Requer certificado digital ICP-Brasil
 * - APIs são RESTritas a órgãos públicos credenciados
 * - NÃO disponível para empresas privadas
 */

/**
 * Configuração do provider INSS Conecta
 */
export interface INSSConectaConfig {
  /** Se o provider está habilitado via feature flag */
  enabled: boolean

  /** URL base da API do ConectaGov */
  baseUrl: string

  /** Client ID para autenticação */
  clientId: string

  /** Client Secret para autenticação */
  clientSecret: string

  /** Caminho para o certificado ICP-Brasil (.pfx/.p12) */
  certificatePath: string

  /** Senha do certificado */
  certificatePassword: string

  /** Timeout para requisições em ms */
  timeout: number

  /** Número de tentativas em caso de falha */
  retryAttempts: number

  /** Delay entre tentativas em ms */
  retryDelay: number

  /** Versão da API */
  apiVersion: string
}

/**
 * Configuração padrão
 */
const DEFAULT_CONFIG: INSSConectaConfig = {
  enabled: false,
  baseUrl: 'https://apigateway.conectagov.gov.br',
  clientId: '',
  clientSecret: '',
  certificatePath: '',
  certificatePassword: '',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  apiVersion: 'v1',
}

/**
 * Obtém a configuração do provider a partir das variáveis de ambiente
 *
 * @returns Configuração do provider
 */
export function getINSSConectaConfig(): INSSConectaConfig {
  const config: INSSConectaConfig = {
    ...DEFAULT_CONFIG,
    enabled: process.env.INSS_CONECTA_ENABLED === 'true',
    baseUrl: process.env.INSS_CONECTA_BASE_URL || DEFAULT_CONFIG.baseUrl,
    clientId: process.env.INSS_CONECTA_CLIENT_ID || '',
    clientSecret: process.env.INSS_CONECTA_CLIENT_SECRET || '',
    certificatePath: process.env.INSS_CONECTA_CERTIFICATE_PATH || '',
    certificatePassword: process.env.INSS_CONECTA_CERTIFICATE_PASSWORD || '',
    timeout: parseInt(process.env.INSS_CONECTA_TIMEOUT_MS || String(DEFAULT_CONFIG.timeout), 10),
    retryAttempts: parseInt(process.env.INSS_CONECTA_RETRY_ATTEMPTS || String(DEFAULT_CONFIG.retryAttempts), 10),
    retryDelay: parseInt(process.env.INSS_CONECTA_RETRY_DELAY_MS || String(DEFAULT_CONFIG.retryDelay), 10),
    apiVersion: process.env.INSS_CONECTA_API_VERSION || DEFAULT_CONFIG.apiVersion,
  }

  return config
}

/**
 * Valida se a configuração está completa
 *
 * @param config - Configuração a ser validada
 * @returns true se a configuração é válida
 */
export function validateINSSConectaConfig(config: INSSConectaConfig): boolean {
  // Se desabilitado, não precisa de configuração
  if (!config.enabled) {
    return true
  }

  // Se habilitado, precisa de todas as credenciais
  const requiredFields: Array<keyof INSSConectaConfig> = [
    'baseUrl',
    'clientId',
    'clientSecret',
    'certificatePath',
  ]

  for (const field of requiredFields) {
    const value = config[field]
    if (typeof value === 'string' && value.trim() === '') {
      return false
    }
  }

  return true
}

/**
 * Obtém erros de configuração
 *
 * @param config - Configuração a ser verificada
 * @returns Array de campos faltantes ou vazio se válido
 */
export function getINSSConectaConfigErrors(config: INSSConectaConfig): string[] {
  const errors: string[] = []

  if (!config.enabled) {
    return errors // Não precisa de configuração se desabilitado
  }

  if (!config.baseUrl) {
    errors.push('INSS_CONECTA_BASE_URL é obrigatório')
  }

  if (!config.clientId) {
    errors.push('INSS_CONECTA_CLIENT_ID é obrigatório')
  }

  if (!config.clientSecret) {
    errors.push('INSS_CONECTA_CLIENT_SECRET é obrigatório')
  }

  if (!config.certificatePath) {
    errors.push('INSS_CONECTA_CERTIFICATE_PATH é obrigatório')
  }

  if (config.timeout <= 0) {
    errors.push('INSS_CONECTA_TIMEOUT_MS deve ser maior que 0')
  }

  if (config.retryAttempts < 0) {
    errors.push('INSS_CONECTA_RETRY_ATTEMPTS deve ser maior ou igual a 0')
  }

  return errors
}

/**
 * Verifica se o provider pode ser utilizado
 *
 * @returns true se o provider está pronto para uso
 */
export function isINSSConectaProviderReady(): boolean {
  const config = getINSSConectaConfig()

  if (!config.enabled) {
    return false
  }

  return validateINSSConectaConfig(config)
}

/**
 * Obtém informações sobre a configuração atual
 *
 * @returns Informações de diagnóstico
 */
export function getINSSConectaDiagnostics() {
  const config = getINSSConectaConfig()
  const errors = getINSSConectaConfigErrors(config)
  const isValid = validateINSSConectaConfig(config)

  return {
    enabled: config.enabled,
    isValid,
    errors,
    hasCredentials: !!(config.clientId && config.clientSecret),
    hasCertificate: !!config.certificatePath,
    baseUrl: config.baseUrl ? '[CONFIGURADO]' : '[NÃO CONFIGURADO]',
    timeout: config.timeout,
    retryAttempts: config.retryAttempts,
  }
}