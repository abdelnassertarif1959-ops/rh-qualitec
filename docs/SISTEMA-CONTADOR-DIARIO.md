# Sistema de Contador Diário

## Visão Geral

Sistema automatizado que incrementa um contador numérico diariamente até o ano de 2078.

## Componentes

### 1. Tabela do Banco de Dados

**Tabela:** `contador_diario`

```sql
CREATE TABLE contador_diario (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único (auto-incremento)
- `numero`: Número sequencial do contador
- `data_criacao`: Data/hora da criação do registro
- `created_at`: Timestamp de criação

### 2. Função de Incremento

**Função:** `incrementar_contador_diario()`

- Verifica se a data limite (31/12/2078) não foi atingida
- Busca o último número inserido
- Insere o próximo número na sequência
- Para automaticamente quando chegar em 2078

### 3. Cron Job Automatizado

**Endpoint:** `/api/cron/incrementar-contador-diario`
**Agendamento:** Diário às 12:00 UTC (09:00 BRT)
**Configuração:** `vercel.json`

```json
{
  "path": "/api/cron/incrementar-contador-diario",
  "schedule": "0 12 * * *"
}
```

### 4. APIs de Consulta

#### Status do Contador
**GET** `/api/contador-diario/status`

Retorna informações sobre o estado atual:
- Número atual
- Total de registros
- Último incremento
- Dias restantes até 2078
- Progresso percentual

#### Listar Registros
**GET** `/api/contador-diario?page=1&limit=50`

Lista os registros com paginação:
- Registros ordenados por ID (mais recente primeiro)
- Paginação configurável
- Máximo 100 registros por página

## Segurança

### Autenticação do Cron
- Usa `CRON_SECRET` para validar chamadas automáticas
- Header: `Authorization: Bearer {CRON_SECRET}`

### Variáveis de Ambiente Necessárias
```env
SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
CRON_SECRET=seu_secret_para_cron
```

## Funcionamento

### Fluxo Diário
1. **12:00 UTC**: Vercel executa o cron job
2. **Validação**: Verifica autenticação e data limite
3. **Incremento**: Executa função `incrementar_contador_diario()`
4. **Registro**: Insere novo número na tabela
5. **Log**: Retorna status da operação

### Condições de Parada
- **Data limite**: 31/12/2078
- **Erro de execução**: Falha na função ou banco
- **Falta de autenticação**: Secret inválido

## Instalação

### 1. Executar Script SQL
```bash
# No Supabase SQL Editor
psql -f database/33-criar-tabela-contador-diario.sql
```

### 2. Configurar Variáveis de Ambiente
```bash
# Adicionar no painel da Vercel ou .env
CRON_SECRET=seu_secret_aqui
```

### 3. Deploy
```bash
# O cron será ativado automaticamente após deploy
vercel --prod
```

## Testes

### Teste Local
```bash
# Executar script de teste
npx tsx scripts/testar-contador-diario.ts
```

### Teste Manual do Cron
```bash
# Chamar endpoint diretamente
curl -H "Authorization: Bearer SEU_CRON_SECRET" \
     https://seu-dominio.vercel.app/api/cron/incrementar-contador-diario
```

### Verificar Status
```bash
# Consultar status atual
curl https://seu-dominio.vercel.app/api/contador-diario/status
```

## Monitoramento

### Logs da Vercel
- Acesse o painel da Vercel
- Vá em "Functions" > "Cron Jobs"
- Monitore execuções diárias

### Verificação Manual
```javascript
// Consultar último registro
const response = await fetch('/api/contador-diario/status')
const { data } = await response.json()
console.log(`Número atual: ${data.numero_atual}`)
```

## Estatísticas

### Cálculos Importantes
- **Início**: 27/01/2026 (data atual)
- **Fim**: 31/12/2078
- **Duração**: ~52 anos e 11 meses
- **Total de dias**: ~19.330 dias
- **Execuções diárias**: 1 por dia

### Exemplo de Progresso
```
Número atual: 365
Dias restantes: 18.965
Progresso: 1.89%
```

## Troubleshooting

### Problemas Comuns

1. **Cron não executa**
   - Verificar configuração no `vercel.json`
   - Confirmar deploy na Vercel
   - Checar logs de execução

2. **Erro de autenticação**
   - Validar `CRON_SECRET` nas variáveis de ambiente
   - Verificar header de autorização

3. **Erro no banco**
   - Confirmar execução do script SQL
   - Verificar permissões do service role
   - Testar função manualmente

4. **Números duplicados**
   - Verificar se há múltiplas execuções
   - Analisar logs de cron
   - Confirmar timezone da execução

### Comandos de Diagnóstico
```sql
-- Verificar últimos registros
SELECT * FROM contador_diario ORDER BY id DESC LIMIT 10;

-- Verificar função existe
SELECT proname FROM pg_proc WHERE proname = 'incrementar_contador_diario';

-- Testar função manualmente
SELECT incrementar_contador_diario();
```

## Manutenção

### Backup Regular
- Dados são automaticamente incluídos no backup do Supabase
- Considerar export periódico para segurança extra

### Monitoramento de Performance
- Tabela crescerá ~365 registros por ano
- Após 50 anos: ~19.000 registros
- Performance deve permanecer boa com índices padrão

### Extensão do Prazo
Para estender além de 2078:
1. Alterar data limite na função SQL
2. Atualizar validação no endpoint
3. Redeploy da aplicação