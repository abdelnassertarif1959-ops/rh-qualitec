ALTER TABLE public.holerites
  ADD COLUMN IF NOT EXISTS decimo_ano integer,
  ADD COLUMN IF NOT EXISTS decimo_parcela smallint,
  ADD COLUMN IF NOT EXISTS decimo_dados jsonb,
  ADD COLUMN IF NOT EXISTS decimo_primeira_id integer REFERENCES public.holerites(id) ON DELETE RESTRICT;
ALTER TABLE public.holerites ADD CONSTRAINT holerites_decimo_consistente CHECK (
  (decimo_ano IS NULL AND decimo_parcela IS NULL AND decimo_dados IS NULL AND decimo_primeira_id IS NULL)
  OR (decimo_ano IS NOT NULL AND decimo_parcela IS NOT NULL AND decimo_ano BETWEEN 2026 AND 2100 AND decimo_parcela IN (1,2) AND decimo_dados IS NOT NULL
    AND ((decimo_parcela = 1 AND decimo_primeira_id IS NULL) OR (decimo_parcela = 2 AND decimo_primeira_id IS NOT NULL)))
);
CREATE UNIQUE INDEX holerites_decimo_funcionario_ano_parcela ON public.holerites(funcionario_id, decimo_ano, decimo_parcela) WHERE decimo_ano IS NOT NULL;
