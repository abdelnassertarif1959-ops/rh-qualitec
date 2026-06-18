# Correção: Duplicação de Pensão ao Editar Holerite
**Data:** 10/02/2026  
**Status:** ✅ CORRIGIDO

## 🎯 Problema Identificado

Toda vez que o usuário editava um holerite, a pensão alimentícia era duplicada através da criação automática de itens personalizados.

### Comportamento Incorreto
1. Usuário abre modal de edição do holerite
2. Usuário altera qualquer campo (ex: dias trabalhados)
3. Usuário clica em "Salvar"
4. Sistema cria automaticamente um item personalizado de pensão
5. Pensão fica duplicada: campo do holerite + item personalizado

### Causa Raiz
No arquivo `app/components/holerites/HoleriteEditForm.vue`, a função `salvar()` tinha código que criava automaticamente um item personalizado quando `pensaoConfig.value.recorrente` era `true`:

```javascript
// CÓDIGO PROBLEMÁTICO (REMOVIDO)
if (pensaoConfig.value.recorrente && form.value.pensao_alimenticia > 0) {
  const itemExistente = itensPersonalizados.value.find(
    item => item.descricao.toUpperCase().includes('PENSÃO') && item.vigencia_tipo === 'recorrente'
  )
  
  if (!itemExistente) {
    await $fetch('/api/holerites/itens-personalizados', {
      method: 'POST',
      body: {
        funcionario_id: funcId,
        tipo: 'desconto',
        descricao: 'PENSÃO ALIMENTÍCIA',
        valor: Number(form.value.pensao_alimenticia),
        vigencia_tipo: 'recorrente',
        // ...
      }
    })
  }
}
```

### Por que a verificação falhava?
A verificação `if (!itemExistente)` não funcionava corretamente porque:
1. A lista `itensPersonalizados.value` podia estar desatualizada
2. O item podia ter sido criado em uma edição anterior mas não carregado
3. A busca por descrição com `.includes('PENSÃO')` era imprecisa

## ✅ Solução Aplicada

### 1. Removido Código de Criação Automática
Removido completamente o código que criava itens personalizados automaticamente na função `salvar()`:

```javascript
// CÓDIGO CORRIGIDO
const salvar = async () => {
  // IMPORTANTE: NÃO criar item personalizado de pensão automaticamente
  // A pensão alimentícia deve ser gerenciada APENAS pelo campo pensao_alimenticia do holerite
  // Itens personalizados devem ser criados manualmente pelo usuário na aba "Itens Personalizados"
  // Isso evita duplicação de pensão no holerite
  
  // Sanitizar todos os valores numéricos antes de enviar
  const dadosSanitizados = {
    // ... campos do holerite
    pensao_alimenticia: sanitizarValorNumerico(form.value.pensao_alimenticia),
    pensao_tipo: pensaoConfig.value.tipo,
    pensao_percentual: sanitizarValorNumerico(pensaoConfig.value.percentual),
    pensao_recorrente: pensaoConfig.value.recorrente
  }
  
  emit('save', dadosSanitizados)
}
```

### 2. Script de Limpeza
Criado script `scripts/limpar-pensao-duplicada-todos.js` para remover todos os itens personalizados de pensão existentes:

```javascript
// Busca TODOS os itens personalizados de pensão
const { data: itens } = await supabase
  .from('holerite_itens_personalizados')
  .select('*')
  .ilike('descricao', '%pensão%')

// Exclui todos os itens encontrados
await supabase
  .from('holerite_itens_personalizados')
  .delete()
  .in('id', idsParaExcluir)
```

## 📊 Arquitetura Correta

### Como Deve Funcionar

1. **Pensão Alimentícia no Holerite**
   - Campo: `pensao_alimenticia` (valor em R$)
   - Configuração: `pensao_tipo` (fixo ou percentual)
   - Configuração: `pensao_percentual` (% do líquido)
   - Configuração: `pensao_recorrente` (apenas flag informativa)

2. **Itens Personalizados**
   - Devem ser usados APENAS para benefícios/descontos não previstos
   - Exemplos: bônus especial, desconto de uniforme, etc.
   - NÃO devem ser usados para pensão alimentícia

3. **Fluxo de Edição**
   ```
   Usuário edita holerite
   ↓
   Altera campo de pensão na aba "Descontos"
   ↓
   Clica em "Salvar"
   ↓
   Sistema salva apenas o campo pensao_alimenticia
   ↓
   NÃO cria item personalizado
   ↓
   Pensão aparece corretamente no holerite (sem duplicação)
   ```

## 🎓 Regras de Negócio

### Pensão Alimentícia
- ✅ Usar campo específico `pensao_alimenticia` do holerite
- ✅ Configurar tipo (fixo ou percentual) na aba "Descontos"
- ✅ Sistema calcula automaticamente se percentual
- ❌ NÃO criar item personalizado de pensão
- ❌ NÃO usar flag `recorrente` para criar itens automáticos

### Itens Personalizados
- ✅ Criar manualmente na aba "Itens Personalizados"
- ✅ Usar para benefícios/descontos não previstos
- ✅ Definir vigência (único ou recorrente)
- ❌ NÃO criar itens de pensão alimentícia

## 📝 Arquivos Modificados

1. `app/components/holerites/HoleriteEditForm.vue`
   - Removido código de criação automática de itens
   - Adicionados comentários explicativos

2. `scripts/limpar-pensao-duplicada-todos.js`
   - Script para limpar itens duplicados
   - Busca e remove todos os itens de pensão

3. `CORRECAO-DUPLICACAO-PENSAO-MODAL-10-02-2026.md`
   - Este documento de correção

## ✅ Testes Realizados

### Teste 1: Edição de Holerite
1. ✅ Abrir modal de edição do holerite do Leonardo
2. ✅ Alterar dias trabalhados de 30 para 25
3. ✅ Clicar em "Salvar"
4. ✅ Verificar que NÃO foi criado item personalizado
5. ✅ Pensão permanece apenas no campo do holerite

### Teste 2: Limpeza de Itens Duplicados
1. ✅ Executar script `limpar-pensao-duplicada-todos.js`
2. ✅ Verificar que todos os itens de pensão foram removidos
3. ✅ Confirmar que pensão permanece no campo do holerite

### Teste 3: Múltiplas Edições
1. ✅ Editar holerite 3 vezes seguidas
2. ✅ Verificar que pensão NÃO duplica
3. ✅ Confirmar que apenas 1 valor de pensão existe

## 🚀 Como Usar Corretamente

### Para Configurar Pensão Alimentícia

1. Abra o modal de edição do holerite
2. Vá na aba "Descontos"
3. Localize a seção "Pensão Alimentícia"
4. Configure:
   - **Tipo de Cálculo:** Fixo ou Percentual
   - **Valor/Percentual:** Digite o valor ou %
   - **Recorrência:** Apenas informativo (não cria itens)
5. Clique em "Salvar"

### Para Adicionar Desconto Personalizado

1. Abra o modal de edição do holerite
2. Vá na aba "Itens Personalizados"
3. Clique em "Adicionar Novo Item"
4. Preencha:
   - Tipo: Desconto
   - Descrição: Ex: "Desconto de Uniforme"
   - Valor: R$ 50,00
   - Vigência: Único ou Recorrente
5. Clique em "Adicionar"

## 📋 Checklist de Validação

- [x] Código de criação automática removido
- [x] Comentários explicativos adicionados
- [x] Script de limpeza criado
- [x] Itens duplicados removidos do banco
- [x] Testes de edição realizados
- [x] Documentação criada
- [x] Commit e push para GitHub

---

**Correção aplicada com sucesso! ✅**

A pensão alimentícia agora é gerenciada corretamente apenas pelo campo do holerite, sem duplicação.
