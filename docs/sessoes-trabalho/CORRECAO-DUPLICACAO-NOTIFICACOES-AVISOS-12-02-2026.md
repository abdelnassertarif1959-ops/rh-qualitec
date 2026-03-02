# Correção: Duplicação de Notificações de Comentários
**Data:** 12/02/2026  
**Status:** ✅ CORRIGIDO

## Problema Identificado

Quando um funcionário fazia 1 comentário em um aviso, apareciam 2 notificações duplicadas no painel do admin.

## Causa Raiz

Existiam **2 triggers ativos** na tabela `avisos_comentarios`:

1. `trigger_notificar_comentario_aviso` (antigo - com erro)
2. `trigger_notificar_comentario_aviso_global` (novo - correto)

Ambos estavam sendo executados a cada INSERT, gerando 2 notificações para o mesmo comentário.

### Como isso aconteceu?

1. Primeira tentativa criou `trigger_notificar_comentario_aviso` com função que tentava usar `funcionario_id` na tabela `notificacoes`
2. Esse trigger causou erro 500 ao comentar
3. Segunda tentativa criou `trigger_notificar_comentario_aviso_global` com função correta
4. O trigger antigo não foi removido, ficando ambos ativos

## Solução Aplicada

### 1. Remover Trigger e Função Antigos

```sql
DROP TRIGGER IF EXISTS trigger_notificar_comentario_aviso ON avisos_comentarios;
DROP FUNCTION IF EXISTS notificar_novo_comentario_aviso();
```

### 2. Limpar Notificações Duplicadas

```sql
DELETE FROM notificacoes
WHERE id IN (
  SELECT n1.id
  FROM notificacoes n1
  INNER JOIN notificacoes n2 ON 
    n1.tipo = 'comentario_aviso' AND
    n2.tipo = 'comentario_aviso' AND
    n1.dados->>'comentario_id' = n2.dados->>'comentario_id' AND
    n1.id < n2.id
);
```

Esta query:
- Identifica notificações com mesmo `comentario_id` no campo JSON `dados`
- Remove a mais antiga, mantendo apenas a mais recente

## Verificação

### Antes da Correção
```
trigger_notificar_comentario_aviso          ← ANTIGO (causava duplicação)
trigger_notificar_comentario_aviso_global   ← NOVO (correto)
```

### Depois da Correção
```
trigger_notificar_comentario_aviso_global   ← ÚNICO trigger ativo
```

## Teste de Validação

1. Funcionário faz comentário em aviso
2. ✅ Apenas 1 notificação é criada
3. ✅ Admin vê apenas 1 notificação no drawer
4. ✅ Notificação contém informações corretas

### Comando de Teste

```sql
-- Verificar triggers ativos
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'avisos_comentarios';

-- Deve retornar apenas 1 linha:
-- trigger_notificar_comentario_aviso_global
```

## Impacto

✅ Notificações duplicadas removidas do banco  
✅ Apenas 1 trigger ativo agora  
✅ Novos comentários geram apenas 1 notificação  
✅ Sistema funcionando corretamente  

## Prevenção Futura

Para evitar esse problema no futuro:

1. Sempre usar `DROP TRIGGER IF EXISTS` antes de criar novo trigger
2. Verificar triggers existentes antes de criar novos
3. Testar em ambiente de desenvolvimento primeiro
4. Documentar mudanças em migrations

## Arquivos Relacionados

- `database/46-notificacoes-comentarios-avisos.sql` - Migration com trigger correto
- `CORRECAO-ERRO-NOTIFICACOES-AVISOS-12-02-2026.md` - Histórico de correções

## Conclusão

Problema de duplicação de notificações resolvido. Agora cada comentário gera exatamente 1 notificação para o admin.
