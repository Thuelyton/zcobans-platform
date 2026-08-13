import { z } from 'zod'

/**
 * Standardized result type for Server Actions
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

/**
 * Error codes for different types of errors
 */
export const ErrorCode = {
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DATABASE: 'DATABASE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * Creates a success result
 */
export function success<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

/**
 * Creates an error result
 */
export function createError(message: string, code?: ErrorCode): ActionResult<never> {
  return { success: false, error: message, code }
}

/**
 * Handles Zod validation errors and returns a standardized error result
 */
export function handleValidationError(result: z.ZodError): ActionResult<never> {
  const messages = result.issues.map((issue) => {
    const path = issue.path.join('.')
    return path ? `${path}: ${issue.message}` : issue.message
  })
  return createError(messages.join(', '), ErrorCode.VALIDATION)
}

/**
 * Handles Supabase errors and returns a standardized error result
 * Sanitizes error messages to avoid exposing sensitive information
 */
export function handleSupabaseError(err: { message: string; code?: string }): ActionResult<never> {
  // Sanitize common Supabase error messages
  const sanitizedMessage = sanitizeErrorMessage(err.message)
  return createError(sanitizedMessage, ErrorCode.DATABASE)
}

/**
 * Sanitizes error messages to avoid exposing sensitive information
 */
function sanitizeErrorMessage(message: string): string {
  // Common Supabase/PostgreSQL error patterns to sanitize
  const patterns = [
    { regex: /relation ".*?" does not exist/i, replacement: 'Recurso não encontrado' },
    { regex: /duplicate key value violates unique constraint/i, replacement: 'Já existe um registro com este valor' },
    { regex: /violates foreign key constraint/i, replacement: 'Referência inválida' },
    { regex: /violates not-null constraint/i, replacement: 'Campo obrigatório não preenchido' },
    { regex: /invalid input syntax for type/i, replacement: 'Formato de dados inválido' },
    { regex: /permission denied for table/i, replacement: 'Sem permissão para acessar este recurso' },
    { regex: /permission denied for function/i, replacement: 'Sem permissão para executar esta operação' },
  ]

  for (const { regex, replacement } of patterns) {
    if (regex.test(message)) {
      return replacement
    }
  }

  // For unknown errors, return a generic message in production
  if (process.env.NODE_ENV === 'production') {
    return 'Erro interno do servidor'
  }

  // In development, return the original message for debugging
  return message
}

/**
 * Validates data with a Zod schema and returns a standardized result
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ActionResult<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    return handleValidationError(result.error)
  }
  return success(result.data)
}

/**
 * Type for Supabase query result
 */
type SupabaseQueryResult<T> = Promise<{ data: T | null; error: { message: string; code?: string } | null }>

/**
 * Wraps a Supabase operation with standardized error handling
 */
export async function executeSupabaseOperation<T>(
  operation: () => SupabaseQueryResult<T>
): Promise<ActionResult<T>> {
  try {
    const { data, error: err } = await operation()
    
    if (err) {
      return handleSupabaseError(err)
    }
    
    if (data === null) {
      return createError('Registro não encontrado', ErrorCode.NOT_FOUND)
    }
    
    return success(data)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro desconhecido'
    return createError(message, ErrorCode.UNKNOWN)
  }
}

/**
 * Type for Supabase mutation result
 */
type SupabaseMutationResult = Promise<{ error: { message: string; code?: string } | null }>

/**
 * Wraps a Supabase insert/update/delete operation
 */
export async function executeSupabaseMutation(
  operation: () => SupabaseMutationResult
): Promise<ActionResult<void>> {
  try {
    const { error: err } = await operation()
    
    if (err) {
      return handleSupabaseError(err)
    }
    
    return success(undefined)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro desconhecido'
    return createError(message, ErrorCode.UNKNOWN)
  }
}
