-- ========================================
-- ADICIONAR COLUNA faixa_irrf NA TABELA holerites
-- ========================================
-- Esta coluna armazena a faixa de IRRF aplicada (ex: "Isento", "7,5%", "Transição c/ Redutor")

-- Adicionar coluna se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'holerites' 
        AND column_name = 'faixa_irrf'
    ) THEN
        ALTER TABLE holerites 
        ADD COLUMN faixa_irrf TEXT;
        
        RAISE NOTICE '✅ Coluna faixa_irrf adicionada com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Coluna faixa_irrf já existe.';
    END IF;
END $$;

-- Verificar resultado
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'holerites'
AND column_name = 'faixa_irrf';
