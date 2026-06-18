-- =====================================================
-- SISTEMA DE AVISOS E COMENTÁRIOS
-- Criado em: 12/02/2026
-- =====================================================

-- Tabela de avisos (apenas admin pode criar)
CREATE TABLE IF NOT EXISTS avisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  criado_por INTEGER NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ativo BOOLEAN DEFAULT true
);

-- Tabela de comentários nos avisos (funcionários podem comentar)
CREATE TABLE IF NOT EXISTS avisos_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aviso_id UUID NOT NULL REFERENCES avisos(id) ON DELETE CASCADE,
  funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  comentario TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avisos_ativo ON avisos(ativo);
CREATE INDEX IF NOT EXISTS idx_avisos_criado_em ON avisos(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_avisos_comentarios_aviso_id ON avisos_comentarios(aviso_id);
CREATE INDEX IF NOT EXISTS idx_avisos_comentarios_criado_em ON avisos_comentarios(criado_em DESC);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos_comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas para AVISOS
-- Todos podem visualizar avisos ativos
CREATE POLICY "Todos podem visualizar avisos ativos"
  ON avisos FOR SELECT
  USING (ativo = true);

-- Apenas admin pode criar avisos
CREATE POLICY "Apenas admin pode criar avisos"
  ON avisos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = criado_por
      AND tipo_acesso = 'admin'
    )
  );

-- Apenas admin pode atualizar avisos
CREATE POLICY "Apenas admin pode atualizar avisos"
  ON avisos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = criado_por
      AND tipo_acesso = 'admin'
    )
  );

-- Apenas admin pode deletar avisos
CREATE POLICY "Apenas admin pode deletar avisos"
  ON avisos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM funcionarios f
      JOIN avisos a ON a.criado_por = f.id
      WHERE f.tipo_acesso = 'admin'
    )
  );

-- Políticas para COMENTÁRIOS
-- Todos podem visualizar comentários de avisos ativos
CREATE POLICY "Todos podem visualizar comentários"
  ON avisos_comentarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM avisos
      WHERE id = aviso_id
      AND ativo = true
    )
  );

-- Usuários autenticados podem criar comentários
CREATE POLICY "Usuários podem criar comentários"
  ON avisos_comentarios FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM avisos
      WHERE id = aviso_id
      AND ativo = true
    )
  );

-- Usuários podem atualizar seus próprios comentários
CREATE POLICY "Usuários podem atualizar seus comentários"
  ON avisos_comentarios FOR UPDATE
  USING (true);

-- Admin pode deletar qualquer comentário, usuários podem deletar os próprios
CREATE POLICY "Admin ou autor podem deletar comentários"
  ON avisos_comentarios FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = funcionario_id
      AND tipo_acesso = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = funcionario_id
    )
  );

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE avisos IS 'Avisos/recados criados pelo administrador';
COMMENT ON TABLE avisos_comentarios IS 'Comentários dos funcionários nos avisos';

COMMENT ON COLUMN avisos.titulo IS 'Título do aviso (máx 200 caracteres)';
COMMENT ON COLUMN avisos.descricao IS 'Descrição completa do aviso (suporta emojis)';
COMMENT ON COLUMN avisos.criado_por IS 'ID do admin que criou o aviso';
COMMENT ON COLUMN avisos.ativo IS 'Se false, o aviso foi deletado (soft delete)';

COMMENT ON COLUMN avisos_comentarios.aviso_id IS 'ID do aviso comentado';
COMMENT ON COLUMN avisos_comentarios.funcionario_id IS 'ID do funcionário que comentou';
COMMENT ON COLUMN avisos_comentarios.comentario IS 'Texto do comentário (suporta emojis)';
