-- =====================================================
-- ADICIONAR COLUNA PENSÃO ALIMENTÍCIA NA TABELA HOLERITES
-- =====================================================
-- Data: 10/02/2026
-- Descrição: Adiciona a coluna pensao_alimenticia na tabela holerites
--            e atualiza as colunas calculadas
-- =====================================================

-- 1. Adicionar coluna pensao_alimenticia na tabela holerites
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_alimenticia DECIMAL(10,2) DEFAULT 0.00;

-- 2. Comentário explicativo
COMMENT ON COLUMN holerites.pensao_alimenticia IS 'Valor da pensão alimentícia descontada no holerite (dedutível do IRRF)';

-- 3. Atualizar valores existentes (se necessário)
-- Copiar valores da tabela funcionarios para holerites existentes
UPDATE holerites h
SET pensao_alimenticia = COALESCE(f.pensao_alimenticia, 0.00)
FROM funcionarios f
WHERE h.funcionario_id = f.id
AND (h.pensao_alimenticia IS NULL OR h.pensao_alimenticia = 0);

-- 4. Recriar as colunas calculadas para incluir pensão alimentícia
-- IMPORTANTE: Precisamos dropar e recriar as colunas GENERATED

-- 4.1. Remover colunas calculadas existentes
ALTER TABLE holerites DROP COLUMN IF EXISTS total_descontos CASCADE;
ALTER TABLE holerites DROP COLUMN IF EXISTS salario_liquido CASCADE;

-- 4.2. Recriar total_descontos incluindo pensão alimentícia
ALTER TABLE holerites 
ADD COLUMN total_descontos DECIMAL(10,2) 
GENERATED ALWAYS AS (
  COALESCE(inss, 0) + 
  COALESCE(irrf, 0) + 
  COALESCE(vale_transporte, 0) + 
  COALESCE(cesta_basica_desconto, 0) + 
  COALESCE(plano_saude, 0) + 
  COALESCE(plano_odontologico, 0) + 
  COALESCE(adiantamento, 0) + 
  COALESCE(faltas, 0) + 
  COALESCE(pensao_alimenticia, 0) + 
  COALESCE(outros_descontos, 0)
) STORED;

-- 4.3. Recriar salario_liquido incluindo pensão alimentícia
ALTER TABLE holerites 
ADD COLUMN salario_liquido DECIMAL(10,2) 
GENERATED ALWAYS AS (
  salario_base + 
  COALESCE(bonus, 0) + 
  COALESCE(horas_extras, 0) + 
  COALESCE(adicional_noturno, 0) + 
  COALESCE(adicional_periculosidade, 0) + 
  COALESCE(adicional_insalubridade, 0) + 
  COALESCE(comissoes, 0) -
  COALESCE(inss, 0) - 
  COALESCE(irrf, 0) - 
  COALESCE(vale_transporte, 0) - 
  COALESCE(cesta_basica_desconto, 0) - 
  COALESCE(plano_saude, 0) - 
  COALESCE(plano_odontologico, 0) - 
  COALESCE(adiantamento, 0) - 
  COALESCE(faltas, 0) - 
  COALESCE(pensao_alimenticia, 0) - 
  COALESCE(outros_descontos, 0)
) STORED;

-- 5. Verificar se a coluna foi criada corretamente
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  CASE 
    WHEN is_generated = 'ALWAYS' THEN 'GENERATED'
    ELSE 'REGULAR'
  END as column_type
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name IN ('pensao_alimenticia', 'total_descontos', 'salario_liquido')
ORDER BY ordinal_position;

-- 6. Verificar alguns registros
SELECT 
  id,
  funcionario_id,
  pensao_alimenticia,
  total_descontos,
  salario_liquido
FROM holerites
LIMIT 5;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
