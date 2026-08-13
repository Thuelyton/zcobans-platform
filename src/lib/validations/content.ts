import { z } from 'zod'

export const contentSchema = z.object({
  id: z.string().uuid().optional(),
  identifier: z.string().min(1, 'Identificador é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  active: z.boolean().default(true),
})

export type ContentFormData = z.infer<typeof contentSchema>
