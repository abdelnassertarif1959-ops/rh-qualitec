-- =====================================================
-- ADICIONAR CONFIGURAÇÕES PERMANENTES DE INSS E PENSÃO
-- =====================================================
-- Data: 10/02/2026
-- Descrição: Adiciona campos para salvar configurações permanentes
--            de INSS e Pensão Alimentícia no cadastro do funcionário

-- Adicionar colunas de configuração permanente na tabela funcionarios
ALTER TABLE funcionarios
ADD COLUMN IF NOT EXISTS inss_config_tipo VARCHAR(20) DEFAULT 'percentual',
ADD COLUMN IF NOT EXISTS inss_config_percentual DECIMAL(5,2) DEFAULT 7.5,
ADD COLUMN IF NOT EXISTS inss_config_valor_fixo DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS inss_config_referencia VARCHAR(10),
ADD COLUMN IF NOT EXISTS pensao_config_tipo VARCHAR(20) DEFAULT 'percentual',
ADD COLUMN IF NOT EXISTS pensao_config_percentual DECIMAL(5,2) DEFAULT 30,
ADD COLUMN IF NOT EXISTS pensao_config_valor_fixo DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pensao_config_recorrente BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pensao_config_ativa BOOLEAN DEFAULT false;

-- Comentários explicativos
COMMENT ON COLUMN funcionarios.inss_config_tipo IS 'Tipo de cálculo do INSS: percentual ou fixo';
COMMENT ON COLUMN funcionarios.inss_config_percentual IS 'Percentual do INSS (ex: 7.5, 8.9, 12.0)';
COMMENT ON COLUMN funcionarios.inss_config_valor_fixo IS 'Valor fixo do INSS (quando tipo = fixo)';
COMMENT ON COLUMN funcionarios.inss_config_referencia IS 'Referência que aparece no PDF (ex: 8.90)';
COMMENT ON COLUMN funcionarios.pensao_config_tipo IS 'Tipo de cálculo da pensão: percentual ou fixo';
COMMENT ON COLUMN funcionarios.pensao_config_percentual IS 'Percentual da pensão (ex: 30)';
COMMENT ON COLUMN funcionarios.pensao_config_valor_fixo IS 'Valor fixo da pensão (quando tipo = fixo)';
COMMENT ON COLUMN funcionarios.pensao_config_recorrente IS 'Se a pensão é recorrente (todos os meses)';
COMMENT ON COLUMN funcionarios.pensao_config_ativa IS 'Se o funcionário tem pensão alimentícia ativa';

-- Migrar configurações existentes dos holerites para os funcionários
-- (pegar a configuração mais recente de cada funcionário)
UPDATE funcionarios f
SET 
  inss_config_tipo = COALESCE(h.inss_tipo, 'percentual'),
  inss_config_percentual = COALESCE(h.inss_percentual, 7.5),
  inss_config_referencia = h.inss_referencia,
  pensao_config_tipo = COALESCE(h.pensao_tipo, 'percentual'),
  pensao_config_percentual = COALESCE(h.pensao_percentual, 30),
  pensao_config_recorrente = COALESCE(h.pensao_recorrente, false),
  pensao_config_ativa = CASE WHEN h.pensao_alimenticia > 0 THEN true ELSE false END
FROM (
  SELECT DISTINCT ON (funcionario_id)
    funcionario_id,
    inss_tipo,
    inss_percentual,
    inss_referencia,
    pensao_tipo,
    pensao_percentual,
    pensao_recorrente,
    pensao_alimenticia
  FROM holerites
  WHERE inss_tipo IS NOT NULL OR pensao_tipo IS NOT NULL
  ORDER BY funcionario_id, created_at DESC
) h
WHERE f.id = h.funcionario_id;

-- Verificar resultado
SELECT 
  id,
  nome_completo,
  inss_config_tipo,
  inss_config_percentual,
  inss_config_referencia,
  pensao_config_tipo,
  pensao_config_percentual,
  pensao_config_ativa
FROM funcionarios
WHERE inss_config_tipo IS NOT NULL OR pensao_config_ativa = true
ORDER BY nome_completo;

-- ✅ Migração concluída!
-- As configurações de INSS e Pensão agora são permanentes no cadastro do funcionário
