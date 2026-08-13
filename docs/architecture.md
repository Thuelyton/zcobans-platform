# Arquitetura do Projeto

## Visão Geral

O ZCobans Platform segue a arquitetura do Next.js App Router com Server Actions para operações de backend.

## Estrutura de Diretórios

```
zcobans-platform/
├── public/                    # Arquivos estáticos
├── src/
│   ├── app/                   # Rotas e páginas (App Router)
│   │   ├── admin/             # Área administrativa
│   │   │   ├── (dashboard)/   # Grupo de rotas do dashboard
│   │   │   │   ├── banners/
│   │   │   │   ├── categories/
│   │   │   │   ├── content/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── leads/
│   │   │   │   ├── promotions/
│   │   │   │   ├── services/
│   │   │   │   ├── settings/
│   │   │   │   └── status/
│   │   │   ├── login/
│   │   │   └── layout.tsx    # Layout do admin
│   │   ├── layout.tsx        # Layout raiz
│   │   └── page.tsx          # Página inicial (placeholder)
│   ├── components/            # Componentes React
│   │   └── admin/             # Componentes do admin
│   ├── lib/                   # Utilitários e configurações
│   │   ├── errors.ts          # Sistema de tratamento de erros
│   │   ├── slug.ts            # Geração e validação de slugs
│   │   ├── supabase/          # Configuração do Supabase
│   │   └── validations/       # Schemas de validação Zod
│   ├── __tests__/             # Testes unitários
│   └── middleware.ts          # Middleware do Next.js
├── supabase/
│   └── schema.sql             # Schema do banco de dados
├── docs/                      # Documentação
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Camadas da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React Components (Client/Server)                   │   │
│  │  ├── Pages (App Router)                             │   │
│  │  ├── Forms (React Hook Form)                        │   │
│  │  └── UI Components (Tailwind CSS)                   │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    SERVER ACTIONS                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Server Functions                                   │   │
│  │  ├── Validation (Zod)                               │   │
│  │  ├── Business Logic                                 │   │
│  │  └── Error Handling (ActionResult)                  │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                      SUPABASE                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Database Layer                                     │   │
│  │  ├── PostgreSQL                                     │   │
│  │  ├── Row Level Security (RLS)                       │   │
│  │  └── Triggers (updated_at)                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

### Fluxo de Leitura (GET)
```
Browser → Page Component (Server) → Supabase Client → Database
    ↓
Response → Render HTML → Browser
```

### Fluxo de Escrita (CREATE/UPDATE/DELETE)
```
Browser → Form Component (Client) → onSubmit()
    ↓
Server Action → validateData() → Supabase Operation
    ↓
ActionResult → Client State Update → UI Update
```

## Dependências Principais

### Runtime
| Pacote | Versão | Uso |
|--------|--------|-----|
| next | 16.2.0 | Framework |
| react | 19.2.4 | UI Library |
| @supabase/supabase-js | 2.99.3 | Cliente Supabase |
| @supabase/ssr | 0.9.0 | Supabase SSR |
| zod | 4.3.6 | Validação |
| react-hook-form | 7.71.2 | Formulários |
| @hookform/resolvers | 5.2.2 | Integração Zod + RHF |
| lucide-react | 0.577.0 | Ícones |
| clsx | 2.1.1 | Classes condicionais |
| tailwind-merge | 3.5.0 | Merge de classes Tailwind |
| date-fns | 4.1.0 | Formatação de datas |

### Dev
| Pacote | Versão | Uso |
|--------|--------|-----|
| typescript | ^5.0.0 | Tipagem |
| vitest | 4.1.0 | Testes |
| @testing-library/react | 16.3.2 | Testes de componentes |
| @testing-library/jest-dom | 6.9.1 | Matchers de DOM |
| jsdom | 29.0.1 | Ambiente de teste |
| tailwindcss | 4.0.0 | CSS Utility |
| eslint | ^9.0.0 | Linting |

## Padrões Utilizados

### 1. Server Actions
Todas as operações de backend são Server Actions com retorno padronizado:
```typescript
'use server'
export async function actionName(data: FormData) {
  // Validação
  // Operação Supabase
  // Retorno ActionResult
}
```

### 2. Component Organization
- **Pages:** `page.tsx` - Rota
- **Forms:** `*Form.tsx` - Componente de formulário
- **Lists:** `*List.tsx` - Componente de listagem
- **Actions:** `actions.ts` - Server Actions

### 3. Validation Pattern
```typescript
// Schema Zod
export const schema = z.object({ ... })

// Tipo inferido
export type FormData = z.infer<typeof schema>

// Uso na action
const result = validateData(schema, data)
if (!result.success) return result
```

### 4. Error Handling Pattern
```typescript
// ActionResult para operações
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

// Uso
const result = await executeSupabaseOperation(() => query)
if (!result.success) throw new Error(result.error)
```
