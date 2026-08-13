# Banco de Dados - Documentação

## Visão Geral

O banco de dados é PostgreSQL gerenciado pelo **Supabase**, com 12 tabelas e Row Level Security (RLS) habilitado.

## Schema

### Tabelas

#### 1. admin_users
Usuários administradores do sistema.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK, FK → auth.users | ID do usuário (Supabase Auth) |
| `name` | text | | Nome do usuário |
| `role` | text | DEFAULT 'editor' | Papel: 'superadmin' ou 'editor' |
| `active` | boolean | DEFAULT true | Se está ativo |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 2. site_settings
Configurações gerais do site (singleton).

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do registro |
| `site_name` | text | NOT NULL | Nome do site |
| `site_description` | text | | Descrição do site |
| `logo_url` | text | | URL do logo |
| `favicon_url` | text | | URL do favicon |
| `theme_color` | text | | Cor do tema |
| `social_links` | jsonb | DEFAULT '{}' | Links de redes sociais |
| `maintenance_mode` | boolean | DEFAULT false | Modo manutenção |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 3. banners
Banners promocionais exibidos no site.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do banner |
| `title` | text | NOT NULL | Título |
| `subtitle` | text | | Subtítulo |
| `image_url` | text | NOT NULL | URL da imagem |
| `link_url` | text | | URL de destino |
| `button_text` | text | | Texto do botão |
| `position` | integer | DEFAULT 0 | Posição de exibição |
| `active` | boolean | DEFAULT true | Se está ativo |
| `starts_at` | timestamptz | | Data de início |
| `ends_at` | timestamptz | | Data de término |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 4. promotions
Promoções e descontos.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID da promoção |
| `title` | text | NOT NULL | Título |
| `description` | text | | Descrição |
| `discount_type` | text | | Tipo: 'percentage' ou 'fixed' |
| `discount_value` | numeric | | Valor do desconto |
| `code` | text | UNIQUE | Código do cupom |
| `active` | boolean | DEFAULT true | Se está ativo |
| `starts_at` | timestamptz | | Data de início |
| `ends_at` | timestamptz | | Data de término |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 5. service_categories
Categorias de serviços.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID da categoria |
| `name` | text | NOT NULL | Nome |
| `slug` | text | UNIQUE, NOT NULL | Slug para URL |
| `description` | text | | Descrição |
| `image_url` | text | | URL da imagem |
| `position` | integer | DEFAULT 0 | Posição |
| `active` | boolean | DEFAULT true | Se está ativo |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 6. services
Serviços oferecidos.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do serviço |
| `category_id` | uuid | FK → service_categories | Categoria |
| `name` | text | NOT NULL | Nome |
| `slug` | text | UNIQUE, NOT NULL | Slug para URL |
| `description` | text | | Descrição completa |
| `short_description` | text | | Descrição curta |
| `features` | jsonb | DEFAULT '[]' | Lista de características |
| `price` | numeric | | Preço |
| `image_url` | text | | URL da imagem |
| `position` | integer | DEFAULT 0 | Posição |
| `active` | boolean | DEFAULT true | Se está ativo |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 7. service_status
Status operacional dos serviços.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do registro |
| `service_id` | uuid | FK → services | Serviço |
| `status` | text | NOT NULL | Status: 'operational', 'degraded', 'outage', 'maintenance' |
| `message` | text | | Mensagem adicional |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 8. trust_indicators
Indicadores de confiança (depoimentos, parceiros, prêmios).

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do indicador |
| `type` | text | NOT NULL | Tipo: 'testimonial', 'partner_logo', 'award' |
| `title` | text | | Título |
| `description` | text | | Descrição |
| `image_url` | text | | URL da imagem |
| `position` | integer | DEFAULT 0 | Posição |
| `active` | boolean | DEFAULT true | Se está ativo |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 9. leads
Leads recebidos via formulário de contato.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do lead |
| `name` | text | NOT NULL | Nome |
| `email` | text | NOT NULL | Email |
| `phone` | text | | Telefone |
| `company` | text | | Empresa |
| `message` | text | | Mensagem |
| `status` | text | DEFAULT 'new' | Status: 'new', 'contacted', 'qualified', 'closed' |
| `source` | text | | Origem do lead |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 10. faq_items
Perguntas frequentes.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do item |
| `question` | text | NOT NULL | Pergunta |
| `answer` | text | NOT NULL | Resposta |
| `category` | text | | Categoria |
| `position` | integer | DEFAULT 0 | Posição |
| `active` | boolean | DEFAULT true | Se está ativo |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 11. contact_settings
Configurações de contato.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID do registro |
| `email` | text | | Email de contato |
| `phone` | text | | Telefone |
| `whatsapp` | text | | WhatsApp |
| `address` | text | | Endereço |
| `maps_url` | text | | URL do Google Maps |
| `business_hours` | text | | Horário de funcionamento |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

#### 12. content_sections
Seções de conteúdo institucional.

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | ID da seção |
| `identifier` | text | UNIQUE, NOT NULL | Identificador único |
| `title` | text | | Título |
| `content` | text | | Conteúdo |
| `active` | boolean | DEFAULT true | Se está ativo |
| `created_at` | timestamptz | DEFAULT now() | Data de criação |
| `updated_at` | timestamptz | DEFAULT now() | Última atualização |

---

## Enums

### Status de Leads
- `new` - Novo
- `contacted` - Contatado
- `qualified` - Qualificado
- `closed` - Fechado

### Status de Serviços
- `operational` - Operacional
- `degraded` - Performance reduzida
- `outage` - Fora do ar
- `maintenance` - Em manutenção

### Tipos de Desconto
- `percentage` - Percentual
- `fixed` - Valor fixo

### Tipos de Indicadores de Confiança
- `testimonial` - Depoimento
- `partner_logo` - Logo de parceiro
- `award` - Prêmio/certificação

### Papéis de Admin
- `superadmin` - Super administrador
- `editor` - Editor

---

## Triggers

### handle_updated_at()
Atualiza automaticamente o campo `updated_at` em todas as tabelas.

```sql
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

**Aplicado em:** Todas as 12 tabelas.

---

## Relacionamentos

```
auth.users ──────────┐
                     ▼
              admin_users

service_categories ──────┐
                        ▼
                   services ──────┐
                                 ▼
                          service_status
```

- `admin_users.id` → `auth.users.id` (ON DELETE CASCADE)
- `services.category_id` → `service_categories.id` (ON DELETE SET NULL)
- `service_status.service_id` → `services.id` (ON DELETE CASCADE)

---

## Row Level Security (RLS)

### Políticas de Admin
Todas as tabelas têm política que permite acesso total para admins:
```sql
create policy "Admins have full access to [table]" 
on public.[table] for all using (public.is_admin());
```

### Políticas Públicas (Leitura)
Leitura de conteúdo ativo para usuários anônimos:
```sql
-- Banners ativos
create policy "Public can view active banners" 
on public.banners for select using (active = true);

-- Serviços ativos
create policy "Public can view active services" 
on public.services for select using (active = true);

-- etc.
```

### Políticas Públicas (Escrita)
Apenas inserção de leads permitida para público:
```sql
create policy "Public can insert leads" 
on public.leads for insert with check (true);
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

## Índices

Não foram identificados índices explícitos além das constraints UNIQUE:
- `service_categories.slug`
- `services.slug`
- `promotions.code`
- `content_sections.identifier`

---

## Notas

1. **Sem foreign keys explícitas** - Alguns relacionamentos não têm FK definida (ex: `service_status.service_id`)
2. **JSONB fields** - `services.features` e `site_settings.social_links` usam JSONB
3. **Singleton settings** - `site_settings` usa UUID fixo `00000000-0000-0000-0000-000000000000`
