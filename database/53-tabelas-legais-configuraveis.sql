-- ============================================================
-- MIGRAÇÃO 53: Tabelas Legais Configuráveis (CLT 2026)
-- ============================================================

-- 1. Faixas do INSS Progressivo 2026
CREATE TABLE IF NOT EXISTS config_inss_faixas (
  id SERIAL PRIMARY KEY,
  ano INTEGER NOT NULL DEFAULT 2026,
  faixa_numero INTEGER NOT NULL,
  limite NUMERIC(10,2) NOT NULL, -- limite superior da faixa
  aliquota NUMERIC(5,4) NOT NULL, -- alíquota correspondente (ex: 0.0750)
  parcela_deducao NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (ano, faixa_numero)
);

-- 2. Faixas do IRRF Progressivo 2026
CREATE TABLE IF NOT EXISTS config_irrf_faixas (
  id SERIAL PRIMARY KEY,
  ano INTEGER NOT NULL DEFAULT 2026,
  faixa_numero INTEGER NOT NULL,
  limite NUMERIC(10,2), -- limite superior (null para a última faixa)
  aliquota NUMERIC(5,4) NOT NULL,
  parcela_deducao NUMERIC(10,2) NOT NULL DEFAULT 0,
  aliquota_desc VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (ano, faixa_numero)
);

-- 3. Parâmetros Especiais de IRRF (Lei 15.270/2025)
CREATE TABLE IF NOT EXISTS config_irrf_parametros (
  id SERIAL PRIMARY KEY,
  ano INTEGER NOT NULL DEFAULT 2026 UNIQUE,
  limite_isencao_redutor NUMERIC(10,2) NOT NULL DEFAULT 5000.00,
  limite_max_redutor NUMERIC(10,2) NOT NULL DEFAULT 7350.00,
  redutor_coeficiente_a NUMERIC(10,2) NOT NULL DEFAULT 978.62,
  redutor_coeficiente_b NUMERIC(10,6) NOT NULL DEFAULT 0.133145,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Deduções Legais do IRRF
CREATE TABLE IF NOT EXISTS config_deducoes_legais (
  id SERIAL PRIMARY KEY,
  ano INTEGER NOT NULL DEFAULT 2026,
  chave VARCHAR(50) NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (ano, chave)
);

-- 5. Códigos de Rubricas/Eventos de Folha e Férias
CREATE TABLE IF NOT EXISTS config_eventos_folha (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('provento', 'desconto')),
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- HABILITAR RLS E CRIAR POLÍTICAS
-- ============================================================
ALTER TABLE config_inss_faixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_irrf_faixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_irrf_parametros ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_deducoes_legais ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_eventos_folha ENABLE ROW LEVEL SECURITY;

-- Permissão de leitura para todos os usuários autenticados
CREATE POLICY "Leitura pública para faixas INSS" ON config_inss_faixas FOR SELECT USING (true);
CREATE POLICY "Leitura pública para faixas IRRF" ON config_irrf_faixas FOR SELECT USING (true);
CREATE POLICY "Leitura pública para parâmetros IRRF" ON config_irrf_parametros FOR SELECT USING (true);
CREATE POLICY "Leitura pública para deduções legais" ON config_deducoes_legais FOR SELECT USING (true);
CREATE POLICY "Leitura pública para eventos folha" ON config_eventos_folha FOR SELECT USING (true);

-- Permissão de escrita apenas para administradores (bypassed pelo service role, mas boa prática)
CREATE POLICY "Admin total faixas INSS" ON config_inss_faixas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin total faixas IRRF" ON config_irrf_faixas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin total parâmetros IRRF" ON config_irrf_parametros FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin total deduções legais" ON config_deducoes_legais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin total eventos folha" ON config_eventos_folha FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA - VALORES OFICIAIS DE 2026
-- ============================================================

-- INSS 2026
INSERT INTO config_inss_faixas (ano, faixa_numero, limite, aliquota, parcela_deducao) VALUES
  (2026, 1, 1621.00, 0.0750, 0.00),
  (2026, 2, 2902.84, 0.0900, 24.31),
  (2026, 3, 4354.27, 0.1200, 111.40),
  (2026, 4, 8475.55, 0.1400, 198.49)
ON CONFLICT (ano, faixa_numero) DO UPDATE SET
  limite = EXCLUDED.limite,
  aliquota = EXCLUDED.aliquota,
  parcela_deducao = EXCLUDED.parcela_deducao,
  updated_at = now();

-- IRRF 2026
INSERT INTO config_irrf_faixas (ano, faixa_numero, limite, aliquota, parcela_deducao, aliquota_desc) VALUES
  (2026, 1, 2428.80, 0.0000, 0.00, 'Isento'),
  (2026, 2, 3051.00, 0.0750, 182.16, '7.5%'),
  (2026, 3, 4052.00, 0.1500, 394.16, '15.0%'),
  (2026, 4, 5050.00, 0.2250, 675.49, '22.5%'),
  (2026, 5, NULL, 0.2750, 896.00, '27.5%')
ON CONFLICT (ano, faixa_numero) DO UPDATE SET
  limite = EXCLUDED.limite,
  aliquota = EXCLUDED.aliquota,
  parcela_deducao = EXCLUDED.parcela_deducao,
  aliquota_desc = EXCLUDED.aliquota_desc,
  updated_at = now();

-- Parâmetros especiais IRRF (Lei 15.270/2025)
INSERT INTO config_irrf_parametros (ano, limite_isencao_redutor, limite_max_redutor, redutor_coeficiente_a, redutor_coeficiente_b) VALUES
  (2026, 5000.00, 7350.00, 978.62, 0.133145)
ON CONFLICT (ano) DO UPDATE SET
  limite_isencao_redutor = EXCLUDED.limite_isencao_redutor,
  limite_max_redutor = EXCLUDED.limite_max_redutor,
  redutor_coeficiente_a = EXCLUDED.redutor_coeficiente_a,
  redutor_coeficiente_b = EXCLUDED.redutor_coeficiente_b,
  updated_at = now();

-- Deduções Legais
INSERT INTO config_deducoes_legais (ano, chave, descricao, valor) VALUES
  (2026, 'dependente_irrf', 'Dedução por Dependente no IRRF', 189.59),
  (2026, 'salario_minimo', 'Salário Mínimo Vigente', 1621.00)
ON CONFLICT (ano, chave) DO UPDATE SET
  valor = EXCLUDED.valor,
  descricao = EXCLUDED.descricao,
  updated_at = now();

-- Eventos de Férias/Folha
INSERT INTO config_eventos_folha (codigo, nome, tipo, descricao) VALUES
  ('8800', 'REMUNERAÇÃO DE FÉRIAS', 'provento', 'Proporcional aos dias de gozo de férias'),
  ('8801', '1/3 CONSTITUCIONAL', 'provento', 'Terço constitucional sobre remuneração de férias'),
  ('8802', 'ABONO PECUNIÁRIO', 'provento', 'Venda de até 1/3 do período de férias'),
  ('8781', 'DIAS NORMAIS', 'provento', 'Salário mensal dos dias trabalhados'),
  ('998', 'I.N.S.S.', 'desconto', 'Previdência social progressiva'),
  ('999', 'I.R.R.F.', 'desconto', 'Imposto de renda retido na fonte'),
  ('915', 'PENSÃO ALIMENTÍCIA', 'desconto', 'Dedução judicial de alimentos')
ON CONFLICT (codigo) DO NOTHING;
