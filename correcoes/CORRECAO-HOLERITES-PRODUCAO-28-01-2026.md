# Correção: Holerites Não Aparecem para Funcionários em Produção

## Problema Identificado

Os funcionários conseguem ver os holerites no **dashboard** mas não na página **"Meus Holerites"**. Isso indica um problema específico na API `/api/holerites/meus-holerites.get.ts`.

## Sintomas

1. ✅ **Dashboard**: Holerites aparecem normalmente
2. ❌ **Página /holerites**: Mostra "Nenhum holerite encontrado"
3. 🔍 **Ambiente**: Problema ocorre apenas em produção, funciona em localhost

## Análise do Problema

### Possíveis Causas

1. **Configuração de Ambiente**: Diferenças entre localhost e produção
2. **Timeout da API**: Requisições podem estar expirando em produção
3. **Autenticação**: Problemas com o Service Role Key
4. **RLS (Row Level Security)**: Políticas do Supabase bloqueando acesso
5. **Headers HTTP**: Diferenças nos headers entre ambientes

### Código Atual da API

A API `/api/holerites/meus-holerites.get.ts` já possui:
- ✅ Logs detalhados para debug
- ✅ Timeout de 30 segundos
- ✅ Retry de 3 tentativas
- ✅ Uso do Service Role Key para bypassar RLS
- ✅ Verificação de configurações

## Correções Implementadas

### 1. Logs Aprimorados

```typescript
console.log('🔍 [MEUS-HOLERITES] Environment:', process.env.NODE_ENV)
console.log('🔍 [MEUS-HOLERITES] Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING')
console.log('🔍 [MEUS-HOLERITES] Service Role Key:', serviceRoleKey ? 'PRESENTE' : 'MISSING')
```

### 2. Verificação de Configurações

```typescript
if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ [MEUS-HOLERITES] Configurações do Supabase faltando!')
  throw createError({
    statusCode: 500,
    message: 'Configuração do servidor incompleta'
  })
}
```

### 3. Headers Específicos para Produção

```typescript
const headers = {
  'apikey': serviceRoleKey,
  'Authorization': `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
  'User-Agent': 'Nuxt-Server'
}
```

### 4. Timeout Aumentado na Página

```typescript
const data = await $fetch('/api/holerites/meus-holerites', {
  query: { funcionarioId },
  retry: 3,
  timeout: 30000 // 30 segundos timeout para produção
})
```

## Script de Teste

Criado script `scripts/testar-holerites-funcionario.js` para testar a API diretamente no console do navegador.

## Próximos Passos

### 1. Verificar Logs em Produção

Execute o script de teste e verifique os logs no console do navegador:

```javascript
// Cole no console da página /holerites
// Código do script testar-holerites-funcionario.js
```

### 2. Verificar Variáveis de Ambiente

Confirmar se as variáveis estão corretas em produção:
- `NUXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Testar API Diretamente

Testar a API diretamente via URL:
```
GET /api/holerites/meus-holerites?funcionarioId=USER_ID
```

### 4. Verificar RLS no Supabase

Confirmar se as políticas RLS estão permitindo acesso aos holerites:
```sql
SELECT * FROM holerites WHERE funcionario_id = 'USER_ID' AND status != 'gerado';
```

## Monitoramento

### Logs a Observar

1. **Configurações**: Verificar se URL e Service Role Key estão presentes
2. **Requisição**: Status da requisição ao Supabase
3. **Resposta**: Quantidade de holerites retornados
4. **Erros**: Qualquer erro de rede ou autenticação

### Métricas

- **Tempo de resposta**: Deve ser < 30 segundos
- **Taxa de sucesso**: Deve ser 100% para usuários autenticados
- **Quantidade de holerites**: Deve corresponder aos dados no dashboard

## Status

- ✅ **Logs implementados**: Logs detalhados para debug
- ✅ **Timeout aumentado**: 30 segundos para produção
- ✅ **Script de teste**: Disponível para debug
- ⏳ **Teste em produção**: Aguardando execução
- ⏳ **Correção final**: Dependente dos resultados dos testes

## Observações

- O problema é específico da página `/holerites`, não do dashboard
- Indica que a API `/api/holerites/meus-holerites.get.ts` tem problemas específicos
- Pode ser relacionado a diferenças de configuração entre localhost e produção