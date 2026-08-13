import { z } from 'zod'

export const promotionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional().nullable(),
  discount_type: z.enum(['percentage', 'fixed']).default('percentage'),
  discount_value: z.coerce.number().min(0, 'Valor deve ser positivo'),
  code: z.string().optional().nullable(),
  active: z.boolean().default(true),
  starts_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
})

export type PromotionFormData = z.infer<typeof promotionSchema>
