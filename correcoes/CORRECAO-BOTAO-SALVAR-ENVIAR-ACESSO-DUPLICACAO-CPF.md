# Correção: Botão "Salvar e Enviar Acesso" Tentando Duplicar CPF

**Data:** 06/02/2026  
**Problema:** Erro 500 ao clicar em "Salvar e Enviar Acesso" em funcionário existente  
**Status:** ✅ CORRIGIDO

## 🔍 Diagnóstico

### Sintomas
- Ao abrir um funcionário existente (ex: UMBERTO - CPF 43396431218)
- Ao clicar em "Salvar e Enviar Acesso"
- Erro 500: `duplicate key value violates unique constraint "funcionarios_cpf_key"`
- Sistema tentava criar novo funcionário ao invés de apenas enviar email

### Causa Raiz
A função `salvarEEnviarAcesso` estava **sempre executando POST** (criar novo funcionário), independente se o funcionário já existia ou não.

**Fluxo incorreto:**
```
Usuário abre funcionário existente
  ↓
Clica em "Salvar e Enviar Acesso"
  ↓
Sistema tenta criar NOVO funcionário (POST)
  ↓
Erro: CPF já existe no banco
```

### Código Problemático

**Arquivo:** `app/pages/admin/funcionarios.vue`

```javascript
const salvarEEnviarAcesso = async () => {
  // ❌ SEMPRE criava novo funcionário
  const response: any = await $fetch('/api/funcionarios', {
    method: 'POST',  // ← Sempre POST, nunca verificava se já existia
    body: form.value
  })
  
  // Depois enviava email...
}
```

## ✅ Solução Implementada

### Lógica Corrigida

A função agora verifica se o funcionário já existe antes de decidir a ação:

```javascript
const salvarEEnviarAcesso = async () => {
  let funcionarioId = null

  // CASO 1: Funcionário já existe (editando)
  if (funcionarioEditando.value && funcionarioEditando.value.id) {
    console.log('✅ Funcionário já existe - apenas enviando email')
    funcionarioId = funcionarioEditando.value.id
    
    // Se houver alterações, salvar primeiro (PATCH)
    if (JSON.stringify(form.value) !== JSON.stringify(funcionarioEditando.value)) {
      await $fetch(`/api/funcionarios/${funcionarioId}`, {
        method: 'PATCH',
        body: form.value
      })
    }
  } 
  // CASO 2: Novo funcionário
  else {
    console.log('🆕 Novo funcionário - criando')
    const response: any = await $fetch('/api/funcionarios', {
      method: 'POST',
      body: form.value
    })
    funcionarioId = response.data.id
  }

  // Enviar email de acesso
  await $fetch('/api/funcionarios/enviar-acesso', {
    method: 'POST',
    body: { funcionario_id: funcionarioId }
  })
}
```

### Fluxo Correto

**Para funcionário existente:**
```
Usuário abre funcionário existente
  ↓
Clica em "Salvar e Enviar Acesso"
  ↓
Sistema detecta que já existe (tem ID)
  ↓
Se houver alterações → PATCH (atualizar)
  ↓
Enviar email de acesso
  ↓
✅ Sucesso!
```

**Para novo funcionário:**
```
Usuário clica em "Novo Funcionário"
  ↓
Preenche dados
  ↓
Clica em "Salvar e Enviar Acesso"
  ↓
Sistema detecta que é novo (sem ID)
  ↓
POST (criar novo)
  ↓
Enviar email de acesso
  ↓
✅ Sucesso!
```

## 🎯 Melhorias Implementadas

### 1. Detecção Inteligente de Modo
```javascript
console.log('📋 Modo:', funcionarioEditando.value ? 'EDIÇÃO' : 'CRIAÇÃO')
```

### 2. Validações Específicas por Modo

**Modo Edição:**
- ✅ Valida apenas se tem email configurado
- ✅ Salva alterações se houver (PATCH)
- ✅ Envia email

**Modo Criação:**
- ✅ Valida nome, CPF e email
- ✅ Cria funcionário (POST)
- ✅ Envia email

### 3. Mensagens Contextuais

**Funcionário existente:**
```
"Email de acesso reenviado para [email]! ✉️"
```

**Novo funcionário:**
```
"Funcionário cadastrado e email enviado para [email]! ✉️"
```

### 4. Logs Detalhados

```javascript
console.log('📋 Modo:', funcionarioEditando.value ? 'EDIÇÃO' : 'CRIAÇÃO')
console.log('📋 Dados do formulário:', {
  id: funcionarioEditando.value?.id,
  nome: form.value.nome_completo,
  cpf: form.value.cpf,
  email: form.value.email_login
})
```

## 🧪 Casos de Teste

### Teste 1: Reenviar Acesso para Funcionário Existente
```
✅ Abrir funcionário UMBERTO (ID 169)
✅ Clicar em "Salvar e Enviar Acesso"
✅ Sistema detecta ID existente
✅ Envia email sem tentar criar novo
✅ Mensagem: "Email de acesso reenviado"
```

### Teste 2: Criar Novo Funcionário e Enviar Acesso
```
✅ Clicar em "Novo Funcionário"
✅ Preencher dados (nome, CPF, email)
✅ Clicar em "Salvar e Enviar Acesso"
✅ Sistema cria novo funcionário
✅ Envia email de acesso
✅ Mensagem: "Funcionário cadastrado e email enviado"
```

### Teste 3: Editar e Reenviar Acesso
```
✅ Abrir funcionário existente
✅ Alterar dados (ex: telefone)
✅ Clicar em "Salvar e Enviar Acesso"
✅ Sistema salva alterações (PATCH)
✅ Envia email de acesso
✅ Mensagem: "Email de acesso reenviado"
```

## 📊 Impacto

### Antes da Correção
- ❌ Impossível reenviar acesso para funcionário existente
- ❌ Erro 500 ao tentar
- ❌ Confusão entre criar e reenviar
- ❌ CPF duplicado mesmo sendo o mesmo funcionário

### Depois da Correção
- ✅ Reenvio de acesso funciona perfeitamente
- ✅ Criação de novo funcionário funciona
- ✅ Atualização + reenvio funciona
- ✅ Mensagens claras e contextuais
- ✅ Logs detalhados para debug

## 🔐 Validações Mantidas

- ✅ CPF único no banco de dados
- ✅ Email obrigatório para enviar acesso
- ✅ Nome e CPF obrigatórios para criar
- ✅ Validação de funcionário existente

## 📝 Casos de Uso Suportados

1. **Reenviar credenciais** - Funcionário esqueceu senha
2. **Criar e enviar** - Novo funcionário
3. **Atualizar e reenviar** - Mudou email e precisa reenviar
4. **Apenas enviar** - Funcionário já existe, só precisa do email

## 🎯 Próximos Passos

- [ ] Testar em produção com funcionários reais
- [ ] Adicionar botão separado "Reenviar Acesso" no card do funcionário
- [ ] Considerar adicionar histórico de envios de email
- [ ] Adicionar confirmação antes de reenviar email

## 📚 Arquivos Modificados

1. `app/pages/admin/funcionarios.vue` - Função `salvarEEnviarAcesso` (linhas 507-580)

## 🔗 Relacionado

- `CORRECAO-FORMULARIO-FUNCIONARIO-CPF-DUPLICADO.md` - Correção do formulário não limpar dados

---

**Testado e Validado:** ✅  
**Deploy Necessário:** Sim  
**Breaking Changes:** Não  
**Melhoria de UX:** Sim
