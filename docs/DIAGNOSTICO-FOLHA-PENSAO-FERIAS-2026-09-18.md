# Diagnóstico da folha: Leonardo, pensão e férias

Data: 18/09/2026. Escopo: leitura do código local, consultas de leitura ao Supabase configurado no projeto e conferência de fontes oficiais. Nenhum registro financeiro foi alterado. As consultas iniciais usaram a API do próprio projeto. Após a instalação pelo usuário, o acesso MCP do Supabase foi confirmado e usado para conferir registros, colunas e gatilhos. O código implantado não foi comparado com o código local.

## 1. Resultado principal

Há defeitos reais na seleção de descontos, integração das férias e cálculo tributário. A hipótese inicial de pensão ausente em todas as folhas não se confirmou: ela consta nas folhas recentes consultadas. A ausência comprovada é de itens personalizados na folha de agosto. O mês específico relatado pelo usuário ainda precisa ser confirmado.

## 2. Leonardo — evidências do banco

Funcionário 156, salário base R$ 4.000,00. Configuração atual: pensão ativa e recorrente, tipo fixo, R$ 1.104,16; percentual também armazenado: 30%. A existência desse percentual não prova que a decisão judicial determine 30%.

| Competência | Holerite | Pensão | Tipo registrado | Líquido |
|---|---:|---:|---|---:|
| Agosto/2026 | 1624 | R$ 1.104,16 | Fixo | R$ 988,35 |
| Setembro/2026 | 1581 | R$ 1.093,03 | Percentual de 30% | R$ 2.550,39 |

A configuração atual difere da fotografia gravada em setembro. Isso requer conciliação histórica: não prova isoladamente cálculo incorreto nem autoriza substituir valores antigos pela configuração atual.

Dois itens cadastrados não aparecem nos descontos personalizados de agosto:

- Item 39: faltas, R$ 400,00; recorrente; vigência de 12/08 a 04/09/2026.
- Item 40: atrasos/saídas antecipadas, R$ 109,09; único; vigência em 01/08/2026.

A folha 1624 foi criada em 08/09/2026 e editada em seguida. A seleção em server/api/holerites/[id].patch.ts:105–115 usa created_at como data de vigência: ambos os itens são excluídos. A reprodução desse filtro retornou nenhum item; o cruzamento de vigência com agosto retornou os itens 39 e 40. Isso demonstra um mecanismo compatível com o desaparecimento observado, embora não substitua um histórico de auditoria da operação.

O gerador (server/api/holerites/gerar.post.ts:414) usa outro critério: seleciona apenas recorrentes, sem filtrar ativo e vigência. Portanto, pode ignorar descontos únicos e incluir descontos vencidos. Criar, editar e visualizar não compartilham a mesma regra.

Não se deve simplesmente cobrar R$ 509,09 adicionais: primeiro confirmar a competência pretendida, a legitimidade das faltas e eventual desconto já efetuado. Faltas de três dias cadastradas como recorrentes também precisam ser revistas para não repetir a cobrança em setembro.

Não há registro de férias do Leonardo na tabela funcionario_ferias consultada.

## 3. Pensão: problemas de persistência e cálculo

- O gerador depende de funcionarios.pensao_config_ativa. Configurar apenas um holerite não garante aplicação futura.
- O formulário só salva a configuração permanente se recorrente estiver marcado (HoleriteEditForm.vue:1220). Além disso, define a obrigação como ativa a partir do valor calculado naquele mês (:1225). Um mês zerado pode desativar uma obrigação ainda vigente.
- Existem padrões de 30% usados quando o percentual é zero/ausente. Não há percentual legal universal de pensão.
- O gerador mensal e o cálculo de férias aplicam o percentual antes de subtrair IRRF, apesar de a tela descrever líquido após INSS e IRRF. Se essa for a base judicial, a relação entre IRRF e pensão precisa ser resolvida conjuntamente.
- Férias recebem automaticamente a mesma configuração de pensão, sem parâmetros próprios de incidência. Uma pensão fixa pode ser repetida indevidamente no recibo e na folha se não houver conciliação por competência.

Base jurídica: o desconto em folha observa a ordem judicial e seus termos (CPC, art. 529). A dedução tributária depende de obrigação formalmente amparada; a Receita orienta seguir exatamente a decisão/acordo. Consultar o ofício ou dispositivo da decisão para definir valor, base, incidência em férias/terço/13º e tratamento de afastamentos.

Fontes: [CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm), [Receita — pensão alimentícia](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/malha-fiscal/antecipacao/pensao-alimenticia), [Solução de Consulta Cosit 354/2014](https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=33995).

## 4. Férias: falta integração com a folha mensal

Caso confirmado: funcionário 149, férias 20, de 06/08 a 04/09/2026. Recibo 1565: bruto R$ 4.400,00, líquido R$ 3.982,50. As folhas mensais 1618 (agosto) e 1583 (setembro) mantêm 30 dias e salário integral de R$ 3.300,00, sem rubricas de compensação de férias. É risco de pagamento duplicado; os registros consultados não comprovam transferências bancárias.

O gerador mensal não consulta funcionario_ferias nem distribui férias pelos meses de gozo. É preciso separar salário dos dias trabalhados, férias e terço por competência, adiantamento já pago e compensação das retenções, evitando cobrar tributos/pensão duas vezes.

O eSocial orienta informar, em cada mês de gozo, as rubricas de férias e terço, desconto do adiantamento e devolução da provisão de INSS correspondentes à competência. A CLT, arts. 142 e 145, trata da remuneração e do pagamento até dois dias antes do início. O endpoint de recibo usa a data inicial como alternativa quando falta data de pagamento, incompatível com esse prazo como padrão.

Outro defeito: editar um recibo pela API genérica recalcula proventos como salário comum e substitui beneficios pelo array de itens personalizados ([id].patch.ts:161), podendo destruir beneficios.ferias, onde estão o terço e os valores do recibo.

Fontes: [CLT](https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm), [eSocial — orientações de férias por competência](https://www.gov.br/esocial/pt-br/empresas/perguntas-frequentes/historico-de-perguntas-frequentes).

## 5. IRRF e INSS

A tabela IRRF de 2026 está incorreta tanto nos valores padrão do código quanto em config_irrf_faixas no banco. Limites intermediários cadastrados: 3.051,00 / 4.052,00 / 5.050,00; oficiais: 2.826,65 / 3.751,05 / 4.664,68. A dedução da última faixa está em R$ 896,00, mas é R$ 908,73.

O redutor de 2026 é aplicado sobre a base após deduções; a Receita exige considerar os rendimentos tributáveis para determinar esse redutor. Também falta comparar as deduções legais com o desconto simplificado mensal quando aplicável.

Reprodução executada com a função real calcularIRRF: no exemplo oficial de rendimento de R$ 6.000,00 e contribuição de R$ 649,60 (base R$ 5.350,40), o código retorna R$ 309,12, enquanto o exemplo oficial resulta em R$ 382,88. Diferença: R$ 73,76 a menor. Esse é um exemplo de validação, não um cálculo da folha de Leonardo.

No INSS, a folha mensal usa percentual direto ou valor fixo, apesar de existir função progressiva no projeto. Para base integral de R$ 4.000,00 e sem particularidades, a função progressiva retorna R$ 368,60. Os registros recentes de Leonardo mostram valores diferentes; a causa e as bases efetivas precisam ser conciliadas antes de corrigir retenções passadas.

Fontes: [Receita — tabela 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026), [Receita — exemplos da Lei 15.270/2025](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/exemplos-de-aplicacao-da-lei-15-270-2025), [INSS — tabela de contribuição](https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal).

## 6. Ordem de correção e validação

1. Definir uma regra única de competência e destinação dos itens (mensal/adiantamento), registrar aplicação de item único e impedir duplicação. Preservar o histórico de folhas já pagas.
2. Separar configuração judicial vigente da pensão e valor calculado por recibo; remover o percentual presumido e impedir desativação por mês zerado.
3. Unificar cálculos de INSS, IRRF e pensão entre servidor, edição e impressão; atualizar tabela do banco com migração versionada por vigência.
4. Integrar férias por competência e preservar seus dados na edição. Tratar recibo e folha como documentos distintos que se conciliam.
5. Preservar zero dias: usos de valor || 30 transformam zero em 30. Não esconder divergências limitando silenciosamente total_descontos aos proventos.
6. Simular agosto/setembro de Leonardo e as férias 06/08–04/09 antes de qualquer atualização financeira. Validar férias entre meses, desconto único, item vencido/inativo, mês zerado, pensão fixa e percentual com IRRF, e equivalência entre tela/documento/banco.

## 7. Pendências para fechar a correção financeira

Confirmar o mês e documento em que o usuário vê o erro; obter os termos da pensão; confirmar os pagamentos efetivamente realizados e a destinação dos itens 39/40; identificar a convenção coletiva aplicável. A investigação acima identifica defeitos técnicos concretos, mas não define unilateralmente novos descontos no salário.

## 8. Confirmação adicional pelo MCP Supabase

A conexão foi confirmada nesta sessão. Os holerites 1581 e 1624 mantêm pensão preenchida e descontos_personalizados vazio. Os totais são colunas numéricas comuns, não colunas geradas. O único gatilho de holerites atualiza updated_at; não recalcula descontos. Na tabela de itens personalizados, o gatilho existente também atualiza apenas a data de modificação. Não foi encontrado gatilho em funcionario_ferias. Portanto, não existe nesses gatilhos uma sincronização automática que compense as falhas de integração observadas no código. Todas as consultas foram de leitura.
