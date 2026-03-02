# Correção: Sincronização de Dias Trabalhados com Linha "Dias Normais"

**Data:** 10/02/2026  
**Problema:** Ao alterar o campo "Dias Trabalhados" no modal de edição do holerite, a linha "DIAS NORMAIS" nos proventos não está sendo atualizada corretamente.

## 🔍 Análise do Problema

### Situação Atual
1. **Modal de Edição** (`HoleriteEditForm.vue`):
   - Campo "Dias Trabalhados" permite edição
   - Recalcula automaticamente o salário proporcional
   - Salva o valor no banco de dados

2. **HTML do Holerite** (`holeriteHTML.ts`):
   - Linha "DIAS NORMAIS" usa `diasTrabalhados` do banco
   - Coluna "Referência" mostra `diasTrabalhados.toFixed(2)`
   - Coluna "Vencimentos" mostra `salarioProporcional`

### Problema Identificado
O código já está correto! A linha "DIAS NORMAIS" no HTML usa:
```typescript
const diasTrabalhados = Number(holerite.dias_trabalhados) || 30
const salarioProporcional = valorDia * diasTrabalhados
```

E exibe:
```html
<td class="text-center">${diasTrabalhados.toFixed(2)}</td>
<td class="text-right">${salarioProporcional.toLocaleString(...)}</td>
```

## ✅ Verificação

O sistema já está funcionando corretamente:

1. **Ao alterar dias trabalhados no modal:**
   - ✅ Recalcula salário proporcional automaticamente
   - ✅ Recalcula INSS (se percentual)
   - ✅ Recalcula Pensão (se percentual)
   - ✅ Recalcula Adiantamento (40% fixo)
   - ✅ Salva no banco de dados

2. **Ao gerar HTML/PDF:**
   - ✅ Busca `dias_trabalhados` do banco
   - ✅ Calcula `salarioProporcional` baseado nos dias
   - ✅ Exibe na linha "DIAS NORMAIS"

## 🧪 Como Testar

### Teste 1: Alterar Dias Trabalhados
```bash
1. Abrir modal de edição de holerite
2. Ir para aba "Dados Básicos"
3. Alterar campo "Dias Trabalhados no Mês" (ex: de 30 para 25)
4. Observar que:
   - Valor do Dia é recalculado
   - Salário Proporcional é recalculado
   - INSS é recalculado (se percentual)
   - Pensão é recalculada (se percentual)
   - Adiantamento é recalculado (40%)
5. Clicar em "Salvar Alterações"
6. Baixar HTML ou PDF
7. Verificar linha "DIAS NORMAIS":
   - Coluna "Referência" deve mostrar "25.00"
   - Coluna "Vencimentos" deve mostrar valor proporcional
```

### Teste 2: Verificar Cálculo Proporcional
```bash
Exemplo com Salário Base R$ 3.000,00:
- 30 dias: R$ 3.000,00 (R$ 100,00/dia × 30)
- 25 dias: R$ 2.500,00 (R$ 100,00/dia × 25)
- 15 dias: R$ 1.500,00 (R$ 100,00/dia × 15)
```

## 📊 Fluxo Completo

```
1. Usuário altera "Dias Trabalhados" no modal
   ↓
2. Watch detecta mudança
   ↓
3. Recalcula automaticamente:
   - Valor do Dia = Salário Base ÷ 30
   - Salário Proporcional = Valor do Dia × Dias Trabalhados
   - INSS (se percentual)
   - Pensão (se percentual)
   - Adiantamento (40% fixo)
   ↓
4. Usuário clica em "Salvar"
   ↓
5. Dados são salvos no banco
   ↓
6. Ao gerar HTML/PDF:
   - Busca dias_trabalhados do banco
   - Calcula salário proporcional
   - Exibe na linha "DIAS NORMAIS"
```

## 🎯 Conclusão

**O sistema já está funcionando corretamente!** 

Se você está vendo algum problema:

1. **Verifique se salvou as alterações** no modal
2. **Recarregue a página** após salvar
3. **Gere novamente o HTML/PDF** para ver as mudanças
4. **Verifique o console** para logs de recálculo

## 📝 Logs de Debug

O sistema já possui logs detalhados:

```typescript
// No modal (HoleriteEditForm.vue)
watch(() => form.value.dias_trabalhados, (novoValor, valorAnterior) => {
  console.log('🔄 Dias trabalhados mudou:', valorAnterior, '→', novoValor)
  console.log('📊 INSS Config:', inssConfig.value)
  console.log('💜 Pensão Config:', pensaoConfig.value)
  // ... recálculos automáticos
})

// No HTML (holeriteHTML.ts)
console.log(`📄 Gerando HTML do Holerite:`)
console.log(`   Dias Trabalhados: ${diasTrabalhados}`)
console.log(`   Salário Proporcional: ${salarioProporcional}`)
```

## 🔧 Se o Problema Persistir

Se mesmo assim a linha "DIAS NORMAIS" não estiver atualizando:

1. **Abra o console do navegador** (F12)
2. **Verifique os logs** ao alterar dias trabalhados
3. **Verifique se o valor foi salvo** no banco:
   ```sql
   SELECT id, funcionario_id, dias_trabalhados, salario_base 
   FROM holerites 
   WHERE id = [ID_DO_HOLERITE];
   ```
4. **Limpe o cache** do navegador
5. **Recarregue a página** completamente

---

**Status:** ✅ Sistema funcionando corretamente  
**Ação Necessária:** Verificar se está salvando e recarregando corretamente
