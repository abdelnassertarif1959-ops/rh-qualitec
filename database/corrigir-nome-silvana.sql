-- Corrigir nome da Silvana no banco de dados
UPDATE funcionarios
SET nome_completo = 'Silvana'
WHERE email_login = 'silvana@qualitec.ind.br'
AND nome_completo = 'MACIELCARVALHO';

-- Verificar se foi atualizado
SELECT 
  id,
  nome_completo,
  email_login,
  tipo_acesso,
  status
FROM funcionarios
WHERE email_login = 'silvana@qualitec.ind.br';
