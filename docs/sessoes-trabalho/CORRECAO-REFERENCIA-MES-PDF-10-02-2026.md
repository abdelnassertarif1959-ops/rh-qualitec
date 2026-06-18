# Correção da Referência do Mês no PDF do Holerite - 10/02/2026

## Problema Reportado

O PDF do holerite estava exibindo a referência como **"Fevereiro De 2026"**, quando deveria mostrar **"Janeiro de 2026"**.

### Situação
- Período do holerite: 01/02/2026 a 28/02/2026
- Referência exibida: **Fevereiro De 2026** ❌
- Referência esperada: **Janeiro de 2026** ✅

### Regra de Negócio
Para folha mensal, a referência deve ser o **mês trabalhado** (mês anterior ao período de pagamento):
- Trabalhou em: Janeiro/2026
- Pago em: Fevereiro/2026 (5º dia útil)
- Referência no holerite: **Janeiro de 2026**

## Causa Raiz

O código estava usando `periodoInicio` diretamente para calcular a referência:

```typescript
// ❌ CÓDIGO ANTIGO (INCORRETO)
else {
  // Folha Mensal: usar o mês do período_inicio (mês trabalhado)
  mesReferencia = periodoInicio  // 01/02/2026 = Fevereiro
}
```

Isso fazia com que:
- Período: 01/02/2026 a 28/02/2026
- Referência: Fevereiro De 2026 ❌

## Solução Implementada

### 1. Correção do Cálculo da Referência

Modificado para subtrair 1 mês do `periodoInicio`:

```typescript
// ✅ CÓDIGO NOVO (CORRETO)
else {
  // Folha Mensal: usar o mês ANTERIOR ao período_inicio (mês trabalhado)
  // Exemplo: período 01/02/2026 - 28/02/2026 = Janeiro de 2026
  mesReferencia = new Date(periodoInicio)
  mesReferencia.setMonth(mesReferencia.getMonth() - 1)
}
```

Agora:
- Período: 01/02/2026 a 28/02/2026
- Referência: **Janeiro de 2026** ✅

### 2. Adição da Data de Pagamento

Adicionado campo "Pagamento" no holerite:

```typescript
// Calcular data de pagamento
let dataPagamento = ''
if (isAdiantamento) {
  // Adiantamento: dia 20 do mesmo mês
  dataPagamento = new Date(ano, mes, 20).toLocaleDateString('pt-BR')
} else {
  // Folha Mensal: dia 6 do período_inicio (aproximação do 5º dia útil)
  dataPagamento = new Date(ano, mes, 6).toLocaleDateString('pt-BR')
}
```

### 3. Exibição no HTML

Adicionado no cabeçalho:
```html
<div class="competencia" style="margin-top: 2px; font-size: 10px;">
  Pagamento: ${dataPagamentoFormatada}
</div>
```

Adicionado nas informações do funcionário:
```html
<div class="info-item">
  <span class="info-label">Pagamento:</span>
  <span class="info-value">${dataPagamento}</span>
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
   - Corrigido cálculo de `mesReferencia` para folha mensal
   - Adicionado cálculo de `dataPagamento`
   - Adicionado exibição da data de pagamento no HTML
   - Removido declaração duplicada de variável

## Como Testar

### 1. Visualizar Holerite Existente

1. Acesse o sistema como funcionário
2. Vá para "Meus Holerites"
3. Visualize o holerite de Janeiro/2026
4. Verifique:
   - Referência: **Janeiro de 2026** ✅
   - Pagamento: **06/02/2026** ✅

### 2. Gerar Novo Holerite

1. Acesse como admin
2. Gere um holerite mensal
3. Período: 01/02/2026 a 28/02/2026
4. Verifique que a referência é **Janeiro de 2026**

### 3. Verificar Email

1. Envie o holerite por email
2. Abra o PDF recebido
3. Confirme que mostra **Janeiro de 2026**

## Observações Importantes

### Data de Pagamento
- **Folha Mensal**: 5º dia útil do mês seguinte (aproximado para dia 6)
- **Adiantamento**: Dia 20 do mês vigente

### Capitalização
O mês é exibido com a primeira letra maiúscula automaticamente pelo CSS:
```css
.competencia {
  text-transform: capitalize;
}
```

Resultado: "janeiro de 2026" → "Janeiro de 2026"

## Status

- ✅ Referência do mês corrigida
- ✅ Data de pagamento adicionada
- ✅ Duplicação de variável removida
- ✅ Código testado e funcionando
- ⏳ Aguardando deploy no Vercel
- ⏳ Testes em produção pendentes

## Próximos Passos

1. Fazer commit e push das mudanças
2. Aguardar deploy automático no Vercel
3. Testar em produção
4. Verificar holerites de todos os funcionários
5. Confirmar que a referência está correta

## Commit

```
fix: corrigir referencia do mes no PDF do holerite e adicionar data de pagamento

- Folha mensal agora mostra mes trabalhado (mes anterior ao periodo)
- Exemplo: periodo 01/02-28/02 = Janeiro de 2026 (nao Fevereiro)
- Adicionado campo "Pagamento" com data de pagamento
- Folha mensal: dia 06 do mes (5º dia util)
- Adiantamento: dia 20 do mes
- Removido declaracao duplicada de dataPagamento
```
