-- Adicionar coluna data_referencia para documentos
-- Permite que o admin especifique a data/competência do documento (ex: holerite de 2024)

ALTER TABLE funcionario_documentos
  ADD COLUMN IF NOT EXISTS data_referencia DATE;

-- Comentário explicativo
COMMENT ON COLUMN funcionario_documentos.data_referencia IS 'Data de referência/competência do documento (ex: 2024-01-01 para documentos de janeiro/2024). Permite organizar documentos históricos por período.';

-- IMPORTANTE: Não atualizar automaticamente documentos existentes
-- Deixar NULL para que o frontend use criado_em como fallback na exibição
-- Apenas novos documentos terão data_referencia definida pelo usuário
