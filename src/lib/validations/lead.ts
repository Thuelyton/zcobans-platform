import { z } from 'zod'

// Lead status enum based on database schema
export const leadStatusEnum = z.enum(['new', 'contacted', 'qualified', 'closed'])

// Lead creation schema (for public forms)
export const createLeadSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  phone: z
    .string()
    .max(50, 'Telefone deve ter no máximo 50 caracteres')
    .optional()
    .nullable()
    .refine(
      (value) => {
        if (!value || value.trim() === '') return true
        // Basic phone validation: allows digits, spaces, dashes, parentheses, and +
        const phoneRegex = /^[\d\s\-\(\)\+]+$/
        return phoneRegex.test(value)
      },
      { message: 'Telefone inválido' }
    ),
  company: z
    .string()
    .max(255, 'Empresa deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
  message: z
    .string()
    .max(5000, 'Mensagem deve ter no máximo 5000 caracteres')
    .optional()
    .nullable(),
  source: z
    .string()
    .max(100, 'Fonte deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),
})

// Lead update schema (for admin)
export const updateLeadSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional(),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .optional(),
  phone: z
    .string()
    .max(50, 'Telefone deve ter no máximo 50 caracteres')
    .optional()
    .nullable()
    .refine(
      (value) => {
        if (!value || value.trim() === '') return true
        const phoneRegex = /^[\d\s\-\(\)\+]+$/
        return phoneRegex.test(value)
      },
      { message: 'Telefone inválido' }
    ),
  company: z
    .string()
    .max(255, 'Empresa deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
  message: z
    .string()
    .max(5000, 'Mensagem deve ter no máximo 5000 caracteres')
    .optional()
    .nullable(),
  status: leadStatusEnum.optional(),
  source: z
    .string()
    .max(100, 'Fonte deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),
})

// Lead status update schema (simplified for status changes)
export const updateLeadStatusSchema = z.object({
  id: z.string().uuid('ID inválido'),
  status: leadStatusEnum,
})

// Schema for database insert (matches Supabase Insert type)
export const leadInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(255).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  status: leadStatusEnum.default('new'),
  source: z.string().max(100).optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Schema for database update (matches Supabase Update type)
export const leadUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(255).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  status: leadStatusEnum.optional(),
  source: z.string().max(100).optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Inferred types
export type CreateLeadFormData = z.infer<typeof createLeadSchema>
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>
export type UpdateLeadStatusFormData = z.infer<typeof updateLeadStatusSchema>
export type LeadInsert = z.infer<typeof leadInsertSchema>
export type LeadUpdate = z.infer<typeof leadUpdateSchema>
export type LeadStatus = z.infer<typeof leadStatusEnum>
