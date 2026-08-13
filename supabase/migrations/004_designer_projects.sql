-- Migration 004: Designer Projects
-- Etapa 9.7 - Persistência do Designer
-- Data: 2026-08-13

-- 1. designer_projects
-- Tabela de projetos do Designer
CREATE TABLE public.designer_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  page_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Unique constraint: user can't have two projects with same slug
  UNIQUE(user_id, slug)
);

-- Triggers para updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.designer_projects 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Índices para performance
CREATE INDEX idx_designer_projects_user_id ON public.designer_projects(user_id);
CREATE INDEX idx_designer_projects_slug ON public.designer_projects(slug);
CREATE INDEX idx_designer_projects_created_at ON public.designer_projects(created_at DESC);
CREATE INDEX idx_designer_projects_updated_at ON public.designer_projects(updated_at DESC);

-- Row Level Security (RLS)

-- Habilitar RLS
ALTER TABLE public.designer_projects ENABLE ROW LEVEL SECURITY;

-- Políticas para designer_projects

-- Usuários podem ver seus próprios projetos
CREATE POLICY "Users can view their own projects" 
  ON public.designer_projects FOR SELECT 
  USING (auth.uid() = user_id);

-- Usuários podem criar seus próprios projetos
CREATE POLICY "Users can create their own projects" 
  ON public.designer_projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios projetos
CREATE POLICY "Users can update their own projects" 
  ON public.designer_projects FOR UPDATE 
  USING (auth.uid() = user_id);

-- Usuários podem deletar seus próprios projetos
CREATE POLICY "Users can delete their own projects" 
  ON public.designer_projects FOR DELETE 
  USING (auth.uid() = user_id);

-- Admins têm acesso total (para suporte)
CREATE POLICY "Admins have full access to designer_projects" 
  ON public.designer_projects FOR ALL USING (public.is_admin());
