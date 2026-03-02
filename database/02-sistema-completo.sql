-- =====================================================
-- MIGRAÇÃO COMPLETA PARA SUPABASE - SISTEMA RH
-- Salário Quinzenal + Holerites Automáticos + Benefícios
-- =====================================================

-- 1. Atualizar tabela funcionarios para suportar salário quinzenal
ALTER TABLE funcionarios 
ADD COLUMN IF NOT EXISTS tipo_salario VARCHAR(20) DEFAULT 'mensal';

-- Adicionar constraint para tipo_salario
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

-- 2. Criar tabela para holerites (mensal e quinzenal)
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

-- Índice único para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_holerites_funcionario_competencia_quinzena 
ON holerites(funcionario_id, competencia, COALESCE(quinzena, 0));

-- 3. Criar tabela para benefícios dos funcionários
CREATE TABLE IF NOT EXISTS funcionario_beneficios (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT REFERENCES funcionarios(id) ON DELETE CASCADE,
  
  -- Vale Transporte
  vt_ativo BOOLEAN DEFAULT FALSE,
  vt_valor_diario DECIMAL(8,2) DEFAULT 0,
  vt_tipo_desconto VARCHAR(20) DEFAULT 'percentual',
  vt_percentual_desconto DECIMAL(5,2) DEFAULT 0.00,
  vt_valor_desconto DECIMAL(8,2) DEFAULT 0,
  
  -- Vale Refeição  
  vr_ativo BOOLEAN DEFAULT FALSE,
  vr_valor_diario DECIMAL(8,2) DEFAULT 0,
  vr_tipo_desconto VARCHAR(20) DEFAULT 'percentual',
  vr_percentual_desconto DECIMAL(5,2) DEFAULT 0.00,
  vr_valor_desconto DECIMAL(8,2) DEFAULT 0,
  
  -- Plano de Saúde
  ps_ativo BOOLEAN DEFAULT FALSE,
  ps_plano VARCHAR(50) DEFAULT 'individual',
  ps_valor_empresa DECIMAL(8,2) DEFAULT 0,
  ps_valor_funcionario DECIMAL(8,2) DEFAULT 0,
  ps_dependentes INTEGER DEFAULT 0,
  
  -- Plano Odontológico
  po_ativo BOOLEAN DEFAULT FALSE,
  po_valor_funcionario DECIMAL(8,2) DEFAULT 0,
  po_dependentes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT funcionario_beneficios_vt_tipo_check CHECK (vt_tipo_desconto IN ('sem_desconto', 'percentual', 'valor_fixo')),
  CONSTRAINT funcionario_beneficios_vr_tipo_check CHECK (vr_tipo_desconto IN ('sem_desconto', 'percentual', 'valor_fixo')),
  CONSTRAINT funcionario_beneficios_ps_plano_check CHECK (ps_plano IN ('individual', 'familiar', 'coparticipacao')),
  
  UNIQUE(funcionario_id)
);

-- 4. Criar tabela para descontos personalizados
CREATE TABLE IF NOT EXISTS funcionario_descontos (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT REFERENCES funcionarios(id) ON DELETE CASCADE,
  descricao VARCHAR(200) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  valor DECIMAL(10,2) DEFAULT 0,
  percentual DECIMAL(5,2) DEFAULT 0,
  recorrente BOOLEAN DEFAULT TRUE,
  parcelas INTEGER DEFAULT 1,
  parcelas_pagas INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT funcionario_descontos_tipo_check CHECK (tipo IN ('percentual', 'valor_fixo'))
);

-- 5. Criar tabela para configurações de holerites automáticos
CREATE TABLE IF NOT EXISTS configuracoes_holerites (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT REFERENCES empresas(id),
  
  -- Configurações de liberação automática
  liberar_automatico_2quinzena BOOLEAN DEFAULT TRUE,
  dias_antecedencia INTEGER DEFAULT 2,
  respeitar_feriados BOOLEAN DEFAULT TRUE,
  respeitar_fins_semana BOOLEAN DEFAULT TRUE,
  
  -- Configurações de notificação
  notificar_funcionarios BOOLEAN DEFAULT TRUE,
  notificar_rh BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(empresa_id)
);

-- 6. Criar tabela para feriados
CREATE TABLE IF NOT EXISTS feriados (
  id BIGSERIAL PRIMARY KEY,
  data DATE NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'nacional',
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT feriados_tipo_check CHECK (tipo IN ('nacional', 'estadual', 'municipal')),
  UNIQUE(data)
);

-- 7. Inserir feriados nacionais para 2026
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
CREATE INDEX IF NOT EXISTS idx_funcionario_descontos_ativo ON funcionario_descontos(funcionario_id, ativo);
CREATE INDEX IF NOT EXISTS idx_feriados_data ON feriados(data);
CREATE INDEX IF NOT EXISTS idx_feriados_ativo ON feriados(ativo);

-- 9. Criar função para verificar se é dia útil
CREATE OR REPLACE FUNCTION is_dia_util(data_verificar DATE)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se é fim de semana (0 = domingo, 6 = sábado)
  IF EXTRACT(DOW FROM data_verificar) IN (0, 6) THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se é feriado
  IF EXISTS (SELECT 1 FROM feriados WHERE data = data_verificar AND ativo = TRUE) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 10. Criar função para calcular data de disponibilização automática
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
  
  -- Verificar se é dia útil e ajustar se necessário
  WHILE NOT is_dia_util(data_disponibilizacao) LOOP
    data_disponibilizacao := data_disponibilizacao - INTERVAL '1 day';
  END LOOP;
  
  RETURN data_disponibilizacao;
END;
$$ LANGUAGE plpgsql;

-- 11. Criar função para gerar holerites quinzenais
CREATE OR REPLACE FUNCTION gerar_holerites_quinzenais(p_funcionario_id BIGINT, p_ano INTEGER, p_mes INTEGER)
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
  SELECT * INTO funcionario_rec 
  FROM funcionarios 
  WHERE id = p_funcionario_id AND tipo_salario = 'quinzenal';
  
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
  ) ON CONFLICT (funcionario_id, competencia, COALESCE(quinzena, 0)) DO NOTHING;
  
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
  ) ON CONFLICT (funcionario_id, competencia, COALESCE(quinzena, 0)) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 12. Criar função para atualizar status dos holerites automaticamente
CREATE OR REPLACE FUNCTION atualizar_status_holerites()
RETURNS INTEGER AS $$
DECLARE
  registros_atualizados INTEGER;
BEGIN
  -- Atualizar status para 'disponivel' quando a data de disponibilização chegar
  UPDATE holerites 
  SET status = 'disponivel', updated_at = NOW()
  WHERE status = 'programado' 
    AND data_disponibilizacao IS NOT NULL 
    AND data_disponibilizacao <= NOW();
    
  GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
  
  RETURN registros_atualizados;
END;
$$ LANGUAGE plpgsql;

-- 13. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas relevantes
CREATE TRIGGER update_holerites_updated_at 
  BEFORE UPDATE ON holerites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funcionario_beneficios_updated_at 
  BEFORE UPDATE ON funcionario_beneficios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_holerites_updated_at 
  BEFORE UPDATE ON configuracoes_holerites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Inserir dados de exemplo (REMOVIDO - sem dados de teste)
-- Os dados devem ser inseridos manualmente pelo administrador do sistema

-- 15. Inserir configurações padrão para holerites automáticos
INSERT INTO configuracoes_holerites (empresa_id) 
SELECT id FROM empresas 
WHERE NOT EXISTS (
  SELECT 1 FROM configuracoes_holerites WHERE empresa_id = empresas.id
);

-- 16. Gerar holerites de exemplo (REMOVIDO - sem dados de teste)
-- Os holerites serão gerados automaticamente quando funcionários quinzenais forem criados

-- 17. Habilitar RLS (Row Level Security) para as novas tabelas
ALTER TABLE holerites ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_beneficios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_descontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_holerites ENABLE ROW LEVEL SECURITY;
ALTER TABLE feriados ENABLE ROW LEVEL SECURITY;

-- 18. Criar políticas RLS básicas
-- Holerites: funcionários só veem seus próprios holerites
CREATE POLICY "Funcionários podem ver seus próprios holerites" ON holerites
  FOR SELECT USING (
    funcionario_id = (SELECT id FROM funcionarios WHERE email_login = auth.email())
  );

-- Benefícios: funcionários só veem seus próprios benefícios
CREATE POLICY "Funcionários podem ver seus próprios benefícios" ON funcionario_beneficios
  FOR SELECT USING (
    funcionario_id = (SELECT id FROM funcionarios WHERE email_login = auth.email())
  );

-- Feriados: todos podem visualizar
CREATE POLICY "Todos podem visualizar feriados" ON feriados
  FOR SELECT USING (true);

-- 19. Comentários para documentação
COMMENT ON TABLE holerites IS 'Armazena holerites mensais e quinzenais dos funcionários';
COMMENT ON TABLE funcionario_beneficios IS 'Benefícios configurados por funcionário (VT, VR, Planos)';
COMMENT ON TABLE funcionario_descontos IS 'Descontos personalizados por funcionário';
COMMENT ON TABLE configuracoes_holerites IS 'Configurações de automação de holerites por empresa';
COMMENT ON TABLE feriados IS 'Calendário de feriados para cálculo de datas úteis';

COMMENT ON FUNCTION calcular_data_disponibilizacao(INTEGER, INTEGER) IS 'Calcula data de disponibilização do holerite respeitando fins de semana e feriados';
COMMENT ON FUNCTION gerar_holerites_quinzenais(BIGINT, INTEGER, INTEGER) IS 'Gera holerites da 1ª e 2ª quinzena para um funcionário';
COMMENT ON FUNCTION atualizar_status_holerites() IS 'Atualiza status dos holerites programados para disponível quando chega a data';

-- =====================================================
-- MIGRAÇÃO CONCLUÍDA COM SUCESSO!
-- 
-- Funcionalidades implementadas:
-- ✅ Salário quinzenal para funcionários
-- ✅ Holerites automáticos (2ª quinzena)
-- ✅ Benefícios completos (VT, VR, Planos)
-- ✅ Descontos personalizados
-- ✅ Calendário de feriados
-- ✅ Funções de automação
-- ✅ Políticas de segurança RLS
-- ✅ Dados de exemplo
-- =====================================================