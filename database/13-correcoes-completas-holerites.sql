-- ============================================
-- SCRIPT COMPLETO DE CORREÇÕES
-- Executar no Supabase SQL Editor
-- ============================================

-- 1. CORRIGIR TABELA HOLERITES
-- Remover colunas GENERATED e torná-las normais

ALTER TABLE holerites 
  DROP COLUMN IF EXISTS total_proventos CASCADE,
  DROP COLUMN IF EXISTS total_descontos CASCADE,
  DROP COLUMN IF EXISTS salario_liquido CASCADE;

ALTER TABLE holerites
  ADD COLUMN total_proventos NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN total_descontos NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN salario_liquido NUMERIC(10, 2) DEFAULT 0;

-- Adicionar colunas que podem estar faltando
ALTER TABLE holerites
  ADD COLUMN IF NOT EXISTS base_irrf NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aliquota_irrf NUMERIC(5, 2) DEFAULT 0;

-- Comentários
COMMENT ON COLUMN holerites.total_proventos IS 'Total de proventos (vencimentos)';
COMMENT ON COLUMN holerites.total_descontos IS 'Total de descontos';
COMMENT ON COLUMN holerites.salario_liquido IS 'Salário líquido (proventos - descontos)';
COMMENT ON COLUMN holerites.base_irrf IS 'Base de cálculo do IRRF (salário - INSS - dependentes)';
COMMENT ON COLUMN holerites.aliquota_irrf IS 'Alíquota efetiva do IRRF aplicada';

-- 2. ADICIONAR COLUNA DE DEPENDENTES NA TABELA FUNCIONARIOS
ALTER TABLE funcionarios
  ADD COLUMN IF NOT EXISTS numero_dependentes INTEGER DEFAULT 0;

COMMENT ON COLUMN funcionarios.numero_dependentes IS 'Número de dependentes para dedução do IRRF (R$ 189,59 por dependente)';

-- Atualizar funcionários existentes para 0 dependentes se NULL
UPDATE funcionarios
SET numero_dependentes = 0
WHERE numero_dependentes IS NULL;

-- 3. ATUALIZAR VALORES EXISTENTES DE HOLERITES (se houver)
UPDATE holerites
SET 
  total_proventos = COALESCE(salario_base, 0) + COALESCE(bonus, 0) + COALESCE(horas_extras, 0) + 
                    COALESCE(adicional_noturno, 0) + COALESCE(adicional_periculosidade, 0) + 
                    COALESCE(adicional_insalubridade, 0) + COALESCE(comissoes, 0),
  total_descontos = COALESCE(inss, 0) + COALESCE(irrf, 0) + COALESCE(vale_transporte, 0) + 
                    COALESCE(vale_refeicao_desconto, 0) + COALESCE(plano_saude, 0) + 
                    COALESCE(plano_odontologico, 0) + COALESCE(adiantamento, 0) + COALESCE(faltas, 0)
WHERE total_proventos = 0 OR total_descontos = 0;

UPDATE holerites
SET salario_liquido = total_proventos - total_descontos
WHERE salario_liquido = 0;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Verificar se tudo foi aplicado corretamente:
SELECT 
  'holerites' as tabela,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'holerites'
  AND column_name IN ('total_proventos', 'total_descontos', 'salario_liquido', 'base_irrf', 'aliquota_irrf')
ORDER BY column_name;

SELECT 
  'funcionarios' as tabela,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'funcionarios'
  AND column_name = 'numero_dependentes';
