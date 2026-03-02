-- 3. ADICIONAR ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_funcionarios_beneficios ON funcionarios USING GIN (beneficios);
CREATE INDEX IF NOT EXISTS idx_funcionarios_descontos ON funcionarios USING GIN (descontos_personalizados);

-- 4. DOCUMENTAR ESTRUTURA
COMMENT ON COLUMN funcionarios.beneficios IS 
'Estrutura JSON dos benefícios:
{
  "vale_transporte": {
    "ativo": boolean,
    "tipo_transporte": "onibus" | "metro" | "integracao",
    "passagens_onibus_dia": number,
    "valor_passagem_onibus": number (padrão: 5.30 - SPTrans 2024),
    "passagens_metro_dia": number,
    "valor_passagem_metro": number (padrão: 5.40 - CPTM 2024),
    "dias_uteis": number (padrão: 22),
    "percentual_desconto": number (padrão: 6, máximo: 6),
    "valor_total": number (calculado automaticamente)
  },
  "vale_refeicao": {
    "ativo": boolean,
    "valor": number,
    "tipo_desconto": "percentual" | "valor_fixo" | "sem_desconto",
    "percentual_desconto": number,
    "valor_desconto": number
  },
  "plano_saude": {
    "ativo": boolean,
    "plano": string,
    "dependentes": number,
    "valor_empresa": number,
    "valor_funcionario": number
  },
  "plano_odonto": {
    "ativo": boolean,
    "dependentes": number,
    "valor_funcionario": number
  }
}';

COMMENT ON COLUMN funcionarios.descontos_personalizados IS
'Array JSON de descontos personalizados:
[
  {
    "descricao": string,
    "tipo": "percentual" | "valor_fixo",
    "percentual": number,
    "valor": number,
    "recorrente": boolean,
    "parcelas": number
  }
]';

-- 5. CRIAR VIEW PARA FACILITAR CONSULTAS DE VALE TRANSPORTE
CREATE OR REPLACE VIEW vw_vale_transporte_funcionarios AS
SELECT 
  f.id,
  f.nome_completo,
  f.salario_base,
  (f.beneficios->'vale_transporte'->>'ativo')::boolean AS vt_ativo,
  f.beneficios->'vale_transporte'->>'tipo_transporte' AS tipo_transporte,
  COALESCE((f.beneficios->'vale_transporte'->>'passagens_onibus_dia')::INTEGER, 0) AS passagens_onibus_dia,
  COALESCE((f.beneficios->'vale_transporte'->>'valor_passagem_onibus')::NUMERIC, 0) AS valor_passagem_onibus,
  COALESCE((f.beneficios->'vale_transporte'->>'passagens_metro_dia')::INTEGER, 0) AS passagens_metro_dia,
  COALESCE((f.beneficios->'vale_transporte'->>'valor_passagem_metro')::NUMERIC, 0) AS valor_passagem_metro,
  COALESCE((f.beneficios->'vale_transporte'->>'dias_uteis')::INTEGER, 22) AS dias_uteis,
  COALESCE((f.beneficios->'vale_transporte'->>'percentual_desconto')::NUMERIC, 6) AS percentual_desconto,
  COALESCE((f.beneficios->'vale_transporte'->>'valor_total')::NUMERIC, 0) AS valor_total,
  -- Calcular desconto (6% do salário base)
  ROUND(f.salario_base * COALESCE((f.beneficios->'vale_transporte'->>'percentual_desconto')::NUMERIC, 6) / 100, 2) AS valor_desconto,
  -- Calcular valor líquido
  COALESCE((f.beneficios->'vale_transporte'->>'valor_total')::NUMERIC, 0) - 
  ROUND(f.salario_base * COALESCE((f.beneficios->'vale_transporte'->>'percentual_desconto')::NUMERIC, 6) / 100, 2) AS valor_liquido
FROM funcionarios f
WHERE f.status = 'ativo';

-- Comentários
COMMENT ON VIEW vw_vale_transporte_funcionarios IS 
'View que facilita a consulta dos dados de Vale Transporte dos funcionários, 
incluindo cálculos automáticos de desconto e valor líquido';

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Exemplo 1: Funcionário que usa apenas ônibus (4 passagens/dia)
-- Ônibus SPTrans: R$ 5,30 por viagem
UPDATE funcionarios 
SET beneficios = jsonb_set(
  COALESCE(beneficios, '{}'::jsonb),
  '{vale_transporte}',
  '{
    "ativo": true,
    "tipo_transporte": "onibus",
    "passagens_onibus_dia": 4,
    "valor_passagem_onibus": 5.30,
    "passagens_metro_dia": 0,
    "valor_passagem_metro": 0,
    "dias_uteis": 22,
    "percentual_desconto": 6,
    "valor_total": 466.40
  }'::jsonb
)
WHERE email_login = 'silvana@qualitec.ind.br';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Ver configuração de Vale Transporte de todos os funcionários
SELECT 
  nome_completo,
  vt_ativo,
  tipo_transporte,
  valor_total,
  valor_desconto,
  valor_liquido
FROM vw_vale_transporte_funcionarios
ORDER BY nome_completo;
