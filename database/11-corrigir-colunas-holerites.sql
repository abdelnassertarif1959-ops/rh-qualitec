-- Corrigir colunas da tabela holerites
-- Remover colunas GENERATED e torná-las normais para permitir inserção manual

-- 1. Remover as colunas GENERATED
ALTER TABLE holerites 
  DROP COLUMN IF EXISTS total_proventos CASCADE,
  DROP COLUMN IF EXISTS total_descontos CASCADE,
  DROP COLUMN IF EXISTS salario_liquido CASCADE;

-- 2. Adicionar as colunas como NUMERIC normais
ALTER TABLE holerites
  ADD COLUMN total_proventos NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN total_descontos NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN salario_liquido NUMERIC(10, 2) DEFAULT 0;

-- 3. Adicionar colunas que podem estar faltando
ALTER TABLE holerites
  ADD COLUMN IF NOT EXISTS base_irrf NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aliquota_irrf NUMERIC(5, 2) DEFAULT 0;

-- 4. Atualizar valores existentes (se houver)
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

-- 5. Comentário
COMMENT ON COLUMN holerites.total_proventos IS 'Total de proventos (vencimentos)';
COMMENT ON COLUMN holerites.total_descontos IS 'Total de descontos';
COMMENT ON COLUMN holerites.salario_liquido IS 'Salário líquido (proventos - descontos)';
