-- Adicionar coluna de dependentes na tabela funcionarios
-- Cada dependente deduz R$ 189,59 da base de cálculo do IRRF

ALTER TABLE funcionarios
  ADD COLUMN IF NOT EXISTS numero_dependentes INTEGER DEFAULT 0;

-- Adicionar comentário
COMMENT ON COLUMN funcionarios.numero_dependentes IS 'Número de dependentes para dedução do IRRF (R$ 189,59 por dependente)';

-- Atualizar funcionários existentes para 0 dependentes se NULL
UPDATE funcionarios
SET numero_dependentes = 0
WHERE numero_dependentes IS NULL;
