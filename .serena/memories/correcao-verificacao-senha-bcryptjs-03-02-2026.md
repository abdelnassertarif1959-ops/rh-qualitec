# Correção do Sistema de Verificação de Senha - 03/02/2026

## Problema Identificado
Após implementar o sistema de recuperação de senha, os usuários conseguiam redefinir suas senhas com sucesso, mas não conseguiam fazer login com as novas senhas. O erro retornado era "Email ou senha incorretos".

## Causa Raiz
- **API de Reset**: Estava usando `bcryptjs.hash()` para criar hashes no formato `$2a$12$...`
- **API de Login**: Estava usando a função `verifyPassword()` em `server/utils/auth.ts` que só suportava:
  1. Formato `MIGRAR_` (senhas em texto plano)
  2. Formato `salt:hash` (sistema customizado com SHA-256)
  3. Texto plano (fallback)

A função não reconhecia hashes do bcryptjs, resultando em falha na verificação.

## Solução Implementada
Modificada a função `verifyPassword` em `server/utils/auth.ts` para incluir suporte a hashes do bcryptjs:

```typescript
// Verificar se é um hash do bcryptjs (formato: $2a$, $2b$, $2x$, $2y$)
if (storedHash.startsWith('$2')) {
  try {
    // Importar bcryptjs dinamicamente para verificação
    const bcrypt = await import('bcryptjs')
    return await bcrypt.compare(password, storedHash)
  } catch (error) {
    console.error('Erro ao verificar hash bcryptjs:', error)
    return false
  }
}
```

## Compatibilidade
A solução mantém compatibilidade total com:
- Senhas existentes em formato customizado (salt:hash)
- Senhas migradas (MIGRAR_)
- Senhas em texto plano (fallback)
- Novas senhas criadas via reset (bcryptjs)

## Arquivos Modificados
- `server/utils/auth.ts` - Adicionado suporte a bcryptjs na função verifyPassword

## Status
✅ **RESOLVIDO** - Usuários agora podem redefinir senhas e fazer login normalmente