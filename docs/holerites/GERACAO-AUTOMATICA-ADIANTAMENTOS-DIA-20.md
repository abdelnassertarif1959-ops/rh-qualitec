# Geração Automática de Adiantamentos no Dia 20 - 18/02/2026

## Objetivo

Implementar geração e disponibilização automática de adiantamentos salariais no dia 20 de cada mês, ou no último dia útil anterior caso o dia 20 caia em feriado ou fim de semana.

## Regras de Negócio

### Dia de Execução

- **Dia 20 em dia útil (seg-sex)**: Executar no dia 20
- **Dia 20 em sábado**: Executar no dia 19 (sexta-feira)
- **Dia 20 em domingo**: Executar no dia 18 (sexta-feira)

### Período do Adiantamento

- **Início**: Dia 15 do mês atual
- **Fim**: Último dia do mês atual
- **Data de pagamento**: Dia 20 (ou dia útil anterior)

### Valor do Adiantamento

- **Cálculo**: 40% do salário base do funcionário
- **Descontos**: Nenhum desconto aplicado no adiantamento
- **Salário líquido**: Igual ao valor do adiantamento

### Funcionários Elegíveis

- Funcionários com `tipo_salario = 'quinzenal'`
- Funcionários com `ativo = true`

## Implementação

### API de Cron

**Arquivo**: `server/api/cron/gerar-adiantamentos-dia-20.get.ts`

Esta API deve ser configurada no Vercel Cron Jobs para executar **diariamente**.

#### Fluxo de Execução

1. **Verificação de autenticação**: Valida que a requisição vem do cron job
2. **Cálculo do dia de execução**: Determina se hoje é o dia correto
3. **Busca de funcionários**: Lista todos os funcionários elegíveis
4. **Verificação de duplicatas**: Verifica se já existe adiantamento para o período
5. **Cálculo do valor**: Calcula 40% do salário base
6. **Criação do holerite**: Insere o adiantamento no banco de dados
7. **Disponibilização automática**: Holerite já fica disponível para o funcionário

#### Exemplo de Resposta

```json
{
  "success": true,
  "message": "Adiantamentos gerados e disponibilizados automaticamente no dia 20",
  "dia_atual": 20,
  "dia_execucao": 20,
  "acao_executada": true,
  "funcionarios_processados": 15,
  "holerites_criados": 15,
  "periodo": {
    "inicio": "2026-02-15",
    "fim": "2026-02-28",
    "data_pagamento": "2026-02-20"
  }
}
```

## Configuração do Vercel Cron Job

### Arquivo: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/gerar-adiantamentos-dia-20",
      "schedule": "0 6 * * *"
    }
  ]
}
```

**Schedule**: `0 6 * * *` = Todos os dias às 06:00 UTC (03:00 BRT)

### Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

- `CRON_SECRET`: Chave secreta para autenticação do cron job
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase

## Exemplos de Execução em 2026

| Mês | Dia 20 | Dia da Semana | Dia de Execução |
|-----|--------|---------------|-----------------|
| Janeiro | 20/01 | Terça-feira | 20 |
| Fevereiro | 20/02 | Sexta-feira | 20 |
| Março | 20/03 | Sexta-feira | 20 |
| Abril | 20/04 | Segunda-feira | 20 |
| Maio | 20/05 | Quarta-feira | 20 |
| **Junho** | **20/06** | **Sábado** | **19** ⚠️ |
| Julho | 20/07 | Segunda-feira | 20 |
| Agosto | 20/08 | Quinta-feira | 20 |
| **Setembro** | **20/09** | **Domingo** | **18** ⚠️ |
| Outubro | 20/10 | Terça-feira | 20 |
| Novembro | 20/11 | Sexta-feira | 20 |
| **Dezembro** | **20/12** | **Domingo** | **18** ⚠️ |

## Segurança

### Autenticação de Cron Job

A API utiliza o middleware `requireCronAuth` que valida:

1. **Header Authorization**: Deve conter `Bearer ${CRON_SECRET}`
2. **Header x-vercel-cron**: Deve estar presente (enviado automaticamente pelo Vercel)

### Proteção contra Duplicatas

O sistema verifica se já existe um adiantamento para o mesmo funcionário e período antes de criar um novo.

## Monitoramento

### Logs

Todos os eventos são logados com prefixo `[CRON-ADIANTAMENTOS-DIA-20]`:

- ✅ Execução bem-sucedida
- ⏰ Dia não é o dia de execução
- 👥 Funcionários processados
- ❌ Erros encontrados

### Verificação Manual

Para testar manualmente, execute:

```bash
curl -X GET https://seu-dominio.vercel.app/api/cron/gerar-adiantamentos-dia-20 \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

## Scripts de Teste

### Teste de Lógica de Dia de Execução

```bash
node scripts/testar-geracao-adiantamento-dia-20.js
```

Este script testa todos os meses de 2026 e mostra qual será o dia de execução para cada mês.

## Diferenças da Implementação Anterior

### Antes (Dia 17)

- Adiantamentos eram **disponibilizados** no dia 17
- Precisavam ser **gerados manualmente** pelo admin antes
- Dois passos: geração + disponibilização

### Agora (Dia 20)

- Adiantamentos são **gerados E disponibilizados** automaticamente no dia 20
- Processo totalmente automático
- Um único passo: geração + disponibilização simultânea

## Benefícios

1. **Automação completa**: Sem necessidade de intervenção manual
2. **Consistência**: Sempre no dia 20 ou último dia útil anterior
3. **Confiabilidade**: Verificação diária garante execução
4. **Transparência**: Logs detalhados de todas as operações
5. **Segurança**: Proteção contra duplicatas e autenticação robusta

## Manutenção

### Adicionar Feriados

Para considerar feriados nacionais, adicione lógica de verificação de feriados na função `calcularDiaExecucao()`.

### Alterar Percentual do Adiantamento

Atualmente configurado em 40%. Para alterar, modifique a linha:

```typescript
const valorAdiantamento = salarioBase * 0.4 // Alterar aqui
```

### Alterar Dia de Execução

Para mudar do dia 20 para outro dia, altere a constante no início da função `calcularDiaExecucao()`.

## Data de Implementação

18 de fevereiro de 2026 - 12:00
