# Adiantamento na folha do início do mês

As dez folhas de setembro para pagamento em 07/10/2026 foram criadas em 08/09, antes dos adiantamentos registrados em 24/09. A geração ignorava documentos existentes, mantendo o desconto zerado.

Correção: nova geração, sem Recriar, confere e ajusta somente adiantamento, total de descontos e líquido dos documentos com status gerado. Preserva INSS, IRRF, pensão e itens personalizados. Não recalcula documentos liberados. Ao disponibilizar, divergências bloqueiam a operação e solicitam revisão. Consulta com erro ou adiantamento duplicado não é tratada como ausência de adiantamento.

A competência sugerida para a folha mensal agora é o mês anterior. Para o pagamento de outubro, selecionar setembro/2026. A busca considera o mês de competência, incluindo documentos antigos com início no meio do mês. Usa o bruto efetivamente registrado, sem devolver empréstimos já descontados no adiantamento. A exceção existente do funcionário 169 permanece.

## Correção dos documentos atuais

Arquivo: `database/20261006-corrigir-adiantamento-folha-setembro.sql`.

1. No SQL Editor do Supabase, execute e confira a primeira consulta, antes de BEGIN.
2. Se os dados conferirem, execute o trecho de BEGIN até COMMIT.
3. Confira os holerites na administração antes de disponibilizar.

A prévia consultada retornou dez folhas. O script não foi executado para atualização. Só altera os IDs identificados, ainda com status gerado e com os valores anteriores conferidos. Não libera perfis, não altera tributos e não duplica descontos se executado novamente. Se os valores ou status mudarem, as respectivas linhas são ignoradas e devem ser revisadas. A correção permanente no código depende de publicação.
