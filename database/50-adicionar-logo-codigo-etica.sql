-- Adicionar coluna logo_base64 na tabela codigo_etica (se já existir a tabela)
ALTER TABLE codigo_etica ADD COLUMN IF NOT EXISTS logo_base64 TEXT;
COMMENT ON COLUMN codigo_etica.logo_base64 IS 'Logo da empresa em base64 para exibir no PDF do código de ética';
