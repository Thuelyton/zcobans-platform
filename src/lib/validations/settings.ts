import { z } from 'zod'

export const siteSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  site_name: z.string().min(1, 'Nome do site é obrigatório'),
  site_description: z.string().optional().nullable(),
  logo_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  favicon_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  theme_color: z.string().optional().nullable(),
  social_links: z.record(z.string(), z.string()).optional().nullable(),
  maintenance_mode: z.boolean().default(false),
})

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>
