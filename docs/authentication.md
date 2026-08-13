# Autenticação - Documentação

## Visão Geral

O sistema de autenticação utiliza **Supabase Auth** com uma tabela auxiliar `admin_users` para controle de acesso administrativo.

## Estado Atual

| Funcionalidade | Status |
|----------------|--------|
| Supabase Auth configurado | ✅ |
| Tabela admin_users | ✅ |
| Função is_admin() | ✅ |
| RLS habilitado | ✅ |
| Página de login | ⚠️ Estrutura existe |
| Login funcional | ❌ Não implementado |
| Logout | ❌ Não implementado |
| Proteção de rotas | ❌ Não implementado |
| Session management | ❌ Não implementado |

---

## Estrutura

### Supabase Auth
- Integração via `@supabase/ssr` para Server Components
- Client browser via `@supabase/supabase-js`

### Tabela admin_users
```sql
create table public.admin_users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  role text default 'editor', -- 'superadmin', 'editor'
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Função is_admin()
```sql
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users 
    where id = auth.uid() and active = true
  );
end;
$$ language plpgsql security definer;
```

---

## Fluxo de Autenticação (Planejado)

### Login
```
1. Usuário acessa /admin/login
2. Preenche email + senha
3. Chama Supabase Auth signInWithPassword()
4. Supabase retorna session + user
5. Verifica se user existe em admin_users
6. Redireciona para /admin/dashboard
```

### Proteção de Rotas
```
1. Request entra
2. Middleware verifica session
3. Se não autenticado → redireciona para /admin/login
4. Se autenticado → verifica is_admin()
5. Se não é admin → redireciona ou retorna erro
```

---

## Segurança

### Row Level Security (RLS)
Todas as tabelas têm RLS habilitado com políticas:

```sql
-- Admins têm acesso total
create policy "Admins have full access to [table]" 
on public.[table] for all using (public.is_admin());

-- Público pode ler conteúdo ativo
create policy "Public can view active [table]" 
on public.[table] for select using (active = true);
```

### Supabase Client

#### Server Side (`src/lib/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  // Usa cookies do request para session
}
```

#### Client Side (`src/lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## O que Falta Implementar

### Prioridade Alta
1. **Login funcional** - Integrar Supabase Auth no formulário
2. **Middleware** - Proteger rotas do admin
3. **Session management** - Manter usuário logado
4. **Logout** - Encerrar sessão

### Prioridade Média
1. **Refresh token** - Renovação automática
2. **Roles** - Controle por papel (superadmin/editor)
3. **Audit log** - Registro de ações

### Prioridade Baixa
1. **MFA** - Autenticação multifator
2. **Recuperação de senha** - Fluxo de reset
3. **Invites** - Convite de novos admins

---

## Página de Login

### Localização
`src/app/admin/login/page.tsx`

### Estado Atual
- Estrutura HTML existe
- Formulário com campos email/senha
- **Não está conectada ao Supabase Auth**
- **Não redireciona após login**

---

## Notas

1. **Auth via Supabase** - Não usa NextAuth ou similar
2. **RLS como guard** - Mesmo sem middleware, o RLS bloqueia acesso não autorizado
3. **admin_users separada** - Metadados do admin ficam em tabela separada do auth.users
