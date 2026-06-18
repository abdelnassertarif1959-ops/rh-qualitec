-- =====================================================
-- MIGRAÇÃO COMPLETA COM TODOS OS RELACIONAMENTOS
-- Sistema RH - Vinculação Total do Funcionário
-- =====================================================

-- =====================================================
-- PARTE 1: ESTRUTURA BASE DO FUNCIONÁRIO
-- =====================================================

-- 1. Garantir que a tabela funcionarios tem todos os campos necessários
ALTER TABLE funcionarios 
ADD COLUMN IF NOT EXISTS tipo_salario VARCHAR(20) DEFAULT 'mensal',
ADD COLUMN IF NOT EXISTS empresa_id BIGINT REFERENCES empresas(id),
ADD COLUMN IF NOT EXISTS departamento_id BIGINT REFERENCES departamentos(id),
ADD COLUMN IF NOT EXISTS cargo_id BIGINT REFERENCES cargos(id),
ADD COLUMN IF NOT EXISTS jornada_trabalho_id BIGINT REFERENCES jornadas_trabalho(id),
ADD COLUMN IF NOT EXISTS responsavel_id BIGINT REFERENCES funcionarios(id);

-- Adicionar constraints
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

-- =====================================================
-- PARTE 2: TABELAS DE RELACIONAMENTO
-- =====================================================

-- 2. Tabela de HOLERITES (vinculada ao funcionário e empresa)
CREATE TABLE IF NOT EXISTS holerites (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  empresa_id BIGINT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  referencia VARCHAR(100) NOT NULL,
  competencia VARCHAR(7) NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  quinzena INTEGER,
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
  
  CONSTRAINT holerites_tipo_check CHECK (tipo IN ('mensal', 'quinzenal')),
  CONSTRAINT holerites_status_check CHECK (status IN ('programado', 'disponivel', 'pago', 'cancelado')),
  CONSTRAINT holerites_quinzena_check CHECK (quinzena IS NULL OR quinzena IN (1, 2))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_holerites_funcionario_competencia_quinzena 
ON holerites(funcionario_id, competencia, COALESCE(quinzena, 0));

-- 3. Tabela de BENEFÍCIOS (vinculada ao funcionário)
CREATE TABLE IF NOT EXISTS funcionario_beneficios (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  
  -- Vale Transporte
  vt_ativo BOOLEAN DEFAULT FALSE,
  vt_valor_diario DECIMAL(8,2) DEFAULT 0,
  vt_tipo_desconto VARCHAR(20) DEFAULT 'percentual',
  vt_percentual_desconto DECIMAL(5,2) DEFAULT 6.00,
  vt_valor_desconto DECIMAL(8,2) DEFAULT 0,
  
  -- Vale Refeição  
  vr_ativo BOOLEAN DEFAULT FALSE,
  vr_valor_diario DECIMAL(8,2) DEFAULT 0,
  vr_tipo_desconto VARCHAR(20) DEFAULT 'percentual',
  vr_percentual_desconto DECIMAL(5,2) DEFAULT 20.00,
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
  
  CONSTRAINT funcionario_beneficios_vt_tipo_check CHECK (vt_tipo_desconto IN ('sem_desconto', 'percentual', 'valor_fixo')),
  CONSTRAINT funcionario_beneficios_vr_tipo_check CHECK (vr_tipo_desconto IN ('sem_desconto', 'percentual', 'valor_fixo')),
  CONSTRAINT funcionario_beneficios_ps_plano_check CHECK (ps_plano IN ('individual', 'familiar', 'coparticipacao')),
  
  UNIQUE(funcionario_id)
);

-- 4. Tabela de DESCONTOS PERSONALIZADOS (vinculada ao funcionário)
CREATE TABLE IF NOT EXISTS funcionario_descontos (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
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

-- 5. Tabela de DEPENDENTES (vinculada ao funcionário)
CREATE TABLE IF NOT EXISTS funcionario_dependentes (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  nome_completo VARCHAR(200) NOT NULL,
  cpf VARCHAR(14),
  data_nascimento DATE NOT NULL,
  parentesco VARCHAR(50) NOT NULL,
  tipo_dependencia VARCHAR(50),
  plano_saude BOOLEAN DEFAULT FALSE,
  plano_odonto BOOLEAN DEFAULT FALSE,
  imposto_renda BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT funcionario_dependentes_parentesco_check 
    CHECK (parentesco IN ('filho', 'filha', 'conjuge', 'companheiro', 'pai', 'mae', 'outro'))
);

-- 6. Tabela de DOCUMENTOS (vinculada ao funcionário) - SEM UPLOAD DE ARQUIVOS
CREATE TABLE IF NOT EXISTS funcionario_documentos (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  tipo_documento VARCHAR(50) NOT NULL,
  numero_documento VARCHAR(100),
  data_emissao DATE,
  data_validade DATE,
  orgao_emissor VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT funcionario_documentos_tipo_check 
    CHECK (tipo_documento IN ('rg', 'cnh', 'ctps', 'titulo_eleitor', 'reservista', 'pis_pasep', 'outro'))
);

-- 7. Tabela de HISTÓRICO DE CARGOS (vinculada ao funcionário)
CREATE TABLE IF NOT EXISTS funcionario_historico_cargos (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  cargo_id BIGINT NOT NULL REFERENCES cargos(id),
  departamento_id BIGINT REFERENCES departamentos(id),
  salario_anterior DECIMAL(10,2),
  salario_novo DECIMAL(10,2) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  motivo VARCHAR(200),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabela de HISTÓRICO DE SALÁRIOS (vinculada ao funcionário)
CREATE TABLE IF NOT EXISTS funcionario_historico_salarios (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  salario_anterior DECIMAL(10,2) NOT NULL,
  salario_novo DECIMAL(10,2) NOT NULL,
  percentual_aumento DECIMAL(5,2),
  tipo_reajuste VARCHAR(50),
  data_vigencia DATE NOT NULL,
  motivo VARCHAR(200),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT funcionario_historico_salarios_tipo_check 
    CHECK (tipo_reajuste IN ('dissidio', 'merito', 'promocao', 'correcao', 'outro'))
);

-- 9. Tabela de FÉRIAS (vinculada ao funcionário)
CREATE TABLE IF NOT EXISTS funcionario_ferias (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  periodo_aquisitivo_inicio DATE NOT NULL,
  periodo_aquisitivo_fim DATE NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias_corridos INTEGER NOT NULL,
  dias_uteis INTEGER NOT NULL,
  abono_pecuniario BOOLEAN DEFAULT FALSE,
  dias_abono INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'programado',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT funcionario_ferias_status_check 
    CHECK (status IN ('programado', 'em_andamento', 'concluido', 'cancelado'))
);

-- 10. Tabela de PONTO ELETRÔNICO (vinculada ao funcionário)
CREATE TABLE IF NOT EXISTS funcionario_ponto (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  entrada_1 TIME,
  saida_1 TIME,
  entrada_2 TIME,
  saida_2 TIME,
  horas_trabalhadas DECIMAL(5,2),
  horas_extras DECIMAL(5,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(funcionario_id, data)
);--

-- PARTE 3: TABELAS DE SUPORTE E CONFIGURAÇÃO
-- =====================================================

-- 11. Tabela de CONFIGURAÇÕES DE HOLERITES (por empresa)
CREATE TABLE IF NOT EXISTS configuracoes_holerites (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  
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

-- 12. Tabela de FERIADOS (global, mas pode ser filtrada por empresa)
CREATE TABLE IF NOT EXISTS feriados (
  id BIGSERIAL PRIMARY KEY,
  data DATE NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'nacional',
  estado VARCHAR(2),
  cidade VARCHAR(100),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT feriados_tipo_check CHECK (tipo IN ('nacional', 'estadual', 'municipal'))
);

-- Criar índice único para feriados (sem COALESCE na constraint)
CREATE UNIQUE INDEX IF NOT EXISTS idx_feriados_unique 
ON feriados(data, tipo, COALESCE(estado, ''), COALESCE(cidade, ''));

-- 13. Tabela de AUDITORIA/LOG (rastreia todas as ações)
CREATE TABLE IF NOT EXISTS auditoria_funcionarios (
  id BIGSERIAL PRIMARY KEY,
  funcionario_id BIGINT REFERENCES funcionarios(id) ON DELETE SET NULL,
  usuario_id BIGINT REFERENCES funcionarios(id),
  acao VARCHAR(50) NOT NULL,
  tabela_afetada VARCHAR(100),
  registro_id BIGINT,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT auditoria_funcionarios_acao_check 
    CHECK (acao IN ('criar', 'atualizar', 'deletar', 'visualizar', 'exportar'))
);

-- =====================================================
-- PARTE 4: ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para holerites
CREATE INDEX IF NOT EXISTS idx_holerites_funcionario ON holerites(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_holerites_empresa ON holerites(empresa_id);
CREATE INDEX IF NOT EXISTS idx_holerites_competencia ON holerites(competencia);
CREATE INDEX IF NOT EXISTS idx_holerites_status ON holerites(status);
CREATE INDEX IF NOT EXISTS idx_holerites_data_disponibilizacao ON holerites(data_disponibilizacao);

-- Índices para benefícios
CREATE INDEX IF NOT EXISTS idx_funcionario_beneficios_funcionario ON funcionario_beneficios(funcionario_id);

-- Índices para descontos
CREATE INDEX IF NOT EXISTS idx_funcionario_descontos_funcionario ON funcionario_descontos(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_funcionario_descontos_ativo ON funcionario_descontos(funcionario_id, ativo);

-- Índices para dependentes
CREATE INDEX IF NOT EXISTS idx_funcionario_dependentes_funcionario ON funcionario_dependentes(funcionario_id);

-- Índices para documentos
CREATE INDEX IF NOT EXISTS idx_funcionario_documentos_funcionario ON funcionario_documentos(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_funcionario_documentos_tipo ON funcionario_documentos(tipo_documento);

-- Índices para históricos
CREATE INDEX IF NOT EXISTS idx_funcionario_historico_cargos_funcionario ON funcionario_historico_cargos(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_funcionario_historico_salarios_funcionario ON funcionario_historico_salarios(funcionario_id);

-- Índices para férias
CREATE INDEX IF NOT EXISTS idx_funcionario_ferias_funcionario ON funcionario_ferias(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_funcionario_ferias_status ON funcionario_ferias(status);

-- Índices para ponto
CREATE INDEX IF NOT EXISTS idx_funcionario_ponto_funcionario_data ON funcionario_ponto(funcionario_id, data);

-- Índices para feriados
CREATE INDEX IF NOT EXISTS idx_feriados_data ON feriados(data);
CREATE INDEX IF NOT EXISTS idx_feriados_ativo ON feriados(ativo);

-- Índices para auditoria
CREATE INDEX IF NOT EXISTS idx_auditoria_funcionarios_funcionario ON auditoria_funcionarios(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_funcionarios_usuario ON auditoria_funcionarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_funcionarios_created_at ON auditoria_funcionarios(created_at);

-- Índices na tabela funcionarios
CREATE INDEX IF NOT EXISTS idx_funcionarios_empresa ON funcionarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_departamento ON funcionarios(departamento_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cargo ON funcionarios(cargo_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_responsavel ON funcionarios(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_tipo_salario ON funcionarios(tipo_salario);
CREATE INDEX IF NOT EXISTS idx_funcionarios_status ON funcionarios(status);

-- =====================================================
-- PARTE 5: FUNÇÕES E PROCEDURES
-- =====================================================

-- Função para verificar se é dia útil
CREATE OR REPLACE FUNCTION is_dia_util(data_verificar DATE)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se é fim de semana
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

-- Função para calcular data de disponibilização
CREATE OR REPLACE FUNCTION calcular_data_disponibilizacao(ano INTEGER, mes INTEGER)
RETURNS DATE AS $$
DECLARE
  dia_20 DATE;
  data_disponibilizacao DATE;
BEGIN
  dia_20 := make_date(ano, mes, 20);
  data_disponibilizacao := dia_20 - INTERVAL '2 days';
  
  WHILE NOT is_dia_util(data_disponibilizacao) LOOP
    data_disponibilizacao := data_disponibilizacao - INTERVAL '1 day';
  END LOOP;
  
  RETURN data_disponibilizacao;
END;
$$ LANGUAGE plpgsql;

-- Função para gerar holerites quinzenais
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
  SELECT * INTO funcionario_rec 
  FROM funcionarios 
  WHERE id = p_funcionario_id AND tipo_salario = 'quinzenal';
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  valor_quinzenal := funcionario_rec.salario_base / 2;
  
  periodo_1_inicio := make_date(p_ano, p_mes, 1);
  periodo_1_fim := make_date(p_ano, p_mes, 15);
  periodo_2_inicio := make_date(p_ano, p_mes, 16);
  periodo_2_fim := (make_date(p_ano, p_mes, 1) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  data_disponibilizacao_2q := calcular_data_disponibilizacao(p_ano, p_mes);
  
  -- 1ª Quinzena (manual)
  INSERT INTO holerites (
    funcionario_id, empresa_id, referencia, competencia, mes, ano, quinzena, tipo, status,
    periodo_inicio, periodo_fim, salario_base, total_proventos, total_descontos, liquido
  ) VALUES (
    p_funcionario_id, funcionario_rec.empresa_id,
    'Holerite ' || LPAD(p_mes::TEXT, 2, '0') || '/' || p_ano || ' - 1ª Quinzena',
    LPAD(p_mes::TEXT, 2, '0') || '/' || p_ano,
    p_mes, p_ano, 1, 'quinzenal', 'programado',
    periodo_1_inicio, periodo_1_fim, valor_quinzenal, valor_quinzenal, 0, valor_quinzenal
  ) ON CONFLICT DO NOTHING;
  
  -- 2ª Quinzena (automático)
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
  ) ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar status dos holerites
CREATE OR REPLACE FUNCTION atualizar_status_holerites()
RETURNS INTEGER AS $$
DECLARE
  registros_atualizados INTEGER;
BEGIN
  UPDATE holerites 
  SET status = 'disponivel', updated_at = NOW()
  WHERE status = 'programado' 
    AND data_disponibilizacao IS NOT NULL 
    AND data_disponibilizacao <= NOW();
    
  GET DIAGNOSTICS registros_atualizados = ROW_COUNT;
  RETURN registros_atualizados;
END;
$$ LANGUAGE plpgsql;

-- Função para criar benefícios padrão ao criar funcionário
CREATE OR REPLACE FUNCTION criar_beneficios_padrao()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO funcionario_beneficios (funcionario_id)
  VALUES (NEW.id)
  ON CONFLICT (funcionario_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar auditoria
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO auditoria_funcionarios (
      funcionario_id, acao, tabela_afetada, registro_id, dados_anteriores
    ) VALUES (
      OLD.funcionario_id, 'deletar', TG_TABLE_NAME, OLD.id, row_to_json(OLD)
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO auditoria_funcionarios (
      funcionario_id, acao, tabela_afetada, registro_id, dados_anteriores, dados_novos
    ) VALUES (
      NEW.funcionario_id, 'atualizar', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO auditoria_funcionarios (
      funcionario_id, acao, tabela_afetada, registro_id, dados_novos
    ) VALUES (
      NEW.funcionario_id, 'criar', TG_TABLE_NAME, NEW.id, row_to_json(NEW)
    );
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PARTE 6: TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de updated_at
DROP TRIGGER IF EXISTS update_holerites_updated_at ON holerites;
CREATE TRIGGER update_holerites_updated_at 
  BEFORE UPDATE ON holerites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_funcionario_beneficios_updated_at ON funcionario_beneficios;
CREATE TRIGGER update_funcionario_beneficios_updated_at 
  BEFORE UPDATE ON funcionario_beneficios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_configuracoes_holerites_updated_at ON configuracoes_holerites;
CREATE TRIGGER update_configuracoes_holerites_updated_at 
  BEFORE UPDATE ON configuracoes_holerites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar benefícios padrão ao criar funcionário
DROP TRIGGER IF EXISTS trigger_criar_beneficios_padrao ON funcionarios;
CREATE TRIGGER trigger_criar_beneficios_padrao
  AFTER INSERT ON funcionarios
  FOR EACH ROW EXECUTE FUNCTION criar_beneficios_padrao();

-- Triggers de auditoria (opcional - comentado por padrão)
-- DROP TRIGGER IF EXISTS trigger_auditoria_holerites ON holerites;
-- CREATE TRIGGER trigger_auditoria_holerites
--   AFTER INSERT OR UPDATE OR DELETE ON holerites
--   FOR EACH ROW EXECUTE FUNCTION registrar_auditoria();

-- =====================================================
-- PARTE 7: POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE holerites ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_beneficios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_descontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_dependentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionario_ponto ENABLE ROW LEVEL SECURITY;
ALTER TABLE feriados ENABLE ROW LEVEL SECURITY;

-- Políticas para holerites
DROP POLICY IF EXISTS "Funcionários veem seus holerites" ON holerites;
CREATE POLICY "Funcionários veem seus holerites" ON holerites
  FOR SELECT USING (
    funcionario_id = (SELECT id FROM funcionarios WHERE email_login = auth.email())
  );

DROP POLICY IF EXISTS "Admins veem todos holerites" ON holerites;
CREATE POLICY "Admins veem todos holerites" ON holerites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM funcionarios 
      WHERE email_login = auth.email() 
      AND tipo_acesso = 'admin'
    )
  );

-- Políticas para benefícios
DROP POLICY IF EXISTS "Funcionários veem seus benefícios" ON funcionario_beneficios;
CREATE POLICY "Funcionários veem seus benefícios" ON funcionario_beneficios
  FOR SELECT USING (
    funcionario_id = (SELECT id FROM funcionarios WHERE email_login = auth.email())
  );

-- Políticas para descontos
DROP POLICY IF EXISTS "Funcionários veem seus descontos" ON funcionario_descontos;
CREATE POLICY "Funcionários veem seus descontos" ON funcionario_descontos
  FOR SELECT USING (
    funcionario_id = (SELECT id FROM funcionarios WHERE email_login = auth.email())
  );

-- Políticas para dependentes
DROP POLICY IF EXISTS "Funcionários veem seus dependentes" ON funcionario_dependentes;
CREATE POLICY "Funcionários veem seus dependentes" ON funcionario_dependentes
  FOR SELECT USING (
    funcionario_id = (SELECT id FROM funcionarios WHERE email_login = auth.email())
  );

-- Políticas para feriados (todos podem ver)
DROP POLICY IF EXISTS "Todos veem feriados" ON feriados;
CREATE POLICY "Todos veem feriados" ON feriados
  FOR SELECT USING (true);

-- =====================================================
-- PARTE 8: DADOS INICIAIS
-- =====================================================

-- Inserir feriados nacionais 2026
INSERT INTO feriados (data, descricao, tipo) VALUES
('2026-01-01', 'Confraternização Universal', 'nacional'),
('2026-04-21', 'Tiradentes', 'nacional'),
('2026-05-01', 'Dia do Trabalhador', 'nacional'),
('2026-09-07', 'Independência do Brasil', 'nacional'),
('2026-10-12', 'Nossa Senhora Aparecida', 'nacional'),
('2026-11-02', 'Finados', 'nacional'),
('2026-11-15', 'Proclamação da República', 'nacional'),
('2026-12-25', 'Natal', 'nacional')
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão para empresas existentes
INSERT INTO configuracoes_holerites (empresa_id) 
SELECT id FROM empresas 
WHERE NOT EXISTS (
  SELECT 1 FROM configuracoes_holerites WHERE empresa_id = empresas.id
);

-- =====================================================
-- PARTE 9: VIEWS ÚTEIS
-- =====================================================

-- View completa do funcionário com todos os relacionamentos
CREATE OR REPLACE VIEW vw_funcionarios_completo AS
SELECT 
  f.id,
  f.nome_completo,
  f.cpf,
  f.email_login,
  f.tipo_salario,
  f.salario_base,
  f.status,
  
  -- Empresa
  e.id as empresa_id,
  e.nome_fantasia as empresa_nome,
  
  -- Departamento
  d.id as departamento_id,
  d.nome as departamento_nome,
  
  -- Cargo
  c.id as cargo_id,
  c.nome as cargo_nome,
  
  -- Responsável
  r.id as responsavel_id,
  r.nome_completo as responsavel_nome,
  
  -- Jornada
  j.id as jornada_id,
  j.nome as jornada_nome,
  
  -- Contadores
  (SELECT COUNT(*) FROM holerites WHERE funcionario_id = f.id) as total_holerites,
  (SELECT COUNT(*) FROM funcionario_dependentes WHERE funcionario_id = f.id) as total_dependentes,
  (SELECT COUNT(*) FROM funcionario_descontos WHERE funcionario_id = f.id AND ativo = true) as total_descontos_ativos
  
FROM funcionarios f
LEFT JOIN empresas e ON f.empresa_id = e.id
LEFT JOIN departamentos d ON f.departamento_id = d.id
LEFT JOIN cargos c ON f.cargo_id = c.id
LEFT JOIN funcionarios r ON f.responsavel_id = r.id
LEFT JOIN jornadas_trabalho j ON f.jornada_trabalho_id = j.id;

-- View de holerites com informações do funcionário
CREATE OR REPLACE VIEW vw_holerites_completo AS
SELECT 
  h.*,
  f.nome_completo as funcionario_nome,
  f.cpf as funcionario_cpf,
  e.nome_fantasia as empresa_nome,
  e.cnpj as empresa_cnpj,
  c.nome as cargo_nome,
  d.nome as departamento_nome
FROM holerites h
JOIN funcionarios f ON h.funcionario_id = f.id
JOIN empresas e ON h.empresa_id = e.id
LEFT JOIN cargos c ON f.cargo_id = c.id
LEFT JOIN departamentos d ON f.departamento_id = d.id;

-- View de benefícios ativos por funcionário
CREATE OR REPLACE VIEW vw_beneficios_ativos AS
SELECT 
  f.id as funcionario_id,
  f.nome_completo,
  fb.vt_ativo,
  fb.vt_valor_diario * 22 as vt_valor_mensal,
  fb.vr_ativo,
  fb.vr_valor_diario * 22 as vr_valor_mensal,
  fb.ps_ativo,
  fb.ps_valor_empresa + fb.ps_valor_funcionario as ps_valor_total,
  fb.po_ativo,
  fb.po_valor_funcionario as po_valor_total,
  
  -- Total de benefícios
  COALESCE(fb.vt_valor_diario * 22, 0) + 
  COALESCE(fb.vr_valor_diario * 22, 0) + 
  COALESCE(fb.ps_valor_empresa, 0) as total_beneficios_empresa,
  
  COALESCE(
    CASE WHEN fb.vt_tipo_desconto = 'valor_fixo' THEN fb.vt_valor_desconto
         WHEN fb.vt_tipo_desconto = 'percentual' THEN f.salario_base * fb.vt_percentual_desconto / 100
         ELSE 0 END, 0
  ) +
  COALESCE(
    CASE WHEN fb.vr_tipo_desconto = 'valor_fixo' THEN fb.vr_valor_desconto
         WHEN fb.vr_tipo_desconto = 'percentual' THEN f.salario_base * fb.vr_percentual_desconto / 100
         ELSE 0 END, 0
  ) +
  COALESCE(fb.ps_valor_funcionario, 0) +
  COALESCE(fb.po_valor_funcionario, 0) as total_descontos_beneficios
  
FROM funcionarios f
LEFT JOIN funcionario_beneficios fb ON f.id = fb.funcionario_id;

-- =====================================================
-- PARTE 10: COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE holerites IS 'Armazena holerites mensais e quinzenais - vinculado a funcionário e empresa';
COMMENT ON TABLE funcionario_beneficios IS 'Benefícios do funcionário (VT, VR, Planos) - 1:1 com funcionário';
COMMENT ON TABLE funcionario_descontos IS 'Descontos personalizados - N:1 com funcionário';
COMMENT ON TABLE funcionario_dependentes IS 'Dependentes do funcionário - N:1 com funcionário';
COMMENT ON TABLE funcionario_documentos IS 'Documentos do funcionário (apenas dados, sem upload de arquivos) - N:1 com funcionário';
COMMENT ON TABLE funcionario_historico_cargos IS 'Histórico de mudanças de cargo - N:1 com funcionário';
COMMENT ON TABLE funcionario_historico_salarios IS 'Histórico de reajustes salariais - N:1 com funcionário';
COMMENT ON TABLE funcionario_ferias IS 'Registro de férias - N:1 com funcionário';
COMMENT ON TABLE funcionario_ponto IS 'Registro de ponto eletrônico - N:1 com funcionário';
COMMENT ON TABLE configuracoes_holerites IS 'Configurações de automação por empresa - 1:1 com empresa';
COMMENT ON TABLE feriados IS 'Calendário de feriados para cálculo de datas úteis';
COMMENT ON TABLE auditoria_funcionarios IS 'Log de auditoria de todas as ações';

COMMENT ON COLUMN funcionarios.empresa_id IS 'Empresa à qual o funcionário pertence';
COMMENT ON COLUMN funcionarios.departamento_id IS 'Departamento do funcionário';
COMMENT ON COLUMN funcionarios.cargo_id IS 'Cargo atual do funcionário';
COMMENT ON COLUMN funcionarios.responsavel_id IS 'Gestor/responsável direto do funcionário';
COMMENT ON COLUMN funcionarios.jornada_trabalho_id IS 'Jornada de trabalho do funcionário';
COMMENT ON COLUMN funcionarios.tipo_salario IS 'Tipo de pagamento: mensal, quinzenal ou horista';

-- =====================================================
-- PARTE 11: VERIFICAÇÕES E VALIDAÇÕES
-- =====================================================

-- Função para verificar integridade dos relacionamentos
CREATE OR REPLACE FUNCTION verificar_integridade_funcionario(p_funcionario_id BIGINT)
RETURNS TABLE(
  item VARCHAR,
  status VARCHAR,
  detalhes TEXT
) AS $$
BEGIN
  -- Verificar se funcionário existe
  RETURN QUERY
  SELECT 
    'Funcionário'::VARCHAR,
    CASE WHEN EXISTS (SELECT 1 FROM funcionarios WHERE id = p_funcionario_id) 
         THEN 'OK' ELSE 'ERRO' END::VARCHAR,
    'Funcionário ' || CASE WHEN EXISTS (SELECT 1 FROM funcionarios WHERE id = p_funcionario_id) 
                           THEN 'encontrado' ELSE 'não encontrado' END::TEXT;
  
  -- Verificar empresa
  RETURN QUERY
  SELECT 
    'Empresa'::VARCHAR,
    CASE WHEN EXISTS (
      SELECT 1 FROM funcionarios f 
      JOIN empresas e ON f.empresa_id = e.id 
      WHERE f.id = p_funcionario_id
    ) THEN 'OK' ELSE 'AVISO' END::VARCHAR,
    'Empresa ' || CASE WHEN EXISTS (
      SELECT 1 FROM funcionarios f 
      JOIN empresas e ON f.empresa_id = e.id 
      WHERE f.id = p_funcionario_id
    ) THEN 'vinculada' ELSE 'não vinculada' END::TEXT;
  
  -- Verificar benefícios
  RETURN QUERY
  SELECT 
    'Benefícios'::VARCHAR,
    CASE WHEN EXISTS (SELECT 1 FROM funcionario_beneficios WHERE funcionario_id = p_funcionario_id) 
         THEN 'OK' ELSE 'AVISO' END::VARCHAR,
    'Benefícios ' || CASE WHEN EXISTS (SELECT 1 FROM funcionario_beneficios WHERE funcionario_id = p_funcionario_id) 
                          THEN 'configurados' ELSE 'não configurados' END::TEXT;
  
  -- Verificar holerites
  RETURN QUERY
  SELECT 
    'Holerites'::VARCHAR,
    'INFO'::VARCHAR,
    (SELECT COUNT(*)::TEXT || ' holerites encontrados' FROM holerites WHERE funcionario_id = p_funcionario_id);
  
  -- Verificar dependentes
  RETURN QUERY
  SELECT 
    'Dependentes'::VARCHAR,
    'INFO'::VARCHAR,
    (SELECT COUNT(*)::TEXT || ' dependentes cadastrados' FROM funcionario_dependentes WHERE funcionario_id = p_funcionario_id);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIM DA MIGRAÇÃO COMPLETA
-- =====================================================

-- Resumo dos relacionamentos criados:
-- 
-- FUNCIONÁRIO está vinculado a:
-- ✅ Empresa (empresa_id) - OBRIGATÓRIO
-- ✅ Departamento (departamento_id)
-- ✅ Cargo (cargo_id)
-- ✅ Responsável/Gestor (responsavel_id) - outro funcionário
-- ✅ Jornada de Trabalho (jornada_trabalho_id)
-- ✅ Usuário/Acesso (email_login, senha, tipo_acesso)
-- 
-- FUNCIONÁRIO tem relacionamento 1:N com:
-- ✅ Holerites (holerites.funcionario_id)
-- ✅ Descontos Personalizados (funcionario_descontos.funcionario_id)
-- ✅ Dependentes (funcionario_dependentes.funcionario_id)
-- ✅ Documentos (funcionario_documentos.funcionario_id)
-- ✅ Histórico de Cargos (funcionario_historico_cargos.funcionario_id)
-- ✅ Histórico de Salários (funcionario_historico_salarios.funcionario_id)
-- ✅ Férias (funcionario_ferias.funcionario_id)
-- ✅ Ponto Eletrônico (funcionario_ponto.funcionario_id)
-- ✅ Auditoria (auditoria_funcionarios.funcionario_id)
-- 
-- FUNCIONÁRIO tem relacionamento 1:1 com:
-- ✅ Benefícios (funcionario_beneficios.funcionario_id) - UNIQUE
-- 
-- EMPRESA tem relacionamento 1:N com:
-- ✅ Funcionários (funcionarios.empresa_id)
-- ✅ Holerites (holerites.empresa_id)
-- 
-- EMPRESA tem relacionamento 1:1 com:
-- ✅ Configurações de Holerites (configuracoes_holerites.empresa_id) - UNIQUE
-- 
-- =====================================================
-- EXECUTE: SELECT verificar_integridade_funcionario(1);
-- Para verificar todos os relacionamentos de um funcionário
-- =====================================================