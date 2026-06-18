# Lógicas Automáticas Permanentes - Sistema de Holerites

## Data de Implementação: 18/02/2026

Este documento descreve todas as lógicas automáticas implementadas que funcionarão permanentemente nos próximos meses.

---

## 1. Geração Automática de Adiantamentos no Dia 20

### Funcionamento Permanente

**Cron Job**: Executa diariamente às 06:00 UTC (03:00 BRT)

**Lógica de Dia de Execução**:
- Se dia 20 é dia útil (seg-sex): executa no dia 20
- Se dia 20 é sábado: executa no dia 19 (sexta-feira)
- Se dia 20 é domingo: executa no dia 18 (sexta-feira)

**Período do Adiantamento**:
- Início: Dia 15 do mês atual
- Fim: Último dia do mês atual
- Data de pagamento: Dia 20 (ou dia útil anterior)

**Valor**: 40% do salário base

**Funcionários Elegíveis**: 
- `tipo_salario = 'quinzenal'`
- `ativo = true`

**Disponibilização**: Automática (já fica disponível no perfil do funcionário)

### Exemplos de Execução Futura

| Mês | Dia 20 | Dia da Semana | Dia de Execução | Período Gerado |
|-----|--------|---------------|-----------------|----------------|
| Fevereiro 2026 | 20/02 | Sexta | 20 | 15/02 - 28/02 |
| Março 2026 | 20/03 | Sexta | 20 | 15/03 - 31/03 |
| Abril 2026 | 20/04 | Segunda | 20 | 15/04 - 30/04 |
| Maio 2026 | 20/05 | Quarta | 20 | 15/05 - 31/05 |
| **Junho 2026** | **20/06** | **Sábado** | **19** | 15/06 - 30/06 |
| Julho 2026 | 20/07 | Segunda | 20 | 15/07 - 31/07 |
| Agosto 2026 | 20/08 | Quinta | 20 | 15/08 - 31/08 |
| **Setembro 2026** | **20/09** | **Domingo** | **18** | 15/09 - 30/09 |
| Outubro 2026 | 20/10 | Terça | 20 | 15/10 - 31/10 |
| Novembro 2026 | 20/11 | Sexta | 20 | 15/11 - 30/11 |
| **Dezembro 2026** | **20/12** | **Domingo** | **18** | 15/12 - 31/12 |

---

## 2. Remoção da Referência "Adiantamento Salarial"

### Funcionamento Permanente

**Onde**: Página de visualização de holerites do funcionário (`app/pages/holerites.vue`)

**Lógica**:
- Adiantamentos mostram apenas o mês de referência
- Exemplo: "fevereiro de 2026" (ao invés de "Adiantamento Salarial fevereiro de 2026")
- Folhas mensais continuam mostrando "Holerite janeiro de 2026"

**Aplicação**: Automática para todos os holerites futuros

---

## 3. Formatação de Período na Página Admin

### Funcionamento Permanente

**Onde**: Página admin de gestão de holerites (`app/pages/admin/holerites.vue`)

**Lógica**:
- **Adiantamentos**: Mostram apenas o mês (ex: "fevereiro de 2026")
- **Folhas Mensais**: Mostram o período completo do mês anterior (ex: "01/01/2026 - 31/01/2026")

**Detecção**: Verifica se o dia de início é 15 (adiantamento) ou não (mensal)

**Aplicação**: Automática para todos os holerites futuros

---

## 4. Cálculo Automático de Datas

### Funcionamento Permanente

**API**: `/api/holerites/gerar`

**Lógica de Adiantamentos**:
```
Se hoje está entre dia 15 e último dia do mês:
  - Período: dia 15 até último dia do mês ATUAL
  - Pagamento: dia 20 do mês ATUAL
  - Exemplo em 18/02/2026: período 15/02 - 28/02, pagamento 20/02
```

**Lógica de Folhas Mensais**:
```
Se hoje está entre dia 01 e 25 do mês:
  - Período: dia 01 até último dia do mês ANTERIOR
  - Pagamento: 5º dia útil do mês ATUAL
  - Exemplo em 09/02/2026: período 01/01 - 31/01, pagamento 07/02
```

**Aplicação**: Automática ao gerar holerites manualmente

---

## 5. Proteção Contra Duplicatas

### Funcionamento Permanente

**Onde**: API de geração de adiantamentos automáticos

**Lógica**:
- Antes de criar um adiantamento, verifica se já existe um para o mesmo funcionário e período
- Se existir, pula a criação
- Evita duplicação mesmo se o cron job executar múltiplas vezes

**Aplicação**: Automática em todas as execuções

---

## 6. Logs Detalhados

### Funcionamento Permanente

**Onde**: API de cron job (`/api/cron/gerar-adiantamentos-dia-20`)

**Informações Logadas**:
- Data e hora da execução
- Dia atual e dia de execução calculado
- Funcionários processados
- Adiantamentos criados
- Erros encontrados

**Prefixo**: `[CRON-ADIANTAMENTOS-DIA-20]`

**Aplicação**: Automática em todas as execuções

---

## Arquivos Modificados

### APIs
- `server/api/cron/gerar-adiantamentos-dia-20.get.ts` - Cron job de geração automática
- `server/api/holerites/gerar.post.ts` - Geração manual com datas automáticas

### Páginas
- `app/pages/holerites.vue` - Visualização do funcionário (sem "Adiantamento Salarial")
- `app/pages/admin/holerites.vue` - Gestão admin (formatação de período)

### Configuração
- `vercel.json` - Cron job configurado para execução diária

### Scripts de Teste
- `scripts/testar-geracao-adiantamento-dia-20.js` - Testa lógica de dia de execução
- `scripts/testar-referencia-adiantamento-simples.js` - Testa remoção de referência

---

## Manutenção Futura

### Adicionar Feriados

Para considerar feriados nacionais, edite a função `calcularDiaExecucao()` em:
`server/api/cron/gerar-adiantamentos-dia-20.get.ts`

Adicione verificação de feriados antes de retornar o dia de execução.

### Alterar Percentual do Adiantamento

Atualmente: 40% do salário base

Para alterar, modifique a linha:
```typescript
const valorAdiantamento = salarioBase * 0.4 // Alterar aqui
```

### Alterar Dia de Execução

Para mudar do dia 20 para outro dia, altere a constante no início da função `calcularDiaExecucao()`.

---

## Monitoramento

### Verificar Execução no Vercel

1. Acesse Vercel Dashboard
2. Vá para **Deployments** > **Functions**
3. Procure por `/api/cron/gerar-adiantamentos-dia-20`
4. Verifique os logs de execução

### Verificar no Banco de Dados

```sql
-- Verificar adiantamentos criados no mês atual
SELECT 
  h.id,
  f.nome_completo,
  h.periodo_inicio,
  h.periodo_fim,
  h.data_pagamento,
  h.salario_liquido,
  h.created_at
FROM holerites h
JOIN funcionarios f ON f.id = h.funcionario_id
WHERE h.periodo_inicio >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '14 days'
  AND h.periodo_fim = DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'
ORDER BY h.created_at DESC;
```

---

## Segurança

### Autenticação de Cron Job

- Header `Authorization: Bearer ${CRON_SECRET}` obrigatório
- Header `x-vercel-cron` verificado (enviado automaticamente pelo Vercel)

### Variáveis de Ambiente Necessárias

- `CRON_SECRET` - Chave secreta para autenticação
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase

---

## Benefícios das Lógicas Automáticas

1. **Zero Intervenção Manual**: Adiantamentos gerados automaticamente todo mês
2. **Consistência**: Sempre no dia 20 ou último dia útil anterior
3. **Confiabilidade**: Proteção contra duplicatas e logs detalhados
4. **Transparência**: Funcionários veem apenas o mês, sem confusão
5. **Escalabilidade**: Funciona para qualquer número de funcionários
6. **Manutenibilidade**: Código bem documentado e testado

---

## Próximas Execuções Automáticas

- **20/02/2026** (Sexta): Primeira execução automática
- **20/03/2026** (Sexta): Segunda execução
- **20/04/2026** (Segunda): Terceira execução
- E assim por diante, todo mês...

---

## Commits Realizados

1. `7e85ed9` - feat: Geração automática adiantamentos dia 20 e remoção referência - 18/02/2026 12:30
2. `eceb1d1` - docs: Instruções verificação cron job adiantamentos - 18/02/2026
3. `a6f21b0` - fix: Adiantamentos mostram apenas mês de referência - 18/02/2026

---

**Última Atualização**: 18/02/2026 13:00  
**Status**: ✅ Todas as lógicas implementadas e testadas  
**Próxima Ação**: Aguardar execução automática no dia 20/02/2026
