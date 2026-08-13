# Frontend - Documentação

## Visão Geral

O frontend é construído com Next.js 16 (App Router) e React 19, utilizando Tailwind CSS para estilização.

## Estrutura de Rotas

```
/                           → page.tsx (placeholder)
/admin                      → layout.tsx (layout do admin)
/admin/login                → page.tsx (login)
/admin/dashboard            → page.tsx (dashboard)
/admin/banners              → page.tsx (CRUD banners)
/admin/categories           → page.tsx (CRUD categorias)
/admin/services             → page.tsx (CRUD serviços)
/admin/status               → page.tsx (CRUD status)
/admin/leads                → page.tsx (listagem leads)
/admin/promotions           → page.tsx (CRUD promoções)
/admin/content              → page.tsx (CRUD conteúdo)
/admin/settings             → page.tsx (configurações)
/admin/settings/faq         → page.tsx (CRUD FAQ)
/admin/settings/trust       → page.tsx (CRUD indicadores)
```

## Layouts

### Root Layout (`src/app/layout.tsx`)
- Fonte: Geist Sans e Geist Mono
- Meta tags padrão
- HTML com classe `antialiased`

### Admin Layout (`src/app/admin/layout.tsx`)
- **Tipo:** Client Component
- **Estrutura:** Sidebar + Main Content
- **Sidebar:** Navegação lateral colapsável
- **Header:** Cabeçalho com informações do usuário

### Dashboard Layout (`src/app/admin/(dashboard)/layout.tsx`)
- **Tipo:** Server Component
- **Função:** Layout agrupado para rotas do dashboard
- **Estrutura:** Header + Conteúdo principal

## Componentes

### Componentes Admin

| Componente | Arquivo | Tipo | Descrição |
|------------|---------|------|-----------|
| `AdminHeader` | `components/admin/AdminHeader.tsx` | Client | Cabeçalho do painel |
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Client | Menu lateral |
| `DashboardCards` | `components/admin/DashboardCards.tsx` | Server | Cards de métricas |
| `DataTable` | `components/admin/DataTable.tsx` | Client | Tabela genérica |
| `FormModal` | `components/admin/FormModal.tsx` | Client | Modal para formulários |
| `SectionHeader` | `components/admin/SectionHeader.tsx` | Server | Cabeçalho de seção |
| `StatusBadge` | `components/admin/StatusBadge.tsx` | Server | Badge de status |

### Padrões de Componentes

#### Formulários
```tsx
// Padrão: *Form.tsx
'use client'
export function EntityForm({ entity, onSuccess }: Props) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: entity || defaults
  })
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

#### Listagens
```tsx
// Padrão: *List.tsx
'use client'
export function EntityList({ initialData }: Props) {
  const columns = [...]
  return <DataTable data={initialData} columns={columns} />
}
```

## Formulários

### Stack
- **React Hook Form** - Gerenciamento de estado
- **Zod** - Validação via `@hookform/resolvers`

### Formulários Implementados

| Formulário | Schema | Campos |
|------------|--------|--------|
| `BannerForm` | `bannerSchema` | title, subtitle, image_url, link_url, button_text, position, active, starts_at, ends_at |
| `CategoryForm` | `categorySchema` | name, slug, description, image_url, position, active |
| `ServiceForm` | `serviceSchema` | name, slug, category_id, description, short_description, features, price, image_url, position, active |
| `StatusForm` | `statusSchema` | service_id, status, message |
| `PromotionForm` | `promotionSchema` | title, description, discount_type, discount_value, code, active, starts_at, ends_at |
| `ContentForm` | `contentSchema` | identifier, title, content, active |
| `FaqForm` | `faqSchema` | question, answer, category, position, active |
| `TrustForm` | `trustSchema` | type, title, description, image_url, position, active |
| `SettingsForm` | `siteSettingsSchema` | site_name, site_description, logo_url, favicon_url, theme_color, social_links, maintenance_mode |

### Padrão de Validação
```typescript
const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().refine(isValidSlug, 'Slug inválido'),
  // ...
})

type FormData = z.infer<typeof schema>
```

## Estados

### Loading States
- ⚠️ **Não implementado** - Componentes não mostram estados de carregamento

### Error States
- Formulários: Mensagem de erro via `useState`
- Server Actions: `ActionResult` com código de erro

### Empty States
- ⚠️ **Não implementado** - Listagens não tratam dados vazios

## Server Components vs Client Components

### Server Components
- Páginas (`page.tsx`)
- `DashboardCards`
- `SectionHeader`
- `StatusBadge`

### Client Components
- Formulários (`*Form.tsx`)
- `DataTable`
- `FormModal`
- `AdminSidebar`
- `AdminHeader`

## Navegação

### Sidebar Links
```typescript
const links = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Banners', href: '/admin/banners', icon: Image },
  { name: 'Serviços', href: '/admin/services', icon: Briefcase },
  { name: 'Status', href: '/admin/status', icon: Activity },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Promoções', href: '/admin/promotions', icon: Tag },
  { name: 'Conteúdo', href: '/admin/content', icon: FileText },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
]
```

## UI/UX

### Framework CSS
- **Tailwind CSS 4** - Utility-first CSS

### Estilo
- Design system: Custom (sem component library)
- Cores: Blue (primary), Gray (neutros), Green/Red (status)
- Ícones: Lucide React

### Responsividade
- Layout admin: Responsivo (sidebar colapsável)
- Tabelas: Scroll horizontal em mobile
- Formulários: Grid responsivo

## Integrações

### Supabase Client
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Supabase Server
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  // Cria cliente com cookies do request
}
```
