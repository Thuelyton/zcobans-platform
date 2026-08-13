-- Migration 003: Query Engine Tables
-- Etapa 9.3 - Motor de Consultas
-- Data: 2026-08-11

-- 1. query_providers
-- Tabela de configuração dos provedores de consulta
-- Acesso controlado exclusivamente por admins
CREATE TABLE public.query_providers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL, -- 'mock', 'serasa', 'sivec', 'detran', etc.
  description text,
  config jsonb DEFAULT '{}'::jsonb, -- Configurações específicas do provider
  credits_per_query integer DEFAULT 1,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. consultations
-- Registro de todas as consultas realizadas
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES public.query_providers(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_document text NOT NULL,
  document_type text NOT NULL, -- 'cpf', 'cnpj', 'rg'
  query_type text NOT NULL, -- 'cpf', 'inss', 'fgts', 'telefone', 'limpa_nome'
  status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'error', 'cancelled'
  error_message text,
  credits_used integer DEFAULT 0, -- Estrutural - será used na Etapa 9.4
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. consultation_results
-- Resultados das consultas
CREATE TABLE public.consultation_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id uuid REFERENCES public.consultations(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES public.query_providers(id) ON DELETE SET NULL,
  raw_data jsonb NOT NULL, -- Resposta bruta do provider (dados sensíveis)
  processed_data jsonb, -- Dados processados/formatados
  score integer, -- Score de confiança (0-100)
  created_at timestamptz DEFAULT now()
);

-- Triggers para updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.query_providers 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.consultations 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Índices para performance
CREATE INDEX idx_query_providers_type ON public.query_providers(type);
CREATE INDEX idx_query_providers_active ON public.query_providers(active);

CREATE INDEX idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX idx_consultations_status ON public.consultations(status);
CREATE INDEX idx_consultations_query_type ON public.consultations(query_type);
CREATE INDEX idx_consultations_created_at ON public.consultations(created_at DESC);

CREATE INDEX idx_consultation_results_consultation_id ON public.consultation_results(consultation_id);

-- Row Level Security (RLS)

-- Habilitar RLS
ALTER TABLE public.query_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_results ENABLE ROW LEVEL SECURITY;

-- Políticas para query_providers
-- Acesso total apenas para admins (configuração interna)
CREATE POLICY "Admins have full access to query_providers" 
  ON public.query_providers FOR ALL USING (public.is_admin());

-- NENHUMA política pública - providers são configuração interna

-- Políticas para consultations
-- Acesso total para admins
CREATE POLICY "Admins have full access to consultations" 
  ON public.consultations FOR ALL USING (public.is_admin());

-- Usuários autenticados podem ver suas próprias consultas
CREATE POLICY "Users can view their own consultations" 
  ON public.consultations FOR SELECT 
  USING (auth.uid() = user_id);

-- Usuários autenticados podem criar consultas (user_id definido via auth.uid() no server)
CREATE POLICY "Authenticated users can create consultations" 
  ON public.consultations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas para consultation_results
-- Acesso total para admins
CREATE POLICY "Admins have full access to consultation_results" 
  ON public.consultation_results FOR ALL USING (public.is_admin());

-- Usuários podem ver resultados de suas próprias consultas
CREATE POLICY "Users can view results of their consultations" 
  ON public.consultation_results FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations 
      WHERE consultations.id = consultation_results.consultation_id 
      AND consultations.user_id = auth.uid()
    )
  );

-- Inserir provider Mock para desenvolvimento
INSERT INTO public.query_providers (name, slug, type, description, credits_per_query, active)
VALUES ('Mock Provider', 'mock-provider', 'mock', 'Provedor de simulação para desenvolvimento e testes', 0, true);
