import { z } from 'zod'
import { isValidSlug } from '@/lib/slug'

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .refine((val) => isValidSlug(val), {
      message: 'Slug inválido. Use apenas letras minúsculas, números e hífens.',
    }),
  description: z.string().optional().nullable(),
  image_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  position: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
})

export type CategoryFormData = z.infer<typeof categorySchema>
