-- =====================================================
-- SCRIPT PARA TROCAR ADMIN DE TESTE POR ADMIN REAL
-- Deleta admin teste e cria Silvana como admin
-- =====================================================

-- =====================================================
-- PARTE 1: DELETAR ADMIN DE TESTE
-- =====================================================

-- Deletar usuário admin de teste (admin@teste.com ou similar)
DELETE FROM funcionarios 
WHERE email_login IN ('admin@teste.com', 'admin@example.com', 'teste@admin.com')
  AND tipo_acesso = 'admin';

-- Verificar se ainda existe algum admin de teste
SELECT 
  id, 
  nome_completo, 
  email_login, 
  tipo_acesso 
FROM funcionarios 
WHERE tipo_acesso = 'admin';

-- =====================================================
-- PARTE 2: CRIAR ADMIN REAL - SILVANA
-- =====================================================

-- Inserir Silvana como administradora
INSERT INTO funcionarios (
  nome_completo,
  cpf,
  email_login,
  senha,
  tipo_acesso,
  status,
  tipo_salario,
  salario_base,
  data_admissao,
  matricula,
  empresa_id
) VALUES (
  'Silvana',
  '000.000.000-00', -- Substitua pelo CPF real se necessário
  'silvana@qualitec.ind.br',
  'Qualitec2025Silvana', -- Senha em texto claro (será criptografada pelo sistema)
  'admin',
  'ativo',
  'mensal',
  0.00, -- Salário pode ser ajustado depois
  CURRENT_DATE,
  'ADM001',
  (SELECT id FROM empresas LIMIT 1) -- Vincula à primeira empresa cadastrada
)
ON CONFLICT (email_login) DO UPDATE SET
  nome_completo = EXCLUDED.nome_completo,
  senha = EXCLUDED.senha,
  tipo_acesso = 'admin',
  status = 'ativo';

-- =====================================================
-- PARTE 3: VERIFICAR CRIAÇÃO
-- =====================================================

-- Verificar se Silvana foi criada corretamente
SELECT 
  id,
  nome_completo,
  email_login,
  tipo_acesso,Qualitec2025Silvana
  status,
  empresa_id,
  created_at
FROM funcionarios 
WHERE email_login = 'silvana@qualitec.ind.br';

-- =====================================================
-- PARTE 4: CRIAR BENEFÍCIOS PADRÃO PARA SILVANA
-- =====================================================

-- Garantir que Silvana tem registro de benefícios
INSERT INTO funcionario_beneficios (funcionario_id)
SELECT id FROM funcionarios 
WHERE email_login = 'silvana@qualitec.ind.br'
ON CONFLICT (funcionario_id) DO NOTHING;

-- =====================================================
-- PARTE 5: RESUMO FINAL
-- =====================================================

-- Listar todos os administradores ativos
SELECT 
  '✅ ADMINISTRADORES ATIVOS' as status,
  id,
  nome_completo,
  email_login,
  tipo_acesso,
  status,
  created_at
FROM funcionarios 
WHERE tipo_acesso = 'admin' 
  AND status = 'ativo'
ORDER BY created_at DESC;

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================

/*
╔════════════════════════════════════════════════════════════════╗
║              COMO USAR ESTE SCRIPT                             ║
╚════════════════════════════════════════════════════════════════╝

1. Copie TODO este script
2. Cole no SQL Editor do Supabase
3. Clique em "Run" para executar
4. Verifique os resultados das queries SELECT

✅ CREDENCIAIS DA SILVANA:
   Email: silvana@qualitec.ind.br
   Senha: Qualitec2025Silvana
   Tipo: admin

⚠️ IMPORTANTE:
   - A senha está em texto claro no banco
   - Recomendo implementar hash de senha (bcrypt) no futuro
   - Por enquanto, o sistema compara senha em texto claro

🔐 PRÓXIMOS PASSOS:
   1. Execute este script no Supabase
   2. Faça login com as credenciais da Silvana
   3. Teste o acesso admin
   4. Delete outros admins de teste se necessário

╚════════════════════════════════════════════════════════════════╝
*/
