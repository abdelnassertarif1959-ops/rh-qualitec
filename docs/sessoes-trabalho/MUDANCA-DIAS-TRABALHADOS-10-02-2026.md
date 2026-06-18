# 📅 Mudança: Horas Trabalhadas → Dias Trabalhados
**Data:** 10/02/2026

## 🎯 Objetivo
Alterar o sistema de cálculo de holerites de **horas trabalhadas** para **dias trabalhados**, conforme solicitado pela empresa.

## 📋 Mudanças Implementadas

### 1. Campo Alterado
- ❌ **Antes:** `horas_trabalhadas` (número de horas no mês)
- ✅ **Agora:** `dias_trabalhados` (número de dias no mês)

### 2. Lógica de Cálculo

#### Valor do Dia
```
Valor do Dia = Salário Base ÷ 30 dias
```

#### Salário Proporcional
```
Salário Proporcional = Valor do Dia × Dias Trabalhados
```

#### Exemplo Prático
- **Salário Base:** R$ 3.000,00
- **Valor do Dia:** R$ 3.000,00 ÷ 30 = R$ 100,00
- **Dias Trabalhados:** 10 dias
- **Salário Proporcional:** R$ 100,00 × 10 = R$ 1.000,00

### 3. Cálculo de Proventos e Descontos

Todos os cálculos são feitos em cima do **salário proporcional**:

- **Total de Proventos** = Salário Proporcional + Bônus + Horas Extras + Adicionais + Comissões
- **INSS** = Calculado sobre o Total de Proventos
- **IRRF** = Calculado sobre (Total de Proventos - INSS)
- **Pensão Alimentícia** = Calculada sobre o Salário Líquido Base (se percentual)

### 4. Interface Atualizada

#### Aba "Dados Básicos"
```
┌─────────────────────────────────────────────┐
│ Salário Base (Mensal)    │ Dias Trabalhados │
│ R$ 3.000,00              │ 10 dias          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 💰 Valor do Dia: R$ 100,00                  │
│ 📅 Dias Trabalhados: 10 dias                │
│ 💵 Salário Proporcional: R$ 1.000,00        │
└─────────────────────────────────────────────┘
```

## 📁 Arquivos Modificados

### `app/components/holerites/HoleriteEditForm.vue`
- ✅ Substituído campo `horas_trabalhadas` por `dias_trabalhados`
- ✅ Adicionado cálculo de `valorDia` (Salário Base ÷ 30)
- ✅ Adicionado cálculo de `salarioProporcional` (Valor Dia × Dias Trabalhados)
- ✅ Atualizado `calcularTotalProventos()` para usar salário proporcional
- ✅ Removido código relacionado a jornadas de trabalho (horas semanais)
- ✅ Adicionado card informativo mostrando valor do dia e salário proporcional

## 🔄 Impacto nos Cálculos

### Antes (Horas)
```javascript
Total Proventos = Salário Base + Bônus + Extras...
```

### Agora (Dias)
```javascript
Valor Dia = Salário Base ÷ 30
Salário Proporcional = Valor Dia × Dias Trabalhados
Total Proventos = Salário Proporcional + Bônus + Extras...
```

## ✅ Validação

### Cenário 1: Mês Completo (30 dias)
- Salário Base: R$ 3.000,00
- Dias Trabalhados: 30
- Salário Proporcional: R$ 3.000,00 ✅ (igual ao salário base)

### Cenário 2: Meio Mês (15 dias)
- Salário Base: R$ 3.000,00
- Dias Trabalhados: 15
- Salário Proporcional: R$ 1.500,00 ✅ (metade do salário)

### Cenário 3: 10 Dias
- Salário Base: R$ 3.000,00
- Dias Trabalhados: 10
- Salário Proporcional: R$ 1.000,00 ✅ (1/3 do salário)

## 🎨 Melhorias na Interface

1. **Card Informativo:** Mostra claramente:
   - Valor do dia
   - Dias trabalhados
   - Salário proporcional calculado

2. **Validação:** Campo aceita de 1 a 31 dias

3. **Padrão:** Se não informado, assume 30 dias (mês completo)

## 📝 Observações

- O campo `dias_trabalhados` precisa ser adicionado à tabela `holerites` no banco de dados
- Todos os holerites existentes devem ter `dias_trabalhados = 30` por padrão
- A lógica de cálculo é mais simples e intuitiva para a empresa

## 🚀 Próximos Passos

1. ✅ Atualizar componente de edição de holerite
2. ⏳ Adicionar coluna `dias_trabalhados` na tabela `holerites`
3. ⏳ Atualizar API de criação/edição de holerites
4. ⏳ Atualizar geração de PDF para mostrar dias trabalhados
5. ⏳ Migrar dados existentes (definir 30 dias para todos)

## 📊 Commit
```bash
git add app/components/holerites/HoleriteEditForm.vue
git commit -m "feat: alterar cálculo de horas para dias trabalhados"
```
