ALTER TABLE public.funcionario_ferias
  ADD COLUMN IF NOT EXISTS irrf_manual numeric(12,2) DEFAULT NULL
  CHECK (irrf_manual >= 0 AND irrf_manual <> 'NaN'::numeric);
COMMENT ON COLUMN public.funcionario_ferias.irrf_manual IS 'IRRF informado pelo administrador para este período. NULL usa cálculo automático; zero é uma substituição explícita.';
