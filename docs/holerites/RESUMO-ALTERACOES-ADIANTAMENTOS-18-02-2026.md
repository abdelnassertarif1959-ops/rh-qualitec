# Resumo das Alterações - Adiantamentos Automáticos - 18/02/2026

## Alterações Implementadas

### 1. Remoção da Referência "Adiantamento Salarial"

**Arquivo**: `app/pages/holerites.vue`

**Antes**: Adiantamentos mostravam "Adiantamento Salarial fevereiro de 2026"

**Depois**: Adiantamentos mostram apenas "fevereiro de 2026"

**Motivo**: O usuário não deve ver explicitamente que é um adiantamento, apenas o mês de referência.

### 2. Geração Automática de Adiantamentos no Dia 20

**Arquivos Criados**:
- `server/api/cron/gerar-adiantamentos-dia-20.get.ts` - API de cron job
- `scripts/testar-geracao-adiantamento-dia-20.js` - Script de teste
- `docs/holerites/GERACAO-AUTOMATICA-ADIANTAMENTOS-DIA-20.md` - Documentação completa

**Arquivo Modificado**:
- `vercel.json` - Adicionado novo cron job

#### Regras de Negócio

- **Dia de execução**: Dia 20 ou último dia útil anterior
  - Dia 20 em dia útil (seg-sex): executa no dia 20
  - Dia 20 em sábado: executa no dia 19 (sexta)
  - Dia 20 em domingo: executa no dia 18 (sexta)

- **Período do adiantamento**: Dia 15 até último dia do mês
- **Valor**: 40% do salário base
- **Funcionários elegíveis**: `tipo_salario = 'quinzenal'` e `ativo = true`
- **Disponibilização**: Automática (já fica disponível no perfil)

#### Configuração do Cron Job

```json
{
  "path": "/api/cron/gerar-adiantamentos-dia-20",
  "schedule": "0 6 * * *"
}
```

**Schedule**: Executa diariamente às 06:00 UTC (03:00 BRT)

A API verifica se é o dia correto e executa apenas quando necessário.

#### Exemplos de Execução em 2026

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

## Testes Realizados

### Teste de Lógica de Dia de Execução

```bash
node scripts/testar-geracao-adiantamento-dia-20.js
```

**Resultado**: ✅ Todos os 12 meses de 2026 testados com sucesso

## Próximos Passos

1. ✅ Configurar cron job no `vercel.json`
2. ⏳ Fazer commit e push das alterações
3. ⏳ Verificar no Vercel Dashboard se o cron job foi registrado
4. ⏳ Aguardar o dia 20/02/2026 para validar a execução automática

## Variáveis de Ambiente Necessárias

Certifique-se de que as seguintes variáveis estão configuradas no Vercel:

- `CRON_SECRET` - Chave secreta para autenticação do cron job
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase

## Segurança

- ✅ Autenticação via `requireCronAuth`
- ✅ Proteção contra duplicatas
- ✅ Logs detalhados de todas as operações
- ✅ Validação de funcionários elegíveis

## Diferenças da Implementação Anterior

### Antes (Dia 17)
- Adiantamentos eram **disponibilizados** no dia 17
- Precisavam ser **gerados manualmente** pelo admin antes
- Dois passos: geração + disponibilização

### Agora (Dia 20)
- Adiantamentos são **gerados E disponibilizados** automaticamente no dia 20
- Processo totalmente automático
- Um único passo: geração + disponibilização simultânea

## Data de Implementação

18 de fevereiro de 2026 - 12:30
