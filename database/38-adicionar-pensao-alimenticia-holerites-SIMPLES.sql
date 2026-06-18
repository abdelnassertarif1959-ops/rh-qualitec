-- =====================================================
-- ADICIONAR COLUNA PENSÃO ALIMENTÍCIA NA TABELA HOLERITES
-- VERSÃO SIMPLES - SÓ ADICIONA A COLUNA
-- =====================================================
-- Data: 10/02/2026
-- =====================================================

-- 1. Adicionar coluna pensao_alimenticia
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_alimenticia DECIMAL(10,2) DEFAULT 0.00;

-- 2. Comentário explicativo
COMMENT ON COLUMN holerites.pensao_alimenticia IS 'Valor da pensão alimentícia descontada no holerite (dedutível do IRRF)';

-- 3. Verificar se a coluna foi criada
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name = 'pensao_alimenticia';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
