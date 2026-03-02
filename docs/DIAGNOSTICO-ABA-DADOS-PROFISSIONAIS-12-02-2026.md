# Diagnóstico - Aba "Dados Profissionais" Não Abre

**Data:** 12 de Fevereiro de 2026  
**Problema:** Não consegue navegar para a aba "Dados Profissionais"  
**Componente:** `FuncionarioForm.vue`

---

## 🔍 POSSÍVEIS CAUSAS

### 1. Erro de JavaScript no Componente
O componente `FuncionarioDadosProfissionais` pode estar com erro que impede a renderização.

### 2. Props Faltando
Alguma prop obrigatória não está sendo passada para o componente.

### 3. Dados Não Carregados
As opções de select (empresas, departamentos, cargos, etc.) podem não estar carregadas.

### 4. Erro no Console
Verificar se há erros no console do navegador.

---

## 🔧 DIAGNÓSTICO PASSO A PASSO

### Passo 1: Verificar Console do Navegador

Abra o DevTools (F12) e vá para a aba Console. Procure por:
- ❌ Erros em vermelho
- ⚠️ Warnings em amarelo
- 📋 Mensagens de log

**O que procurar:**
```
- Cannot read property 'X' of undefined
- X is not defined
- Failed to resolve component
- Invalid prop
```

### Passo 2: Verificar Network

Na aba Network do DevTools, verifique se as requisições estão sendo feitas:
- `/api/empresas` - Status 200?
- `/api/departamentos` - Status 200?
- `/api/cargos` - Status 200?
- `/api/jornadas` - Status 200?

### Passo 3: Verificar Props

No componente `FuncionarioForm.vue`, as seguintes props são passadas:

```vue
<FuncionarioDadosProfissionais 
  v-if="abaAtiva === 'profissionais'" 
  :form="form"
  :show-empresa-select="showEmpresaSelect"
  :empresas-options="empresasOptions"
  :departamentos-options="departamentosOptions"
  :cargos-options="cargosOptions"
  :jornada-options-computed="jornadaOptionsComputed"
  :responsavel-options="responsavelOptions"
/>
```

**Verificar se todas estão definidas:**
- `form` - Objeto com dados do funcionário
- `showEmpresaSelect` - Boolean
- `empresasOptions` - Array
- `departamentosOptions` - Array
- `cargosOptions` - Array
- `jornadaOptionsComputed` - Array
- `responsavelOptions` - Array

---

## ✅ SOLUÇÕES

### Solução 1: Adicionar Tratamento de Erro

Adicionar `v-if` para verificar se os dados estão carregados:

```vue
<FuncionarioDadosProfissionais 
  v-if="abaAtiva === 'profissionais' && form && empresasOptions.length > 0" 
  :form="form"
  :show-empresa-select="showEmpresaSelect"
  :empresas-options="empresasOptions"
  :departamentos-options="departamentosOptions"
  :cargos-options="cargosOptions"
  :jornada-options-computed="jornadaOptionsComputed"
  :responsavel-options="responsavelOptions"
/>

<!-- Loading State -->
<div v-else-if="abaAtiva === 'profissionais'" class="p-8 text-center">
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
  <p class="text-sm text-gray-500 mt-3">Carregando dados profissionais...</p>
</div>
```

### Solução 2: Adicionar Valores Padrão

No `FuncionarioForm.vue`, garantir que todas as props tenham valores padrão:

```typescript
const empresasOptions = ref([])
const departamentosOptions = ref([])
const cargosOptions = ref([])
const jornadaOptionsComputed = ref([])
const responsavelOptions = ref([])
```

### Solução 3: Adicionar Try-Catch

Envolver o componente em um `<Suspense>` ou adicionar tratamento de erro:

```vue
<template>
  <div class="space-y-6">
    <!-- ... abas ... -->
    
    <div class="min-h-[400px]">
      <ErrorBoundary>
        <FuncionarioDadosProfissionais 
          v-if="abaAtiva === 'profissionais'" 
          :form="form"
          :show-empresa-select="showEmpresaSelect"
          :empresas-options="empresasOptions"
          :departamentos-options="departamentosOptions"
          :cargos-options="cargosOptions"
          :jornada-options-computed="jornadaOptionsComputed"
          :responsavel-options="responsavelOptions"
        />
        
        <template #error="{ error }">
          <div class="p-8 text-center">
            <div class="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Erro ao carregar dados profissionais
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              {{ error.message }}
            </p>
            <button 
              @click="recarregarDados"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        </template>
      </ErrorBoundary>
    </div>
  </div>
</template>
```

---

## 🧪 TESTE RÁPIDO

### Teste 1: Verificar se a Aba Está Ativa

Adicione um `console.log` no clique da aba:

```vue
<button
  v-for="tab in tabs"
  :key="tab.id"
  @click="() => {
    console.log('Clicou na aba:', tab.id)
    abaAtiva = tab.id
    console.log('Aba ativa agora:', abaAtiva)
  }"
>
  {{ tab.icon }} {{ tab.label }}
</button>
```

### Teste 2: Verificar se o Componente Está Sendo Renderizado

Adicione um `console.log` no componente `FuncionarioDadosProfissionais`:

```vue
<script setup>
// ... props ...

console.log('🔍 FuncionarioDadosProfissionais montado')
console.log('Props recebidas:', {
  form: props.form,
  empresasOptions: props.empresasOptions?.length,
  departamentosOptions: props.departamentosOptions?.length,
  cargosOptions: props.cargosOptions?.length
})
</script>
```

### Teste 3: Verificar Dados no DevTools

No Vue DevTools:
1. Selecionar o componente `FuncionarioForm`
2. Ver o valor de `abaAtiva`
3. Ver os valores de todas as props
4. Verificar se há erros

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Console do navegador sem erros?
- [ ] Network mostra requisições com status 200?
- [ ] `abaAtiva` muda para 'profissionais' ao clicar?
- [ ] `empresasOptions` tem dados?
- [ ] `departamentosOptions` tem dados?
- [ ] `cargosOptions` tem dados?
- [ ] `jornadaOptionsComputed` tem dados?
- [ ] `responsavelOptions` tem dados?
- [ ] Componente `FuncionarioDadosProfissionais` existe?
- [ ] Todas as props estão sendo passadas?

---

## 🎯 PRÓXIMOS PASSOS

1. **Abrir DevTools (F12)**
2. **Ir para aba Console**
3. **Clicar na aba "Dados Profissionais"**
4. **Verificar se aparece algum erro**
5. **Copiar e colar o erro aqui**

Com o erro específico, posso fornecer uma solução precisa.

---

## 💡 DICA RÁPIDA

Se você ver um erro como:
```
Cannot read property 'length' of undefined
```

Significa que alguma das arrays de opções não está definida. A solução é adicionar valores padrão:

```typescript
const empresasOptions = ref([])
const departamentosOptions = ref([])
const cargosOptions = ref([])
```

---

**Responsável:** Kiro AI  
**Data:** 12 de Fevereiro de 2026  
**Status:** Aguardando informações do console
