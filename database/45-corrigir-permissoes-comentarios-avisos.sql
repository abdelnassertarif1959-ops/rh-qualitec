-- =====================================================
-- CORREÇÃO DE PERMISSÕES - SISTEMA DE AVISOS
-- Criado em: 12/02/2026
-- =====================================================

-- Remover política antiga de INSERT que pode estar muito restritiva
DROP POLICY IF EXISTS "Usuários podem criar comentários" ON avisos_comentarios;

-- Criar nova política mais permissiva para INSERT
-- Qualquer funcionário autenticado pode comentar em avisos ativos
CREATE POLICY "Funcionários podem criar comentários em avisos ativos"
  ON avisos_comentarios FOR INSERT
  WITH CHECK (
    -- Verifica se o aviso existe e está ativo
    EXISTS (
      SELECT 1 FROM avisos
      WHERE id = aviso_id
      AND ativo = true
    )
    AND
    -- Verifica se o funcionário existe
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = funcionario_id
    )
  );

-- Garantir que a política de SELECT está correta
DROP POLICY IF EXISTS "Todos podem visualizar comentários" ON avisos_comentarios;

CREATE POLICY "Todos podem visualizar comentários de avisos ativos"
  ON avisos_comentarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM avisos
      WHERE id = aviso_id
      AND ativo = true
    )
  );

-- Corrigir política de UPDATE
DROP POLICY IF EXISTS "Usuários podem atualizar seus comentários" ON avisos_comentarios;

CREATE POLICY "Funcionários podem atualizar seus próprios comentários"
  ON avisos_comentarios FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = funcionario_id
    )
  );

-- Corrigir política de DELETE
DROP POLICY IF EXISTS "Admin ou autor podem deletar comentários" ON avisos_comentarios;

CREATE POLICY "Admin pode deletar qualquer comentário, funcionários seus próprios"
  ON avisos_comentarios FOR DELETE
  USING (
    -- Admin pode deletar qualquer comentário
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = funcionario_id
      AND tipo_acesso = 'admin'
    )
    OR
    -- Funcionário pode deletar seu próprio comentário
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = funcionario_id
    )
  );

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Listar todas as políticas das tabelas de avisos
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename IN ('avisos', 'avisos_comentarios')
ORDER BY tablename, policyname;

