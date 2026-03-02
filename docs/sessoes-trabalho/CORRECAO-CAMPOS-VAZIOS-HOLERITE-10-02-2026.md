# Correção: Campos Vazios no Modal de Edição de Holerite

**Data:** 10/02/2026  
**Status:** ✅ Corrigido  
**Commit:** da510e0

## 🐛 Problema Identificado

Ao salvar alterações no modal de edição de holerite, ocorria erro 500:

```
ERROR Erro ao atualizar holerite: {
  code: '22P02',
  details: null,
  hint: null,
  message: 'invalid input syntax for type numeric: ""'
}
```

### Causa Raiz

Campos numéricos do formulário estavam sendo enviados como **strings vazias** (`""`) para o banco de dados PostgreSQL, que não aceita strings vazias em colunas do tipo `numeric`.

## ✅ Solução Implementada

### 1. Funções de Parse Adicionadas

Criadas duas funções auxiliares em `server/api/holerites/[id].patch.ts`:

```typescript
// Converte valores vazios em 0 para campos numéricos
const parseNumericValue = (value: any): number => {
  if (value === '' || value === null || value === undefined) return 0
  const parsed = Number(value)
  return isNaN(parsed) ? 0 : parsed
}

// Converte valores vazios em null para campos de texto
const parseStringValue = (value: any): string | null => {
  if (value === '' || value === null || value === undefined) return null
  return String(value)
}
```

### 2. Aplicação nas Atualizações

Todos os campos numéricos agora passam por `parseNumericValue`:

```typescript
if (body.salario_base !== undefined) 
  dadosParaAtualizar.salario_base = parseNumericValue(body.salario_base)

if (body.bonus !== undefined) 
  dadosParaAtualizar.bonus = parseNumericValue(body.bonus)

if (body.inss !== undefined) 
  dadosParaAtualizar.inss = parseNumericValue(body.inss)

// ... todos os outros campos numéricos
```

Campos de texto passam por `parseStringValue`:

```typescript
if (body.observacoes !== undefined) 
  dadosParaAtualizar.observacoes = parseStringValue(body.observacoes)

if (body.data_pagamento !== undefined) 
  dadosParaAtualizar.data_pagamento = parseStringValue(body.data_pagamento)
```

## 📋 Campos Tratados

### Campos Numéricos (convertidos para 0 se vazios):
- ✅ salario_base
- ✅ bonus
- ✅ horas_extras
- ✅ adicional_noturno
- ✅ adicional_periculosidade
- ✅ adicional_insalubridade
- ✅ comissoes
- ✅ inss
- ✅ irrf
- ✅ fgts
- ✅ vale_transporte
- ✅ cesta_basica_desconto
- ✅ plano_saude
- ✅ plano_odontologico
- ✅ adiantamento
- ✅ faltas
- ✅ pensao_alimenticia
- ✅ dias_trabalhados

### Campos de Texto (convertidos para null se vazios):
- ✅ observacoes
- ✅ data_pagamento

## 🧪 Como Testar

### Teste Manual:
1. Abrir modal de edição de holerite
2. Deixar campos numéricos vazios
3. Clicar em "Salvar Alterações"
4. ✅ Deve salvar sem erro 500
5. ✅ Campos vazios devem ser salvos como 0

### Teste Automatizado:
```bash
node scripts/testar-correcao-campos-vazios.js
```

## 📝 Arquivos Modificados

- ✅ `server/api/holerites/[id].patch.ts` - Adicionadas funções de parse
- ✅ `scripts/testar-correcao-campos-vazios.js` - Script de teste criado

## 🔄 Próximos Passos

1. ✅ Commit realizado
2. ⏳ Testar em ambiente local
3. ⏳ Push para GitHub
4. ⏳ Deploy na Vercel
5. ⏳ Validar em produção

## 💡 Observações

- A correção é **retrocompatível** - não quebra funcionalidades existentes
- Campos que já tinham valores continuam funcionando normalmente
- A conversão só afeta campos vazios ou undefined
- O recálculo automático de totais continua funcionando

## 🎯 Resultado Esperado

Agora é possível:
- ✅ Salvar holerites com campos vazios
- ✅ Editar apenas alguns campos sem preencher todos
- ✅ Persistir alterações corretamente no banco
- ✅ Reabrir o modal e ver as alterações salvas
