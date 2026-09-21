# Pensão — alterações para novos holerites

## Aplicado no Supabase

- Leonardo (156): tipo percentual, 40%, obrigação ativa e recorrente, conforme instrução do usuário.
- Novos registros deixam de presumir 30%: padrão das colunas de percentual alterado para zero por migração.
- Nenhum holerite foi atualizado. Os 153 registros tiveram o mesmo checksum antes e depois: `d6bef254776528950f6a8cdefc4dc59a`.

## Correções locais

- Atualização parcial da configuração preserva campos omitidos, inclusive ativação e recorrência.
- Percentual zero não vira 30%. Valores inválidos são rejeitados na API específica de configuração.
- Salvar edição de holerite não regrava automaticamente sua configuração histórica no cadastro do funcionário.
- Uma opção explícita permite aplicar a configuração aos próximos holerites. A obrigação não é desativada pelo valor calculado de um mês zerado.
- Nove testes de persistência, validação e cálculo passaram.

As alterações de código ainda dependem de publicação para afetar o sistema hospedado. A configuração de 40% já está no banco. A fórmula atualmente publicada continua em uso até a implantação da correção de cálculo.

## Confirmação recebida e cálculo implementado

O usuário confirmou 40% sobre o bruto, incluindo férias, terço e 13º, com ajuste manual pelo administrador. A regra foi gravada no cadastro de Leonardo. O gerador mensal e o cálculo de férias agora usam a base bruta; o abono pecuniário não foi incluído, pois não foi confirmado. O modo fixo do editor permite ajuste manual, sem alterar a regra futura salvo escolha explícita. Os 153 holerites preservaram o checksum anterior (desconsiderando a nova coluna vazia pensao_regras).

O projeto não possui gerador de 13º: a incidência foi cadastrada e a função de cálculo foi preparada e testada, mas não existe ainda fluxo de emissão de 13º integrado. A conciliação geral entre folha mensal e férias e as fórmulas legadas de pensão líquida/IRRF continuam fora desta alteração; não houve recálculo retroativo. A publicação das mudanças locais ainda é necessária.

## Referências oficiais consultadas

- [Receita Federal — pensão alimentícia](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/malha-fiscal/antecipacao/pensao-alimenticia): seguir os termos da decisão, acordo homologado ou escritura aplicável.
- [Solução de Consulta Cosit 354/2014](https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=33995): se o percentual é aplicado depois do IRRF e a pensão é dedutível, os dois valores são interdependentes e exigem solução conjunta.
- [Tabelas eSocial S-1.3](https://www.gov.br/esocial/pt-br/documentacao-tecnica/leiautes-esocial-versao-s-1-3-nt-07-2026/tabelas.html): a natureza 9213 contempla pensão; classificar a rubrica não determina por si só a base ou a incidência de uma ordem judicial individual.
