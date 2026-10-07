-- Ajusta os holerites ainda não liberados da competência 09/2026 ao modelo informado.
-- O pagamento permanece em 07/10/2026. Os recibos separados dos adiantamentos não são alterados.
WITH correcoes (
  id, funcionario_id, dias_trabalhados, inss, base_inss, base_irrf,
  beneficios, descontos_personalizados, total_proventos, total_descontos,
  salario_liquido, observacoes
) AS (
  VALUES
    (
      1578, 129, 3, 30.75, 5330.00, 379.25,
      '[{"referencia":"931","descricao":"1/3 DAS FÉRIAS","valor":1230.00},{"referencia":"8783","descricao":"DIAS FÉRIAS","valor":3690.00}]'::jsonb,
      '[{"referencia":"937","descricao":"ADIANTAMENTO DE FÉRIAS","valor":4287.55},{"referencia":"812","descricao":"INSS FÉRIAS","valor":510.20},{"referencia":"821","descricao":"INSS DIFERENÇA FÉRIAS","valor":6.75},{"referencia":"942","descricao":"IRRF FÉRIAS","valor":122.25}]'::jsonb,
      5330.00, 4957.50, 372.50, 'Folha mensal - férias proporcionais'
    ),
    (
      1586, 93, 7, 63.87, 4582.78, 787.80,
      '[{"referencia":"931","descricao":"1/3 DAS FÉRIAS","valor":932.78},{"referencia":"8783","descricao":"DIAS FÉRIAS","valor":2798.33}]'::jsonb,
      '[{"referencia":"937","descricao":"ADIANTAMENTO DE FÉRIAS","valor":3360.99},{"referencia":"812","descricao":"INSS FÉRIAS","valor":370.12},{"referencia":"821","descricao":"INSS DIFERENÇA FÉRIAS","valor":9.10}]'::jsonb,
      4582.78, 3804.08, 778.70, 'Folha mensal - férias proporcionais'
    )
), atualizados AS (
  UPDATE holerites h
  SET periodo_inicio = DATE '2026-09-01',
      periodo_fim = DATE '2026-09-30',
      data_pagamento = DATE '2026-10-07',
      dias_trabalhados = c.dias_trabalhados,
      inss = c.inss,
      inss_referencia = '7.50',
      aliquota_inss = 7.50,
      base_inss = c.base_inss,
      irrf = 0,
      aliquota_irrf = 0,
      base_irrf = c.base_irrf,
      adiantamento = 0,
      beneficios = c.beneficios,
      descontos_personalizados = c.descontos_personalizados,
      total_proventos = c.total_proventos,
      total_descontos = c.total_descontos,
      salario_liquido = c.salario_liquido,
      observacoes = c.observacoes,
      updated_at = now()
  FROM correcoes c
  WHERE h.id = c.id
    AND h.funcionario_id = c.funcionario_id
    AND h.periodo_inicio = DATE '2026-09-01'
    AND h.periodo_fim = DATE '2026-09-30'
    AND h.status = 'gerado'
    AND h.total_proventos IN (5330.00, 4582.78)
    AND h.salario_liquido = 0
  RETURNING h.id, h.funcionario_id, h.status, h.data_pagamento,
            h.dias_trabalhados, h.total_proventos, h.total_descontos,
            h.salario_liquido, h.adiantamento
)
SELECT * FROM atualizados ORDER BY id;
