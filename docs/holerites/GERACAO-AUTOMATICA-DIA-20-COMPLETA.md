# 🤖 Geração Automática de Adiantamentos - Dia 20

## 📋 Resumo Executivo

Sistema totalmente automatizado que gera e disponibiliza adiantamentos salariais (40%) no dia 20 de cada mês (ou último dia útil anterior).

## ✨ Características Principais

- **Geração:** Automática no dia 20
- **Valor:** 40% do salário base
- **Período:** Dia 15 até último dia do mês
- **Disponibilização:** Imediata (status "enviado")
- **Funcionários:** Apenas com salário quinzenal
- **Fins de semana/Feriados:** Antecipa para último dia útil

## 🎯 Como Funciona

### Processo Automático

1. **00:00 do dia 20** (ou dia útil anterior)
2. Sistema verifica se é o dia correto
3. Busca funcionários ativos com salário quinzenal
4. Calcula 40% do salário base de cada um
5. Cria holerite com status "enviado"
6. Funcionários veem imediatamente no perfil

### Exemplo Prático

**Fevereiro 2026:**
- Dia 20 (sexta-feira) às 00:00
- Sistema gera adiantamentos
- Período: 15/02/2026 até 28/02/2026
- Funcionários acessam imediatamente

## 📅 Calendário 2026

| Mês | Dia 20 | Dia Útil | Disponibilização |
|-----|--------|----------|------------------|
| Jan | Ter | Sim | 20/01 |
| Fev | Sex | Sim | 20/02 |
| Mar | Sex | Sim | 20/03 |
| Abr | Seg | Sim | 20/04 |
| Mai | Qua | Sim | 20/05 |
| Jun | Sáb | Não | 19/06 |
| Jul | Seg | Sim | 20/07 |
| Ago | Qui | Sim | 20/08 |
| Set | Dom | Não | 18/09 |
| Out | Ter | Sim | 20/10 |
| Nov | Sex | Sim | 20/11 |
| Dez | Dom | Não | 18/12 |

## 🔧 Implementação

### API CRON
- **Endpoint:** `/api/cron/gerar-disponibilizar-adiantamentos`
- **Método:** GET
- **Autenticação:** CRON_SECRET
- **Execução:** Diária às 00:00

### Configuração Vercel
```json
{
  "crons": [{
    "path": "/api/cron/gerar-disponibilizar-adiantamentos",
    "schedule": "0 0 * * *"
  }]
}
```

---

**Implementado:** 18/02/2026  
**Status:** ✅ Ativo
