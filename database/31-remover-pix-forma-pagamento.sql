-- ========================================
-- REMOVER PIX COMO FORMA DE PAGAMENTO
-- ========================================
-- Atualizar funcionários que têm PIX como forma de pagamento para 'deposito'
-- O campo chave_pix será mantido para referência

-- Verificar quantos funcionários têm PIX como forma de pagamento
SELECT 
    COUNT(*) as total_funcionarios_pix,
    'Funcionários com forma_pagamento = pix' as descricao
FROM funcionarios 
WHERE forma_pagamento = 'pix';

-- Atualizar funcionários com PIX para depósito
UPDATE funcionarios 
SET forma_pagamento = 'deposito'
WHERE forma_pagamento = 'pix';

-- Verificar resultado da atualização
SELECT 
    forma_pagamento,
    COUNT(*) as total
FROM funcionarios 
GROUP BY forma_pagamento
ORDER BY forma_pagamento;

-- Log da operação
DO $$
DECLARE
    funcionarios_atualizados INTEGER;
BEGIN
    -- Contar quantos foram atualizados
    SELECT COUNT(*) INTO funcionarios_atualizados
    FROM funcionarios 
    WHERE forma_pagamento = 'deposito' AND chave_pix IS NOT NULL AND chave_pix != '';
    
    RAISE NOTICE '✅ Migração PIX concluída:';
    RAISE NOTICE '   - Forma de pagamento PIX removida das opções';
    RAISE NOTICE '   - Funcionários atualizados para depósito: %', funcionarios_atualizados;
    RAISE NOTICE '   - Campo chave_pix mantido para referência';
END $$;