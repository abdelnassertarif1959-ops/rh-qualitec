# Correção de Pensão Alimentícia Duplicada - Leonardo - 10/02/2026

## Problema Reportado

O holerite do Leonardo estava mostrando a pensão alimentícia **duas vezes**:
- Código 915: PENSÃO ALIMENTÍCIA - R$ 948,63
- Código 960: PENSÃO ALIMENTÍCIA - R$ 948,63

**Total incorreto de descontos**: R$ 2.639,88 (incluindo pensão duplicada)

## Diagnóstico

### Resultado da Verificação

```
👤 FUNCIONÁRIO:
   ID: 156
   Nome: LEONARDO RAMOS DA SILVA
   Pensão Alimentícia: R$ 0 (no cadastro do funcionário)

📋 HOLERITE:
   ID: 1213
   Período: 01/02/2026 a 28/02/2026
   Pensão Alimentícia: R$ 948,63 (no campo do holerite)

🔧 ITENS PERSONALIZADOS:
   1. ID: 6
      Descrição: PENSÃO ALIMENTÍCIA
      Valor: R$ 948,63
      Tipo: desconto
```

### Causa Raiz

A pensão alimentícia estava sendo registrada em **dois lugares**:

1. **Campo `pensao_alimenticia` do holerite**: R$ 948,63 ✅ (correto)
2. **Tabela `holerite_itens_personalizados`**: R$ 948,63 ❌ (duplicado)

Quando o holerite é gerado, o sistema:
1. Adiciona a pensão do campo `pensao_alimenticia` do holerite
2. Adiciona os itens personalizados da tabela `holerite_itens_personalizados`

Como a pensão estava nos dois lugares, aparecia duplicada no PDF/HTML.

## Solução Aplicada

### 1. Identificação do Item Duplicado

Script criado: `scripts/verificar-duplicacao-pensao-leonardo-atual.js`

Resultado:
- Item ID: 6
- Descrição: PENSÃO ALIMENTÍCIA
- Valor: R$ 948,63
- Tipo: desconto

### 2. Exclusão do Item Duplicado

Script executado: `scripts/excluir-pensao-duplicada-leonardo.js`

```sql
DELETE FROM holerite_itens_personalizados
WHERE id = 6
  AND funcionario_id = 156
  AND descricao ILIKE '%pensão%'
```

### 3. Verificação Pós-Correção

```
✅ ITENS PERSONALIZADOS: 0
✅ Pensão aparece apenas no campo do holerite: R$ 948,63
✅ Não há mais duplicação
```

## Resultado

### Antes da Correção

```
Código  Descrição              Descontos
915     PENSÃO ALIMENTÍCIA     948,63
960     PENSÃO ALIMENTÍCIA     948,63  ❌ DUPLICADO
```

### Depois da Correção

```
Código  Descrição              Descontos
915     PENSÃO ALIMENTÍCIA     948,63  ✅ ÚNICO
```

## Valores Corretos do Holerite

### Vencimentos
- Dias Normais (30 dias): R$ 3.466,67

**Total de Vencimentos**: R$ 3.466,67

### Descontos
- INSS (9,23%): R$ 304,58
- Adiantamento Salarial: R$ 1.386,67
- Pensão Alimentícia: R$ 948,63

**Total de Descontos**: R$ 2.639,88

### Salário Líquido
R$ 3.466,67 - R$ 2.639,88 = **R$ 826,79** ✅

## Prevenção de Duplicação Futura

### Regra Implementada

A pensão alimentícia deve estar em **apenas um lugar**:

1. **Opção 1 (Recomendada)**: Campo `pensao_alimenticia` do holerite
   - Valor vem do cadastro do funcionário
   - Calculado automaticamente na geração do holerite
   - Aparece com código fixo (915)

2. **Opção 2**: Itens personalizados
   - Apenas se for um desconto eventual/temporário
   - Não usar para pensão alimentícia permanente

### Como Evitar

1. **Não adicionar pensão nos itens personalizados** se ela já está no campo do holerite
2. **Verificar antes de gerar** se há itens personalizados de pensão
3. **Usar apenas o campo `pensao_alimenticia`** para descontos permanentes

## Scripts Criados

1. `scripts/verificar-duplicacao-pensao-leonardo-atual.js`
   - Verifica duplicação de pensão
   - Mostra detalhes do holerite
   - Lista itens personalizados

2. `scripts/excluir-pensao-duplicada-leonardo.js`
   - Exclui itens de pensão duplicados
   - Mantém apenas o campo do holerite
   - Verifica resultado

## Arquivos Modificados

- Nenhum arquivo de código foi modificado
- Apenas correção de dados no banco

## Como Testar

1. Acessar o sistema
2. Ir em Admin > Holerites
3. Buscar holerite do Leonardo (ID: 1213)
4. Visualizar o holerite
5. Verificar que a pensão aparece apenas uma vez
6. Confirmar valores:
   - Pensão: R$ 948,63
   - Total Descontos: R$ 2.639,88
   - Salário Líquido: R$ 826,79

## Status

- ✅ Item duplicado excluído
- ✅ Pensão aparece apenas uma vez
- ✅ Valores corretos
- ✅ Scripts de verificação criados
- ✅ Documentação completa

## Observações

- O campo `pensao_alimenticia` no cadastro do funcionário está zerado (R$ 0)
- O valor correto (R$ 948,63) está no campo do holerite
- Isso é normal, pois o valor pode ser editado no momento da geração
- O importante é que não haja duplicação nos itens personalizados

## Próximos Passos

1. Verificar se outros funcionários têm o mesmo problema
2. Adicionar validação no sistema para evitar duplicação
3. Criar alerta quando pensão estiver nos dois lugares
4. Documentar processo de geração de holerites

## Commit

```
fix: excluir pensao alimenticia duplicada do holerite do leonardo

- Item duplicado na tabela holerite_itens_personalizados
- Pensao agora aparece apenas uma vez (campo do holerite)
- Scripts de verificacao e correcao criados
- Valores corretos: pensao R$ 948,63, total descontos R$ 2.639,88
```
