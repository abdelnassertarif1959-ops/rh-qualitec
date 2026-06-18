-- =====================================================
-- SISTEMA DE NOTIFICAÇÕES GLOBAIS PARA COMENTÁRIOS EM AVISOS
-- Criado em: 12/02/2026
-- Atualizado em: 12/02/2026 - Notificações globais para admins
-- =====================================================

-- NOTA: A tabela 'notificacoes' é GLOBAL para admins, não tem funcionario_id
-- Por isso, criamos notificações globais que aparecem no painel admin

-- Função para criar notificação GLOBAL quando houver novo comentário
CREATE OR REPLACE FUNCTION notificar_novo_comentario_aviso_global()
RETURNS TRIGGER AS $$
DECLARE
  v_aviso_titulo TEXT;
  v_comentarista_nome TEXT;
BEGIN
  -- Buscar informações do aviso e do comentarista
  SELECT 
    a.titulo,
    f.nome_completo
  INTO 
    v_aviso_titulo,
    v_comentarista_nome
  FROM avisos a
  JOIN funcionarios f ON f.id = NEW.funcionario_id
  WHERE a.id = NEW.aviso_id;

  -- Criar notificação GLOBAL para admins
  INSERT INTO notificacoes (
    tipo,
    titulo,
    mensagem,
    lida,
    importante,
    origem,
    dados,
    created_at
  ) VALUES (
    'comentario_aviso',
    '💬 Novo comentário em aviso',
    v_comentarista_nome || ' comentou no aviso "' || v_aviso_titulo || '"',
    false,
    false,
    'avisos',
    jsonb_build_object(
      'aviso_id', NEW.aviso_id,
      'comentario_id', NEW.id,
      'funcionario_id', NEW.funcionario_id,
      'funcionario_nome', v_comentarista_nome
    ),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para notificações de comentários
DROP TRIGGER IF EXISTS trigger_notificar_comentario_aviso_global ON avisos_comentarios;

CREATE TRIGGER trigger_notificar_comentario_aviso_global
  AFTER INSERT ON avisos_comentarios
  FOR EACH ROW
  EXECUTE FUNCTION notificar_novo_comentario_aviso_global();

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON FUNCTION notificar_novo_comentario_aviso_global() IS 
  'Cria notificações GLOBAIS para admins quando alguém comenta em um aviso';

COMMENT ON TRIGGER trigger_notificar_comentario_aviso_global ON avisos_comentarios IS 
  'Trigger que dispara notificações globais quando há novo comentário em aviso';

-- =====================================================
-- MIGRAR COMENTÁRIOS EXISTENTES
-- =====================================================

-- Criar notificações para comentários que já existem
INSERT INTO notificacoes (
  tipo,
  titulo,
  mensagem,
  lida,
  importante,
  origem,
  dados,
  created_at
)
SELECT 
  'comentario_aviso',
  '💬 Novo comentário em aviso',
  f.nome_completo || ' comentou no aviso "' || a.titulo || '"',
  false,
  false,
  'avisos',
  jsonb_build_object(
    'aviso_id', ac.aviso_id,
    'comentario_id', ac.id,
    'funcionario_id', ac.funcionario_id,
    'funcionario_nome', f.nome_completo
  ),
  ac.criado_em
FROM avisos_comentarios ac
JOIN avisos a ON a.id = ac.aviso_id
JOIN funcionarios f ON f.id = ac.funcionario_id
WHERE NOT EXISTS (
  SELECT 1 FROM notificacoes n
  WHERE n.tipo = 'comentario_aviso'
  AND n.dados->>'comentario_id' = ac.id::text
)
ORDER BY ac.criado_em DESC;

-- =====================================================
-- TESTE
-- =====================================================

-- Para testar, insira um comentário e verifique se as notificações foram criadas:
-- SELECT * FROM notificacoes WHERE tipo = 'comentario_aviso' ORDER BY created_at DESC LIMIT 10;

-- Verificar total de notificações de comentários:
-- SELECT COUNT(*) FROM notificacoes WHERE tipo = 'comentario_aviso';
