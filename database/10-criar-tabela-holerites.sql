-- Criar tabela de holerites
CREATE TABLE IF NOT EXISTS holerites (
  id SERIAL PRIMARY KEY,
  funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  
  -- Período
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  data_pagamento DATE,
  
  -- Proventos
  salario_base DECIMAL(10,2) NOT NULL DEFAULT 0,
  bonus DECIMAL(10,2) DEFAULT 0,
  horas_extras DECIMAL(10,2) DEFAULT 0,
  adicional_noturno DECIMAL(10,2) DEFAULT 0,
  adicional_periculosidade DECIMAL(10,2) DEFAULT 0,
  adicional_insalubridade DECIMAL(10,2) DEFAULT 0,
  comissoes DECIMAL(10,2) DEFAULT 0,
  
  -- Descontos
  inss DECIMAL(10,2) DEFAULT 0,
  base_inss DECIMAL(10,2),
  aliquota_inss DECIMAL(5,2),
  
  irrf DECIMAL(10,2) DEFAULT 0,
  base_irrf DECIMAL(10,2),
  aliquota_irrf DECIMAL(5,2),
  
  vale_transporte DECIMAL(10,2) DEFAULT 0,
  vale_refeicao_desconto DECIMAL(10,2) DEFAULT 0,
  plano_saude DECIMAL(10,2) DEFAULT 0,
  plano_odontologico DECIMAL(10,2) DEFAULT 0,
  adiantamento DECIMAL(10,2) DEFAULT 0,
  faltas DECIMAL(10,2) DEFAULT 0,
  outros_descontos DECIMAL(10,2) DEFAULT 0,
  
  -- Totais
  total_proventos DECIMAL(10,2) GENERATED ALWAYS AS (
    salario_base + 
    COALESCE(bonus, 0) + 
    COALESCE(horas_extras, 0) + 
    COALESCE(adicional_noturno, 0) + 
    COALESCE(adicional_periculosidade, 0) + 
    COALESCE(adicional_insalubridade, 0) + 
    COALESCE(comissoes, 0)
  ) STORED,
  
  total_descontos DECIMAL(10,2) GENERATED ALWAYS AS (
    COALESCE(inss, 0) + 
    COALESCE(irrf, 0) + 
    COALESCE(vale_transporte, 0) + 
    COALESCE(vale_refeicao_desconto, 0) + 
    COALESCE(plano_saude, 0) + 
    COALESCE(plano_odontologico, 0) + 
    COALESCE(adiantamento, 0) + 
    COALESCE(faltas, 0) + 
    COALESCE(outros_descontos, 0)
  ) STORED,
  
  salario_liquido DECIMAL(10,2) GENERATED ALWAYS AS (
    salario_base + 
    COALESCE(bonus, 0) + 
    COALESCE(horas_extras, 0) + 
    COALESCE(adicional_noturno, 0) + 
    COALESCE(adicional_periculosidade, 0) + 
    COALESCE(adicional_insalubridade, 0) + 
    COALESCE(comissoes, 0) -
    COALESCE(inss, 0) - 
    COALESCE(irrf, 0) - 
    COALESCE(vale_transporte, 0) - 
    COALESCE(vale_refeicao_desconto, 0) - 
    COALESCE(plano_saude, 0) - 
    COALESCE(plano_odontologico, 0) - 
    COALESCE(adiantamento, 0) - 
    COALESCE(faltas, 0) - 
    COALESCE(outros_descontos, 0)
  ) STORED,
  
  -- Controle
  status VARCHAR(20) DEFAULT 'gerado' CHECK (status IN ('gerado', 'enviado', 'visualizado')),
  horas_trabalhadas INTEGER,
  observacoes TEXT,
  
  -- Timestamps
  enviado_em TIMESTAMP,
  visualizado_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_holerites_funcionario ON holerites(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_holerites_periodo ON holerites(periodo_inicio, periodo_fim);
CREATE INDEX IF NOT EXISTS idx_holerites_status ON holerites(status);

-- Comentários
COMMENT ON TABLE holerites IS 'Tabela de holerites/contracheques dos funcionários';
COMMENT ON COLUMN holerites.funcionario_id IS 'Referência ao funcionário';
COMMENT ON COLUMN holerites.periodo_inicio IS 'Data de início do período de referência';
COMMENT ON COLUMN holerites.periodo_fim IS 'Data de fim do período de referência';
COMMENT ON COLUMN holerites.data_pagamento IS 'Data prevista para pagamento';
COMMENT ON COLUMN holerites.status IS 'Status do holerite: gerado, enviado, visualizado';
COMMENT ON COLUMN holerites.salario_liquido IS 'Valor líquido a receber (calculado automaticamente)';

-- RLS (Row Level Security)
ALTER TABLE holerites ENABLE ROW LEVEL SECURITY;

-- Política: Funcionários podem ver apenas seus próprios holerites
CREATE POLICY "Funcionários podem ver seus holerites"
  ON holerites
  FOR SELECT
  USING (
    funcionario_id = auth.uid()::integer
  );

-- Política: Admins podem ver todos os holerites
CREATE POLICY "Admins podem ver todos os holerites"
  ON holerites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE funcionarios.id = auth.uid()::integer
      AND funcionarios.tipo_usuario = 'admin'
    )
  );

-- Política: Admins podem inserir holerites
CREATE POLICY "Admins podem inserir holerites"
  ON holerites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE funcionarios.id = auth.uid()::integer
      AND funcionarios.tipo_usuario = 'admin'
    )
  );

-- Política: Admins podem atualizar holerites
CREATE POLICY "Admins podem atualizar holerites"
  ON holerites
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE funcionarios.id = auth.uid()::integer
      AND funcionarios.tipo_usuario = 'admin'
    )
  );

-- Política: Admins podem deletar holerites
CREATE POLICY "Admins podem deletar holerites"
  ON holerites
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE funcionarios.id = auth.uid()::integer
      AND funcionarios.tipo_usuario = 'admin'
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_holerites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_holerites_updated_at
  BEFORE UPDATE ON holerites
  FOR EACH ROW
  EXECUTE FUNCTION update_holerites_updated_at();
