-- Ativar todas as empresas cadastradas
-- Execute este SQL no Supabase SQL Editor

-- Ativar todas as empresas
UPDATE empresas 
SET ativo = true
WHERE ativo = false;

-- Verificar resultado
SELECT 
  id,
  nome,
  cnpj,
  ativo,
  funcionarios_count
FROM empresas
ORDER BY nome;
