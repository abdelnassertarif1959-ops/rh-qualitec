# ⭐ Admin como Responsável Sugerida

## 📋 Implementação

Sistema que sugere automaticamente a **Silvana (Admin)** como responsável ao criar:
- Departamentos
- Cargos  
- Funcionários

## 🎯 Onde Aparece

### 1. Cadastro de Departamentos (`/admin/departamentos`)

Ao criar um novo departamento:
- Campo **"Responsável"** vem pré-preenchido com: `Silvana Qualitec (Admin) ⭐`
- Aparece em destaque no topo da lista de opções
- Pode ser alterado se necessário

### 2. Cadastro de Funcionários (`/admin/funcionarios`)

Na aba **"Dados Profissionais"**:
- Novo campo: **"Responsável Direto"**
- Sugestão padrão: `Silvana Qualitec (Admin) ⭐`
- Dica visual explicando que é quem supervisiona o funcionário

### 3. Cadastro de Cargos (`/admin/cargos`)

Ao criar um novo cargo:
- Campo **"Cargo Superior (Reporta a)"** pode ter a admin como opção
- Útil para definir hierarquia organizacional

## 🔧 Como Funciona

### Composable `useAdmin`

```typescript
// app/composables/useAdmin.ts
export const useAdmin = () => {
  const adminInfo = ref<any>(null)
  
  const buscarAdmin = async () => {
    // Busca dados da admin do banco
    const { data } = await useFetch('/api/admin/info')
    adminInfo.value = data.value?.data
  }
  
  const nomeAdmin = computed(() => {
    return adminInfo.value?.nome || 'Silvana Qualitec'
  })
  
  return { nomeAdmin, buscarAdmin }
}
```

### API Backend

```typescript
// server/api/admin/info.get.ts
export default defineEventHandler(async (event) => {
  // Busca funcionário com tipo 'admin'
  const admins = await fetch(
    `${supabaseUrl}/rest/v1/funcionarios?tipo=eq.admin&limit=1`
  )
  
  return { success: true, data: admins[0] }
})
```

## 📊 Estrutura Visual

### Departamentos
```
┌─────────────────────────────────────┐
│ Novo Departamento                   │
├─────────────────────────────────────┤
│ Nome: [________________]            │
│ Descrição: [________________]       │
│ Responsável:                        │
│ ┌─────────────────────────────────┐ │
│ │ Silvana Qualitec (Admin) ⭐     │ │ ← PRÉ-SELECIONADO
│ └─────────────────────────────────┘ │
│                                     │
│ [Cancelar]  [💾 Salvar]            │
└─────────────────────────────────────┘
```

### Funcionários
```
┌─────────────────────────────────────┐
│ 💼 Dados Profissionais              │
├─────────────────────────────────────┤
│ Empresa: [________________]         │
│ Departamento: [________________]    │
│ Cargo: [________________]           │
│ Responsável Direto:                 │
│ ┌─────────────────────────────────┐ │
│ │ Silvana Qualitec (Admin) ⭐     │ │ ← SUGESTÃO
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Dica: O responsável direto é    │
│    quem supervisiona este           │
│    funcionário. Por padrão,         │
│    sugerimos Silvana Qualitec       │
│    como responsável.                │
└─────────────────────────────────────┘
```

## ✅ Benefícios

1. **Agilidade**: Não precisa digitar o nome toda vez
2. **Consistência**: Garante que a admin seja sempre a mesma pessoa
3. **Hierarquia Clara**: Define estrutura organizacional desde o início
4. **Flexibilidade**: Pode ser alterado se necessário

## 🔄 Fluxo de Dados

```
┌──────────────┐
│  Frontend    │
│  (Vue)       │
└──────┬───────┘
       │ 1. Monta componente
       │ 2. Chama buscarAdmin()
       ▼
┌──────────────┐
│  Composable  │
│  useAdmin    │
└──────┬───────┘
       │ 3. Faz requisição
       ▼
┌──────────────┐
│  API         │
│  /admin/info │
└──────┬───────┘
       │ 4. Consulta banco
       ▼
┌──────────────┐
│  Supabase    │
│  funcionarios│
│  tipo=admin  │
└──────┬───────┘
       │ 5. Retorna dados
       ▼
┌──────────────┐
│  Frontend    │
│  Exibe nome  │
│  com ⭐      │
└──────────────┘
```

## 🧪 Testando

### 1. Testar Departamentos
1. Acesse `/admin/departamentos`
2. Clique em "Novo Departamento"
3. Verifique se o campo "Responsável" já vem com "Silvana Qualitec (Admin) ⭐"

### 2. Testar Funcionários
1. Acesse `/admin/funcionarios`
2. Clique em "Novo Funcionário"
3. Vá na aba "Dados Profissionais"
4. Verifique o campo "Responsável Direto"
5. Deve mostrar a dica com o nome da admin

### 3. Verificar API
```bash
# Testar endpoint
curl http://localhost:3000/api/admin/info
```

Deve retornar:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "nome": "Silvana Qualitec",
    "email": "silvana@qualitec.com.br"
  }
}
```

## 📝 Arquivos Criados/Modificados

### Criados
- ✅ `app/composables/useAdmin.ts` - Composable para buscar admin
- ✅ `server/api/admin/info.get.ts` - API para retornar dados da admin
- ✅ `docs/ADMIN-COMO-RESPONSAVEL.md` - Esta documentação

### Modificados
- ✅ `app/pages/admin/departamentos.vue` - Adicionada sugestão da admin
- ✅ `app/components/funcionarios/FuncionarioForm.vue` - Adicionado campo "Responsável Direto"

## 🎨 Personalização

Para mudar o ícone ou texto:

```typescript
// Em qualquer componente
const responsavelOptions = computed(() => [
  { 
    value: nomeAdmin.value, 
    label: `${nomeAdmin.value} (Admin) ⭐` // ← Mudar aqui
  }
])
```

Opções de ícones:
- ⭐ (estrela)
- 👑 (coroa)
- 🏆 (troféu)
- 💼 (maleta)
- 🎯 (alvo)

## 🚀 Próximos Passos

1. **Buscar todos os gestores**: Além da admin, listar outros gerentes
2. **Hierarquia visual**: Mostrar organograma da empresa
3. **Notificações**: Avisar responsável quando novo funcionário é adicionado
4. **Relatórios**: Quantos funcionários cada responsável supervisiona

## ⚠️ Observações

- Se a admin não estiver cadastrada no banco, usa "Silvana Qualitec" como padrão
- O campo é opcional - pode ficar vazio se necessário
- Funciona mesmo sem conexão com o banco (fallback)

---

**Status:** ✅ Implementado  
**Data:** 14/01/2026  
**Testado:** Aguardando testes
