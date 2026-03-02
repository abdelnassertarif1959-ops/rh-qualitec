# Correção de Erro de Importação - APIs de Avisos
**Data**: 12/02/2026

## Problema Identificado

Erro ao iniciar servidor de desenvolvimento:
```
Could not load C:/Users/Vendas2/Downloads/rhhhh-main/app//server/utils/authMiddleware 
(imported by server/api/avisos/[id].get.ts)
```

## Causa Raiz

O arquivo `server/api/avisos/[id]/comentarios/[comentarioId].delete.ts` estava importando `authMiddleware`:
```typescript
import { requireAdmin } from '~/server/utils/authMiddleware'
```

Este import estava causando erro porque o caminho estava incorreto e a abordagem de autenticação foi alterada para usar cookies diretamente.

## Solução Aplicada

### 1. Corrigido arquivo problemático
Reescrito `server/api/avisos/[id]/comentarios/[comentarioId].delete.ts` para:
- Remover import de `authMiddleware`
- Usar autenticação via cookies (mesma abordagem das outras APIs)
- Verificar permissões manualmente (admin ou autor do comentário)

### 2. Removido arquivo desnecessário
- Deletado `server/api/avisos/[id].patch.ts` (estava vazio)

### 3. Limpeza de cache
- Executado `Remove-Item -Recurse -Force .nuxt` para limpar cache do Nuxt

## Arquivos Corrigidos

1. `server/api/avisos/[id]/comentarios/[comentarioId].delete.ts`
   - Removido import de authMiddleware
   - Implementada autenticação via cookies
   - Adicionada verificação de permissões (admin ou autor)

## Estrutura Final de APIs de Avisos

```
server/api/avisos/
├── index.get.ts                              # Listar avisos
├── index.post.ts                             # Criar aviso
├── [id].get.ts                               # Buscar aviso específico
├── [id].delete.ts                            # Deletar aviso
├── [id]/
│   └── comentarios/
│       ├── [comentarioId].delete.ts          # Deletar comentário (CORRIGIDO)
│       ├── comentarios.get.ts                # Listar comentários
│       └── comentarios.post.ts               # Criar comentário
└── comentarios/
    └── [id].delete.ts                        # Deletar comentário (alternativo)
```

## Próximos Passos

1. Reiniciar servidor de desenvolvimento
2. Testar todas as APIs de avisos
3. Integrar componente `<CaixaAvisos />` no dashboard do funcionário
4. Adicionar link no menu admin para `/admin/avisos`

## Status

✅ Erro de importação corrigido
✅ Cache limpo
⏳ Aguardando reinício do servidor para validação
