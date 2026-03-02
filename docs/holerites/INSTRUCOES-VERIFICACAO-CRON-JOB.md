# Instruções para Verificação do Cron Job - Adiantamentos Automáticos

## ✅ Alterações Implementadas e Enviadas

Commit: `7e85ed9`  
Data: 18/02/2026 12:30  
Mensagem: "feat: Geração automática adiantamentos dia 20 e remoção referência - 18/02/2026 12:30"

## 📋 Checklist de Verificação no Vercel

### 1. Verificar se o Deploy foi Realizado

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione o projeto do sistema RH
3. Verifique se o último deploy foi concluído com sucesso
4. Aguarde o deploy terminar (geralmente leva 2-3 minutos)

### 2. Verificar se o Cron Job foi Registrado

1. No Vercel Dashboard, vá para o projeto
2. Clique em **Settings** (Configurações)
3. Clique em **Cron Jobs** no menu lateral
4. Verifique se o cron job aparece na lista:

```
Path: /api/cron/gerar-adiantamentos-dia-20
Schedule: 0 6 * * * (Diariamente às 06:00 UTC / 03:00 BRT)
Status: Active
```

### 3. Verificar Variáveis de Ambiente

1. No Vercel Dashboard, vá para **Settings** > **Environment Variables**
2. Verifique se as seguintes variáveis existem:
   - `CRON_SECRET` - Chave secreta para autenticação
   - `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase

**Se não existirem**, adicione-as:

```bash
CRON_SECRET=sua-chave-secreta-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-supabase-aqui
```

### 4. Testar Manualmente a API (Opcional)

Você pode testar a API manualmente antes do dia 20:

```bash
curl -X GET https://seu-dominio.vercel.app/api/cron/gerar-adiantamentos-dia-20 \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

**Resposta esperada** (se não for dia 20):

```json
{
  "success": true,
  "message": "Verificação executada. Não é o dia de execução (hoje é dia 18, execução no dia 20).",
  "dia_atual": 18,
  "dia_execucao": 20,
  "acao_executada": false
}
```

## 📅 Próxima Execução Automática

**Data**: 20 de fevereiro de 2026 (sexta-feira)  
**Horário**: 06:00 UTC / 03:00 BRT

Como hoje é dia 18/02/2026, a próxima execução será daqui a 2 dias.

## 🔍 Como Verificar se Funcionou no Dia 20

### Opção 1: Verificar Logs no Vercel

1. Acesse o Vercel Dashboard
2. Vá para **Deployments** > **Functions**
3. Procure por `/api/cron/gerar-adiantamentos-dia-20`
4. Verifique os logs de execução

### Opção 2: Verificar no Banco de Dados

Execute esta query no Supabase:

```sql
SELECT 
  h.id,
  h.funcionario_id,
  f.nome_completo,
  h.periodo_inicio,
  h.periodo_fim,
  h.data_pagamento,
  h.salario_base,
  h.salario_liquido,
  h.status,
  h.created_at
FROM holerites h
JOIN funcionarios f ON f.id = h.funcionario_id
WHERE h.periodo_inicio = '2026-02-15'
  AND h.periodo_fim = '2026-02-28'
ORDER BY h.created_at DESC;
```

**Resultado esperado**: Lista de adiantamentos criados no dia 20/02/2026

### Opção 3: Verificar no Sistema

1. Faça login como funcionário com `tipo_salario = 'quinzenal'`
2. Acesse a página de **Holerites**
3. Verifique se aparece um novo holerite com:
   - Referência: "fevereiro de 2026" (sem mencionar "Adiantamento")
   - Período: 15/02/2026 até 28/02/2026
   - Valor: 40% do salário base
   - Status: Disponível

## 🚨 Troubleshooting

### Problema: Cron job não aparece no Vercel

**Solução**: 
1. Verifique se o arquivo `vercel.json` foi enviado corretamente
2. Faça um novo deploy forçado: `vercel --prod --force`

### Problema: API retorna erro 401 (Unauthorized)

**Solução**:
1. Verifique se a variável `CRON_SECRET` está configurada
2. Verifique se o header `Authorization` está correto

### Problema: Adiantamentos não foram criados no dia 20

**Solução**:
1. Verifique os logs no Vercel
2. Execute a query SQL para verificar se há funcionários com `tipo_salario = 'quinzenal'`
3. Verifique se a variável `SUPABASE_SERVICE_ROLE_KEY` está configurada

## 📞 Suporte

Se encontrar algum problema, verifique:

1. **Logs do Vercel**: Para erros de execução
2. **Logs do Supabase**: Para erros de banco de dados
3. **Documentação completa**: `docs/holerites/GERACAO-AUTOMATICA-ADIANTAMENTOS-DIA-20.md`

## ✅ Resumo das Alterações

1. ✅ Removida referência "Adiantamento Salarial" dos holerites
2. ✅ Criada API de cron job para geração automática
3. ✅ Configurado cron job no Vercel (execução diária)
4. ✅ Lógica de dia útil implementada (dia 20 ou sexta anterior)
5. ✅ Testes validados para todos os meses de 2026
6. ✅ Documentação completa criada
7. ✅ Commit e push realizados com sucesso

**Próximo passo**: Aguardar o dia 20/02/2026 para validar a execução automática! 🎉
