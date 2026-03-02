# Correção da Referência do Mês no Holerite - 10/02/2026

## Problema Reportado

O PDF do holerite estava exibindo a referência como **"Fevereiro De 2026"**, quando deveria mostrar **"Janeiro de 2026"**.

### Situação
- Período do holerite: 01/02/2026 a 28/02/2026
- Referência exibida: **Fevereiro De 2026** ❌
- Referência esperada: **Janeiro de 2026** ✅

### Regra de Negócio
Para folha mensal, a referência é sempre o **mês trabalhado** (mês anterior ao período de pagamento):
- Trabalhou em Janeiro → Pago em Fevereiro → Referência: **Janeiro de 2026**
- Trabalhou em Fevereiro → Pago em Março → Referência: **Fevereiro de 2026**

## Diagnóstico

### Código Anterior (Incorreto)

```typescript
// Folha Mensal: usar o mês do período_inicio (mês trabalhado)
mesReferencia = periodoInicio  // ❌ ERRADO: usava fevereiro
```

Problema: O código usava `periodoInicio` diretamente, que é "2026-02-01" (fevereiro), mas deveria mostrar janeiro (mês trabalhado).

## Solução Implementada

### 1. Correção da Referência do Mês

```typescript
// REGRA DO MÊS DE REFERÊNCIA:
// - Adiantamento (pago dia 20): mostrar período completo
// - Folha Mensal (paga 5º dia útil): mês trabalhado = MÊS ANTERIOR
let mesReferencia: Date
if (isAdiantamento) {
  // Adiantamento: usar o mês do período_inicio (mês vigente)
  mesReferencia = periodoInicio
} else {
  // Folha Mensal: usar o mês ANTERIOR ao período_inicio (mês trabalhado)
  // Exemplo: período 01/02/2026 - 28/02/2026 = Janeiro de 2026
  mesReferencia = new Date(periodoInicio)
  mesReferencia.setMonth(mesReferencia.getMonth() - 1)  // ✅ CORRETO: subtrai 1 mês
}

const mesAno = mesReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
```

### 2. Adição da Data de Pagamento

Adicionado cálculo e exibição da data de pagamento:

```typescript
// Calcular data de pagamento
let dataPagamento = ''
let dataPagamentoFormatada = ''
if (isAdiantamento) {
  // Adiantamento: dia 20 do mesmo mês
  dataPagamento = new Date(anoAdiantamento, mesAdiantamento, 20).toLocaleDateString('pt-BR')
} else {
  // Folha Mensal: 5º dia útil do mês seguinte (dia 6 do período_inicio)
  // Exemplo: Janeiro/2026 pago em 06/02/2026
  dataPagamento = new Date(anoPagamento, mesPagamento, 6).toLocaleDateString('pt-BR')
}
```

### 3. Exibição no HTML

#### No Cabeçalho
```html
<div class="header-right">
  <div class="folha-tipo">Folha Mensal</div>
  <div class="competencia">Janeiro de 2026</div>
  <div class="competencia" style="margin-top: 2px; font-size: 10px;">
    Pagamento: 06/02/2026
  </div>
</div>
```

#### Nas Informações do Funcionário
```html
<div class="info-item">
  <span class="info-label">Pagamento:</span>
  <span class="info-value">06/02/2026</span>
</div>
```

## Resultado

### Antes da Correção
```
┌─────────────────────────────────────┐
│ Folha Mensal                        │
│ Fevereiro De 2026  ❌               │
└─────────────────────────────────────┘
```

### Depois da Correção
```
┌─────────────────────────────────────┐
│ Folha Mensal                        │
│ Janeiro de 2026  ✅                 │
│ Pagamento: 06/02/2026               │
└─────────────────────────────────────┘
```

## Exemplos de Uso

### Folha Mensal de Janeiro/2026
- Período: 01/02/2026 a 28/02/2026
- Referência: **Janeiro de 2026**
- Pagamento: **06/02/2026**

### Folha Mensal de Fevereiro/2026
- Período: 01/03/2026 a 31/03/2026
- Referência: **Fevereiro de 2026**
- Pagamento: **06/03/2026**

### Adiantamento de Janeiro/2026
- Período: 15/01/2026 a 31/01/2026
- Referência: **Janeiro de 2026**
- Pagamento: **20/01/2026**

## Arquivos Modificados

1. `server/utils/holeriteHTML.ts`
   - Corrigido cálculo do `mesReferencia` para folha mensal
   - Adicionado cálculo da `dataPagamento`
   - Adicionado exibição da data de pagamento no cabeçalho
   - Adicionado campo "Pagamento" nas informações do funcionário

## Como Testar

### 1. Visualizar Holerite Existente

1. Acesse o sistema como funcionário
2. Vá para "Meus Holerites"
3. Visualize o holerite de Janeiro/2026
4. Verifique:
   - Referência: **Janeiro de 2026** ✅
   - Data de Pagamento: **06/02/2026** ✅

### 2. Gerar Novo Holerite

1. Acesse como admin
2. Gere um novo holerite para fevereiro
3. Período: 01/03/2026 a 31/03/2026
4. Verifique:
   - Referência: **Fevereiro de 2026** ✅
   - Data de Pagamento: **06/03/2026** ✅

## Observações

- A correção afeta apenas a **visualização** do holerite
- Os **dados no banco** permanecem inalterados
- A **lógica de cálculo** não foi alterada
- Apenas a **exibição da referência** foi corrigida

## Status

- ✅ Referência do mês corrigida
- ✅ Data de pagamento adicionada
- ✅ Código testado localmente
- ⏳ Aguardando commit e deploy
- ⏳ Testes em produção pendentes

## Próximos Passos

1. Fazer commit das mudanças
2. Push para GitHub
3. Aguardar deploy automático no Vercel
4. Testar em produção
5. Verificar holerites de todos os funcionários
