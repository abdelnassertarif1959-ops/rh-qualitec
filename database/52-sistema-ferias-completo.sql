-- ============================================================
-- MIGRAÇÃO 52: Sistema de Férias Completo
-- CLT 2026 - Cálculo de remuneração de férias
-- ============================================================

-- 1. Adicionar colunas financeiras à tabela funcionario_ferias (já existente)
ALTER TABLE funcionario_ferias
  ADD COLUMN IF NOT EXISTS valor_remuneracao     numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_um_terco        numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_abono_pecuniario numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inss                  numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS irrf                  numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_bruto           numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_liquido         numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS holerite_id           integer REFERENCES holerites(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS observacoes           text,
  ADD COLUMN IF NOT EXISTS data_pagamento        date,
  ADD COLUMN IF NOT EXISTS updated_at            timestamptz DEFAULT now();

-- 2. Corrigir valores padrão de colunas existentes (caso nullable)
ALTER TABLE funcionario_ferias
  ALTER COLUMN abono_pecuniario SET DEFAULT false,
  ALTER COLUMN dias_abono       SET DEFAULT 0,
  ALTER COLUMN status           SET DEFAULT 'programado';

-- 3. Adicionar constraint de check para status válido
ALTER TABLE funcionario_ferias DROP CONSTRAINT IF EXISTS funcionario_ferias_status_check;
ALTER TABLE funcionario_ferias DROP CONSTRAINT IF EXISTS chk_ferias_status;
ALTER TABLE funcionario_ferias
  ADD CONSTRAINT chk_ferias_status
  CHECK (status IN ('pendente', 'programado', 'em_gozo', 'concluido', 'cancelado'));

-- 4. Índices de performance
CREATE INDEX IF NOT EXISTS idx_ferias_funcionario_id  ON funcionario_ferias(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_ferias_status           ON funcionario_ferias(status);
CREATE INDEX IF NOT EXISTS idx_ferias_data_inicio      ON funcionario_ferias(data_inicio);
CREATE INDEX IF NOT EXISTS idx_ferias_data_fim         ON funcionario_ferias(data_fim);

-- 5. Habilitar RLS na tabela (se ainda não estiver)
ALTER TABLE funcionario_ferias ENABLE ROW LEVEL SECURITY;

-- 6. Política: admin pode tudo
DROP POLICY IF EXISTS "admin_full_access_ferias" ON funcionario_ferias;
CREATE POLICY "admin_full_access_ferias" ON funcionario_ferias
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. View útil para admin — lista férias com dados do funcionário
CREATE OR REPLACE VIEW vw_ferias_funcionarios AS
SELECT
  ff.id,
  ff.funcionario_id,
  f.nome_completo,
  f.salario_base,
  f.data_admissao,
  c.nome AS cargo_nome,
  d.nome AS departamento_nome,
  ff.periodo_aquisitivo_inicio,
  ff.periodo_aquisitivo_fim,
  ff.data_inicio,
  ff.data_fim,
  ff.dias_corridos,
  ff.dias_uteis,
  ff.abono_pecuniario,
  ff.dias_abono,
  ff.status,
  ff.valor_remuneracao,
  ff.valor_um_terco,
  ff.valor_abono_pecuniario,
  ff.inss,
  ff.irrf,
  ff.valor_bruto,
  ff.valor_liquido,
  ff.holerite_id,
  ff.data_pagamento,
  ff.observacoes,
  ff.created_at,
  ff.updated_at,
  -- Dias corridos calculados das datas (para confirmar o campo)
  (ff.data_fim - ff.data_inicio + 1) AS dias_calculado,
  -- Status automático baseado nas datas
  CASE
    WHEN ff.data_inicio > CURRENT_DATE THEN 'programado'
    WHEN ff.data_inicio <= CURRENT_DATE AND ff.data_fim >= CURRENT_DATE THEN 'em_gozo'
    WHEN ff.data_fim < CURRENT_DATE AND ff.status != 'cancelado' THEN 'concluido'
    ELSE ff.status
  END AS status_automatico
FROM funcionario_ferias ff
JOIN funcionarios f ON f.id = ff.funcionario_id
LEFT JOIN cargos c ON c.id = f.cargo_id
LEFT JOIN departamentos d ON d.id = f.departamento_id;

-- 8. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION fn_update_ferias_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ferias_updated_at ON funcionario_ferias;
CREATE TRIGGER trg_ferias_updated_at
  BEFORE UPDATE ON funcionario_ferias
  FOR EACH ROW EXECUTE FUNCTION fn_update_ferias_updated_at();

-- 9. Função para calcular período aquisitivo automaticamente a partir da admissão
-- (Utility function usada pela API)
CREATE OR REPLACE FUNCTION fn_calcular_periodo_aquisitivo(
  p_data_admissao date,
  p_numero_periodo integer DEFAULT 1
)
RETURNS TABLE(periodo_inicio date, periodo_fim date) LANGUAGE plpgsql AS $$
BEGIN
  -- Período N começa na admissão + (N-1)*12 meses
  -- Período N termina na admissão + N*12 meses - 1 dia
  RETURN QUERY
  SELECT
    (p_data_admissao + ((p_numero_periodo - 1) * INTERVAL '12 months'))::date AS periodo_inicio,
    (p_data_admissao + (p_numero_periodo * INTERVAL '12 months') - INTERVAL '1 day')::date AS periodo_fim;
END;
$$;

-- 10. Confirmar migração
DO $$
BEGIN
  RAISE NOTICE '✅ Migração 52 executada com sucesso: Sistema de Férias Completo';
END $$;
