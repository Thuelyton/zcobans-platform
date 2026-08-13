import { z } from 'zod'

// Helper to validate date strings (ISO format or empty)
const nullableDateSchema = z
  .string()
  .optional()
  .nullable()
  .refine(
    (value) => {
      if (!value || value.trim() === '') return true
      const date = new Date(value)
      return !isNaN(date.getTime())
    },
    { message: 'Data inválida' }
  )

// Schema for form (without refinement for better TypeScript inference with react-hook-form)
export const bannerFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Título é obrigatório').max(255, 'Título deve ter no máximo 255 caracteres'),
  subtitle: z.string().max(255, 'Subtítulo deve ter no máximo 255 caracteres').optional().nullable(),
  image_url: z.string().url('URL de imagem inválida').min(1, 'Imagem é obrigatória'),
  link_url: z.string().url('URL inválida').optional().nullable(),
  button_text: z.string().max(100, 'Texto do botão deve ter no máximo 100 caracteres').optional().nullable(),
  position: z.number().int().min(0, 'Posição deve ser positiva').optional(),
  active: z.boolean().optional(),
  starts_at: nullableDateSchema,
  ends_at: nullableDateSchema,
})

// Schema for validation (with date range refinement and defaults)
export const bannerSchema = bannerFormSchema.refine(
  (data) => {
    // If both dates are provided, starts_at should be before ends_at
    if (data.starts_at && data.ends_at) {
      const start = new Date(data.starts_at)
      const end = new Date(data.ends_at)
      return start < end
    }
    return true
  },
  {
    message: 'Data de início deve ser anterior à data de término',
    path: ['ends_at'],
  }
)

export type BannerFormData = z.infer<typeof bannerFormSchema>
