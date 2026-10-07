-- Correção pontual: setembro/2026, pagamento 07/10/2026.
-- NÃO altera INSS, IRRF, pensão, itens personalizados ou status.
-- Primeiro confira a prévia. Depois execute a transação abaixo.
-- Reexecutar não duplica descontos: só altera adiantamento ainda zero.
WITH alvos(id, adiantamento_id, valor, descontos_antes, liquido_antes) AS (
 VALUES (1578,1627,1640,380.58,3719.42),
  (1581,1628,1600,1449.61,2550.39),
  (1582,1630,1060,214.18,2435.82),
  (1583,1631,1320,284.58,3015.42),
  (1584,1632,1272,270.18,2909.82),
  (1585,1633,1144.8,233.26,2628.74),
  (1586,1634,1460,326.58,3323.42),
  (1587,1635,1100,206.25,2543.75),
  (1588,1636,1484,333.78,3376.22),
  (1589,1637,1200,248.58,2751.42)
), conferidos AS (
 SELECT h.id, a.valor, h.total_descontos, h.salario_liquido
 FROM alvos a JOIN public.holerites h ON h.id=a.id
 JOIN public.holerites ad ON ad.id=a.adiantamento_id AND ad.funcionario_id=h.funcionario_id
 WHERE h.status='gerado' AND coalesce(h.adiantamento,0)=0
 AND h.periodo_inicio=DATE '2026-09-01' AND h.data_pagamento=DATE '2026-10-07'
 AND h.observacoes LIKE 'Folha mensal%' AND h.decimo_ano IS NULL
 AND h.total_descontos=a.descontos_antes AND h.salario_liquido=a.liquido_antes
 AND h.total_proventos=h.total_descontos+h.salario_liquido
 AND h.salario_liquido>=a.valor
 AND ad.total_proventos=a.valor AND ad.observacoes LIKE 'Adiantamento%'
 AND ad.periodo_inicio=DATE '2026-09-01' AND ad.decimo_ano IS NULL
 AND coalesce(ad.status,'') NOT IN ('cancelado','estornado')
 AND (SELECT count(*) FROM public.holerites x WHERE x.funcionario_id=h.funcionario_id
      AND x.periodo_inicio BETWEEN DATE '2026-09-01' AND DATE '2026-09-30'
      AND x.observacoes ILIKE 'Adiantamento%' AND x.decimo_ano IS NULL
      AND coalesce(x.status,'') NOT IN ('cancelado','estornado'))=1
)
SELECT c.id, f.nome_completo, c.valor AS adiantamento,
 c.total_descontos AS descontos_antes, c.total_descontos+c.valor AS descontos_depois,
 c.salario_liquido AS liquido_antes, c.salario_liquido-c.valor AS liquido_depois
FROM conferidos c JOIN public.holerites h USING(id)
JOIN public.funcionarios f ON f.id=h.funcionario_id ORDER BY c.id;

BEGIN;
-- Evitar edição concorrente durante a conferência e a atualização.
LOCK TABLE public.holerites IN SHARE ROW EXCLUSIVE MODE;
WITH alvos(id, adiantamento_id, valor, descontos_antes, liquido_antes) AS (
 VALUES (1578,1627,1640,380.58,3719.42),
  (1581,1628,1600,1449.61,2550.39),
  (1582,1630,1060,214.18,2435.82),
  (1583,1631,1320,284.58,3015.42),
  (1584,1632,1272,270.18,2909.82),
  (1585,1633,1144.8,233.26,2628.74),
  (1586,1634,1460,326.58,3323.42),
  (1587,1635,1100,206.25,2543.75),
  (1588,1636,1484,333.78,3376.22),
  (1589,1637,1200,248.58,2751.42)
), conferidos AS (
 SELECT h.id, a.valor, h.total_descontos, h.salario_liquido
 FROM alvos a JOIN public.holerites h ON h.id=a.id
 JOIN public.holerites ad ON ad.id=a.adiantamento_id AND ad.funcionario_id=h.funcionario_id
 WHERE h.status='gerado' AND coalesce(h.adiantamento,0)=0
 AND h.periodo_inicio=DATE '2026-09-01' AND h.data_pagamento=DATE '2026-10-07'
 AND h.observacoes LIKE 'Folha mensal%' AND h.decimo_ano IS NULL
 AND h.total_descontos=a.descontos_antes AND h.salario_liquido=a.liquido_antes
 AND h.total_proventos=h.total_descontos+h.salario_liquido
 AND h.salario_liquido>=a.valor
 AND ad.total_proventos=a.valor AND ad.observacoes LIKE 'Adiantamento%'
 AND ad.periodo_inicio=DATE '2026-09-01' AND ad.decimo_ano IS NULL
 AND coalesce(ad.status,'') NOT IN ('cancelado','estornado')
 AND (SELECT count(*) FROM public.holerites x WHERE x.funcionario_id=h.funcionario_id
      AND x.periodo_inicio BETWEEN DATE '2026-09-01' AND DATE '2026-09-30'
      AND x.observacoes ILIKE 'Adiantamento%' AND x.decimo_ano IS NULL
      AND coalesce(x.status,'') NOT IN ('cancelado','estornado'))=1
)
UPDATE public.holerites h
SET adiantamento=c.valor,
 total_descontos=c.total_descontos+c.valor,
 salario_liquido=c.salario_liquido-c.valor
FROM conferidos c WHERE h.id=c.id
RETURNING h.id,h.funcionario_id,h.adiantamento,h.total_descontos,h.salario_liquido;
COMMIT;
