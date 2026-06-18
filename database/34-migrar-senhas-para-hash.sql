-- Migração para adicionar coluna senha_hash e migrar senhas existentes
-- ATENÇÃO: Execute este script com cuidado em produção

-- 1. Adicionar coluna senha_hash
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS senha_hash TEXT;

-- 2. Criar função para hash de senhas (temporária para migração)
-- NOTA: Em produção, faça o hash no backend, não no banco
CREATE OR REPLACE FUNCTION hash_existing_passwords()
RETURNS void AS $$
DECLARE
    funcionario_record RECORD;
BEGIN
    -- Iterar sobre funcionários com senhas em texto plano
    FOR funcionario_record IN 
        SELECT id, senha 
        FROM funcionarios 
        WHERE senha IS NOT NULL 
        AND (senha_hash IS NULL OR senha_hash = '')
    LOOP
        -- ATENÇÃO: Este é um exemplo. Use bcrypt no backend!
        -- Aqui estamos apenas movendo a senha para senha_hash temporariamente
        -- Mantemos a senha original por enquanto para não quebrar a constraint
        UPDATE funcionarios 
        SET senha_hash = 'MIGRAR_' || senha
        WHERE id = funcionario_record.id;
    END LOOP;
    
    RAISE NOTICE 'Migração concluída. IMPORTANTE: Execute o script de hash no backend!';
    RAISE NOTICE 'As senhas originais foram mantidas. Remova-as apenas após confirmar que o hash funciona.';
END;
$$ LANGUAGE plpgsql;

-- 3. Executar migração
SELECT hash_existing_passwords();

-- 4. Remover função temporária
DROP FUNCTION hash_existing_passwords();

-- 5. Verificar quantos registros foram migrados
SELECT 
    COUNT(*) as total_funcionarios,
    COUNT(CASE WHEN senha_hash LIKE 'MIGRAR_%' THEN 1 END) as migrados,
    COUNT(CASE WHEN senha_hash IS NULL OR senha_hash = '' THEN 1 END) as pendentes
FROM funcionarios;

-- 6. APÓS CONFIRMAR QUE O LOGIN FUNCIONA, execute estes comandos:
-- 
-- -- Remover constraint NOT NULL da coluna senha (se existir)
-- ALTER TABLE funcionarios ALTER COLUMN senha DROP NOT NULL;
-- 
-- -- Limpar senhas em texto plano
-- UPDATE funcionarios SET senha = NULL WHERE senha_hash LIKE 'MIGRAR_%';
-- 
-- -- Adicionar constraint para garantir que senha_hash seja obrigatória
-- ALTER TABLE funcionarios ALTER COLUMN senha_hash SET NOT NULL;
-- 
-- -- Remover coluna senha antiga (CUIDADO!)
-- -- ALTER TABLE funcionarios DROP COLUMN IF EXISTS senha;