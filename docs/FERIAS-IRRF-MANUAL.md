# IRRF manual nas férias

No cadastro/edição de férias, o administrador pode preencher **Descontos — IRRF manual (R$)**. Para o valor informado para Maciel, digite **135,83**. O desconto substitui o IRRF automático apenas naquele período, sem exigir percentual.

- Vazio: cálculo automático existente.
- `0,00`: substituição explícita por zero.
- Valor positivo: descontado uma única vez, preservando INSS e pensão.
- A edição mantém o valor e a geração do recibo reaplica a escolha armazenada.
- Após emitir recibo, a alteração dessa opção é bloqueada para não deixar recibo e cadastro com valores diferentes.
- Valores negativos, inválidos, mais de duas casas decimais ou que tornem o líquido negativo são recusados.

A migração `20260925-ferias-irrf-manual.sql` foi aplicada no Supabase e apenas acrescenta a opção, inicialmente nula. Nenhum período de férias de Maciel ou de outro funcionário foi lançado ou recalculado durante a implementação. As regras do cálculo automático não foram alteradas.

Validação: quatro testes de valores e cinco testes dos fluxos de cadastro, permissão, edição e emissão, com banco isolado. A opção na tela depende da publicação da aplicação.
