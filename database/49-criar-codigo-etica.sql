-- Sistema de Código de Ética
-- Tabela principal do código (editável pelo admin, por empresa)
CREATE TABLE IF NOT EXISTS codigo_etica (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL DEFAULT 'Código de Ética e Conduta',
  conteudo TEXT NOT NULL,
  versao INTEGER NOT NULL DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  logo_base64 TEXT, -- Logo da empresa em base64 para o PDF
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de confirmações de leitura
CREATE TABLE IF NOT EXISTS codigo_etica_confirmacoes (
  id SERIAL PRIMARY KEY,
  codigo_etica_id INTEGER NOT NULL REFERENCES codigo_etica(id) ON DELETE CASCADE,
  funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  confirmado_em TIMESTAMP DEFAULT NOW(),
  versao_confirmada INTEGER NOT NULL DEFAULT 1,
  UNIQUE(codigo_etica_id, funcionario_id)
);

CREATE INDEX IF NOT EXISTS idx_codigo_etica_empresa ON codigo_etica(empresa_id);
CREATE INDEX IF NOT EXISTS idx_codigo_etica_confirmacoes_func ON codigo_etica_confirmacoes(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_codigo_etica_confirmacoes_codigo ON codigo_etica_confirmacoes(codigo_etica_id);

-- RLS
ALTER TABLE codigo_etica ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigo_etica_confirmacoes ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (controle feito via JWT no servidor)
CREATE POLICY "allow_all_codigo_etica" ON codigo_etica FOR ALL USING (true);
CREATE POLICY "allow_all_confirmacoes" ON codigo_etica_confirmacoes FOR ALL USING (true);
