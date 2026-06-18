-- =====================================================
-- CORREÇÃO: Ajustar periodo_inicio e periodo_fim dos holerites
-- Data: 06/02/2026
-- =====================================================
-- 
-- PROBLEMA:
-- Holerites mensais estão com periodo_inicio/fim do mês vigente (fevereiro)
-- mas deveriam estar com o mês anterior (janeiro)
--
-- SOLUÇÃO:
-- Atualizar holerites mensais (não adiantamentos) para voltar 1 mês
-- =====================================================

-- BACKUP: Criar tabela temporária com dados atuais
CREATE TABLE IF NOT EXISTS holerites_backup_20260206 AS 
SELECT * FROM holerites;

-- VERIFICAR dados antes da correção
SELECT 
  id,
  funcionario_id,
  periodo_inicio,
  periodo_fim,
  observacoes,
  created_at
FROM holerites
WHERE 
  -- Apenas holerites mensais (não adiantamentos)
  EXTRACT(DAY FROM periodo_inicio) = 1
  -- Apenas holerites de fevereiro que deveriam ser janeiro
  AND periodo_inicio >= '2026-02-01'
  AND periodo_inicio < '2026-03-01'
ORDER BY created_at DESC;

-- CORREÇÃO: Voltar 1 mês nos holerites mensais de fevereiro
UPDATE holerites
SET 
  periodo_inicio = periodo_inicio - INTERVAL '1 month',
  periodo_fim = (periodo_inicio - INTERVAL '1 month' + INTERVAL '1 month' - INTERVAL '1 day')::date,
  updated_at = NOW()
WHERE 
  -- Apenas holerites mensais (dia 1)
  EXTRACT(DAY FROM periodo_inicio) = 1
  -- Apenas holerites de fevereiro
  AND periodo_inicio >= '2026-02-01'
  AND periodo_inicio < '2026-03-01'
  -- Não atualizar adiantamentos
  AND (observacoes NOT LIKE '%Adiantamento%' OR observacoes IS NULL);

-- VERIFICAR dados após a correção
SELECT 
  id,
  funcionario_id,
  periodo_inicio,
  periodo_fim,
  observacoes,
  updated_at
FROM holerites
WHERE 
  periodo_inicio >= '2026-01-01'
  AND periodo_inicio < '2026-02-01'
  AND EXTRACT(DAY FROM periodo_inicio) = 1
ORDER BY updated_at DESC;

-- =====================================================
-- ROLLBACK (caso necessário):
-- =====================================================
-- DELETE FROM holerites WHERE updated_at > '2026-02-06';
-- INSERT INTO holerites SELECT * FROM holerites_backup_20260206;
-- DROP TABLE holerites_backup_20260206;
