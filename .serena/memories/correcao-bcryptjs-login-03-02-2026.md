# Correção Sistema Recuperação Senha - Compatibilidade bcryptjs

## Problema Identificado
- Sistema de recuperação de senha usando bcryptjs para gerar hashes no formato `$2b$12$...`
- Função `verifyPassword` em `server/utils/auth.ts` não reconhecia formato bcryptjs
- Usuário conseguia redefinir senha mas não conseguia fazer login com nova senha

## Solução Implementada
- Adicionado suporte ao bcryptjs na função `verifyPassword`
- Detecta hashes que começam com `$2b$`, `$2a$` ou `$2y$` (formatos bcrypt)
- Usa `bcrypt.compare()` para verificar senhas com hash bcryptjs
- Mantém compatibilidade com formatos existentes (MIGRAR_, salt:hash, texto plano)

## Arquivos Modificados
- `server/utils/auth.ts`: Adicionada verificação bcryptjs na função `verifyPassword`

## Fluxo Completo Funcionando
1. Usuário solicita recuperação de senha
2. Sistema gera token e envia email
3. Usuário acessa link e define nova senha
4. Sistema gera hash bcryptjs e salva no banco
5. Usuário faz login com nova senha
6. Sistema reconhece hash bcryptjs e verifica corretamente

## Status
✅ Implementado - Pronto para teste