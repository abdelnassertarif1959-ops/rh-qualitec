-- ============================================================================
-- ADICIONAR COLUNAS DE CONFIGURAÇÃO DE INSS E PENSÃO ALIMENTÍCIA
-- ============================================================================
-- Data: 10/02/2026
-- Objetivo: Salvar as configurações de cálculo (tipo e percentual) para 
--           que ao reabrir o modal, os valores sejam mantidos
-- ============================================================================

-- 1. Adicionar colunas de configuração do INSS
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS inss_tipo VARCHAR(20) DEFAULT 'percentual' CHECK (inss_tipo IN ('fixo', 'percentual'));

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS inss_percentual DECIMAL(5,2) DEFAULT 7.5;

-- 2. Adicionar colunas de configuração da Pensão Alimentícia
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_tipo VARCHAR(20) DEFAULT 'percentual' CHECK (pensao_tipo IN ('fixo', 'percentual'));

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_percentual DECIMAL(5,2) DEFAULT 30;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_recorrente BOOLEAN DEFAULT false;

-- 3. Adicionar comentários
COMMENT ON COLUMN holerites.inss_tipo IS 'Tipo de cálculo do INSS: fixo ou percentual';
COMMENT ON COLUMN holerites.inss_percentual IS 'Percentual usado no cálculo do INSS (quando tipo = percentual)';
COMMENT ON COLUMN holerites.pensao_tipo IS 'Tipo de cálculo da pensão: fixo ou percentual';
COMMENT ON COLUMN holerites.pensao_percentual IS 'Percentual usado no cálculo da pensão (quando tipo = percentual)';
COMMENT ON COLUMN holerites.pensao_recorrente IS 'Se a pensão deve ser aplicada automaticamente todos os meses';

-- 4. Verificar se as colunas foram criadas
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'holerites'
AND column_name IN ('inss_tipo', 'inss_percentual', 'pensao_tipo', 'pensao_percentual', 'pensao_recorrente')
ORDER BY column_name;

-- ============================================================================
-- RESULTADO ESPERADO:
-- ============================================================================
-- ✅ 5 novas colunas adicionadas à tabela holerites
-- ✅ Valores padrão configurados (percentual 7.5% para INSS, 30% para pensão)
-- ✅ Constraints de validação aplicadas
-- ============================================================================
