# Sistema de Dias Trabalhados

**Data:** 10/02/2026  
**Status:** ✅ Implementado

## 📋 Resumo

O sistema foi alterado para trabalhar com **dias trabalhados** ao invés de horas trabalhadas. Esta mudança reflete melhor a realidade operacional da empresa.

## 🎯 Mudança Principal

### Antes
- Campo: `horas_trabalhadas`
- Cálculo: Baseado em horas mensais

### Depois
- Campo: `dias_trabalhados`
- Cálculo: Baseado em dias do mês (padrão: 30 dias)

## 💰 Lógica de Cálculo

### Valor do Dia
```
Valor do Dia = Salário Base ÷ 30 dias
```

### Salário Proporcional
```
Salário Proporcional = Valor do Dia × Dias Trabalhados
```

### Exemplo Prático
- **Salário Base:** R$ 3.000,00
- **Valor do Dia:** R$ 3.000,00 ÷ 30 = R$ 100,00
- **Dias Trabalhados:** 10 dias
- **Salário Proporcional:** R$ 100,00 × 10 = R$ 1.000,00

## 📊 Impacto nos Cálculos

Todos os cálculos de proventos e descontos são baseados no **salário proporcional**:

### Proventos
- Salário Base Proporcional (calculado automaticamente)
- Bônus
- Horas Extras
- Adicionais (noturno, periculosidade, insalubridade)
- Comissões

### Descontos
Os descontos são calculados sobre o **salário bruto proporcional**:
- INSS (pode ser fixo ou percentual)
- IRRF
- Vale Transporte
- Cesta Básica
- Planos de Saúde e Odontológico
- Adiantamento
- Faltas
- Pensão Alimentícia (pode ser fixa ou percentual do líquido)

## 🔧 Arquivos Alterados

### Frontend
1. **app/components/holerites/HoleriteEditForm.vue**
   - Substituído campo `horas_trabalhadas` por `dias_trabalhados`
   - Adicionadas funções `calcularValorDia()` e `calcularSalarioProporcional()`
   - Interface mostra valor do dia, dias trabalhados e salário proporcional

2. **app/pages/holerites.vue**
   - Atualizado mapeamento de dados: `dias_trabalhados` (padrão: 30)

3. **app/pages/admin/holerites.vue**
   - Atualizada interface TypeScript: `dias_trabalhados?: number`

### Backend
4. **server/api/holerites/[id].patch.ts**
   - Substituído `horas_trabalhadas` por `dias_trabalhados` na API de atualização

### Banco de Dados
5. **database/39-adicionar-dias-trabalhados-holerites.sql**
   - Migration para adicionar coluna `dias_trabalhados` (padrão: 30)
   - Atualização de registros existentes

## 📱 Interface do Usuário

### Tela de Edição de Holerite

```
┌─────────────────────────────────────────────────┐
│ Salário Base (Mensal)    Dias Trabalhados       │
│ R$ 3.000,00              10 dias                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 💰 Valor do Dia: R$ 100,00                      │
│ 📅 Dias Trabalhados: 10 dias                    │
│ 💵 Salário Proporcional: R$ 1.000,00            │
│                                                  │
│ 💡 Cálculo: Valor do dia = Salário Base ÷ 30    │
│            Salário Proporcional = Valor × Dias  │
└─────────────────────────────────────────────────┘
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: holerites

```sql
ALTER TABLE holerites 
ADD COLUMN dias_trabalhados INTEGER DEFAULT 30;

COMMENT ON COLUMN holerites.dias_trabalhados IS 
'Número de dias trabalhados no mês (padrão: 30 dias). 
Usado para calcular salário proporcional: (Salário Base / 30) × Dias Trabalhados';
```

## 🚀 Como Usar

### 1. Executar Migration
```bash
# No Supabase SQL Editor, execute:
database/39-adicionar-dias-trabalhados-holerites.sql
```

### 2. Editar Holerite
1. Acesse a página de holerites
2. Clique em "Editar" no holerite desejado
3. Na aba "Dados Básicos":
   - Informe o **Salário Base** (valor mensal completo)
   - Informe os **Dias Trabalhados** (1 a 31)
4. O sistema calcula automaticamente:
   - Valor do dia
   - Salário proporcional
   - Todos os proventos e descontos

### 3. Casos de Uso

#### Funcionário trabalhou o mês completo
- Dias Trabalhados: **30**
- Salário Proporcional = Salário Base

#### Funcionário trabalhou 10 dias
- Dias Trabalhados: **10**
- Salário Proporcional = (Salário Base ÷ 30) × 10

#### Funcionário trabalhou 15 dias
- Dias Trabalhados: **15**
- Salário Proporcional = (Salário Base ÷ 30) × 15

## ⚠️ Observações Importantes

1. **Padrão de 30 dias:** O sistema sempre divide o salário base por 30 dias, independente do mês ter 28, 29, 30 ou 31 dias. Esta é a prática padrão no Brasil.

2. **Descontos Proporcionais:** Todos os descontos (INSS, IRRF, etc.) são calculados sobre o salário proporcional, não sobre o salário base completo.

3. **Compatibilidade:** Registros antigos com `horas_trabalhadas` continuam funcionando. A coluna antiga pode ser removida após migração completa.

4. **Validação:** O campo aceita valores de 1 a 31 dias.

## 📝 Exemplo Completo

### Cenário
- **Funcionário:** João Silva
- **Salário Base:** R$ 3.000,00
- **Dias Trabalhados:** 10 dias
- **INSS:** 7,5% (percentual)
- **IRRF:** R$ 0,00
- **Pensão Alimentícia:** 30% do líquido

### Cálculos
1. **Valor do Dia:** R$ 3.000,00 ÷ 30 = R$ 100,00
2. **Salário Proporcional:** R$ 100,00 × 10 = R$ 1.000,00
3. **INSS (7,5%):** R$ 1.000,00 × 7,5% = R$ 75,00
4. **Salário Líquido Base:** R$ 1.000,00 - R$ 75,00 = R$ 925,00
5. **Pensão (30%):** R$ 925,00 × 30% = R$ 277,50
6. **Salário Líquido Final:** R$ 925,00 - R$ 277,50 = R$ 647,50

## 🔄 Commits Relacionados

- `feat: substituir horas_trabalhadas por dias_trabalhados no sistema de holerites`
- Arquivos alterados: 5 arquivos (frontend, backend, database)

## 📚 Documentos Relacionados

- `database/39-adicionar-dias-trabalhados-holerites.sql` - Migration SQL
- `docs/COMO-GERAR-HOLERITES.md` - Guia de geração de holerites
- `docs/PRD-SISTEMA-RH-QUALITEC-ATUALIZADO-2026.md` - Especificação completa
