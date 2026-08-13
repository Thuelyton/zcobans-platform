import { z } from 'zod'

export const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1, 'Pergunta é obrigatória'),
  answer: z.string().min(1, 'Resposta é obrigatória'),
  active: z.boolean().default(true),
  position: z.coerce.number().int().default(0),
})

export type FaqItemFormData = z.infer<typeof faqSchema>
