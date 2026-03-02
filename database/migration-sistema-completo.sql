-- =====================================================
-- MIGRAÇÃO COMPLETA DO SISTEMA RH - SUPABASE
-- Inclui: Salário Quinzenal + Holerites Automáticos
-- =====================================================

-- 1. Atualizar tabela funcionarios para suportar salário quinzenal
ALTER TABLE funcionarios 
ADD COLUMN IF NOT EXISTS tipo_salario VARCHAR(20) DEFAULT 'mensal';

-- Adicionar constraint se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'funcionarios_tipo_salario_check' 
    AND table_name = 'funcionarios'
  ) THEN
    ALTER TABLE funcionarios 
    ADD CONSTRAINT funcionarios_tipo_salario_check 
    CHECK (tipo_salario IN ('mensal', 'quinzenal', 'horista'));
  END IF;
END $$;

-- 2. Criar tabela para holerites quinzenais
CREATE TABLE IF NOT EXISTS holerites (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT REFERENCES funcionarios(id) ON DELETE CASCADE,
  empresa_id BIGINT REFERENCES empresas(id),
  referencia VARCHAR(100) NOT NULL,
  competencia VARCHAR(7) NOT NULL, -- MM/YYYY
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  quinzena INTEGER, -- NULL para mensal, 1 ou 2 para quinzenal
  tipo VARCHAR(20) NOT NULL DEFAULT 'mensal',
  status VARCHAR(20) DEFAULT 'programado',
  
  -- Período de referência
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  
  -- Valores financeiros
  salario_base DECIMAL(10,2) NOT NULL DEFAULT 0,
  bonus DECIMAL(10,2) DEFAULT 0,
  total_proventos DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_descontos DECIMAL(10,2) NOT NULL DEFAULT 0,
  liquido DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Datas de controle
  data_disponibilizacao TIMESTAMPTZ,
  data_pagamento TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT holerites_tipo_check CHECK (tipo IN ('mensal', 'quinzenal')),
  CONSTRAINT holerites_status_check CHECK (status IN ('programado', 'disponivel', 'pago', 'cancelado')),
  CONSTRAINT holerites_quinzena_check CHECK (quinzena IS NULL OR quinzena IN (1, 2))
);

-- Criar índice único composto
CREATE UNIQUE INDEX IF NOT EXISTS idx_holerites_funcionario_competencia_quinzena 
ON holerites(funcionario_id, competencia, COALESCE(quinzena, 0));
);-- 4
. Criar tabela para descontos personalizados
CREATE TABLE IF NOT EXISTS funcionario_descontos (
  id SERIAL PRIMARY KEY,
  funcionario_id INTEGER REFERENCES funcionarios(id) ON DELETE CASCADE,
  descricao VARCHAR(200) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('percentual', 'valor_fixo')),
  valor DECIMAL(10,2) DEFAULT 0,
  percentual DECIMAL(5,2) DEFAULT 0,
  recorrente BOOLEAN DEFAULT TRUE,
  parcelas INTEGER DEFAULT 1,
  parcelas_pagas INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Criar tabela para configurações de holerites automáticos
CREATE TABLE IF NOT EXISTS configuracoes_holerites (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  
  -- Configurações de liberação automática
  liberar_automatico_2quinzena BOOLEAN DEFAULT TRUE,
  dias_antecedencia INTEGER DEFAULT 2,
  respeitar_feriados BOOLEAN DEFAULT TRUE,
  respeitar_fins_semana BOOLEAN DEFAULT TRUE,
  
  -- Configurações de notificação
  notificar_funcionarios BOOLEAN DEFAULT TRUE,
  notificar_rh BOOLEAN DEFAULT TRUE,
  
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(empresa_id)
);

-- 6. Criar tabela para feriados
CREATE TABLE IF NOT EXISTS feriados (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'nacional' CHECK (tipo IN ('nacional', 'estadual', 'municipal')),
  ativo BOOLEAN DEFAULT TRUE,
  
  UNIQUE(data)
);

-- 7. Inserir feriados nacionais padrão para 2026
INSERT INTO feriados (data, descricao, tipo) VALUES
('2026-01-01', 'Confraternização Universal', 'nacional'),
('2026-04-21', 'Tiradentes', 'nacional'),
('2026-05-01', 'Dia do Trabalhador', 'nacional'),
('2026-09-07', 'Independência do Brasil', 'nacional'),
('2026-10-12', 'Nossa Senhora Aparecida', 'nacional'),
('2026-11-02', 'Finados', 'nacional'),
('2026-11-15', 'Proclamação da República', 'nacional'),
('2026-12-25', 'Natal', 'nacional')
ON CONFLICT (data) DO NOTHING;

-- 8. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_holerites_funcionario_competencia ON holerites(funcionario_id, competencia);
CREATE INDEX IF NOT EXISTS idx_holerites_data_disponibilizacao ON holerites(data_disponibilizacao);
CREATE INDEX IF NOT EXISTS idx_holerites_status ON holerites(status);
CREATE INDEX IF NOT EXISTS idx_funcionario_beneficios_funcionario ON funcionario_beneficios(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_funcionario_descontos_funcionario ON funcionario_descontos(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_feriados_data ON feriados(data);

-- 9. Criar função para calcular data de disponibilização automática
CREATE OR REPLACE FUNCTION calcular_data_disponibilizacao(ano INTEGER, mes INTEGER)
RETURNS DATE AS $$
DECLARE
  dia_20 DATE;
  data_disponibilizacao DATE;
BEGIN
  -- Data do dia 20 do mês
  dia_20 := make_date(ano, mes, 20);
  
  -- Calcular 2 dias antes
  data_disponibilizacao := dia_20 - INTERVAL '2 days';
  
  -- Verificar se é fim de semana ou feriado e ajustar
  WHILE EXTRACT(DOW FROM data_disponibilizacao) IN (0, 6) -- Domingo ou Sábado
        OR EXISTS (SELECT 1 FROM feriados WHERE data = data_disponibilizacao AND ativo = TRUE) LOOP
    data_disponibilizacao := data_disponibilizacao - INTERVAL '1 day';
  END LOOP;
  
  RETURN data_disponibilizacao;
END;
$$ LANGUAGE plpgsql;-- 1
0. Criar função para gerar holerites quinzenais automaticamente
CREATE OR REPLACE FUNCTION gerar_holerites_quinzenais(p_funcionario_id INTEGER, p_ano INTEGER, p_mes INTEGER)
RETURNS VOID AS $$
DECLARE
  funcionario_rec RECORD;
  valor_quinzenal DECIMAL(10,2);
  periodo_1_inicio DATE;
  periodo_1_fim DATE;
  periodo_2_inicio DATE;
  periodo_2_fim DATE;
  data_disponibilizacao_2q DATE;
BEGIN
  -- Buscar dados do funcionário
  SELECT * INTO funcionario_rec FROM funcionarios WHERE id = p_funcionario_id AND tipo_salario = 'quinzenal';
  
  IF NOT FOUND THEN
    RETURN; -- Funcionário não encontrado ou não é quinzenal
  END IF;
  
  -- Calcular valor quinzenal
  valor_quinzenal := funcionario_rec.salario_base / 2;
  
  -- Definir períodos
  periodo_1_inicio := make_date(p_ano, p_mes, 1);
  periodo_1_fim := make_date(p_ano, p_mes, 15);
  periodo_2_inicio := make_date(p_ano, p_mes, 16);
  periodo_2_fim := (make_date(p_ano, p_mes, 1) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- Calcular data de disponibilização da 2ª quinzena
  data_disponibilizacao_2q := calcular_data_disponibilizacao(p_ano, p_mes);
  
  -- Inserir holerite da 1ª quinzena (manual)
  INSERT INTO holerites (
    funcionario_id, empresa_id, referencia, competencia, mes, ano, quinzena, tipo, status,
    periodo_inicio, periodo_fim, salario_base, total_proventos, total_descontos, liquido
  ) VALUES (
    p_funcionario_id, funcionario_rec.empresa_id,
    'Holerite ' || LPAD(p_mes::TEXT, 2, '0') || '/' || p_ano || ' - 1ª Quinzena',
    LPAD(p_mes::TEXT, 2, '0') || '/' || p_ano,
    p_mes, p_ano, 1, 'quinzenal', 'programado',
    periodo_1_inicio, periodo_1_fim, valor_quinzenal, valor_quinzenal, 0, valor_quinzenal
  ) ON CONFLICT (funcionario_id, competencia, quinzena) DO NOTHING;
  
  -- Inserir holerite da 2ª quinzena (automático)
  INSERT INTO holerites (
    funcionario_id, empresa_id, referencia, competencia, mes, ano, quinzena, tipo, status,
    periodo_inicio, periodo_fim, salario_base, total_proventos, total_descontos, liquido,
    data_disponibilizacao
  ) VALUES (
    p_funcionario_id, funcionario_rec.empresa_id,
    'Holerite ' || LPAD(p_mes::TEXT, 2, '0') || '/' || p_ano || ' - 2ª Quinzena',
    LPAD(p_mes::TEXT, 2, '0') || '/' || p_ano,
    p_mes, p_ano, 2, 'quinzenal', 'programado',
    periodo_2_inicio, periodo_2_fim, valor_quinzenal, valor_quinzenal, 0, valor_quinzenal,
    data_disponibilizacao_2q
  ) ON CONFLICT (funcionario_id, competencia, quinzena) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 11. Criar trigger para atualizar status dos holerites automaticamente
CREATE OR REPLACE FUNCTION atualizar_status_holerites()
RETURNS VOID AS $$
BEGIN
  -- Atualizar status para 'disponivel' quando a data de disponibilização chegar
  UPDATE holerites 
  SET status = 'disponivel'
  WHERE status = 'programado' 
    AND data_disponibilizacao IS NOT NULL 
    AND data_disponibilizacao <= CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- 12. Criar dados de exemplo (REMOVIDO - sem dados de teste)
-- Os dados devem ser inseridos manualmente pelo administrador do sistema

-- 13. Inserir configurações padrão para holerites automáticos
INSERT INTO configuracoes_holerites (empresa_id) 
SELECT id FROM empresas 
ON CONFLICT (empresa_id) DO NOTHING;

-- 14. Comentários e documentação
COMMENT ON TABLE holerites IS 'Tabela para armazenar holerites mensais e quinzenais';
COMMENT ON TABLE funcionario_beneficios IS 'Benefícios configurados por funcionário';
COMMENT ON TABLE funcionario_descontos IS 'Descontos personalizados por funcionário';
COMMENT ON TABLE configuracoes_holerites IS 'Configurações de automação de holerites por empresa';
COMMENT ON TABLE feriados IS 'Calendário de feriados para cálculo de datas úteis';

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================