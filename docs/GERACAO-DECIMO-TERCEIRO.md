# Geração do 13º salário

Em Administração → Holerites → Gerar 13º, selecione o funcionário CLT, o ano e a parcela. Confira a prévia, marque a conferência e gere. Depois utilize Disponibilizar no Perfil para liberar o documento. A geração não envia mensagens automaticamente.

As tabelas implementadas são de 2026. Outros anos ficam bloqueados até atualização das tabelas.

- A primeira parcela corresponde à metade do direito proporcional informado, sem INSS/IRRF. A pensão padrão dessa parcela é zero; o administrador pode informar retenção manual justificada conforme a ordem judicial.
- A segunda calcula o direito integral, desconta o valor bruto da primeira e apura INSS/IRRF separadamente da folha mensal. A pensão automática compensa a retenção já registrada na primeira.
- Os avos sugeridos consideram admissão e pelo menos quinze dias no mês, projetados até dezembro. Afastamentos, faltas e médias variáveis precisam de conferência e ajuste pelo administrador. A remuneração de referência da primeira parcela deve observar o mês anterior; a segunda, a remuneração de dezembro.
- Para Leonardo, a regra cadastrada é 40% sobre o bruto, com incidência no 13º. A prévia permite ajuste manual com justificativa, inclusive valor zero.
- A segunda parcela exige primeira cadastrada neste fluxo. Não é permitida duplicação de funcionário/ano/parcela. Se já houve pagamento fora do sistema, confira seus valores antes de registrar a primeira.
- Valores financeiros do 13º gerado não passam pelo editor/recalculador mensal. Corrija a prévia antes de gerar. Exclusão e nova geração só devem ser usadas para documentos ainda não pagos; a primeira vinculada à segunda não pode ser excluída.

A migração `database/20260921-holerite-decimo-terceiro.sql` adiciona campos próprios, vínculo entre parcelas e índice único. Não recalcula nem substitui holerites antigos. Nenhum 13º real foi gerado durante a implementação.

## Referências consultadas

- [Lei 4.090/1962: avos e fração de quinze dias](https://www.planalto.gov.br/ccivil_03/leis/l4090.htm).
- [eSocial: orientações sobre parcelas e prazos](https://www.gov.br/esocial/pt-br/empregador-domestico/orientacoes/direitos-do-trabalhador-domestico).
- [eSocial: perguntas frequentes de empresas](https://www.gov.br/esocial/pt-br/empresas/perguntas-frequentes/perguntas-frequentes-producao-empresas-e-ambiente-de-testes).
- [Receita Federal: tabelas de 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026).
- [Lei 15.270/2025: redução do IR também para o 13º](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm).

A incidência e a forma de desconto da pensão devem seguir os termos da ordem judicial. Os 40% são a configuração informada para Leonardo, não um percentual legal universal.
