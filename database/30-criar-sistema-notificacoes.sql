-- ========================================
-- SISTEMA DE NOTIFICAÇÕES PARA ADMIN
-- ========================================

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informações básicas
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error', 'aniversario'
  
  -- Dados específicos (JSON flexível para diferentes tipos)
  dados JSONB DEFAULT '{}',
  
  -- Status e controle
  lida BOOLEAN DEFAULT FALSE,
  importante BOOLEAN DEFAULT FALSE,
  
  -- Datas
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_leitura TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE, -- Para notificações temporárias
  
  -- Metadados
  origem VARCHAR(100), -- 'sistema', 'aniversarios', 'holerites', etc.
  acao_url VARCHAR(500), -- URL para ação relacionada (opcional)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON notificacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_notificacoes_data_criacao ON notificacoes(data_criacao DESC);
CREATE INDEX IF NOT EXISTS idx_notificacoes_origem ON notificacoes(origem);
CREATE INDEX IF NOT EXISTS idx_notificacoes_importante ON notificacoes(importante);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_notificacoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notificacoes_updated_at
  BEFORE UPDATE ON notificacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_notificacoes_updated_at();

-- RLS (Row Level Security) - Apenas admins podem ver notificações
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Política: Apenas usuários admin podem acessar notificações
CREATE POLICY "Apenas admins podem acessar notificações" ON notificacoes
  FOR ALL USING (is_admin());

-- Inserir algumas notificações de exemplo
INSERT INTO notificacoes (titulo, mensagem, tipo, origem, importante) VALUES
('🎉 Sistema de Notificações Ativo', 'O sistema de notificações foi configurado com sucesso! Você receberá alertas sobre aniversariantes, holerites e outras informações importantes.', 'success', 'sistema', true),
('📋 Bem-vindo ao Painel Admin', 'Use este painel para acompanhar informações importantes do sistema RH. As notificações aparecerão automaticamente conforme necessário.', 'info', 'sistema', false);

-- Comentários para documentação
COMMENT ON TABLE notificacoes IS 'Sistema de notificações para administradores do sistema RH';
COMMENT ON COLUMN notificacoes.tipo IS 'Tipo da notificação: info, success, warning, error, aniversario';
COMMENT ON COLUMN notificacoes.dados IS 'Dados específicos em JSON para diferentes tipos de notificação';
COMMENT ON COLUMN notificacoes.origem IS 'Origem da notificação: sistema, aniversarios, holerites, etc.';
COMMENT ON COLUMN notificacoes.acao_url IS 'URL opcional para ação relacionada à notificação';

-- Função para limpar notificações antigas (executar mensalmente)
CREATE OR REPLACE FUNCTION limpar_notificacoes_antigas()
RETURNS INTEGER AS $$
DECLARE
  registros_removidos INTEGER;
BEGIN
  -- Remove notificações lidas com mais de 30 dias
  DELETE FROM notificacoes 
  WHERE lida = true 
    AND data_leitura < NOW() - INTERVAL '30 days'
    AND importante = false;
  
  GET DIAGNOSTICS registros_removidos = ROW_COUNT;
  
  -- Remove notificações expiradas
  DELETE FROM notificacoes 
  WHERE data_expiracao IS NOT NULL 
    AND data_expiracao < NOW();
  
  RETURN registros_removidos;
END;
$$ LANGUAGE plpgsql;

-- Função para criar notificação de aniversariante
CREATE OR REPLACE FUNCTION criar_notificacao_aniversario(
  funcionario_nome VARCHAR,
  funcionario_id BIGINT,
  data_aniversario DATE
)
RETURNS UUID AS $$
DECLARE
  notificacao_id UUID;
  idade INTEGER;
BEGIN
  -- Calcular idade
  idade := EXTRACT(YEAR FROM AGE(data_aniversario));
  
  -- Inserir notificação
  INSERT INTO notificacoes (
    titulo,
    mensagem,
    tipo,
    origem,
    dados,
    importante,
    data_expiracao
  ) VALUES (
    '🎂 Aniversariante do Mês',
    funcionario_nome || ' faz aniversário hoje (' || data_aniversario || ')! ' || 
    CASE 
      WHEN idade > 0 THEN 'Completando ' || idade || ' anos.'
      ELSE 'Deseje parabéns!'
    END,
    'aniversario',
    'aniversarios',
    jsonb_build_object(
      'funcionario_id', funcionario_id,
      'funcionario_nome', funcionario_nome,
      'data_aniversario', data_aniversario,
      'idade', idade
    ),
    true,
    NOW() + INTERVAL '7 days' -- Expira em 7 dias
  ) RETURNING id INTO notificacao_id;
  
  RETURN notificacao_id;
END;
$$ LANGUAGE plpgsql;

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION marcar_notificacao_lida(notificacao_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notificacoes 
  SET lida = true, data_leitura = NOW()
  WHERE id = notificacao_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função para contar notificações não lidas
CREATE OR REPLACE FUNCTION contar_notificacoes_nao_lidas()
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*) INTO total
  FROM notificacoes 
  WHERE lida = false 
    AND (data_expiracao IS NULL OR data_expiracao > NOW());
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Inserir log de criação
INSERT INTO notificacoes (titulo, mensagem, tipo, origem) VALUES
('✅ Tabela de Notificações Criada', 'Sistema de notificações configurado com sucesso em ' || NOW()::DATE, 'success', 'sistema');

-- Exibir resumo
SELECT 
  'Tabela notificacoes criada com sucesso!' as status,
  COUNT(*) as notificacoes_exemplo
FROM notificacoes;