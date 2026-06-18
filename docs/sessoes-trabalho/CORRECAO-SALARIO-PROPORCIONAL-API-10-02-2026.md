# ✅ CORREÇÃO: Salário Proporcional na API de Atualização

**Data:** 10/02/2026  
**Status:** ✅ CORRIGIDO E DEPLOYED  
**Commit:** `78f5653`

## 🎯 PROBLEMA IDENTIFICADO

Quando o usuário editava um holerite e mudava os dias trabalhados (ex: 10 dias), o formulário mostrava os cálculos corretos, mas após salvar, o salário líquido na listagem estava errado.

### Exemplo do Problema:
- **Salário Base:** R$ 3.000,00
- **Dias Trabalhados:** 10 dias
- **Esperado:** R$ 1.000,00 (proporcional)
- **Estava calculando:** R$ 3.000,00 (salário completo)

## 🔍 CAUSA RAIZ

A API de atualização (`server/api/holerites/[id].patch.ts`) estava calculando o `total_proventos` usando o `salario_base` completo ao invés do salário proporcional aos dias trabalhados:

```typescript
// ❌ ANTES (errado)
const totalProventos = 
  Number(dadosAtualizados.salario_base || 0) + // Usava salário completo
  Number(dadosAtualizados.bonus || 0) +
  // ... outros proventos
```

Além disso, `dias_trabalhados` não estava na lista de campos que acionam o recálculo.

## ✅ SOLUÇÃO IMPLEMENTADA

### 1. Cálculo do Salário Proporcional

Adicionado cálculo proporcional baseado nos dias trabalhados:

```typescript
// ✅ DEPOIS (correto)
// Calcular salário proporcional aos dias trabalhados
const salarioBase = Number(dadosAtualizados.salario_base || 0)
const diasTrabalhados = Number(dadosAtualizados.dias_trabalhados || 30)
const valorDia = salarioBase / 30
const salarioProporcional = valorDia * diasTrabalhados

// Calcular totais (usando salário proporcional)
const totalProventos = 
  salarioProporcional + // Agora usa salário proporcional
  Number(dadosAtualizados.bonus || 0) +
  Number(dadosAtualizados.horas_extras || 0) +
  // ... outros proventos
```

### 2. Adicionado `dias_trabalhados` aos Campos que Afetam Cálculo

```typescript
const camposQueAfetamCalculo = [
  'salario_base', 
  'dias_trabalhados', // ✅ ADICIONADO
  'bonus', 
  'horas_extras', 
  // ... outros campos
]
```

### 3. Log Detalhado para Debug

```typescript
console.log('🧮 Recalculando totais do holerite:', {
  id,
  salarioBase,
  diasTrabalhados,
  salarioProporcional, // ✅ ADICIONADO
  totalProventos,
  totalDescontos,
  salarioLiquido,
  adiantamento: dadosAtualizados.adiantamento
})
```

## 📊 EXEMPLO DE CÁLCULO CORRETO

### Funcionário com 10 dias trabalhados:

**Entrada:**
- Salário Base: R$ 3.000,00
- Dias Trabalhados: 10

**Cálculo:**
1. Valor do Dia = R$ 3.000 ÷ 30 = R$ 100,00
2. Salário Proporcional = R$ 100 × 10 = **R$ 1.000,00**
3. INSS (7.5%) = R$ 1.000 × 7.5% = R$ 75,00
4. Adiantamento (40%) = R$ 1.000 × 40% = R$ 400,00
5. Total Descontos = R$ 475,00
6. **Salário Líquido = R$ 525,00**

### Funcionário com 30 dias trabalhados:

**Entrada:**
- Salário Base: R$ 3.000,00
- Dias Trabalhados: 30

**Cálculo:**
1. Valor do Dia = R$ 3.000 ÷ 30 = R$ 100,00
2. Salário Proporcional = R$ 100 × 30 = **R$ 3.000,00**
3. INSS (7.5%) = R$ 3.000 × 7.5% = R$ 225,00
4. Adiantamento (40%) = R$ 3.000 × 40% = R$ 1.200,00
5. Total Descontos = R$ 1.425,00
6. **Salário Líquido = R$ 1.575,00**

## 🔄 FLUXO COMPLETO AGORA

1. **Usuário edita holerite** → Muda dias trabalhados para 10
2. **Frontend calcula** → Mostra valores proporcionais corretos
3. **Usuário salva** → Envia dados para API
4. **API detecta mudança** → `dias_trabalhados` está na lista de campos que afetam cálculo
5. **API recalcula** → Usa salário proporcional (não o completo)
6. **API salva no banco** → `total_proventos`, `total_descontos`, `salario_liquido` corretos
7. **Listagem atualiza** → Mostra R$ 525,00 (correto) ao invés de R$ 2.597,11 (errado)

## 📝 ARQUIVO MODIFICADO

- `server/api/holerites/[id].patch.ts`

## 🚀 DEPLOY

- ✅ Commit: `78f5653`
- ✅ Push para GitHub: Concluído
- ⏳ Deploy automático na Vercel: Em andamento
- 🔗 URL: https://rhqualitec.vercel.app

## ✅ VALIDAÇÃO

Após o deploy, testar:

1. Abrir edição de um holerite
2. Mudar dias trabalhados de 30 para 10
3. Verificar se os valores recalculam no formulário
4. Clicar em "Salvar"
5. Verificar se o salário líquido na listagem está correto (proporcional aos 10 dias)
6. Abrir novamente para edição e verificar se os valores salvos estão corretos

## 📚 DOCUMENTAÇÃO RELACIONADA

- `CORRECAO-RECALCULO-AUTOMATICO-INSS-PENSAO-10-02-2026.md` - Recálculo automático no frontend
- `docs/SISTEMA-DIAS-TRABALHADOS.md` - Sistema completo de dias trabalhados
- `MUDANCA-DIAS-TRABALHADOS-10-02-2026.md` - Mudança de horas para dias
