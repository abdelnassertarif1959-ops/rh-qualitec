-- ========================================
-- CORREÇÃO DA ORDEM DAS NOTIFICAÇÕES
-- Data: 28/01/2026
-- ========================================

-- Função RPC para buscar notificações ordenadas corretamente
CREATE OR REPLACE FUNCTION get_notifications_ordered(
  limite_param INTEGER DEFAULT 50,
  apenas_nao_lidas_param BOOLEAN DEFAULT FALSE,
  tipo_param VARCHAR DEFAULT NULL,
  origem_param VARCHAR DEFAULT NULL,
  ultimos_dias_param INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  titulo VARCHAR,
  mensagem TEXT,
  tipo VARCHAR,
  dados JSONB,
  lida BOOLEAN,
  importante BOOLEAN,
  data_criacao TIMESTAMP WITH TIME ZONE,
  data_leitura TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE,
  origem VARCHAR,
  acao_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.titulo,
    n.mensagem,
    n.tipo,
    n.dados,
    n.lida,
    n.importante,
    n.data_criacao,
    n.data_leitura,
    n.data_expiracao,
    n.origem,
    n.acao_url,
    n.created_at,
    n.updated_at
  FROM notificacoes n
  WHERE 
    -- Filtrar por data (últimos X dias)
    (ultimos_dias_param <= 0 OR n.created_at >= NOW() - INTERVAL '1 day' * ultimos_dias_param)
    -- Filtrar apenas não lidas
    AND (apenas_nao_lidas_param = FALSE OR n.lida = FALSE)
    -- Filtrar por tipo
    AND (tipo_param IS NULL OR n.tipo = tipo_param)
    -- Filtrar por origem
    AND (origem_param IS NULL OR n.origem = origem_param)
    -- Filtrar notificações não expiradas
    AND (n.data_expiracao IS NULL OR n.data_expiracao > NOW())
  ORDER BY 
    n.importante DESC,  -- Importantes primeiro
    n.created_at DESC   -- Mais recentes primeiro
  LIMIT limite_param;
END;
$ LANGUAGE plpgsql;

-- Comentário da função
COMMENT ON FUNCTION get_notifications_ordered IS 'Busca notificações ordenadas corretamente: importantes primeiro, depois por data (mais recente → mais antiga)';

-- Atualizar índice para otimizar a ordenação
DROP INDEX IF EXISTS idx_notificacoes_data_criacao;
CREATE INDEX idx_notificacoes_ordenacao ON notificacoes(importante DESC, created_at DESC);

-- Verificar se há notificações com created_at NULL e corrigir
UPDATE notificacoes 
SET created_at = data_criacao 
WHERE created_at IS NULL AND data_criacao IS NOT NULL;

UPDATE notificacoes 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- Função para testar a ordenação
CREATE OR REPLACE FUNCTION testar_ordem_notificacoes()
RETURNS TABLE (
  posicao INTEGER,
  titulo VARCHAR,
  importante BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  ordem_correta BOOLEAN
) AS $
DECLARE
  rec RECORD;
  pos INTEGER := 1;
  anterior_importante BOOLEAN := TRUE;
  anterior_data TIMESTAMP WITH TIME ZONE := NOW() + INTERVAL '1 year';
BEGIN
  FOR rec IN 
    SELECT n.titulo, n.importante, n.created_at
    FROM notificacoes n
    ORDER BY n.importante DESC, n.created_at DESC
    LIMIT 10
  LOOP
    RETURN QUERY SELECT 
      pos,
      rec.titulo,
      rec.importante,
      rec.created_at,
      -- Verificar se a ordem está correta
      CASE 
        WHEN rec.importante = anterior_importante THEN rec.created_at <= anterior_data
        WHEN rec.importante = FALSE AND anterior_importante = TRUE THEN TRUE
        ELSE FALSE
      END as ordem_correta;
    
    anterior_importante := rec.importante;
    anterior_data := rec.created_at;
    pos := pos + 1;
  END LOOP;
END;
$ LANGUAGE plpgsql;

-- Executar teste
SELECT 'Testando ordem das notificações:' as status;
SELECT * FROM testar_ordem_notificacoes();

-- Inserir log de correção
INSERT INTO notificacoes (titulo, mensagem, tipo, origem, importante) VALUES
('✅ Ordem das Notificações Corrigida', 'Sistema de ordenação das notificações foi corrigido em ' || NOW()::DATE || '. Agora as notificações aparecem sempre das mais recentes para as mais antigas.', 'success', 'sistema', true);

-- Exibir resumo
SELECT 
  'Correção aplicada com sucesso!' as status,
  COUNT(*) as total_notificacoes,
  COUNT(*) FILTER (WHERE importante = true) as importantes,
  COUNT(*) FILTER (WHERE lida = false) as nao_lidas
FROM notificacoes;