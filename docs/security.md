# Segurança - Documentação

## Visão Geral

O projeto implementa segurança através do **Supabase RLS**, **validação server-side** e **sanitização de erros**.

---

## Medidas Implementadas

### 1. Row Level Security (RLS)

**Status:** ✅ Habilitado em todas as tabelas

```sql
-- Todas as tabelas têm RLS
alter table public.[table] enable row level security;
```

#### Políticas de Admin
Acesso total para usuários autenticados como admin:
```sql
create policy "Admins have full access to [table]" 
on public.[table] for all using (public.is_admin());
```

#### Políticas Públicas
Leitura de conteúdo ativo:
```sql
create policy "Public can view active [table]" 
on public.[table] for select using (active = true);
```

#### Exceção: Leads
Inserção pública permitida:
```sql
create policy "Public can insert leads" 
on public.leads for insert with check (true);
```

---

### 2. Função is_admin()

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

- Verifica se o usuário está na tabela `admin_users`
- Verifica se está ativo
- Usa `security definer` para acesso seguro

---

### 3. Validação Server-Side

Todos os dados são validados nas Server Actions antes de inserir:

```typescript
const result = validateData(schema, data)
if (!result.success) return result
```

**Previne:**
- SQL injection (via Supabase parameterized queries)
- Dados inválidos
- Tipos incorretos
- Valores fora de limites

---

### 4. Sanitização de Erros

Erros do Supabase são sanitizados antes de retornar ao cliente:

```typescript
function sanitizeErrorMessage(message: string): string {
  // Mapeia erros técnicos para mensagens amigáveis
  // Não expõe detalhes internos do banco
}
```

**Previne:**
- Vazamento de estrutura do banco
- Exposição de nomes de tabelas/colunas
- Detalhes de constraints

---

### 5. Supabase Client

#### Server Side
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  // Usa cookies do request para session
  // Não expõe chaves no client-side
}
```

#### Client Side
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

**Nota:** A `anon key` é pública mas segura graças ao RLS.

---

### 6. Variáveis de Ambiente

```env
# Públicas (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Privadas (server-side apenas)
# Nenhuma identificada no projeto atual
```

---

## O que NÃO está Implementado

### ❌ Autenticação Completa
- Login não está funcional
- Session management não implementado
- Logout não existe

### ❌ Proteção de Rotas
- Middleware não verifica autenticação
- Rotas do admin são acessíveis sem login

### ❌ Rate Limiting
- Sem limite de requisições
- Sem proteção contra brute force

### ❌ CSRF Protection
- Sem tokens CSRF
- Server Actions do Next.js têm proteção básica

### ❌ Headers de Segurança
- Sem CSP (Content Security Policy)
- Sem X-Frame-Options
- Sem X-Content-Type-Options

### ❌ Logging de Segurança
- Sem log de tentativas de acesso
- Sem log de ações admin

---

## Recomendações

### Prioridade Alta
1. **Implementar autenticação** - Login/logout funcionais
2. **Middleware de proteção** - Verificar session em rotas admin
3. **Refresh token** - Manter sessão ativa

### Prioridade Média
1. **Rate limiting** - Proteger endpoints públicos
2. **Audit log** - Registrar ações administrativas
3. **Headers de segurança** - CSP, X-Frame-Options

### Prioridade Baixa
1. **MFA** - Autenticação multifator
2. **IP whitelist** - Restringir acesso
3. **Encryption at rest** - Supabase já implementa

---

## Supabase Security Features

O Supabase já fornece:
- ✅ Encryption em trânsito (TLS)
- ✅ Encryption em repouso
- ✅ Row Level Security
- ✅ API keys com escopo
- ✅ Auth com JWT
- ✅ Backup automático

---

## Notas

1. **RLS é a principal definição** - Mesmo sem middleware, o RLS bloqueia acesso não autorizado
2. **Anon key é pública** - Segurança depende do RLS
3. **Server Actions** - Next.js fornece proteção básica contra CSRF
4. **Sem WAF** - Não há Web Application Firewall configurado
