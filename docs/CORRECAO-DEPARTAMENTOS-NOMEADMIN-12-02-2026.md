# Correção - Erro ao Adicionar Novo Departamento

**Data:** 12/02/2026  
**Status:** ✅ RESOLVIDO

---

## 🔍 Problema Identificado

Ao clicar no botão "Novo Departamento", o sistema apresentava erro:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'value')
at Proxy.abrirModal (departamentos.vue:143:57)
```

### Causa Raiz

O composable `useAdmin` não exportava a propriedade `nomeAdmin`, apenas `adminInfo`. A página de departamentos tentava acessar `nomeAdmin.value` que não existia.

**Código problemático:**
```typescript
// useAdmin.ts - ANTES
return {
  adminInfo: readonly(adminInfo),
  loading: readonly(loading),
  buscarAdmin
}

// departamentos.vue - tentava usar
const { nomeAdmin, buscarAdmin } = useAdmin()
// nomeAdmin era undefined!
```

---

## ✅ Solução Aplicada

### 1. Adicionar computed `nomeAdmin` ao composable `useAdmin`

**Antes:**
```typescript
return {
  adminInfo: readonly(adminInfo),
  loading: readonly(loading),
  buscarAdmin
}
```

**Depois:**
```typescript
// Computed para nome da admin
const nomeAdmin = computed(() => {
  return adminInfo.value?.nome_completo || 'Admin'
})

// Computed para email da admin
const emailAdmin = computed(() => {
  return adminInfo.value?.email_login || ''
})

return {
  adminInfo: readonly(adminInfo),
  nomeAdmin,
  emailAdmin,
  loading: readonly(loading),
  buscarAdmin
}
```

### 2. Adicionar proteção contra undefined na página

**Antes:**
```typescript
const abrirModal = (dept?: any) => {
  editando.value = dept || null
  form.value = dept 
    ? { nome: dept.nome, descricao: dept.descricao, responsavel: dept.responsavel } 
    : { nome: '', descricao: '', responsavel: nomeAdmin.value }
  modalAberto.value = true
}
```

**Depois:**
```typescript
const abrirModal = (dept?: any) => {
  editando.value = dept || null
  form.value = dept 
    ? { nome: dept.nome, descricao: dept.descricao, responsavel: dept.responsavel } 
    : { nome: '', descricao: '', responsavel: nomeAdmin.value || '' }
  modalAberto.value = true
}
```

### 3. Proteger computed `responsaveisOptions`

**Antes:**
```typescript
const responsaveisOptions = computed(() => [
  { value: nomeAdmin.value, label: `${nomeAdmin.value} (Admin) ⭐` },
  // Outros responsáveis serão carregados da API
])
```

**Depois:**
```typescript
const responsaveisOptions = computed(() => {
  const options = []
  
  if (nomeAdmin.value) {
    options.push({ value: nomeAdmin.value, label: `${nomeAdmin.value} (Admin) ⭐` })
  }
  
  // Outros responsáveis serão carregados da API
  return options
})
```

---

## 🎯 Resultado

- ✅ Botão "Novo Departamento" funciona corretamente
- ✅ Modal abre sem erros
- ✅ Campo "Responsável" é preenchido automaticamente com nome da admin
- ✅ Proteções contra valores undefined adicionadas
- ✅ Composable `useAdmin` agora exporta `nomeAdmin` e `emailAdmin`

---

## 📝 Arquivos Modificados

1. **`app/composables/useAdmin.ts`** ⭐
   - Adicionado computed `nomeAdmin`
   - Adicionado computed `emailAdmin`
   - Exportados no return

2. **`app/pages/admin/departamentos.vue`**
   - Adicionada proteção `|| ''` em `abrirModal`
   - Refatorado `responsaveisOptions` com verificação

---

## ✅ Validação

Para validar a correção:

1. ✅ Acesse a página de departamentos
2. ✅ Clique em "Novo Departamento"
3. ✅ Verifique se o modal abre sem erros
4. ✅ Verifique se o campo "Responsável" está preenchido
5. ✅ Preencha os campos e salve
6. ✅ Verifique se não há erros no console

---

## 📚 Notas Técnicas

### Padrão Aplicado

O composable `useAdmin` agora segue o mesmo padrão de outros composables:
- Exporta dados brutos (`adminInfo`)
- Exporta computed helpers (`nomeAdmin`, `emailAdmin`)
- Exporta funções de ação (`buscarAdmin`)

### Benefícios

1. **Reutilização**: Outros componentes podem usar `nomeAdmin` diretamente
2. **Consistência**: Mesmo padrão usado em `useEmpresas`, `useDepartamentos`, etc.
3. **Segurança**: Valores padrão evitam erros de undefined
4. **Manutenibilidade**: Lógica centralizada no composable

### Componentes que Usam useAdmin

- ✅ `app/pages/admin/departamentos.vue` (corrigido)
- ✅ `app/components/funcionarios/FuncionarioForm.vue` (já tinha computed próprio)

---

## 🔄 Melhorias Futuras (Opcional)

1. Adicionar mais computed helpers ao `useAdmin`:
   - `idAdmin`
   - `tipoAcessoAdmin`
   - `avatarAdmin`

2. Adicionar função para atualizar dados da admin

3. Adicionar cache para evitar múltiplas chamadas à API

---

## ✅ Conclusão

Erro corrigido com sucesso. O composable `useAdmin` agora está completo e consistente com os demais composables do sistema. A página de departamentos funciona perfeitamente.
