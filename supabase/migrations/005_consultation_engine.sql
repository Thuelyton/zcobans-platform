-- Migration 005: Consultation Engine Enhancement
-- Etapa 9.16 - Motor de Consultas
-- Data: 2026-08-17

-- 1. Adicionar campos necessários à tabela consultations
-- Usar ADD COLUMN IF NOT EXISTS para segurança

ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS provider_request_id text,
ADD COLUMN IF NOT EXISTS protocol text,
ADD COLUMN IF NOT EXISTS provider_cost numeric(10,2),
ADD COLUMN IF NOT EXISTS requested_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS started_at timestamptz,
ADD COLUMN IF NOT EXISTS completed_at timestamptz,
ADD COLUMN IF NOT EXISTS document_path text;

-- 2. Criar tabela de auditoria de consultas
-- Somente se não existir

CREATE TABLE IF NOT EXISTS public.consultation_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id uuid REFERENCES public.consultations(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'created', 'submitted', 'processing', 'completed', 'failed', 'cancelled'
  event_data jsonb DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_consultation_audit_consultation_id 
  ON public.consultation_audit_log(consultation_id);

CREATE INDEX IF NOT EXISTS idx_consultation_audit_event_type 
  ON public.consultation_audit_log(event_type);

CREATE INDEX IF NOT EXISTS idx_consultation_audit_created_at 
  ON public.consultation_audit_log(created_at DESC);

-- 4. Habilitar RLS na tabela de auditoria
ALTER TABLE public.consultation_audit_log ENABLE ROW LEVEL SECURITY;

-- 5. Políticas para consultation_audit_log
-- Acesso total para admins
CREATE POLICY "Admins have full access to consultation_audit_log" 
  ON public.consultation_audit_log FOR ALL USING (public.is_admin());

-- Usuários podem ver logs de suas próprias consultas
CREATE POLICY "Users can view their consultation audit logs" 
  ON public.consultation_audit_log FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations 
      WHERE consultations.id = consultation_audit_log.consultation_id 
      AND consultations.user_id = auth.uid()
    )
  );

-- 6. Criar view para consultas com provider info (opcional, para facilitar consultas)
CREATE OR REPLACE VIEW public.consultations_with_provider AS
SELECT 
  c.*,
  qp.name as provider_name,
  qp.type as provider_type
FROM public.consultations c
LEFT JOIN public.query_providers qp ON c.provider_id = qp.id;
