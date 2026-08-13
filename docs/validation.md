# Validação - Documentação

## Visão Geral

O projeto utiliza **Zod v4** para validação de dados, com schemas centralizados em `src/lib/validations/`.

## Estrutura

```
src/lib/validations/
├── banner.ts
├── category.ts
├── content.ts
├── faq.ts
├── lead.ts
├── promotion.ts
├── service.ts
├── settings.ts
├── status.ts
└── trust.ts
```

---

## Schemas Disponíveis

### Banner (`banner.ts`)

```typescript
bannerSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).optional().nullable(),
  image_url: z.string().url(),
  link_url: z.string().url().optional().nullable(),
  button_text: z.string().max(100).optional().nullable(),
  position: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  starts_at: nullableDateSchema.optional().nullable(),
  ends_at: nullableDateSchema.optional().nullable(),
}).refine(/* starts_at < ends_at */)
```

### Category (`category.ts`)

```typescript
categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1).refine(isValidSlug),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  position: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
})
```

### Service (`service.ts`)

```typescript
serviceSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid().nullable(),
  name: z.string().min(1),
  slug: z.string().min(1).refine(isValidSlug),
  description: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  price: z.coerce.number().min(0).optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  position: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
})
```

### Status (`status.ts`)

```typescript
serviceStatusEnum = z.enum(['operational', 'degraded', 'outage', 'maintenance'])

statusSchema = z.object({
  id: z.string().uuid().optional(),
  service_id: z.string().uuid().min(1),
  status: serviceStatusEnum,
  message: z.string().max(1000).optional().nullable(),
})
```

### Lead (`lead.ts`)

```typescript
leadStatusEnum = z.enum(['new', 'contacted', 'qualified', 'closed'])

createLeadSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().min(1).email().max(255),
  phone: z.string().max(50).optional().nullable().refine(/* phone regex */),
  company: z.string().max(255).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  source: z.string().max(100).optional().nullable(),
})
```

### Promotion (`promotion.ts`)

```typescript
promotionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  discount_type: z.enum(['percentage', 'fixed']).optional().nullable(),
  discount_value: z.number().min(0).optional().nullable(),
  code: z.string().optional().nullable(),
  active: z.boolean().default(true),
  starts_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
})
```

### Content (`content.ts`)

```typescript
contentSchema = z.object({
  id: z.string().uuid().optional(),
  identifier: z.string().min(1),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  active: z.boolean().default(true),
})
```

### FAQ (`faq.ts`)

```typescript
faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional().nullable(),
  position: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
})
```

### Trust Indicator (`trust.ts`)

```typescript
trustIndicatorSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['testimonial', 'partner_logo', 'award']),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  position: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
})
```

### Settings (`settings.ts`)

```typescript
siteSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  site_name: z.string().min(1),
  site_description: z.string().optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  favicon_url: z.string().url().optional().nullable(),
  theme_color: z.string().optional().nullable(),
  social_links: z.record(z.string()).optional().nullable(),
  maintenance_mode: z.boolean().default(false),
})
```

---

## Funções de Validação

### validateData()
```typescript
function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ActionResult<T>
```

**Uso nas Server Actions:**
```typescript
const validationResult = validateData(schema, data)
if (!validationResult.success) return validationResult
```

---

## Geração de Slugs

### Funções (`src/lib/slug.ts`)

```typescript
// Gera slug a partir de string
function generateSlug(input: string): string

// Valida formato de slug
function isValidSlug(slug: string): boolean
```

### Regras de Slug
- Converte para minúsculas
- Remove acentos
- Substitui espaços por hífens
- Remove caracteres especiais
- Colapsa hífens duplicados
- Remove hífens no início/fim

**Exemplos:**
| Entrada | Resultado |
|---------|-----------|
| `Hello World` | `hello-world` |
| `Serviço de Qualidade` | `servico-de-qualidade` |
| `Café com Açúcar` | `cafe-com-acucar` |

---

## Validação de Datas

### nullableDateSchema
```typescript
const nullableDateSchema = z.string().optional().nullable().refine(
  (value) => {
    if (!value || value.trim() === '') return true
    const date = new Date(value)
    return !isNaN(date.getTime())
  },
  { message: 'Data inválida' }
)
```

---

## Padrões de Validação

### Campos Opcionais
```typescript
z.string().optional().nullable()  // Aceita undefined ou null
```

### Coerção de Tipos
```typescript
z.coerce.number()  // Converte string para number
```

### Refinamento Condicional
```typescript
.refine(
  (data) => {
    if (data.starts_at && data.ends_at) {
      return new Date(data.starts_at) < new Date(data.endss_at)
    }
    return true
  },
  { message: 'Data início deve ser anterior à data término' }
)
```

### Union com Literal
```typescript
z.string().url().optional().nullable().or(z.literal(''))
```

---

## Tipos Inferidos

Cada schema exporta seu tipo inferido:

```typescript
export type BannerFormData = z.infer<typeof bannerSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
// etc.
```

---

## Testes

| Schema | Testes |
|--------|--------|
| banner | 17 |
| category | 5 |
| lead | 25 |
| service | 5 |
| status | 25 |
| **Total** | **77** |

---

## Notas

1. **Mensagens em português** - Todas as mensagens de erro são em PT-BR
2. **Validação server-side** - Schemas são validados nas Server Actions
3. **Validação client-side** - Schemas são usados via zodResolver no React Hook Form
4. **Sem validação de imagem** - Apenas validação de URL
