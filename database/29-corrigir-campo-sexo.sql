-- Correção do campo sexo para usar apenas M, F, O
-- Este script corrige dados existentes que possam estar no formato antigo

-- Atualizar valores de sexo para o formato correto
UPDATE funcionarios 
SET sexo = CASE 
  WHEN LOWER(sexo) = 'masculino' OR LOWER(sexo) = 'm' THEN 'M'
  WHEN LOWER(sexo) = 'feminino' OR LOWER(sexo) = 'f' THEN 'F'
  WHEN LOWER(sexo) = 'outro' OR LOWER(sexo) = 'o' OR LOWER(sexo) = 'nao_informar' THEN 'O'
  ELSE sexo
END
WHERE sexo IS NOT NULL 
  AND sexo NOT IN ('M', 'F', 'O');

-- Verificar se há registros que ainda precisam de correção
SELECT id, nome_completo, sexo 
FROM funcionarios 
WHERE sexo IS NOT NULL 
  AND sexo NOT IN ('M', 'F', 'O');

-- Se houver registros, eles serão mostrados acima para correção manual