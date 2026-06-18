-- =====================================================
-- MIGRAÇÃO: SISTEMA DE JORNADAS DE TRABALHO
-- =====================================================

-- 1. Criar tabela de jornadas de trabalho
CREATE TABLE IF NOT EXISTS jornadas_trabalho (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  horas_semanais DECIMAL(5,2) NOT NULL DEFAULT 0,
  horas_mensais DECIMAL(6,2) NOT NULL DEFAULT 0,
  ativa BOOLEAN DEFAULT TRUE,
  padrao BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de horários por dia da semana
CREATE TABLE IF NOT EXISTS jornada_horarios (
  id BIGSERIAL PRIMARY KEY,
  jornada_id BIGINT REFERENCES jornadas_trabalho(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL, -- 1=Segunda, 2=Terça, ..., 7=Domingo
  entrada TIME NOT NULL,
  saida TIME NOT NULL,
  intervalo_inicio TIME,
  intervalo_fim TIME,
  horas_brutas DECIMAL(5,2) NOT NULL DEFAULT 0,
  horas_intervalo DECIMAL(5,2) NOT NULL DEFAULT 0,
  horas_liquidas DECIMAL(5,2) NOT NULL DEFAULT 0,
  trabalha BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT jornada_horarios_dia_semana_check CHECK (dia_semana BETWEEN 1 AND 7),
  CONSTRAINT jornada_horarios_unique_dia UNIQUE (jornada_id, dia_semana)
);

-- 3. Adicionar coluna jornada_id na tabela funcionarios (se não existir)
ALTER TABLE funcionarios 
ADD COLUMN IF NOT EXISTS jornada_id BIGINT REFERENCES jornadas_trabalho(id);

-- 4. Criar índices
CREATE INDEX IF NOT EXISTS idx_jornadas_trabalho_ativa ON jornadas_trabalho(ativa);
CREATE INDEX IF NOT EXISTS idx_jornadas_trabalho_padrao ON jornadas_trabalho(padrao);
CREATE INDEX IF NOT EXISTS idx_jornada_horarios_jornada_id ON jornada_horarios(jornada_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_jornada_id ON funcionarios(jornada_id);

-- 5. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_jornadas_trabalho_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_jornadas_trabalho_updated_at ON jornadas_trabalho;
CREATE TRIGGER trigger_update_jornadas_trabalho_updated_at
  BEFORE UPDATE ON jornadas_trabalho
  FOR EACH ROW
  EXECUTE FUNCTION update_jornadas_trabalho_updated_at();

-- 7. Inserir jornada padrão (44 horas semanais)
INSERT INTO jornadas_trabalho (nome, descricao, horas_semanais, horas_mensais, ativa, padrao)
VALUES (
  'Jornada Padrão 44h',
  'Jornada de trabalho padrão: Segunda a sexta 8h48min',
  44.00,
  190.52,
  TRUE,
  TRUE
)
ON CONFLICT DO NOTHING;

-- 8. Inserir horários da jornada padrão
DO $$
DECLARE
  jornada_padrao_id BIGINT;
BEGIN
  -- Buscar ID da jornada padrão
  SELECT id INTO jornada_padrao_id 
  FROM jornadas_trabalho 
  WHERE padrao = TRUE 
  LIMIT 1;

  -- Se encontrou, inserir horários
  IF jornada_padrao_id IS NOT NULL THEN
    -- Segunda a Sexta: 08:00 às 17:48 com 1h de intervalo (8h48min líquidas)
    INSERT INTO jornada_horarios (jornada_id, dia_semana, entrada, saida, intervalo_inicio, intervalo_fim, horas_brutas, horas_intervalo, horas_liquidas, trabalha)
    VALUES
      (jornada_padrao_id, 1, '08:00:00', '17:48:00', '12:00:00', '13:00:00', 9.80, 1.00, 8.80, TRUE),
      (jornada_padrao_id, 2, '08:00:00', '17:48:00', '12:00:00', '13:00:00', 9.80, 1.00, 8.80, TRUE),
      (jornada_padrao_id, 3, '08:00:00', '17:48:00', '12:00:00', '13:00:00', 9.80, 1.00, 8.80, TRUE),
      (jornada_padrao_id, 4, '08:00:00', '17:48:00', '12:00:00', '13:00:00', 9.80, 1.00, 8.80, TRUE),
      (jornada_padrao_id, 5, '08:00:00', '17:48:00', '12:00:00', '13:00:00', 9.80, 1.00, 8.80, TRUE),
      (jornada_padrao_id, 6, '08:00:00', '08:00:00', NULL, NULL, 0.00, 0.00, 0.00, FALSE),
      (jornada_padrao_id, 7, '08:00:00', '08:00:00', NULL, NULL, 0.00, 0.00, 0.00, FALSE)
    ON CONFLICT (jornada_id, dia_semana) DO NOTHING;
  END IF;
END $$;

-- 9. Habilitar RLS (Row Level Security)
ALTER TABLE jornadas_trabalho ENABLE ROW LEVEL SECURITY;
ALTER TABLE jornada_horarios ENABLE ROW LEVEL SECURITY;

-- 10. Criar políticas de segurança
-- Permitir leitura para usuários autenticados
CREATE POLICY "Permitir leitura de jornadas para usuários autenticados"
  ON jornadas_trabalho FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir leitura de horários para usuários autenticados"
  ON jornada_horarios FOR SELECT
  TO authenticated
  USING (true);

-- Permitir todas as operações para service_role (backend)
CREATE POLICY "Permitir todas operações em jornadas para service_role"
  ON jornadas_trabalho FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir todas operações em horários para service_role"
  ON jornada_horarios FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================
