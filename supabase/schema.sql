-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. admin_users (handled by Supabase Auth, but we can store extra metadata if needed)
-- Instead of a separate table, we'll rely on auth.users and use a role claim or just check if they are in a specific list,
-- but for completeness, let's create a profile table for admins.
create table public.admin_users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  role text default 'editor', -- 'superadmin', 'editor'
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. site_settings
create table public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text not null,
  site_description text,
  logo_url text,
  favicon_url text,
  theme_color text,
  social_links jsonb default '{}'::jsonb,
  maintenance_mode boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. banners
create table public.banners (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  image_url text not null,
  link_url text,
  button_text text,
  position integer default 0,
  active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. promotions
create table public.promotions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  discount_type text, -- 'percentage', 'fixed'
  discount_value numeric,
  code text unique,
  active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. service_categories
create table public.service_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  position integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. services
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.service_categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  features jsonb default '[]'::jsonb,
  price numeric,
  image_url text,
  position integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. service_status
create table public.service_status (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references public.services(id) on delete cascade,
  status text not null, -- 'operational', 'degraded', 'outage', 'maintenance'
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. trust_indicators (Depoimentos, parceiros, etc)
create table public.trust_indicators (
  id uuid primary key default uuid_generate_v4(),
  type text not null, -- 'testimonial', 'partner_logo', 'award'
  title text,
  description text,
  image_url text,
  position integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. leads
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  status text default 'new', -- 'new', 'contacted', 'qualified', 'closed'
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 10. faq_items
create table public.faq_items (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  category text,
  position integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 11. contact_settings
create table public.contact_settings (
  id uuid primary key default uuid_generate_v4(),
  email text,
  phone text,
  whatsapp text,
  address text,
  maps_url text,
  business_hours text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 12. content_sections (Para gerenciar textos institucionais)
create table public.content_sections (
  id uuid primary key default uuid_generate_v4(),
  identifier text unique not null, -- ex: 'about_us', 'terms_of_service'
  title text,
  content text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Set updated_at triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply triggers to all tables
create trigger set_updated_at before update on public.admin_users for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.site_settings for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.banners for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.promotions for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.service_categories for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.services for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.service_status for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.trust_indicators for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.leads for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.faq_items for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.contact_settings for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.content_sections for each row execute procedure public.handle_updated_at();

-- RLS Policies (Row Level Security)
-- Security: by default allow read for active stuff, but deny all mutations for non-admins

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.banners enable row level security;
alter table public.promotions enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.service_status enable row level security;
alter table public.trust_indicators enable row level security;
alter table public.leads enable row level security;
alter table public.faq_items enable row level security;
alter table public.contact_settings enable row level security;
alter table public.content_sections enable row level security;

-- Function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users where id = auth.uid() and active = true
  );
end;
$$ language plpgsql security definer;

-- Admins can do everything
create policy "Admins have full access to admin_users" on public.admin_users for all using (public.is_admin());
create policy "Admins have full access to site_settings" on public.site_settings for all using (public.is_admin());
create policy "Admins have full access to banners" on public.banners for all using (public.is_admin());
create policy "Admins have full access to promotions" on public.promotions for all using (public.is_admin());
create policy "Admins have full access to service_categories" on public.service_categories for all using (public.is_admin());
create policy "Admins have full access to services" on public.services for all using (public.is_admin());
create policy "Admins have full access to service_status" on public.service_status for all using (public.is_admin());
create policy "Admins have full access to trust_indicators" on public.trust_indicators for all using (public.is_admin());
create policy "Admins have full access to leads" on public.leads for all using (public.is_admin());
create policy "Admins have full access to faq_items" on public.faq_items for all using (public.is_admin());
create policy "Admins have full access to contact_settings" on public.contact_settings for all using (public.is_admin());
create policy "Admins have full access to content_sections" on public.content_sections for all using (public.is_admin());

-- Public can read active content
create policy "Public can view site_settings" on public.site_settings for select using (true);
create policy "Public can view active banners" on public.banners for select using (active = true);
create policy "Public can view active promotions" on public.promotions for select using (active = true);
create policy "Public can view active categories" on public.service_categories for select using (active = true);
create policy "Public can view active services" on public.services for select using (active = true);
create policy "Public can view service_status" on public.service_status for select using (true);
create policy "Public can view active trust_indicators" on public.trust_indicators for select using (active = true);
create policy "Public can view active faq_items" on public.faq_items for select using (active = true);
create policy "Public can view contact_settings" on public.contact_settings for select using (true);
create policy "Public can view active content_sections" on public.content_sections for select using (active = true);

-- Public can insert leads
create policy "Public can insert leads" on public.leads for insert with check (true);

-- 13. query_providers
-- Tabela de configuração dos provedores de consulta
-- Acesso controlado exclusivamente por admins
create table public.query_providers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  type text not null, -- 'mock', 'serasa', 'sivec', 'detran', etc.
  description text,
  config jsonb default '{}'::jsonb, -- Configurações específicas do provider
  credits_per_query integer default 1,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 14. consultations
-- Registro de todas as consultas realizadas
create table public.consultations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  provider_id uuid references public.query_providers(id) on delete set null,
  client_name text not null,
  client_document text not null,
  document_type text not null, -- 'cpf', 'cnpj', 'rg'
  query_type text not null, -- 'cpf', 'inss', 'fgts', 'telefone', 'limpa_nome'
  status text default 'pending', -- 'pending', 'processing', 'completed', 'error', 'cancelled'
  error_message text,
  credits_used integer default 0, -- Estrutural - será used na Etapa 9.4
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 15. consultation_results
-- Resultados das consultas
create table public.consultation_results (
  id uuid primary key default uuid_generate_v4(),
  consultation_id uuid references public.consultations(id) on delete cascade,
  provider_id uuid references public.query_providers(id) on delete set null,
  raw_data jsonb not null, -- Resposta bruta do provider (dados sensíveis)
  processed_data jsonb, -- Dados processados/formatados
  score integer, -- Score de confiança (0-100)
  created_at timestamptz default now()
);

-- Apply triggers to new tables
create trigger set_updated_at before update on public.query_providers for each row execute procedure public.handle_updated_at();
create trigger set_updated_at before update on public.consultations for each row execute procedure public.handle_updated_at();

-- Enable RLS for new tables
alter table public.query_providers enable row level security;
alter table public.consultations enable row level security;
alter table public.consultation_results enable row level security;

-- Admins have full access to query_providers (internal config only)
create policy "Admins have full access to query_providers" on public.query_providers for all using (public.is_admin());

-- Admins have full access to consultations
create policy "Admins have full access to consultations" on public.consultations for all using (public.is_admin());

-- Users can view their own consultations
create policy "Users can view their own consultations" on public.consultations for select using (auth.uid() = user_id);

-- Authenticated users can create consultations (user_id set via auth.uid() on server)
create policy "Authenticated users can create consultations" on public.consultations for insert with check (auth.uid() = user_id);

-- Admins have full access to consultation_results
create policy "Admins have full access to consultation_results" on public.consultation_results for all using (public.is_admin());

-- Users can view results of their own consultations
create policy "Users can view results of their consultations" on public.consultation_results for select using (
  exists (
    select 1 from public.consultations 
    where consultations.id = consultation_results.consultation_id 
    and consultations.user_id = auth.uid()
  )
);

-- Insert mock provider for development
insert into public.query_providers (name, slug, type, description, credits_per_query, active)
values ('Mock Provider', 'mock-provider', 'mock', 'Provedor de simulação para desenvolvimento e testes', 0, true);
