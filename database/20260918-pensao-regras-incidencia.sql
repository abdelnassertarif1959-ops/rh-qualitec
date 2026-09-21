-- Regras novas são opcionais para preservar configurações e documentos legados.
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS pensao_config_regras jsonb;
ALTER TABLE public.holerites ADD COLUMN IF NOT EXISTS pensao_regras jsonb;
