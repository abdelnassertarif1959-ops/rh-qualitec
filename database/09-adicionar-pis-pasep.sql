-- Adicionar campo PIS/PASEP na tabela funcionarios
ALTER TABLE funcionarios 
ADD COLUMN IF NOT EXISTS pis_pasep VARCHAR(14);

-- Adicionar comentário
COMMENT ON COLUMN funcionarios.pis_pasep IS 'Número do PIS/PASEP do funcionário (formato: XXX.XXXXX.XX-X)';
