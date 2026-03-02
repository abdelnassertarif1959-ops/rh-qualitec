-- =====================================================
-- ADICIONAR CONFIGURAÇÕES DE INSS E PENSÃO NOS HOLERITES
-- =====================================================
-- Data: 10/02/2026
-- Objetivo: Salvar configurações de percentual/fixo para INSS e Pensão
--           para que ao reabrir o modal, os valores sejam mantidos

-- Adicionar colunas para configuração do INSS
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS inss_tipo VARCHAR(20) DEFAULT 'percentual',
ADD COLUMN IF NOT EXISTS inss_percentual DECIMAL(5,2) DEFAULT 7.5;

-- Adicionar colunas para configuração da Pensão Alimentícia
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_tipo VARCHAR(20) DEFAULT 'percentual',
ADD COLUMN IF NOT EXISTS pensao_percentual DECIMAL(5,2) DEFAULT 30.0,
ADD COLUMN IF NOT EXISTS pensao_recorrente BOOLEAN DEFAULT false;

-- Comentários nas colunas
COMMENT ON COLUMN holerites.inss_tipo IS 'Tipo de cálculo do INSS: fixo ou percentual';
COMMENT ON COLUMN holerites.inss_percentual IS 'Percentual usado para calcular INSS (se tipo = percentual)';
COMMENT ON COLUMN holerites.pensao_tipo IS 'Tipo de cálculo da pensão: fixo ou percentual';
COMMENT ON COLUMN holerites.pensao_percentual IS 'Percentual usado para calcular pensão (se tipo = percentual)';
COMMENT ON COLUMN holerites.pensao_recorrente IS 'Se a pensão deve ser aplicada automaticamente todos os meses';

-- Atualizar holerites existentes com valores padrão baseados nos valores atuais
-- Se INSS > 0, assumir que é percentual de 7.5% (pode ajustar manualmente depois)
UPDATE holerites 
SET 
  inss_tipo = 'percentual',
  inss_percentual = 7.5,
  pensao_tipo = CASE WHEN pensao_alimenticia > 0 THEN 'percentual' ELSE 'fixo' END,
  pensao_percentual = 30.0,
  pensao_recorrente = false
WHERE inss_tipo IS NULL;

-- Verificar resultado
SELECT 
  id,
  funcionario_id,
  inss,
  inss_tipo,
  inss_percentual,
  pensao_alimenticia,
  pensao_tipo,
  pensao_percentual,
  pensao_recorrente
FROM holerites
ORDER BY id DESC
LIMIT 5;
