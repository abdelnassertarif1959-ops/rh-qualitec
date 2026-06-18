-- Tabela de tipos/títulos pré-configurados de documentos
CREATE TABLE IF NOT EXISTS documento_tipos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao_padrao TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tipos padrão iniciais
INSERT INTO documento_tipos (nome, descricao_padrao) VALUES
  ('Atestado Médico', 'Atestado médico para justificativa de ausência'),
  ('Contrato de Trabalho', 'Contrato de trabalho assinado'),
  ('Declaração de Residência', 'Comprovante ou declaração de endereço'),
  ('RG / CNH', 'Documento de identidade'),
  ('CPF', 'Cadastro de Pessoa Física'),
  ('Comprovante de Escolaridade', 'Diploma, certificado ou histórico escolar'),
  ('Exame Admissional', 'Resultado de exame médico admissional'),
  ('Exame Demissional', 'Resultado de exame médico demissional'),
  ('Termo de Responsabilidade', 'Termo assinado pelo funcionário'),
  ('Outros', NULL)
ON CONFLICT DO NOTHING;

-- Adicionar colunas titulo e descricao na tabela de documentos
ALTER TABLE funcionario_documentos
  ADD COLUMN IF NOT EXISTS titulo VARCHAR(100),
  ADD COLUMN IF NOT EXISTS descricao TEXT,
  ADD COLUMN IF NOT EXISTS tipo_id INTEGER REFERENCES documento_tipos(id);

-- RLS para documento_tipos (leitura para todos autenticados, escrita apenas service role)
ALTER TABLE documento_tipos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'documento_tipos' AND policyname = 'Leitura publica documento_tipos'
  ) THEN
    CREATE POLICY "Leitura publica documento_tipos"
      ON documento_tipos FOR SELECT
      USING (true);
  END IF;
END $$;
