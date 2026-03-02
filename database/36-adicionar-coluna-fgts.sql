-- ============================================================================
-- MIGRATION: Adicionar coluna FGTS na tabela holerites
-- ============================================================================
-- Data: 06/02/2026
-- Descrição: Adiciona coluna para armazenar o valor do FGTS (8% do salário)
-- Nota: O FGTS não é descontado do salário, é depositado pela empresa
-- ============================================================================

-- 1. Adicionar coluna FGTS
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS fgts DECIMAL(10,2) DEFAULT 0;

-- 2. Adicionar comentário explicativo
COMMENT ON COLUMN holerites.fgts IS 'Valor do FGTS (8% do salário bruto) - depositado pela empresa, não descontado do funcionário';

-- 3. Atualizar valores existentes (calcular 8% do salário base)
UPDATE holerites 
SET fgts = ROUND(salario_base * 0.08, 2)
WHERE fgts IS NULL OR fgts = 0;

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- Verificar se a coluna foi criada
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'holerites' 
  AND column_name = 'fgts';

-- Verificar alguns registros
SELECT 
  id,
  funcionario_id,
  salario_base,
  fgts,
  ROUND(salario_base * 0.08, 2) as fgts_calculado,
  periodo_inicio,
  periodo_fim
FROM holerites
ORDER BY id DESC
LIMIT 5;

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
