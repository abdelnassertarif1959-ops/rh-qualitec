-- =====================================================
-- ADICIONAR COLUNA DE REFERÊNCIA DO INSS
-- Data: 10/02/2026
-- Descrição: Adiciona coluna para armazenar texto de 
--            referência quando INSS for valor fixo
-- =====================================================

-- 1. Adicionar coluna inss_referencia
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS inss_referencia VARCHAR(255) DEFAULT NULL;

-- 2. Comentário explicativo
COMMENT ON COLUMN holerites.inss_referencia IS 'Texto de referência para INSS fixo (ex: "7,5% s/ R$ 4.100,00")';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se a coluna foi criada
SELECT column_name, data_type, character_maximum_length, column_default
FROM information_schema.columns
WHERE table_name = 'holerites' 
  AND column_name = 'inss_referencia';

-- =====================================================
-- EXEMPLO DE USO
-- =====================================================

-- Atualizar um holerite com referência do INSS
-- UPDATE holerites 
-- SET inss_referencia = '7,5% s/ R$ 4.100,00'
-- WHERE id = 1272;

-- =====================================================
-- ROLLBACK (se necessário)
-- =====================================================

-- Para remover a coluna (use com cuidado):
-- ALTER TABLE holerites DROP COLUMN IF EXISTS inss_referencia;
