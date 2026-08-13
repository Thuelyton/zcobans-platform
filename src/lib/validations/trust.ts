import { z } from 'zod'

export const trustIndicatorSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['testimonial', 'partner', 'award', 'metric']),
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional().nullable(),
  image_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  active: z.boolean().default(true),
  position: z.coerce.number().int().default(0),
})

export type TrustIndicatorFormData = z.infer<typeof trustIndicatorSchema>
