# Adicionar Adiantamento de 40% nos Holerites Mensais
**Data:** 10/02/2026  
**Situação:** Holerites mensais gerados sem desconto de adiantamento

## 🎯 Objetivo

Adicionar o desconto de 40% de adiantamento salarial nos holerites mensais que foram gerados apenas com desconto de INSS.

## 📋 Situação Atual

- Holerites mensais foram gerados com:
  - ✅ Salário bruto
  - ✅ Desconto de INSS
  - ❌ SEM desconto de adiantamento (40%)

## 🔧 Solução

### Passo 1: Verificar Holerites Atuais

```bash
node scripts/verificar-holerites-mensais-antes.js
```

Este script mostra:
- Todos os holerites mensais
- Valores atuais (salário bruto, descontos, líquido)
- Valores que serão aplicados (adiantamento 40%, novos totais)

### Passo 2: Adicionar Adiantamento

```bash
node scripts/adicionar-adiantamento-holerites-mensais.js
```

Este script:
1. Busca todos os holerites com `tipo_folha = 'mensal'`
2. Para cada holerite:
   - Calcula 40% do salário bruto como adiantamento
   - Recalcula o total de descontos (INSS + IRRF + VT + Pensão + Adiantamento)
   - Recalcula o salário líquido (Bruto - Total Descontos)
   - Atualiza o registro no banco

### Passo 3: Verificar Resultado

Execute novamente o script de verificação para confirmar:

```bash
node scripts/verificar-holerites-mensais-antes.js
```

## 📊 Cálculos Aplicados

### Fórmula do Adiantamento
```
Adiantamento = Salário Bruto × 0.40 (40%)
```

### Fórmula do Total de Descontos
```
Total Descontos = INSS + IRRF + Vale Transporte + Pensão Alimentícia + Adiantamento
```

### Fórmula do Salário Líquido
```
Salário Líquido = Salário Bruto - Total Descontos
```

## 📝 Exemplo de Cálculo

**Funcionário com salário bruto de R$ 3.000,00:**

### Antes:
- Salário Bruto: R$ 3.000,00
- INSS: R$ 281,62
- Adiantamento: R$ 0,00
- Total Descontos: R$ 281,62
- Salário Líquido: R$ 2.718,38

### Depois:
- Salário Bruto: R$ 3.000,00
- INSS: R$ 281,62
- Adiantamento: R$ 1.200,00 (40%)
- Total Descontos: R$ 1.481,62
- Salário Líquido: R$ 1.518,38

## ⚠️ Observações Importantes

1. **Tipo de Folha**: O script atualiza apenas holerites com `tipo_folha = 'mensal'`
2. **Adiantamentos**: Holerites de adiantamento não são afetados
3. **Recálculo Automático**: Todos os valores são recalculados automaticamente
4. **Backup**: Os valores anteriores são sobrescritos, mas o `updated_at` é atualizado

## 🔍 Campos Atualizados

```sql
UPDATE holerites SET
  adiantamento_salarial = [40% do salário bruto],
  total_descontos = [soma de todos os descontos],
  salario_liquido = [bruto - descontos],
  updated_at = [timestamp atual]
WHERE tipo_folha = 'mensal'
```

## ✅ Validação

Após executar o script, verifique:

1. ✅ Adiantamento = 40% do salário bruto
2. ✅ Total descontos inclui o adiantamento
3. ✅ Salário líquido está correto
4. ✅ Todos os holerites mensais foram atualizados

## 📂 Arquivos Criados

- `scripts/verificar-holerites-mensais-antes.js` - Verificação antes/depois
- `scripts/adicionar-adiantamento-holerites-mensais.js` - Atualização em massa
- `ADICIONAR-ADIANTAMENTO-HOLERITES-MENSAIS-10-02-2026.md` - Esta documentação

## 🚀 Execução Rápida

```bash
# 1. Verificar situação atual
node scripts/verificar-holerites-mensais-antes.js

# 2. Adicionar adiantamento
node scripts/adicionar-adiantamento-holerites-mensais.js

# 3. Verificar resultado
node scripts/verificar-holerites-mensais-antes.js
```

---

**Status:** ✅ Scripts criados e prontos para execução  
**Próximo Passo:** Executar verificação e atualização
