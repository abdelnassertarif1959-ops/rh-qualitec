-- =====================================================
-- SCRIPT 01: CRIAR TABELAS BASE
-- Execute PRIMEIRO - Cria estrutura fundamental do sistema
-- =====================================================

-- =====================================================
-- PARTE 1: TABELAS PRINCIPAIS
-- =====================================================

-- 1. Criar tabela de EMPRESAS
CREATE TABLE IF NOT EXISTS empresas (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  inscricao_estadual VARCHAR(50),
  situacao_cadastral VARCHAR(50),
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de DEPARTAMENTOS
CREATE TABLE IF NOT EXISTS departamentos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  responsavel VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar tabela de CARGOS
CREATE TABLE IF NOT EXISTS cargos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  nivel VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criar tabela de JORNADAS DE TRABALHO
CREATE TABLE IF NOT EXISTS jornadas_trabalho (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  horas_semanais DECIMAL(5,2),
  horas_diarias DECIMAL(5,2),
  dias_semana INTEGER DEFAULT 5,
  ativa BOOLEAN DEFAULT TRUE,
  padrao BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Criar tabela de FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS funcionarios (
  id BIGSERIAL PRIMARY KEY,
  
  -- Dados Pessoais
  nome_completo VARCHAR(200) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  rg VARCHAR(20),
  data_nascimento DATE,
  sexo VARCHAR(1),
  telefone VARCHAR(20),
  email_pessoal VARCHAR(100),
  
  -- Dados Profissionais
  empresa_id BIGINT REFERENCES empresas(id),
  departamento_id BIGINT REFERENCES departamentos(id),
  cargo_id BIGINT REFERENCES cargos(id),
  jornada_trabalho_id BIGINT REFERENCES jornadas_trabalho(id),
  responsavel_id BIGINT REFERENCES funcionarios(id),
  tipo_contrato VARCHAR(20),
  data_admissao DATE,
  data_demissao DATE,
  matricula VARCHAR(50),
  
  -- Acesso ao Sistema
  email_login VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_acesso VARCHAR(20) DEFAULT 'funcionario',
  status VARCHAR(20) DEFAULT 'ativo',
  
  -- Dados Financeiros
  salario_base DECIMAL(10,2),
  tipo_salario VARCHAR(20) DEFAULT 'mensal',
  banco VARCHAR(100),
  agencia VARCHAR(20),
  conta VARCHAR(30),
  tipo_conta VARCHAR(20),
  forma_pagamento VARCHAR(50),
  
  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT funcionarios_tipo_acesso_check CHECK (tipo_acesso IN ('funcionario', 'admin')),
  CONSTRAINT funcionarios_status_check CHECK (status IN ('ativo', 'inativo', 'afastado', 'ferias')),
  CONSTRAINT funcionarios_tipo_salario_check CHECK (tipo_salario IN ('mensal', 'quinzenal', 'horista')),
  CONSTRAINT funcionarios_sexo_check CHECK (sexo IN ('M', 'F', 'O'))
);

-- =====================================================
-- PARTE 2: ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para empresas
CREATE INDEX IF NOT EXISTS idx_empresas_cnpj ON empresas(cnpj);

-- Índices para funcionarios
CREATE INDEX IF NOT EXISTS idx_funcionarios_empresa ON funcionarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_departamento ON funcionarios(departamento_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cargo ON funcionarios(cargo_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_responsavel ON funcionarios(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_jornada ON funcionarios(jornada_trabalho_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_email ON funcionarios(email_login);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_status ON funcionarios(status);
CREATE INDEX IF NOT EXISTS idx_funcionarios_tipo_salario ON funcionarios(tipo_salario);

-- =====================================================
-- PARTE 3: TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em empresas
DROP TRIGGER IF EXISTS update_empresas_updated_at ON empresas;
CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger em departamentos
DROP TRIGGER IF EXISTS update_departamentos_updated_at ON departamentos;
CREATE TRIGGER update_departamentos_updated_at
  BEFORE UPDATE ON departamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger em cargos
DROP TRIGGER IF EXISTS update_cargos_updated_at ON cargos;
CREATE TRIGGER update_cargos_updated_at
  BEFORE UPDATE ON cargos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger em jornadas_trabalho
DROP TRIGGER IF EXISTS update_jornadas_trabalho_updated_at ON jornadas_trabalho;
CREATE TRIGGER update_jornadas_trabalho_updated_at
  BEFORE UPDATE ON jornadas_trabalho
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger em funcionarios
DROP TRIGGER IF EXISTS update_funcionarios_updated_at ON funcionarios;
CREATE TRIGGER update_funcionarios_updated_at
  BEFORE UPDATE ON funcionarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PARTE 4: HABILITAR RLS (Row Level Security)
-- =====================================================

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE jornadas_trabalho ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTE 5: POLÍTICAS RLS BÁSICAS
-- =====================================================

-- Empresas: Todos podem ver (será refinado depois)
DROP POLICY IF EXISTS "Todos podem ver empresas" ON empresas;
CREATE POLICY "Todos podem ver empresas" ON empresas
  FOR SELECT USING (true);

-- Departamentos: Todos podem ver (será refinado depois)
DROP POLICY IF EXISTS "Todos podem ver departamentos" ON departamentos;
CREATE POLICY "Todos podem ver departamentos" ON departamentos
  FOR SELECT USING (true);

-- Cargos: Todos podem ver (será refinado depois)
DROP POLICY IF EXISTS "Todos podem ver cargos" ON cargos;
CREATE POLICY "Todos podem ver cargos" ON cargos
  FOR SELECT USING (true);

-- Jornadas: Todos podem ver (será refinado depois)
DROP POLICY IF EXISTS "Todos podem ver jornadas" ON jornadas_trabalho;
CREATE POLICY "Todos podem ver jornadas" ON jornadas_trabalho
  FOR SELECT USING (true);

-- Funcionários: Apenas seus próprios dados (será refinado depois)
DROP POLICY IF EXISTS "Funcionários veem seus dados" ON funcionarios;
CREATE POLICY "Funcionários veem seus dados" ON funcionarios
  FOR SELECT USING (
    email_login = auth.email()
  );

-- =====================================================
-- PARTE 6: COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE empresas IS 'Empresas cadastradas no sistema';
COMMENT ON TABLE departamentos IS 'Departamentos/setores das empresas';
COMMENT ON TABLE cargos IS 'Cargos/funções disponíveis';
COMMENT ON TABLE jornadas_trabalho IS 'Jornadas de trabalho configuradas';
COMMENT ON TABLE funcionarios IS 'Funcionários do sistema com dados completos';

COMMENT ON COLUMN funcionarios.tipo_salario IS 'Tipo de pagamento: mensal, quinzenal ou horista';
COMMENT ON COLUMN funcionarios.tipo_acesso IS 'Nível de acesso: funcionario ou admin';
COMMENT ON COLUMN funcionarios.status IS 'Status atual: ativo, inativo, afastado, ferias';

-- =====================================================
-- FIM DO SCRIPT 01
-- =====================================================

-- Verificar tabelas criadas
SELECT 
  'Tabelas base criadas com sucesso!' as mensagem,
  COUNT(*) as total_tabelas
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('empresas', 'departamentos', 'cargos', 'jornadas_trabalho', 'funcionarios');
