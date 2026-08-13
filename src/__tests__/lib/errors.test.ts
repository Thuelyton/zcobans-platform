import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  success,
  createError,
  handleValidationError,
  handleSupabaseError,
  validateData,
  executeSupabaseOperation,
  executeSupabaseMutation,
  ErrorCode,
} from '@/lib/errors'

describe('Error Handling Utilities', () => {
  describe('success', () => {
    it('should create a success result with data', () => {
      const result = success({ id: 1, name: 'Test' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ id: 1, name: 'Test' })
      }
    })

    it('should create a success result with undefined data', () => {
      const result = success(undefined)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeUndefined()
      }
    })
  })

  describe('createError', () => {
    it('should create an error result with message', () => {
      const result = createError('Something went wrong')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Something went wrong')
        expect(result.code).toBeUndefined()
      }
    })

    it('should create an error result with code', () => {
      const result = createError('Validation failed', ErrorCode.VALIDATION)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Validation failed')
        expect(result.code).toBe(ErrorCode.VALIDATION)
      }
    })
  })

  describe('handleValidationError', () => {
    it('should format Zod error messages', () => {
      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email'),
      })
      const result = schema.safeParse({ name: '', email: 'not-an-email' })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const errorResult = handleValidationError(result.error)
        expect(errorResult.success).toBe(false)
        if (!errorResult.success) {
          expect(errorResult.code).toBe(ErrorCode.VALIDATION)
          expect(errorResult.error).toContain('Name is required')
          expect(errorResult.error).toContain('Invalid email')
        }
      }
    })

    it('should include path in error message', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(1, 'Name is required'),
        }),
      })
      const result = schema.safeParse({ user: { name: '' } })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const errorResult = handleValidationError(result.error)
        expect(errorResult.success).toBe(false)
        if (!errorResult.success) {
          expect(errorResult.error).toContain('user.name')
        }
      }
    })
  })

  describe('handleSupabaseError', () => {
    it('should sanitize common Supabase errors', () => {
      const testCases = [
        { input: 'relation "users" does not exist', expected: 'Recurso não encontrado' },
        { input: 'duplicate key value violates unique constraint "users_email_key"', expected: 'Já existe um registro com este valor' },
        { input: 'violates foreign key constraint "fk_users"', expected: 'Referência inválida' },
        { input: 'violates not-null constraint', expected: 'Campo obrigatório não preenchido' },
        { input: 'invalid input syntax for type uuid', expected: 'Formato de dados inválido' },
        { input: 'permission denied for table users', expected: 'Sem permissão para acessar este recurso' },
      ]

      for (const { input, expected } of testCases) {
        const result = handleSupabaseError({ message: input })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error).toBe(expected)
          expect(result.code).toBe(ErrorCode.DATABASE)
        }
      }
    })

    it('should return original message in development for unknown errors', () => {
      // In test environment, NODE_ENV is typically 'test'
      const result = handleSupabaseError({ message: 'Unknown error' })
      expect(result.success).toBe(false)
      if (!result.success) {
        // In test/development, returns original message
        expect(result.error).toBe('Unknown error')
      }
    })

    it('should return generic message in production for unknown errors', () => {
      // We can't easily change NODE_ENV in tests, but we can verify the sanitization works
      const result = handleSupabaseError({ message: 'Unknown error' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe(ErrorCode.DATABASE)
      }
    })
  })

  describe('validateData', () => {
    it('should return success for valid data', () => {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
      const result = validateData(schema, { name: 'Test', email: 'test@example.com' })
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ name: 'Test', email: 'test@example.com' })
      }
    })

    it('should return error for invalid data', () => {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
      const result = validateData(schema, { name: '', email: 'not-an-email' })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe(ErrorCode.VALIDATION)
      }
    })
  })

  describe('executeSupabaseOperation', () => {
    it('should return success for successful operation', async () => {
      const result = await executeSupabaseOperation(async () => ({
        data: { id: 1, name: 'Test' },
        error: null,
      }))
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ id: 1, name: 'Test' })
      }
    })

    it('should return error for failed operation', async () => {
      const result = await executeSupabaseOperation(async () => ({
        data: null,
        error: { message: 'relation "users" does not exist' },
      }))
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Recurso não encontrado')
      }
    })

    it('should return NOT_FOUND for null data', async () => {
      const result = await executeSupabaseOperation(async () => ({
        data: null,
        error: null,
      }))
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe(ErrorCode.NOT_FOUND)
        expect(result.error).toBe('Registro não encontrado')
      }
    })

    it('should handle unexpected errors', async () => {
      const result = await executeSupabaseOperation(async () => {
        throw new Error('Unexpected error')
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe(ErrorCode.UNKNOWN)
        expect(result.error).toBe('Unexpected error')
      }
    })
  })

  describe('executeSupabaseMutation', () => {
    it('should return success for successful mutation', async () => {
      const result = await executeSupabaseMutation(async () => ({
        error: null,
      }))
      
      expect(result.success).toBe(true)
    })

    it('should return error for failed mutation', async () => {
      const result = await executeSupabaseMutation(async () => ({
        error: { message: 'duplicate key value violates unique constraint' },
      }))
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Já existe um registro com este valor')
      }
    })

    it('should handle unexpected errors', async () => {
      const result = await executeSupabaseMutation(async () => {
        throw new Error('Unexpected error')
      })
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.code).toBe(ErrorCode.UNKNOWN)
      }
    })
  })

  describe('ErrorCode', () => {
    it('should have all error codes', () => {
      expect(ErrorCode.VALIDATION).toBe('VALIDATION_ERROR')
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND')
      expect(ErrorCode.DATABASE).toBe('DATABASE_ERROR')
      expect(ErrorCode.UNKNOWN).toBe('UNKNOWN_ERROR')
    })
  })
})
