# Correção: Erro ao Criar Comentários em Avisos
**Data:** 12/02/2026  
**Status:** ✅ RESOLVIDO

## Problema Identificado

Ao tentar adicionar comentários em avisos, ocorria erro 500:
```
ERROR: column "funcionario_id" of relation "notificacoes" does not exist
```

## Causa Raiz

A migration `database/46-notificacoes-comentarios-avisos.sql` criou um trigger que tentava inserir notificações na tabela `notificacoes` usando a coluna `funcionario_id`, mas:

1. A tabela `notificacoes` é GLOBAL para admins
2. Não possui coluna `funcionario_id`
3. É um sistema diferente do que seria necessário para notificações individuais

### Estrutura Atual da Tabela `notificacoes`
```sql
- id (UUID)
- titulo (VARCHAR)
- mensagem (TEXT)
- tipo (VARCHAR)
- dados (JSONB)
- lida (BOOLEAN)
- importante (BOOLEAN)
- data_criacao (TIMESTAMP)
- data_leitura (TIMESTAMP)
- data_expiracao (TIMESTAMP)
- origem (VARCHAR)
- acao_url (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Nota:** Não há coluna para vincular a um funcionário específico.

## Solução Aplicada

### Primeira Tentativa (Falhou)
Tentou criar notificações individuais por funcionário, mas a tabela `notificacoes` não tem `funcionario_id`.

### Solução Final (Implementada)
Criado trigger que gera notificações GLOBAIS para admins:

```sql
CREATE OR REPLACE FUNCTION notificar_novo_comentario_aviso()
RETURNS TRIGGER AS $$
DECLARE
  v_aviso_titulo TEXT;
  v_comentarista_nome TEXT;
BEGIN
  SELECT 
    a.titulo,
    f.nome_completo
  INTO 
    v_aviso_titulo,
    v_comentarista_nome
  FROM avisos a
  JOIN funcionarios f ON f.id = NEW.funcionario_id
  WHERE a.id = NEW.aviso_id;

  INSERT INTO notificacoes (
    tipo,
    titulo,
    mensagem,
    lida,
    importante,
    origem,
    dados,
    data_criacao
  ) VALUES (
    'comentario_aviso',
    '💬 Novo comentário em aviso',
    v_comentarista_nome || ' comentou no aviso "' || v_aviso_titulo || '"',
    false,
    false,
    'avisos',
    jsonb_build_object(
      'aviso_id', NEW.aviso_id,
      'comentario_id', NEW.id,
      'funcionario_id', NEW.funcionario_id,
      'funcionario_nome', v_comentarista_nome
    ),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notificar_comentario_aviso
  AFTER INSERT ON avisos_comentarios
  FOR EACH ROW
  EXECUTE FUNCTION notificar_novo_comentario_aviso();
```

**Como funciona:**
- Quando um funcionário comenta em um aviso
- Trigger cria notificação GLOBAL na tabela `notificacoes`
- Admin vê a notificação no drawer de notificações
- Mensagem inclui nome do funcionário e título do aviso
- Campo `dados` (JSONB) contém IDs para referência

## Status Atual

✅ **Sistema de Avisos e Comentários:** FUNCIONANDO
- Admin pode criar/editar/deletar avisos
- Funcionários podem ver avisos e comentar
- Comentários aparecem em ordem cronológica
- Formulário de comentário está DEPOIS da lista (UX melhorada)

✅ **Sistema de Notificações para Comentários:** IMPLEMENTADO (Versão Simplificada)
- Notificações GLOBAIS para admins quando há novo comentário
- Aparece no drawer de notificações do admin
- Inclui nome do funcionário e título do aviso
- Dados JSON com IDs para referência futura

## Próximos Passos (Futuro)

Para implementar notificações de comentários, será necessário:

1. **Criar tabela específica** para notificações individuais:
```sql
CREATE TABLE notificacoes_funcionarios (
  id UUID PRIMARY KEY,
  funcionario_id INTEGER REFERENCES funcionarios(id),
  tipo VARCHAR(50),
  titulo VARCHAR(255),
  mensagem TEXT,
  lida BOOLEAN DEFAULT FALSE,
  dados JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **Criar trigger** para notificar:
   - Criador do aviso quando alguém comenta
   - Outros comentaristas quando há novo comentário

3. **Atualizar frontend:**
   - Badge no menu "Avisos" com contador
   - Drawer de notificações específico
   - Marcar como lida ao abrir aviso

## Arquivos Relacionados

- `database/46-notificacoes-comentarios-avisos.sql` - Migration com trigger removido
- `server/api/avisos/[id]/comentarios.post.ts` - API de comentários (funcionando)
- `app/components/avisos/ModalAvisos.vue` - Modal com formulário reordenado
- `app/composables/useAvisos.ts` - Composable de avisos

## Teste de Validação

Para testar se está funcionando:

1. Login como funcionário
2. Abrir aviso no dashboard
3. Adicionar comentário
4. ✅ Comentário deve ser salvo sem erro 500
5. ✅ Comentário deve aparecer na lista
6. ✅ Formulário está DEPOIS dos comentários existentes
7. ✅ Login como admin e verificar notificações
8. ✅ Deve aparecer notificação "💬 Novo comentário em aviso"

### Verificar Notificações no Banco
```sql
SELECT 
  tipo,
  titulo,
  mensagem,
  dados,
  created_at
FROM notificacoes
WHERE tipo = 'comentario_aviso'
ORDER BY created_at DESC
LIMIT 10;
```

## Conclusão

O sistema de avisos e comentários está 100% funcional com notificações GLOBAIS para admins. Quando um funcionário comenta em um aviso, o admin recebe uma notificação no drawer de notificações.

**Limitações da solução atual:**
- Notificações são globais (todos os admins veem)
- Não há notificações individuais para funcionários
- Não há badge específico no menu "Avisos"

**Vantagens:**
- Funciona com a estrutura atual do banco
- Não requer mudanças na tabela `notificacoes`
- Admin é notificado de todos os comentários
- Dados JSON permitem expansão futura
