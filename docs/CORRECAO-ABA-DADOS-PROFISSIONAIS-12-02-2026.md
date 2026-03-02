# Correção: Aba "Dados Profissionais" Não Abre

**Data**: 12/02/2026  
**Status**: ✅ CORRIGIDO  
**Prioridade**: 🔴 CRÍTICA

---

## 🐛 PROBLEMA IDENTIFICADO

### Sintoma
- Usuário não conseguia acessar a aba "Dados Profissionais" no formulário de funcionários
- Erro no console: `Cannot read properties of undefined (reading 'value')`
- Erro ocorria na linha 990 do `FuncionarioForm.vue`

### Causa Raiz
O composable `useEmpresas.ts` não estava retornando o computed `obterOpcoesEmpresas`, que é usado pelo componente `FuncionarioForm.vue` para popular o select de empresas.

```typescript
// ❌ ANTES - Faltando obterOpcoesEmpresas
return {
  empresas,
  loading: readonly(loading),
  error: readonly(error),
  carregarEmpresas
}
```

### Erro no Componente
```vue
<!-- FuncionarioForm.vue linha 990 -->
const empresasOptions = computed(() => obterOpcoesEmpresas.value)
//                                     ^^^^^^^^^^^^^^^^^^^ undefined!
```

---

## ✅ SOLUÇÃO APLICADA

### 1. Adicionado Computed Faltante

**Arquivo**: `app/composables/useEmpresas.ts`

```typescript
// ✅ DEPOIS - Com obterOpcoesEmpresas
const obterOpcoesEmpresas = computed(() => {
  return empresas.value
    .filter(e => e.ativo)
    .map(e => ({
      value: e.id,
      label: e.nome_fantasia || e.nome
    }))
})

return {
  empresas,
  loading: readonly(loading),
  error: readonly(error),
  carregarEmpresas,
  obterOpcoesEmpresas  // ✅ Adicionado
}
```

### 2. Funcionalidade do Computed

O computed `obterOpcoesEmpresas`:
- Filtra apenas empresas ativas (`e.ativo === true`)
- Mapeia para formato de opções de select: `{ value, label }`
- Usa `nome_fantasia` se disponível, senão usa `nome`
- É reativo: atualiza automaticamente quando `empresas.value` muda

---

## 🧪 VALIDAÇÃO

### Checklist de Testes
- [x] Composable retorna `obterOpcoesEmpresas`
- [x] Computed retorna array de opções no formato correto
- [x] Aba "Dados Profissionais" abre sem erros
- [x] Select de empresas é populado corretamente
- [x] Outros selects (departamentos, cargos, jornadas) funcionam
- [x] Não há erros no console

### Como Testar
1. Abrir página de cadastro/edição de funcionário
2. Clicar na aba "Dados Profissionais"
3. Verificar se a aba abre sem erros
4. Verificar se todos os selects estão populados
5. Verificar console do navegador (não deve ter erros)

---

## 📊 IMPACTO

### Antes da Correção
- ❌ Aba "Dados Profissionais" não abria
- ❌ Impossível cadastrar/editar dados profissionais de funcionários
- ❌ Erro crítico bloqueando funcionalidade essencial

### Depois da Correção
- ✅ Aba "Dados Profissionais" abre normalmente
- ✅ Todos os selects funcionam corretamente
- ✅ Cadastro/edição de funcionários totalmente funcional

---

## 🔍 ANÁLISE TÉCNICA

### Por Que o Erro Ocorreu?

Durante a refatoração dos composables (dividindo arquivos grandes), o computed `obterOpcoesEmpresas` foi criado mas não foi adicionado ao `return` do composable.

### Padrão Correto para Composables

```typescript
export const useMinhaFuncionalidade = () => {
  // 1. Estados reativos
  const dados = ref([])
  const loading = ref(false)
  
  // 2. Computeds
  const opcoes = computed(() => {
    return dados.value.map(d => ({ value: d.id, label: d.nome }))
  })
  
  // 3. Funções
  const carregar = async () => { /* ... */ }
  
  // 4. SEMPRE retornar tudo que será usado externamente
  return {
    dados,
    loading,
    opcoes,    // ✅ Não esquecer de retornar computeds!
    carregar
  }
}
```

---

## 📝 LIÇÕES APRENDIDAS

1. **Sempre retornar computeds**: Computeds criados dentro do composable devem ser retornados
2. **Testes de integração**: Testar componentes que usam composables após refatorações
3. **TypeScript ajuda**: Se tivéssemos tipos mais estritos, o erro seria detectado em tempo de desenvolvimento
4. **Logs de debug**: Os logs adicionados no componente ajudaram a identificar o problema rapidamente

---

## 🔗 ARQUIVOS MODIFICADOS

- `app/composables/useEmpresas.ts` - Adicionado `obterOpcoesEmpresas` ao return

---

## ✅ STATUS FINAL

**CORREÇÃO CONCLUÍDA COM SUCESSO**

A aba "Dados Profissionais" agora funciona perfeitamente. Todos os selects são populados corretamente e não há mais erros no console.
