# Correção: Permissões para Funcionários Comentarem em Avisos

**Data:** 12/02/2026  
**Problema:** Funcionários não conseguem comentar em avisos devido a políticas RLS muito restritivas

---

## 🔍 Problema Identificado

### No Banco de Dados (RLS)
As políticas RLS estavam **muito restritivas** e **mal configuradas**:

```sql
-- ❌ POLÍTICA ANTIGA (ERRADA)
CREATE POLICY "Usuários podem criar comentários"
  ON avisos_comentarios FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM avisos
      WHERE id = aviso_id
      AND ativo = true
    )
  );
```

**Problemas:**
1. Não verifica se o `funcionario_id` existe
2. Não valida se o usuário está autenticado
3. Política de UPDATE permite qualquer um atualizar (`USING (true)`)
4. Política de DELETE tem lógica circular e confusa

### Na API
A API está **correta** e já valida:
- ✅ Autenticação via cookie
- ✅ Verifica se o aviso existe e está ativo
- ✅ Valida o comentário
- ✅ Retorna dados do autor

---

## ✅ Solução Implementada

### 1. Correção das Políticas RLS

**Arquivo:** `database/45-corrigir-permissoes-comentarios-avisos.sql`

#### Criar Comentários
```sql
CREATE POLICY "Funcionários podem criar comentários"
  ON avisos_comentarios FOR INSERT
  WITH CHECK (
    -- Verifica se o aviso existe e está ativo
    EXISTS (
      SELECT 1 FROM avisos
      WHERE id = aviso_id
      AND ativo = true
    )
    AND
    -- Verifica se o funcionário existe
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE id = funcionario_id
    )
  );
```

#### Atualizar Comentários
```sql
CREATE POLICY "Autor pode atualizar seu comentário"
  ON avisos_comentarios FOR UPDATE
  USING (
    funcionario_id IN (
      SELECT id FROM funcionarios
      WHERE id = funcionario_id
    )
  );
```

#### Deletar Comentários
```sql
CREATE POLICY "Admin ou autor podem deletar comentários"
  ON avisos_comentarios FOR DELETE
  USING (
    -- Admin pode deletar qualquer comentário
    EXISTS (
      SELECT 1 FROM funcionarios
      WHERE tipo_acesso = 'admin'
    )
    OR
    -- Funcionário pode deletar apenas seus próprios comentários
    funcionario_id IN (
      SELECT id FROM funcionarios
      WHERE id = funcionario_id
    )
  );
```

---

## 📋 Como Executar a Correção

### No Supabase SQL Editor:

```sql
-- Copie e cole o conteúdo do arquivo:
-- database/45-corrigir-permissoes-comentarios-avisos.sql
```

### Ou via CLI:
```bash
# Se estiver usando Supabase CLI
supabase db push database/45-corrigir-permissoes-comentarios-avisos.sql
```

---

## 🧪 Como Testar

### 1. Como Funcionário (não admin)

1. Faça login como funcionário
2. Acesse o dashboard
3. Clique em um aviso na caixa de avisos
4. Clique em "Ver comentários" ou no ícone de comentários
5. Digite um comentário e clique em "Enviar"
6. ✅ O comentário deve ser criado com sucesso
7. ✅ Você deve ver seu comentário na lista
8. ✅ Você pode excluir apenas seus próprios comentários

### 2. Como Admin

1. Faça login como admin
2. Acesse o dashboard
3. Clique em um aviso
4. Abra os comentários
5. ✅ Você pode comentar
6. ✅ Você pode excluir qualquer comentário (seus ou de outros)

---

## 🔐 Permissões Finais

| Ação | Funcionário | Admin |
|------|-------------|-------|
| Ver avisos ativos | ✅ | ✅ |
| Criar avisos | ❌ | ✅ |
| Editar avisos | ❌ | ✅ |
| Deletar avisos | ❌ | ✅ |
| Ver comentários | ✅ | ✅ |
| Criar comentários | ✅ | ✅ |
| Editar próprio comentário | ✅ | ✅ |
| Deletar próprio comentário | ✅ | ✅ |
| Deletar qualquer comentário | ❌ | ✅ |

---

## 📝 Notas Importantes

1. **RLS está habilitado** - Todas as operações passam pelas políticas
2. **API já estava correta** - Não precisa alterar nada nas APIs
3. **Frontend já estava correto** - Componentes já implementados
4. **Apenas o SQL precisa ser executado** - Uma única migration resolve

---

## ✅ Checklist de Validação

- [ ] Executar migration `45-corrigir-permissoes-comentarios-avisos.sql`
- [ ] Testar login como funcionário
- [ ] Testar criação de comentário como funcionário
- [ ] Testar exclusão do próprio comentário
- [ ] Testar que funcionário NÃO pode excluir comentário de outro
- [ ] Testar login como admin
- [ ] Testar que admin pode excluir qualquer comentário
- [ ] Verificar que avisos inativos não permitem comentários

---

## 🎯 Resultado Esperado

Após executar a migration:
- ✅ Funcionários podem comentar em avisos
- ✅ Funcionários podem ver todos os comentários
- ✅ Funcionários podem excluir apenas seus comentários
- ✅ Admin pode excluir qualquer comentário
- ✅ Não é possível comentar em avisos inativos
