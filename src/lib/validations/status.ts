import { z } from 'zod'

// Status enum based on database schema
export const serviceStatusEnum = z.enum(['operational', 'degraded', 'outage', 'maintenance'])

// Status creation/update schema (for forms)
export const statusSchema = z.object({
  id: z.string().uuid('ID inválido').optional(),
  service_id: z
    .string()
    .uuid('Serviço inválido')
    .min(1, 'Serviço é obrigatório'),
  status: serviceStatusEnum,
  message: z
    .string()
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
})

// Schema for database insert (matches Supabase Insert type)
export const serviceStatusInsertSchema = z.object({
  id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional().nullable(),
  status: serviceStatusEnum,
  message: z.string().max(1000).optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Schema for database update (matches Supabase Update type)
export const serviceStatusUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional().nullable(),
  status: serviceStatusEnum.optional(),
  message: z.string().max(1000).optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

// Inferred types
export type StatusFormData = z.infer<typeof statusSchema>
export type ServiceStatusInsert = z.infer<typeof serviceStatusInsertSchema>
export type ServiceStatusUpdate = z.infer<typeof serviceStatusUpdateSchema>
export type ServiceStatus = z.infer<typeof serviceStatusEnum>
