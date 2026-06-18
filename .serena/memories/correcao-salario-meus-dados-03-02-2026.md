# Correção Exibição Salário - Página Meus Dados

## Problema Identificado
- Campo "Salário Base" não aparecia na página "Meus Dados" para funcionários
- Funcionários viam apenas "••••••••" mesmo clicando para revelar
- Problema estava na função `sanitizeUserData` que removia dados financeiros para não-admins

## Causa Raiz
- Função `sanitizeUserData` em `server/utils/authMiddleware.ts` removia `salario_base` para todos os usuários não-admin
- Isso impedia que funcionários vissem seu próprio salário na página "Meus Dados"

## Solução Implementada
- Modificada função `sanitizeUserData` para permitir que funcionários vejam seus próprios dados financeiros
- Adicionada verificação `isViewingOwnData = userData.id === requestingUser.id`
- Dados financeiros só são removidos se: não é admin E não está vendo próprios dados

## Código Alterado
```typescript
// Antes
if (requestingUser.tipo_acesso !== 'admin') {
  delete sanitized.salario_base
  // ... outros campos
}

// Depois  
const isViewingOwnData = userData.id === requestingUser.id
if (requestingUser.tipo_acesso !== 'admin' && !isViewingOwnData) {
  delete sanitized.salario_base
  // ... outros campos
}
```

## Arquivos Modificados
- `server/utils/authMiddleware.ts`: Função `sanitizeUserData`
- `app/pages/meus-dados.vue`: Adicionados logs de debug temporários

## Resultado Esperado
- Funcionários podem ver seu próprio salário na página "Meus Dados"
- Funcionários NÃO podem ver salário de outros funcionários
- Admins podem ver salário de qualquer funcionário
- Campo continua bloqueado para edição (apenas visualização)

## Status
✅ Implementado - Pronto para teste