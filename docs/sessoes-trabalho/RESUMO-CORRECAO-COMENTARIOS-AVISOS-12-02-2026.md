# Resumo: Correção de Permissões para Comentários em Avisos

**Data:** 12/02/2026  
**Status:** ✅ Solução Pronta para Deploy

---

## 🎯 Problema

Funcionários não conseguem comentar em avisos porque as políticas RLS (Row Level Security) do banco de dados estavam muito restritivas e mal configuradas.

---

## ✅ Solução

### Arquivo Criado
- `database/45-corrigir-permissoes-comentarios-avisos.sql`

### O que faz
Corrige as 3 políticas RLS da tabela `avisos_comentarios`:
1. **INSERT** - Permite funcionários criarem comentários
2. **UPDATE** - Permite autor editar próprio comentário
3. **DELETE** - Permite admin deletar qualquer um, funcionário só o próprio

---

## 🚀 Como Aplicar

### Opção 1: Supabase Dashboard
1. Acesse o Supabase Dashboard
2. Vá em "SQL Editor"
3. Copie e cole o conteúdo de `database/45-corrigir-permissoes-comentarios-avisos.sql`
4. Execute

### Opção 2: Linha de Comando
```bash
# Se usar Supabase CLI
supabase db push database/45-corrigir-permissoes-comentarios-avisos.sql
```

---

## 🧪 Como Testar

### Teste Rápido (Manual)
1. Login como funcionário (não admin)
2. Clique em um aviso no dashboard
3. Clique em "Ver comentários"
4. Digite um comentário e envie
5. ✅ Deve funcionar!

### Teste Automatizado
```bash
node scripts/testar-permissoes-comentarios-avisos.js
```

---

## 📊 Antes vs Depois

| Ação | Antes | Depois |
|------|-------|--------|
| Funcionário comentar | ❌ Bloqueado | ✅ Permitido |
| Funcionário ver comentários | ✅ OK | ✅ OK |
| Funcionário deletar próprio | ❌ Bloqueado | ✅ Permitido |
| Funcionário deletar de outro | ❌ Bloqueado | ❌ Bloqueado |
| Admin deletar qualquer | ⚠️ Confuso | ✅ Permitido |

---

## 📝 Arquivos Relacionados

### Criados Agora
- `database/45-corrigir-permissoes-comentarios-avisos.sql` - Migration
- `CORRECAO-PERMISSOES-COMENTARIOS-12-02-2026.md` - Documentação completa
- `scripts/testar-permissoes-comentarios-avisos.js` - Script de teste

### Já Existentes (não precisa alterar)
- `server/api/avisos/[id]/comentarios.post.ts` - ✅ API já correta
- `server/api/avisos/[id]/comentarios.get.ts` - ✅ API já correta
- `app/components/avisos/ComentariosModal.vue` - ✅ Frontend já correto

---

## ⚡ Ação Necessária

**APENAS 1 PASSO:**
1. Execute a migration SQL no banco de dados

**Pronto!** Não precisa alterar código, fazer deploy, ou reiniciar nada.

---

## 🎉 Resultado Final

Após executar a migration:
- ✅ Funcionários podem comentar em avisos
- ✅ Funcionários podem ver todos os comentários
- ✅ Funcionários podem excluir apenas seus comentários
- ✅ Admin pode excluir qualquer comentário
- ✅ Sistema totalmente funcional
