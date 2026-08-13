/**
 * Rate Limiting
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Controle de taxa de requisições para prevenir abuso.
 * Implementação em memória para MVP; pode ser migrada para Redis.
 */

/**
 * Configuração de rate limiting
 */
export interface RateLimitConfig {
  /** Máximo de requisições na janela */
  maxRequests: number
  /** Janela de tempo em milissegundos */
  windowMs: number
}

/**
 * Resultado da verificação de rate limit
 */
export interface RateLimitResult {
  /** Se a requisição é permitida */
  allowed: boolean
  /** Requisições restantes na janela */
  remaining: number
  /** Timestamp de quando a janela reseta */
  resetAt: number
}

/**
 * Store em memória para rate limiting
 * Chave: identificador (IP, user ID, etc.)
 */
const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>()

/**
 * Limpa entradas expiradas periodicamente
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

// Executa limpeza a cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}

/**
 * Verifica se uma requisição é permitida dentro do rate limit
 *
 * @param key - Chave única (IP, user ID, etc.)
 * @param config - Configuração do rate limit
 * @returns Resultado da verificação
 *
 * @example
 * ```typescript
 * const result = checkRateLimit('192.168.1.1', {
 *   maxRequests: 10,
 *   windowMs: 60000, // 1 minuto
 * })
 *
 * if (!result.allowed) {
 *   throw new Error('Rate limit exceeded')
 * }
 * ```
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  // Nova janela ou janela expirada
  if (!record || now > record.resetAt) {
    const resetAt = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    }
  }

  // Janela ativa
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    }
  }

  // Incrementa contador
  record.count++
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Reseta o rate limit para uma chave específica
 * Útil para testes ou quando o usuário sobe de plano
 *
 * @param key - Chave para resetar
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

/**
 * Obtém o status atual do rate limit para uma chave
 *
 * @param key - Chave para consultar
 * @param config - Configuração do rate limit
 * @returns Status atual ou null se não houver registro
 */
export function getRateLimitStatus(
  key: string,
  config: RateLimitConfig
): RateLimitResult | null {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
    }
  }

  return {
    allowed: record.count < config.maxRequests,
    remaining: Math.max(0, config.maxRequests - record.count),
    resetAt: record.resetAt,
  }
}

/**
 * Limpa todos os registros de rate limit
 * Útil para testes
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}
