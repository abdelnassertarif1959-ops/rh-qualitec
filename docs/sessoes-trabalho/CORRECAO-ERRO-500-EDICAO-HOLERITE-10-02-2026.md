# Correção: Erro 500 ao Salvar Edição de Holerite

**Data:** 10/02/2026  
**Status:** ✅ Corrigido

## 🐛 Problema

Ao tentar salvar alterações no modal de edição de holerite, ocorria erro 500:

```
ERROR Erro ao atualizar holerite: { 
  code: '22P02',
  message: 'invalid input syntax for type numeric: ""' 
}
```

### Causa Raiz

Campos numéricos do formulário estavam sendo enviados como **strings vazias** (`""`) em vez de valores numéricos válidos (`0` ou `null`). O PostgreSQL não aceita strings vazias em colunas do tipo `numeric`.

## ✅ Solução Implementada

### 1. Sanitização no Frontend

Adicionada função `sanitizarValorNumerico` no componente `HoleriteEditForm.vue` que:
- Converte strings vazias (`""`) em `0`
- Converte `null` e `undefined` em `0`
- Valida se o valor é um número válido
- Retorna `0` se o valor for `NaN`

```typescript
const sanitizarValorNumerico = (valor: any): number => {
  if (valor === '' || valor === null || valor === undefined) return 0
  const parsed = Number(valor)
  return isNaN(parsed) ? 0 : parsed
}
```

### 2. Aplicação na Função `salvar()`

Todos os campos numéricos são sanitizados antes de enviar para a API:

```typescript
const dadosSanitizados = {
  salario_base: sanitizarValorNumerico(form.value.salario_base),
  dias_trabalhados: sanitizarValorNumerico(form.value.dias_trabalhados),
  bonus: sanitizarValorNumerico(form.value.bonus),
  horas_extras: sanitizarValorNumerico(form.value.horas_extras),
  // ... todos os campos numéricos
}

emit('save', dadosSanitizados)
```

### 3. Proteção Dupla

A API já tinha a função `parseNumericValue` implementada, mas agora temos **proteção dupla**:
1. **Frontend:** Sanitiza antes de enviar
2. **Backend:** Valida e converte novamente na API

## 📁 Arquivos Modificados

- `app/components/holerites/HoleriteEditForm.vue`
  - Adicionada função `sanitizarValorNumerico`
  - Modificada função `salvar()` para sanitizar todos os campos numéricos

## 🧪 Como Testar

1. Abrir modal de edição de qualquer holerite
2. Deixar campos numéricos vazios ou com valores
3. Clicar em "Salvar Alterações"
4. ✅ Deve salvar sem erro 500
5. ✅ Valores vazios devem ser salvos como `0`
6. ✅ Valores preenchidos devem ser salvos corretamente

## 📊 Campos Sanitizados

Todos os campos numéricos do holerite:

**Dados Básicos:**
- `salario_base`
- `dias_trabalhados`

**Proventos:**
- `bonus`
- `horas_extras`
- `adicional_noturno`
- `adicional_periculosidade`
- `adicional_insalubridade`
- `comissoes`

**Descontos:**
- `inss`
- `irrf`
- `fgts`
- `vale_transporte`
- `vale_refeicao_desconto`
- `plano_saude`
- `plano_odontologico`
- `adiantamento`
- `faltas`
- `pensao_alimenticia`

## 🎯 Resultado

- ✅ Erro 500 eliminado
- ✅ Formulário salva corretamente com campos vazios
- ✅ Formulário salva corretamente com campos preenchidos
- ✅ Recálculo automático continua funcionando
- ✅ Validação dupla (frontend + backend)

## 📝 Observações

- A sanitização é feita **apenas no momento do salvamento**
- Os campos do formulário continuam aceitando entrada vazia durante a edição
- A conversão para `0` acontece apenas ao enviar para a API
- Campos de texto (`observacoes`, `data_pagamento`) são tratados separadamente (podem ser `null`)
