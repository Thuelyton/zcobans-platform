import { z } from 'zod'
import { isValidSlug } from '@/lib/slug'

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid('Categoria inválida').nullable(),
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .refine((val) => isValidSlug(val), {
      message: 'Slug inválido. Use apenas letras minúsculas, números e hífens.',
    }),
  description: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  price: z.coerce.number().min(0, 'Preço deve ser positivo').optional().nullable(),
  image_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  position: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
