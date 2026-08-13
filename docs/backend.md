# Backend - Documentação

## Visão Geral

O backend é implementado inteiramente via **Server Actions** do Next.js, sem API routes tradicionais. Todas as operações de banco são feitas via Supabase Client.

## Estrutura

```
src/app/admin/(dashboard)/
├── banners/
│   └── actions.ts        # CRUD Banners
├── categories/
│   └── actions.ts        # CRUD Categorias
├── content/
│   └── actions.ts        # CRUD Conteúdo
├── dashboard/
│   └── actions.ts        # Métricas do Dashboard
├── leads/
│   └── actions.ts        # CRUD Leads
├── promotions/
│   └── actions.ts        # CRUD Promoções
├── services/
│   └── actions.ts        # CRUD Serviços
├── settings/
│   ├── actions.ts        # Configurações gerais
│   ├── faq/
│   │   └── actions.ts    # CRUD FAQ
│   └── trust/
│       └── actions.ts    # CRUD Indicadores
└── status/
    └── actions.ts        # CRUD Status
```

## Padrão de Server Action

### Estrutura Básica
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { executeSupabaseOperation, executeSupabaseMutation } from '@/lib/errors'

export async function getEntities() {
  const supabase = await createClient()
  const result = await executeSupabaseOperation(async () =>
    await supabase.from('table').select('*')
  )
  
  if (!result.success) throw new Error(result.error)
  return result.data
}

export async function createEntity(data: FormData) {
  const supabase = await createClient()
  
  const validationResult = validateData(schema, data)
  if (!validationResult.success) return validationResult
  
  const result = await executeSupabaseMutation(async () =>
    await supabase.from('table').insert(validationResult.data)
  )
  
  if (result.success) revalidatePath('/admin/entities')
  return result
}
```

## Server Actions Disponíveis

### Banners (`banners/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getBanners()` | Query | Lista todos os banners |
| `createBanner(data)` | Mutation | Cria novo banner |
| `updateBanner(id, data)` | Mutation | Atualiza banner |
| `deleteBanner(id)` | Mutation | Remove banner |
| `toggleBannerStatus(id, active)` | Mutation | Alterna status ativo/inativo |

### Categories (`categories/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getCategories()` | Query | Lista categorias |
| `createCategory(data)` | Mutation | Cria categoria |
| `updateCategory(id, data)` | Mutation | Atualiza categoria |
| `deleteCategory(id)` | Mutation | Remove categoria |

### Services (`services/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getServices()` | Query | Lista serviços com categoria |
| `createService(data)` | Mutation | Cria serviço |
| `updateService(id, data)` | Mutation | Atualiza serviço |
| `deleteService(id)` | Mutation | Remove serviço |

### Status (`status/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getStatuses()` | Query | Lista status com serviço |
| `updateServiceStatus(data)` | Mutation | Cria/atualiza status (upsert) |
| `deleteStatus(id)` | Mutation | Remove status |

### Leads (`leads/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getLeads()` | Query | Lista leads |
| `updateLeadStatus(id, status)` | Mutation | Atualiza status do lead |
| `deleteLead(id)` | Mutation | Remove lead |

### Promotions (`promotions/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getPromotions()` | Query | Lista promoções |
| `createPromotion(data)` | Mutation | Cria promoção |
| `updatePromotion(id, data)` | Mutation | Atualiza promoção |
| `deletePromotion(id)` | Mutation | Remove promoção |

### Content (`content/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getContentSections()` | Query | Lista seções de conteúdo |
| `upsertContentSection(data)` | Mutation | Cria ou atualiza seção |
| `deleteContentSection(id)` | Mutation | Remove seção |

### Settings (`settings/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getSiteSettings()` | Query | Obtém configurações |
| `updateSiteSettings(data)` | Mutation | Atualiza configurações |

### FAQ (`settings/faq/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getFaqItems()` | Query | Lista perguntas frequentes |
| `createFaqItem(data)` | Mutation | Cria pergunta |
| `updateFaqItem(id, data)` | Mutation | Atualiza pergunta |
| `deleteFaqItem(id)` | Mutation | Remove pergunta |

### Trust Indicators (`settings/trust/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getTrustIndicators()` | Query | Lista indicadores |
| `createTrustIndicator(data)` | Mutation | Cria indicador |
| `updateTrustIndicator(id, data)` | Mutation | Atualiza indicador |
| `deleteTrustIndicator(id)` | Mutation | Remove indicador |

### Dashboard (`dashboard/actions.ts`)

| Função | Tipo | Descrição |
|--------|------|-----------|
| `getDashboardStats()` | Query | Obtém métricas do dashboard |

## Queries Supabase

### Leitura de Dados
```typescript
// Seleção simples
supabase.from('table').select('*')

// Com filtro
supabase.from('table').select('*').eq('active', true)

// Com ordenação
supabase.from('table').select('*').order('position', { ascending: true })

// Contagem (head query)
supabase.from('table').select('id', { count: 'exact', head: true })

// Com join
supabase.from('services').select('*, category:service_categories(name)')
```

### Mutations
```typescript
// Insert
supabase.from('table').insert(data)

// Update
supabase.from('table').update(data).eq('id', id)

// Delete
supabase.from('table').delete().eq('id', id)

// Upsert
supabase.from('table').upsert(data)
```

## Validação

### Padrão
```typescript
import { validateData } from '@/lib/errors'

const validationResult = validateData(schema, data)
if (!validationResult.success) return validationResult
```

### Schemas Disponíveis
| Schema | Arquivo |
|--------|---------|
| `bannerSchema` | `lib/validations/banner.ts` |
| `categorySchema` | `lib/validations/category.ts` |
| `serviceSchema` | `lib/validations/service.ts` |
| `statusSchema` | `lib/validations/status.ts` |
| `leadInsertSchema` | `lib/validations/lead.ts` |
| `promotionSchema` | `lib/validations/promotion.ts` |
| `contentSchema` | `lib/validations/content.ts` |
| `faqSchema` | `lib/validations/faq.ts` |
| `trustIndicatorSchema` | `lib/validations/trust.ts` |
| `siteSettingsSchema` | `lib/validations/settings.ts` |

## Error Handling

### Tipo de Retorno
```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }
```

### Códigos de Erro
```typescript
const ErrorCode = {
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DATABASE: 'DATABASE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
}
```

### Funções Utilitárias
- `success(data)` - Retorna sucesso
- `createError(message, code)` - Retorna erro
- `validateData(schema, data)` - Valida com Zod
- `executeSupabaseOperation(fn)` - Executa query com erro handling
- `executeSupabaseMutation(fn)` - Executa mutation com erro handling

## Revalidação

Após mutations, as páginas são revalidadas:
```typescript
if (result.success) {
  revalidatePath('/admin/entities')
  revalidatePath('/') // Landing page quando aplicável
}
```

## Segurança das Actions

1. **Validaçãoserver-side** - Todos os dados são validados antes de inserir
2. **Sanitização de erros** - Mensagens do Supabase são sanitizadas
3. **RLS habilitado** - Row Level Security no banco
4. **Sem exposição de dados sensíveis** - Erros genéricos em produção
