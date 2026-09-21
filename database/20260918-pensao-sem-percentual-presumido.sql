-- Apenas padrões de novos registros; não altera valores históricos.
ALTER TABLE public.funcionarios ALTER COLUMN pensao_config_percentual SET DEFAULT 0;
ALTER TABLE public.holerites ALTER COLUMN pensao_percentual SET DEFAULT 0;
