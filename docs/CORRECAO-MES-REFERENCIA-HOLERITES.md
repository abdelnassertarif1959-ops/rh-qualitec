# Correção: Mês de Referência dos Holerites

## Problema Identificado

Os holerites estavam exibindo o mês de referência incorreto. Por exemplo:
- Holerites com `periodo_inicio = 2026-04-01` e `periodo_fim = 2026-04-30` (abril)
- Estavam sendo exibidos como "março de 2026" em vez de "abril de 2026"

## Causa Raiz

A lógica estava assumindo incorretamente que:
- Para folhas mensais: mês de referência = mês ANTERIOR ao `periodo_inicio`
- Isso estava subtraindo 1 mês do `periodo_inicio`

## Regra Correta

**O mês de referência é SEMPRE o mês do `periodo_inicio` (mês trabalhado)**

Exemplos:
- `periodo_inicio = 2026-04-01` → Mês de referência: "abril de 2026"
- `periodo_inicio = 2026-04-20` (adiantamento) → Mês de referência: "abril de 2026"

## Arquivos Corrigidos

### Frontend
1. **app/pages/admin/holerites.vue** - Função `formatarPeriodo`
2. **app/composables/useHolerites.ts** - Função `formatarPeriodoReferencia`
3. **app/components/holerites/HoleriteCard.vue** - Função `formatarPeriodoReferencia`
4. **app/components/holerites/HoleriteModal.vue** - Função `formatarPeriodoReferencia`

### Backend
1. **server/utils/holeriteHTML.ts** - Lógica de cálculo do `mesReferencia`
2. **server/utils/notifications.ts** - Função `calcularMesReferencia`
3. **server/api/holerites/[id]/enviar-email.post.ts** - Função `buildReferencia`

## Código Correto

```typescript
// ✅ CORRETO: Usar o mês do periodo_inicio
const dataInicio = new Date(periodo_inicio + 'T00:00:00')
const mesReferencia = dataInicio.toLocaleDateString('pt-BR', { 
  month: 'long', 
  year: 'numeric' 
})

// ❌ INCORRETO: Subtrair 1 mês
const mesAnterior = new Date(dataInicio)
mesAnterior.setMonth(mesAnterior.getMonth() - 1) // NÃO FAZER ISSO!
```

## Detecção de Adiantamentos

Adiantamentos são identificados pelo dia de início:
- Dia 15 ou 20 = Adiantamento
- Dia 1 = Folha Mensal

```typescript
const diaInicio = dataInicio.getDate()
const isAdiantamento = diaInicio === 15 || diaInicio === 20
```

## Prevenção de Regressão

Para evitar que esse problema ocorra novamente:

1. **Sempre usar `periodo_inicio` como referência**
   - Nunca subtrair meses do `periodo_inicio` para folhas mensais
   - O `periodo_inicio` já representa o mês trabalhado

2. **Testes de validação**
   - Verificar que holerites de abril mostram "abril"
   - Verificar que holerites de maio mostram "maio"
   - Etc.

3. **Documentação clara**
   - Comentários no código explicando a lógica
   - Este documento como referência

## Data da Correção

28 de abril de 2026

## Impacto

- ✅ Listagem de holerites agora mostra o mês correto
- ✅ PDFs de holerites agora mostram o mês correto
- ✅ Emails de holerites agora mostram o mês correto
- ✅ Notificações agora mostram o mês correto
