# Checklist - Implementação do Contador Diário

## ✅ Pré-requisitos

- [ ] Acesso ao Supabase (SQL Editor)
- [ ] Acesso ao painel da Vercel
- [ ] Projeto já configurado com variáveis de ambiente

## 📋 Implementação

### 1. Banco de Dados
- [ ] Executar script SQL: `database/33-criar-tabela-contador-diario.sql`
- [ ] Verificar se tabela `contador_diario` foi criada
- [ ] Verificar se função `incrementar_contador_diario()` existe
- [ ] Testar função manualmente: `SELECT incrementar_contador_diario();`

### 2. Variáveis de Ambiente
- [ ] Adicionar `CRON_SECRET` no painel da Vercel
- [ ] Gerar secret seguro: `openssl rand -hex 32`
- [ ] Confirmar que outras variáveis do Supabase estão configuradas

### 3. Deploy
- [ ] Fazer commit das alterações
- [ ] Push para repositório
- [ ] Aguardar deploy automático na Vercel
- [ ] Verificar se cron job aparece no painel da Vercel

### 4. Testes

#### Teste da API
- [ ] Testar endpoint de status: `GET /api/contador-diario/status`
- [ ] Testar listagem: `GET /api/contador-diario`
- [ ] Verificar se retorna dados corretos

#### Teste do Cron
- [ ] Testar manualmente: `GET /api/cron/incrementar-contador-diario`
- [ ] Usar header: `Authorization: Bearer {CRON_SECRET}`
- [ ] Verificar se novo registro foi criado

#### Teste Local (Opcional)
- [ ] Executar: `npx tsx scripts/testar-contador-diario.ts`
- [ ] Verificar saída do script
- [ ] Confirmar incremento funcionando

## 🔍 Validação

### Verificações no Banco
```sql
-- 1. Verificar tabela existe
SELECT * FROM contador_diario ORDER BY id DESC LIMIT 5;

-- 2. Verificar função existe  
SELECT proname FROM pg_proc WHERE proname = 'incrementar_contador_diario';

-- 3. Contar registros
SELECT COUNT(*) FROM contador_diario;
```

### Verificações na API
```bash
# 1. Status do contador
curl https://seu-dominio.vercel.app/api/contador-diario/status

# 2. Teste do cron (substitua SEU_SECRET)
curl -H "Authorization: Bearer SEU_SECRET" \
     https://seu-dominio.vercel.app/api/cron/incrementar-contador-diario

# 3. Listar registros
curl https://seu-dominio.vercel.app/api/contador-diario?limit=10
```

## 📊 Monitoramento

### Painel da Vercel
- [ ] Acessar "Functions" > "Cron Jobs"
- [ ] Verificar se `incrementar-contador-diario` está listado
- [ ] Confirmar próxima execução agendada
- [ ] Monitorar logs de execução

### Verificação Diária
- [ ] Configurar lembrete para verificar execução
- [ ] Monitorar crescimento do contador
- [ ] Verificar logs de erro

## 🚨 Troubleshooting

### Problemas Comuns

#### Cron não executa
- [ ] Verificar configuração no `vercel.json`
- [ ] Confirmar deploy foi bem-sucedido
- [ ] Checar timezone (executa às 12:00 UTC = 09:00 BRT)

#### Erro de autenticação
- [ ] Verificar `CRON_SECRET` nas variáveis de ambiente
- [ ] Confirmar header `Authorization` correto
- [ ] Testar secret localmente

#### Erro no banco
- [ ] Verificar se script SQL foi executado
- [ ] Confirmar permissões do service role
- [ ] Testar conexão com Supabase

#### Números duplicados
- [ ] Verificar se há múltiplas execuções
- [ ] Analisar logs detalhados
- [ ] Confirmar função não está sendo chamada manualmente

## 📈 Estatísticas Esperadas

### Primeira Semana
- [ ] 7 registros criados
- [ ] Números sequenciais (1, 2, 3, ...)
- [ ] Execução diária às 12:00 UTC

### Primeiro Mês
- [ ] ~30 registros
- [ ] Sem falhas de execução
- [ ] Logs limpos no Vercel

### Longo Prazo
- [ ] Crescimento constante
- [ ] Performance estável
- [ ] Backup automático funcionando

## 🎯 Critérios de Sucesso

- ✅ Tabela criada e funcionando
- ✅ Cron job executando diariamente
- ✅ APIs respondendo corretamente
- ✅ Logs sem erros
- ✅ Contador incrementando sequencialmente
- ✅ Sistema para até 2078 (52+ anos)

## 📝 Documentação

- [ ] Ler: `docs/SISTEMA-CONTADOR-DIARIO.md`
- [ ] Entender arquitetura completa
- [ ] Conhecer endpoints disponíveis
- [ ] Saber como fazer manutenção

## 🔄 Manutenção Futura

### Mensal
- [ ] Verificar execução regular
- [ ] Monitorar performance
- [ ] Backup de segurança

### Anual  
- [ ] Revisar logs completos
- [ ] Verificar crescimento esperado
- [ ] Planejar otimizações se necessário

### Antes de 2078
- [ ] Decidir se estende prazo
- [ ] Planejar migração se necessário
- [ ] Documentar histórico completo

---

**Data de Implementação:** ___________
**Responsável:** ___________
**Status:** [ ] Pendente [ ] Em Andamento [ ] Concluído