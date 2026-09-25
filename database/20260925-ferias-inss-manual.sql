ALTER TABLE public.funcionario_ferias
  ADD COLUMN IF NOT EXISTS inss_manual numeric(12,2) DEFAULT NULL
  CHECK (inss_manual >= 0 AND inss_manual <> 'NaN'::numeric);
COMMENT ON COLUMN public.funcionario_ferias.inss_manual IS 'INSS conferido pelo administrador para estas férias. NULL mantém cálculo automático.';
