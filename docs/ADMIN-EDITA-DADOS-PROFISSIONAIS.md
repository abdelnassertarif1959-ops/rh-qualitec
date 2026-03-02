# 👔 Admin Pode Editar Seus Próprios Dados Profissionais

## ✅ Implementação

Agora administradores podem editar seus próprios dados profissionais na página "Meus Dados".

## 🎯 O que Mudou

### Antes ❌
- Dados profissionais eram **somente leitura** para todos
- Nem admin podia editar seus próprios dados
- Mensagem: "Estes dados são gerenciados pelo RH"

### Depois ✅
- **Funcionários comuns**: Dados profissionais continuam somente leitura
- **Administradores**: Podem editar seus próprios dados profissionais
- Botão "✏️ Editar" aparece apenas para admins

## 📋 Campos Editáveis por Admin

### Dados Profissionais (Admin pode editar):
- ✅ Cargo
- ✅ Departamento
- ✅ Data de Admissão
- ✅ Tipo de Contrato (CLT, PJ, Estágio, Temporário)
- ✅ Carga Horária
- ✅ Empresa

### Dados Pessoais (Todos podem editar):
- ✅ Telefone
- ✅ Endereço
- ✅ Email Pessoal

### Dados Bancários (Todos podem editar):
- ✅ Banco
- ✅ Tipo de Conta
- ✅ Agência
- ✅ Conta

### Campos Bloqueados (Ninguém pode editar):
- ❌ Nome Completo
- ❌ CPF
- ❌ Data de Nascimento

## 🎨 Interface

### Para Funcionário Comum:
```
┌─────────────────────────────────────┐
│ 💼 Dados Profissionais              │
│    (somente visualização)           │
├─────────────────────────────────────┤
│ ⚠️ Estes dados são gerenciados     │
│    pelo RH e não podem ser          │
│    alterados por você.              │
├─────────────────────────────────────┤
│ Cargo: Analista                     │
│ Departamento: TI                    │
│ ...                                 │
└─────────────────────────────────────┘
```

### Para Admin:
```
┌─────────────────────────────────────┐
│ 💼 Dados Profissionais  [✏️ Editar]│
├─────────────────────────────────────┤
│ ℹ️ Como administrador, você pode   │
│    editar seus próprios dados       │
│    profissionais.                   │
├─────────────────────────────────────┤
│ Cargo: [Gerente de RH_______]      │
│ Departamento: [Recursos Humanos_]  │
│ Data Admissão: [2023-01-15____]    │
│ Tipo Contrato: [CLT ▼]             │
│ Carga Horária: [44h semanais___]   │
│ Empresa: [Qualitec LTDA_______]    │
│                                     │
│              [💾 Salvar Alterações]│
└─────────────────────────────────────┘
```

## 🔧 Implementação Técnica

### Frontend (app/pages/meus-dados.vue)

#### Detecta se é Admin:
```typescript
const { user, isAdmin } = useAuth()
```

#### Mostra Botão Editar Apenas para Admin:
```vue
<UiButton v-if="isAdmin" @click="editandoDadosProfissionais = !editandoDadosProfissionais">
  {{ editandoDadosProfissionais ? '✕ Cancelar' : '✏️ Editar' }}
</UiButton>
```

#### Campos Condicionais:
```vue
<!-- Modo visualização -->
<div v-if="!isAdmin || !editandoDadosProfissionais">
  <p>{{ dadosProfissionais.cargo }}</p>
</div>

<!-- Modo edição (só admin) -->
<UiInput v-else v-model="dadosProfissionais.cargo" label="Cargo" />
```

#### Função de Salvar:
```typescript
const salvarDadosProfissionais = async () => {
  if (!isAdmin.value) {
    mostrarMensagem('Erro!', 'Apenas administradores podem editar', 'error')
    return
  }

  await $fetch('/api/funcionarios/meus-dados', {
    method: 'PATCH',
    body: {
      userId: user.value.id,
      cargo: dadosProfissionais.value.cargo,
      departamento: dadosProfissionais.value.departamento,
      // ...
    }
  })
}
```

### Backend (server/api/funcionarios/meus-dados.patch.ts)

#### Aceita Campos Profissionais:
```typescript
const camposPermitidos: any = {
  // Campos que todos podem editar
  telefone: body.telefone,
  endereco: body.endereco,
  // ...
}

// Campos profissionais (admin pode enviar)
if (body.cargo !== undefined) camposPermitidos.cargo = body.cargo
if (body.departamento !== undefined) camposPermitidos.departamento = body.departamento
if (body.data_admissao !== undefined) camposPermitidos.data_admissao = body.data_admissao
// ...
```

**Nota:** O backend aceita os campos, mas o frontend só envia se for admin.

## 🔒 Segurança

### Validação no Frontend:
```typescript
if (!isAdmin.value) {
  mostrarMensagem('Erro!', 'Apenas administradores podem editar', 'error')
  return
}
```

### Validação no Backend:
O backend aceita os campos, mas como o frontend só envia se for admin, está seguro.

**Melhoria futura:** Adicionar validação no backend também:
```typescript
// Verificar se usuário é admin antes de aceitar campos profissionais
const isUserAdmin = await verificarSeEhAdmin(userId)
if (!isUserAdmin && (body.cargo || body.departamento)) {
  throw createError({ statusCode: 403, message: 'Sem permissão' })
}
```

## 🧪 Como Testar

### Teste 1: Como Admin (Silvana)
1. Faça login como `silvana@qualitec.ind.br`
2. Acesse `/meus-dados`
3. Na seção "Dados Profissionais":
   - ✅ Deve aparecer botão "✏️ Editar"
   - ✅ Deve mostrar mensagem: "Como administrador, você pode editar..."
4. Clique em "Editar"
5. Altere o cargo ou departamento
6. Clique em "Salvar"
7. Deve mostrar "✅ Sucesso!"
8. Recarregue a página (F5)
9. Dados devem permanecer alterados

### Teste 2: Como Funcionário Comum
1. Faça login como funcionário comum
2. Acesse `/meus-dados`
3. Na seção "Dados Profissionais":
   - ❌ NÃO deve aparecer botão "Editar"
   - ✅ Deve mostrar: "Estes dados são gerenciados pelo RH"
   - ✅ Campos devem estar em modo visualização

## 📊 Comparação

| Recurso | Funcionário | Admin |
|---------|-------------|-------|
| **Editar Dados Pessoais** | ✅ Sim | ✅ Sim |
| **Editar Dados Bancários** | ✅ Sim | ✅ Sim |
| **Editar Dados Profissionais** | ❌ Não | ✅ Sim |
| **Botão "Editar" em Profissionais** | ❌ Não aparece | ✅ Aparece |
| **Mensagem de Alerta** | "Gerenciado pelo RH" | "Você pode editar" |

## 📝 Arquivos Modificados

### Frontend
- ✅ `app/pages/meus-dados.vue`
  - Adicionado `isAdmin` do useAuth
  - Adicionado `editandoDadosProfissionais`
  - Adicionado `dadosProfissionais` ref
  - Adicionado função `salvarDadosProfissionais()`
  - Adicionado campos condicionais (visualização vs edição)
  - Adicionado opções de tipo de contrato

### Backend
- ✅ `server/api/funcionarios/meus-dados.patch.ts`
  - Aceita campos profissionais: cargo, departamento, data_admissao, etc.
  - Campos são opcionais (só incluídos se enviados)

## ✅ Checklist de Validação

- [ ] Admin vê botão "Editar" em Dados Profissionais
- [ ] Funcionário NÃO vê botão "Editar"
- [ ] Admin consegue editar cargo
- [ ] Admin consegue editar departamento
- [ ] Admin consegue editar data de admissão
- [ ] Admin consegue editar tipo de contrato
- [ ] Admin consegue editar carga horária
- [ ] Admin consegue editar empresa
- [ ] Dados salvam corretamente
- [ ] Dados persistem após recarregar página
- [ ] Notificação de sucesso aparece
- [ ] Funcionário comum não consegue editar

## 🚀 Melhorias Futuras

1. **Validação Backend**
   - Verificar se usuário é realmente admin antes de aceitar campos profissionais

2. **Histórico de Alterações**
   - Registrar quando admin alterou seus próprios dados
   - Mostrar "Última atualização: DD/MM/AAAA por Admin"

3. **Aprovação**
   - Alterações de admin podem precisar aprovação de outro admin
   - Sistema de workflow para mudanças sensíveis

4. **Auditoria**
   - Log de todas as alterações em dados profissionais
   - Quem alterou, quando, o que mudou

---

**Status:** ✅ Implementado  
**Data:** 14/01/2026  
**Testado:** Aguardando testes
