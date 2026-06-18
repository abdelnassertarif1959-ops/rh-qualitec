-- =====================================================
-- MIGRAÇÃO: Adicionar coluna dias_trabalhados
-- Data: 10/02/2026
-- Descrição: Substituir horas_trabalhadas por dias_trabalhados
-- =====================================================

-- 1. Adicionar coluna dias_trabalhados (padrão 30 dias)
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS dias_trabalhados INTEGER DEFAULT 30;

-- 2. Comentário explicativo
COMMENT ON COLUMN holerites.dias_trabalhados IS 'Número de dias trabalhados no mês (padrão: 30 dias). Usado para calcular salário proporcional: (Salário Base / 30) × Dias Trabalhados';

-- 3. Atualizar registros existentes que não têm valor
UPDATE holerites 
SET dias_trabalhados = 30 
WHERE dias_trabalhados IS NULL;

-- 4. (Opcional) Remover coluna horas_trabalhadas se existir
-- Descomente a linha abaixo se quiser remover a coluna antiga
-- ALTER TABLE holerites DROP COLUMN IF EXISTS horas_trabalhadas;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
SELECT 
  'Coluna dias_trabalhados adicionada com sucesso!' as status,
  COUNT(*) as total_holerites,
  COUNT(CASE WHEN dias_trabalhados IS NOT NULL THEN 1 END) as com_dias_trabalhados,
  AVG(dias_trabalhados) as media_dias_trabalhados
FROM holerites;
