-- =====================================================
-- MIGRATION 005 - APLICAR MANUALMENTE NO SUPABASE STUDIO
-- =====================================================
-- Data: 2026-08-17
-- Projeto: gzkbvgbgihsyuxafasjs
-- 
-- INSTRUÇÕES:
-- 1. Acesse https://supabase.com/dashboard
-- 2. Selecione o projeto gzkbvgbgihsyuxafasjs
-- 3. Vá em SQL Editor
-- 4. Cole e execute este script completo
-- 5. Verifique se não houve erros
-- =====================================================

-- 1. Adicionar campos necessários à tabela consultations
-- Usar ADD COLUMN IF NOT EXISTS para segurança (idempotente)

ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS provider_request_id text,
ADD COLUMN IF NOT EXISTS protocol text,
ADD COLUMN IF NOT EXISTS provider_cost numeric(10,2),
ADD COLUMN IF NOT EXISTS requested_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS started_at timestamptz,
ADD COLUMN IF NOT EXISTS completed_at timestamptz,
ADD COLUMN IF NOT EXISTS document_path text;

-- 2. Criar tabela de auditoria de consultas
-- Somente se não existir (idempotente)

CREATE TABLE IF NOT EXISTS public.consultation_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id uuid REFERENCES public.consultations(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- 3. Índices para performance (idempotente)

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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultation_audit_log' 
    AND policyname = 'Admins have full access to consultation_audit_log'
  ) THEN
    CREATE POLICY "Admins have full access to consultation_audit_log" 
      ON public.consultation_audit_log FOR ALL USING (public.is_admin());
  END IF;
END $$;

-- Usuários podem ver logs de suas próprias consultas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultation_audit_log' 
    AND policyname = 'Users can view their consultation audit logs'
  ) THEN
    CREATE POLICY "Users can view their consultation audit logs" 
      ON public.consultation_audit_log FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM public.consultations 
          WHERE consultations.id = consultation_audit_log.consultation_id 
          AND consultations.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 6. Criar view para consultas com provider info

CREATE OR REPLACE VIEW public.consultations_with_provider AS
SELECT 
  c.*,
  qp.name as provider_name,
  qp.type as provider_type
FROM public.consultations c
LEFT JOIN public.query_providers qp ON c.provider_id = qp.id;

-- =====================================================
-- FIM DA MIGRATION 005
-- =====================================================
-- Para verificar se aplicou corretamente, execute:
-- 
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'consultation_audit_log';
-- 
-- SELECT policyname 
-- FROM pg_policies 
-- WHERE tablename = 'consultation_audit_log';
-- =====================================================
