# 🤖 Geração e Disponibilização Automática de Adiantamentos - Dia 20

## 🎯 Funcionalidade

Sistema que **gera E disponibiliza automaticamente** os holerites de adiantamento salarial (40%) no perfil dos funcionários **todo dia 20 do mês** (ou último dia útil anterior se cair em feriado/fim de semana).

## ✨ Como Funciona

### Nova Lógica (Implementada em 18/02/2026)

**Geração e Disponibilização Automática no Dia 20:**
- Sistema executa automaticamente todo dia 20 às 00:00
- Verifica se é dia útil (não é fim de semana ou feriado)
- Se não for dia útil, antecipa para o último dia útil anterior
- Gera adiantamentos (40% do salário base)
- Disponibiliza IMEDIATAMENTE no perfil dos funcionários
- Status já é `"enviado"` (não passa por "gerado")
- Funcionários podem visualizar e baixar imediatamente

### Cálculo do Dia de Disponibilização

**Regras:**
1. Dia padrão: 20 do mês
2. Se dia 20 cair em sábado → antecipa para sexta (dia 19)
3. Se dia 20 cair em domingo → antecipa para sexta (dia 18)
4. Se dia 20 cair em feriado → antecipa para último dia útil anterior

**Feriados Nacionais Considerados:**
- 01/01 - Ano Novo
- 21/04 - Tiradentes
- 01/05 - Dia do Trabalho
- 07/09 - Independência
- 12/10 - Nossa Senhora Aparecida
- 02/11 - Finados
- 15/11 - Proclamação da República
- 25/12 - Natal

### Exemplos de Datas em 2026

| Mês | Dia 20 | Dia da Semana | Dia de Disponibilização |
|-----|--------|---------------|-------------------------|
| Janeiro | 20 | Terça | 20 (dia útil) |
| Fevereiro | 20 | Sexta | 20 (dia útil) |
| Março | 20 | Sexta | 20 (dia útil) |
| Abril | 20 | Segunda | 20 (dia útil) |
| Maio | 20 | Quarta | 20 (dia útil) |
| Junho | 20 | Sábado | 19 (antecipado) |
| Julho | 20 | Segunda | 20 (dia útil) |
| Agosto | 20 | Quinta | 20 (dia útil) |
| Setembro | 20 | Domingo | 18 (antecipado) |
| Outubro | 20 | Terça | 20 (dia útil) |
| Novembro | 20 | Sexta | 20 (dia útil) |
| Dezembro | 20 | Domingo | 18 (antecipado) |

## 🔧 Implementação Técnica

### API CRON Criada

#### `/api/cron/gerar-disponibilizar-adiantamentos` (GET)
**Função:** Gera E disponibiliza adiantamentos automaticamente no dia 20

**Lógica:**
1. Verifica se é dia 20 (ou último dia útil anterior)
2. Calcula o dia de disponibilização considerando fins de semana e feriados
3. Se não for o dia correto, retorna sem executar
4. Busca funcionários ativos com salário quinzenal
5. Para cada funcionário:
   - Verifica se já existe adiantamento para o período
   - Calcula 40% do salário base
   - Cria holerite com status `"enviado"` (já disponibilizado)
   - Período: dia 15 até último dia do mês
6. Retorna relatório completo da operação

**Segurança:**
- Requer autenticação CRON (token ou IP Vercel)
- Validação de data (só executa no dia correto)
- Validação de funcionários ativos
- Validação de duplicação (não cria se já existe)

**Resposta:**
```json
{
  "success": true,
  "message": "Geração automática concluída: 3 adiantamento(s) gerado(s) e disponibilizado(s)",
  "executado": true,
  "data_execucao": "2026-02-20T00:00:00.000Z",
  "dia_execucao": 20,
  "periodo_inicio": "2026-02-15",
  "periodo_fim": "2026-02-28",
  "funcionarios_encontrados": 3,
  "adiantamentos_gerados": 3,
  "erros": 0,
  "resultados": [...]
}
```

## 📅 Cronograma de Execução

### Fluxo Mensal Automático

```
Dia 20 (ou último dia útil anterior):
        ↓
Sistema executa automaticamente às 00:00
        ↓
Verifica funcionários com salário quinzenal
        ↓
Gera adiantamentos (40% do salário base)
        ↓
Disponibiliza IMEDIATAMENTE (status: "enviado")
        ↓
Funcionários VEEM no perfil instantaneamente
        ↓
Funcionários podem baixar PDF/HTML
```

### Exemplo Prático - Fevereiro 2026

```
Dia 20/02 (Sexta-feira):
00:00 - Sistema executa CRON job
00:01 - Adiantamentos gerados e disponibilizados
00:02 - Funcionários podem acessar

Funcionário vê:
- Referência: "fevereiro de 2026"
- Período: 15/02/2026 até 28/02/2026
- Valor: 40% do salário base
- Status: Disponível para visualização
```

## 🎮 Como Usar

### Para Funcionários

#### Visualização Automática (A partir do Dia 20)
1. Sistema gera automaticamente no dia 20
2. Acesse **Meus Holerites**
3. Veja adiantamentos disponíveis imediatamente
4. Baixe PDF/HTML conforme necessário

**Não é necessária nenhuma ação do admin!**

### Para Admins

#### Monitoramento
1. Acesse **Admin → Holerites**
2. Verifique adiantamentos gerados automaticamente
3. Confirme que funcionários têm acesso

#### Teste Manual (Desenvolvimento)
```bash
# Chamar API diretamente (requer autenticação CRON)
curl -X GET /api/cron/gerar-disponibilizar-adiantamentos \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

#### Verificação no Banco
```sql
-- Ver adiantamentos gerados hoje
SELECT 
  h.id,
  f.nome_completo,
  h.periodo_inicio,
  h.periodo_fim,
  h.salario_base as valor_adiantamento,
  h.status,
  h.data_pagamento
FROM holerites h
JOIN funcionarios f ON f.id = h.funcionario_id
WHERE h.periodo_inicio LIKE '%-15'
  AND h.data_pagamento = CURRENT_DATE
ORDER BY f.nome_completo;
```

## 📊 Monitoramento

### Logs do Sistema

**Durante a execução, você verá:**
```
🗓️ [GERAR-ADIANTAMENTOS] Executando em 2026-02-20
📅 Dia atual: 20 | Mês: 2 | Ano: 2026
✅ Dia correto para disponibilização: 20
👥 3 funcionário(s) com salário quinzenal encontrado(s)
📅 Período do adiantamento: 2026-02-15 até 2026-02-28
🔄 Gerando adiantamento para: João Silva
✅ Adiantamento gerado e disponibilizado: João Silva - R$ 2.000,00
🔄 Gerando adiantamento para: Maria Santos
✅ Adiantamento gerado e disponibilizado: Maria Santos - R$ 1.800,00
🔄 Gerando adiantamento para: Pedro Costa
✅ Adiantamento gerado e disponibilizado: Pedro Costa - R$ 2.200,00
🎉 Geração automática concluída: 3 adiantamento(s) gerado(s) e disponibilizado(s)
📊 Resumo:
   - Funcionários encontrados: 3
   - Adiantamentos gerados: 3
   - Erros: 0
```

**Se não for o dia correto:**
```
🗓️ [GERAR-ADIANTAMENTOS] Executando em 2026-02-18
📅 Dia atual: 18 | Mês: 2 | Ano: 2026
⏰ Não é dia de disponibilização (dia 20). Hoje é dia 18.
```

### Resposta da API

```json
{
  "success": true,
  "message": "Geração automática concluída: 3 adiantamento(s) gerado(s) e disponibilizado(s)",
  "executado": true,
  "data_execucao": "2026-02-20T00:00:00.000Z",
  "dia_execucao": 20,
  "periodo_inicio": "2026-02-15",
  "periodo_fim": "2026-02-28",
  "funcionarios_encontrados": 3,
  "adiantamentos_gerados": 3,
  "erros": 0,
  "resultados": [
    {
      "funcionario": "João Silva",
      "holerite_id": "123",
      "status": "gerado_e_disponibilizado",
      "valor": 2000.00
    },
    {
      "funcionario": "Maria Santos",
      "holerite_id": "124",
      "status": "gerado_e_disponibilizado",
      "valor": 1800.00
    },
    {
      "funcionario": "Pedro Costa",
      "holerite_id": "125",
      "status": "gerado_e_disponibilizado",
      "valor": 2200.00
    }
  ]
}
```

**Se não for o dia correto:**
```json
{
  "success": false,
  "message": "Disponibilização automática executa no dia 20. Hoje é dia 18.",
  "executado": false,
  "dia_atual": 18,
  "dia_disponibilizacao": 20
}
```

## 🔐 Segurança

### Validações Implementadas

1. **Autenticação CRON:** Requer token secreto ou IP Vercel autorizado
2. **Data:** Só executa no dia 20 (ou último dia útil anterior)
3. **Funcionários:** Só processa funcionários ativos com salário quinzenal
4. **Duplicação:** Não cria se já existe adiantamento para o período
5. **Período:** Valida que o período é do dia 15 ao último dia do mês

### Proteções

- ✅ Não processa funcionários inativos
- ✅ Não processa funcionários com salário mensal
- ✅ Não cria adiantamentos duplicados
- ✅ Não executa fora do dia correto
- ✅ Log completo de todas as operações
- ✅ Tratamento de erros individual por funcionário
- ✅ Validação de fins de semana e feriados

## 🚀 Configuração de Cron Automático

### Vercel Cron Jobs (Recomendado)

Já configurado em `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/gerar-disponibilizar-adiantamentos",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Configuração:**
- Executa todo dia às 00:00 (meia-noite)
- Vercel envia requisição automaticamente
- Não requer configuração adicional
- Logs disponíveis no dashboard Vercel

**Variável de Ambiente Necessária:**
```env
CRON_SECRET=seu_token_secreto_aqui
```

### GitHub Actions (Alternativa)

Crie `.github/workflows/gerar-adiantamentos.yml`:
```yaml
name: Gerar Adiantamentos Automáticos
on:
  schedule:
    - cron: '0 0 * * *'  # Todo dia às 00:00 UTC
jobs:
  gerar:
    runs-on: ubuntu-latest
    steps:
      - name: Chamar API CRON
        run: |
          curl -X GET https://seu-dominio.com/api/cron/gerar-disponibilizar-adiantamentos \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## 🧪 Testes

### Teste Manual da API

```bash
# Chamar API diretamente (requer CRON_SECRET)
curl -X GET https://seu-dominio.com/api/cron/gerar-disponibilizar-adiantamentos \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

### Verificar Funcionários Quinzenais

```sql
-- Ver funcionários que receberão adiantamento
SELECT 
  id,
  nome_completo,
  salario_base,
  tipo_salario,
  ativo
FROM funcionarios
WHERE tipo_salario = 'quinzenal'
  AND ativo = true;
```

### Verificar Adiantamentos Gerados

```sql
-- Ver adiantamentos do mês atual
SELECT 
  h.id,
  f.nome_completo,
  h.periodo_inicio,
  h.periodo_fim,
  h.salario_base as valor_adiantamento,
  h.status,
  h.data_pagamento,
  h.observacoes
FROM holerites h
JOIN funcionarios f ON f.id = h.funcionario_id
WHERE h.periodo_inicio LIKE '%-15'
  AND EXTRACT(MONTH FROM h.periodo_inicio::date) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM h.periodo_inicio::date) = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY f.nome_completo;
```

### Teste de Cálculo de Data

Use o script criado:
```bash
node scripts/testar-dia-disponibilizacao-adiantamento.js
```

**Saída esperada:**
```
🧪 Testando cálculo do dia de disponibilização de adiantamentos

📅 Fevereiro 2026:
   Dia 20 cai em: Sexta-feira
   ✅ Dia de disponibilização: 20 (dia útil)

📅 Junho 2026:
   Dia 20 cai em: Sábado
   ✅ Dia de disponibilização: 19 (antecipado de sábado)

📅 Setembro 2026:
   Dia 20 cai em: Domingo
   ✅ Dia de disponibilização: 18 (antecipado de domingo)

✅ Todos os testes passaram!
```

## ❓ Troubleshooting

### Problema: Adiantamentos não foram gerados no dia 20

**Verificações:**
1. ✅ CRON job está configurado no Vercel?
2. ✅ Variável `CRON_SECRET` está configurada?
3. ✅ API está respondendo?
4. ✅ Existem funcionários com salário quinzenal?
5. ✅ Funcionários estão ativos?

**Solução:**
```bash
# 1. Verificar logs no Vercel Dashboard
# 2. Testar API manualmente
curl -X GET https://seu-dominio.com/api/cron/gerar-disponibilizar-adiantamentos \
  -H "Authorization: Bearer SEU_CRON_SECRET"

# 3. Verificar funcionários quinzenais
# (usar query SQL acima)
```

### Problema: Adiantamentos duplicados

**Causa:** API foi chamada múltiplas vezes no mesmo dia

**Verificação:**
```sql
-- Ver duplicações
SELECT 
  funcionario_id,
  periodo_inicio,
  periodo_fim,
  COUNT(*) as quantidade
FROM holerites
WHERE periodo_inicio LIKE '%-15'
GROUP BY funcionario_id, periodo_inicio, periodo_fim
HAVING COUNT(*) > 1;
```

**Prevenção:** 
- API já valida duplicação antes de criar
- Não deve acontecer em condições normais

### Problema: Dia de disponibilização incorreto

**Causa:** Lógica de cálculo de dia útil

**Verificação:**
```bash
# Testar cálculo
node scripts/testar-dia-disponibilizacao-adiantamento.js
```

**Solução:**
- Verificar se feriados estão atualizados na função
- Adicionar feriados municipais/estaduais se necessário

## 📈 Benefícios

### Para Admins
- ✅ Zero trabalho manual
- ✅ Processo 100% automatizado
- ✅ Funcionários sempre recebem no dia 20 (ou dia útil anterior)
- ✅ Não precisa lembrar de gerar ou disponibilizar
- ✅ Logs completos para auditoria

### Para Funcionários
- ✅ Previsibilidade total (sempre dia 20)
- ✅ Acesso automático e imediato
- ✅ Não precisa aguardar liberação manual
- ✅ Transparência no processo
- ✅ Disponível 24/7 no perfil

### Para a Empresa
- ✅ Processo totalmente automatizado
- ✅ Redução de erros humanos
- ✅ Maior satisfação dos funcionários
- ✅ Compliance com prazos
- ✅ Economia de tempo do RH
- ✅ Escalável (funciona para 10 ou 1000 funcionários)

## 🔄 Diferenças da Versão Anterior

### Antes (Dia 17 - Duas Etapas)
1. Admin gerava manualmente (qualquer dia)
2. Sistema disponibilizava automaticamente (dia 17)
3. Dois processos separados
4. Status intermediário "gerado"

### Agora (Dia 20 - Uma Etapa)
1. Sistema gera E disponibiliza automaticamente (dia 20)
2. Processo único e completo
3. Status direto "enviado"
4. Zero intervenção manual necessária

---

**Implementado em:** 18 de Fevereiro de 2026  
**Versão:** 2.0  
**Status:** ✅ Ativo  
**Próxima Execução:** 20 de Fevereiro de 2026 (ou dia útil anterior)