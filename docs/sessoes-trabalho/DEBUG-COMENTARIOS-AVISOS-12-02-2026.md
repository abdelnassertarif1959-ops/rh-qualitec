# Debug: Sistema de Comentários em Avisos
**Data:** 12/02/2026

## Problema Relatado
Funcionário não consegue clicar nos avisos para adicionar comentários no dashboard.

## Logs de Debug Adicionados

### 1. CaixaAvisos.vue (Dashboard do Funcionário)
- ✅ Já tinha logs no método `abrirAviso()`
- Logs mostram quando o aviso é clicado e o modal é aberto

### 2. AvisosModal.vue (Modal Principal)
- ✅ Adicionado log no método `abrirDetalhes()`
- ✅ Adicionado log no `onMounted()`
- ✅ Adicionado `watch` para observar mudanças no `avisoSelecionado`
- ✅ Abertura automática de detalhes se `avisoSelecionado` já existe

### 3. AvisoDetalhes.vue (Modal de Comentários)
- ✅ Adicionado log no `onMounted()`
- ✅ Adicionado logs detalhados no método `enviarComentario()`

### 4. useAvisos.ts (Composable)
- ✅ Adicionado logs detalhados no método `adicionarComentario()`
- Logs mostram: avisoId, comentário, usuário, requisição e resposta

## Fluxo Esperado

```
1. Funcionário clica no aviso no CaixaAvisos
   └─> 🔵 [CAIXA-AVISOS] Abrindo aviso
   └─> 🔵 [CAIXA-AVISOS] Modal aberto: true
   └─> 🔵 [CAIXA-AVISOS] Aviso selecionado: {...}

2. AvisosModal é montado
   └─> 🟢 [AVISOS-MODAL] Componente montado
   └─> 🟢 [AVISOS-MODAL] avisoSelecionado prop: {...}
   └─> 🟢 [AVISOS-MODAL] avisoSelecionado mudou: {...}

3. AvisoDetalhes é montado automaticamente
   └─> 🟣 [AVISO-DETALHES] Componente montado
   └─> 🟣 [AVISO-DETALHES] Aviso: {...}

4. Funcionário digita comentário e clica em "Comentar"
   └─> 🟣 [AVISO-DETALHES] Enviando comentário...
   └─> 🟣 [AVISO-DETALHES] Comentário: "texto do comentário"
   └─> 🟣 [AVISO-DETALHES] Chamando adicionarComentario...

5. Composable processa o comentário
   └─> 🔵 [AVISOS] === INÍCIO ADICIONAR COMENTÁRIO ===
   └─> 🔵 [AVISOS] avisoId: "123"
   └─> 🔵 [AVISOS] comentario: "texto do comentário"
   └─> 🔵 [AVISOS] Usuário: existe
   └─> 🔵 [AVISOS] funcionario_id: "456"
   └─> 🔵 [AVISOS] Enviando requisição para API...
   └─> ✅ [AVISOS] Resposta da API: {...}
   └─> ✅ [AVISOS] Comentário adicionado com sucesso
   └─> 🔵 [AVISOS] === FIM ADICIONAR COMENTÁRIO ===

6. Modal atualiza lista de comentários
   └─> ✅ [AVISO-DETALHES] Comentário enviado com sucesso
```

## Como Testar

### Passo 1: Fazer login como funcionário
```
URL: http://localhost:3000/login
Usuário: funcionário (não admin)
```

### Passo 2: Ir para o dashboard
```
URL: http://localhost:3000/dashboard
```

### Passo 3: Abrir o console do navegador
```
F12 ou Ctrl+Shift+I
Aba "Console"
```

### Passo 4: Clicar em um aviso
- Clicar em qualquer aviso na caixa "Avisos e Comunicados"
- Observar os logs no console

### Passo 5: Verificar se o modal abre
- Modal deve abrir mostrando detalhes do aviso
- Deve aparecer formulário de comentários
- Observar logs no console

### Passo 6: Adicionar comentário
- Digitar um comentário no campo de texto
- Clicar no botão "Comentar"
- Observar logs no console

## Possíveis Problemas e Soluções

### Problema 1: Modal não abre
**Sintomas:**
- Clica no aviso mas nada acontece
- Não aparece log `🔵 [CAIXA-AVISOS] Modal aberto: true`

**Solução:**
- Verificar se há erro JavaScript no console
- Verificar se o componente `AvisosModal` está sendo importado corretamente

### Problema 2: Modal abre mas não mostra detalhes
**Sintomas:**
- Modal abre mas mostra lista de avisos ao invés de detalhes
- Não aparece log `🟣 [AVISO-DETALHES] Componente montado`

**Solução:**
- Verificar se `avisoSelecionado` está sendo passado corretamente
- Verificar logs do watcher no `AvisosModal`

### Problema 3: Não consegue enviar comentário
**Sintomas:**
- Formulário aparece mas botão não funciona
- Aparece erro no console

**Solução:**
- Verificar se usuário está autenticado
- Verificar logs do composable `useAvisos`
- Verificar resposta da API

### Problema 4: Erro "Usuário não autenticado"
**Sintomas:**
- Aparece log `❌ [AVISOS] Usuário não autenticado`

**Solução:**
- Fazer logout e login novamente
- Verificar se `useAuth()` está retornando usuário
- Verificar se token está válido

## Arquivos Modificados

1. `app/components/avisos/CaixaAvisos.vue` - Já tinha logs
2. `app/components/avisos/AvisosModal.vue` - Adicionado logs e watcher
3. `app/components/avisos/AvisoDetalhes.vue` - Adicionado logs detalhados
4. `app/composables/useAvisos.ts` - Adicionado logs no adicionarComentario

## Próximos Passos

1. Testar com usuário funcionário real
2. Verificar logs no console
3. Identificar onde o fluxo está quebrando
4. Corrigir o problema específico
5. Remover logs de debug (opcional, após correção)

## Notas Importantes

- Todos os logs usam emojis para facilitar identificação:
  - 🔵 = CaixaAvisos / useAvisos
  - 🟢 = AvisosModal
  - 🟣 = AvisoDetalhes
  - ✅ = Sucesso
  - ❌ = Erro

- Os logs são detalhados e mostram o estado de cada variável
- Use os logs para identificar exatamente onde o problema está ocorrendo
