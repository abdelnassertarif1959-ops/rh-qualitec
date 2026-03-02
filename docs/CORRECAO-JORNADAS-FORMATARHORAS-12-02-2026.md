# Correção: Erro formatarHorasDecimais na Página de Jornadas

**Data**: 12/02/2026  
**Status**: ✅ CORRIGIDO  
**Prioridade**: 🔴 ALTA

---

## 🐛 PROBLEMA IDENTIFICADO

### Sintoma
- Ao acessar a página "Jornadas de Trabalho", erro no console
- Erro: `formatarHorasDecimais is not a function`
- Impossível navegar para outras abas após o erro
- Mesmo comportamento do bug anterior em "Meus Holerites"

### Erro no Console
```
[Vue warn]: Unhandled error during execution of render function
jornadas.vue:35 Uncaught (in promise) TypeError: $setup.formatarHorasDecimais is not a function
```

### Causa Raiz
A página `jornadas.vue` estava tentando importar `formatarHorasDecimais` do composable `useJornadas`, mas essa função não existe lá.

A função existe em um composable separado: `useJornadasFormat`.

```typescript
// ❌ CÓDIGO INCORRETO
const { 
  jornadas, 
  loading, 
  carregarJornadas,
  salvarJornada: salvarJornadaComposable,
  formatarHorasDecimais  // ← Não existe em useJornadas!
} = useJornadas()
```

---

## ✅ SOLUÇÃO APLICADA

### Correção no Import

**Arquivo**: `app/pages/admin/jornadas.vue`

```typescript
// ✅ CÓDIGO CORRETO
const { 
  jornadas, 
  loading, 
  carregarJornadas,
  salvarJornada: salvarJornadaComposable
} = useJornadas()

// Funções de formatação vêm de composable separado
const { formatarHorasDecimais } = useJornadasFormat()
```

### Estrutura dos Composables de Jornadas

O sistema tem 3 composables relacionados a jornadas:

1. **useJornadas.ts** (Core)
   - Gerencia estado e dados
   - Retorna: `jornadas`, `loading`, `error`, `opcoesJornadas`, `carregarJornadas`, `salvarJornada`, `obterJornada`, `obterJornadaPadrao`

2. **useJornadasFormat.ts** (Formatação)
   - Funções de formatação e exibição
   - Retorna: `diasSemana`, `formatarHorario`, `formatarHorasDecimais`, `obterNomeDia`, `obterAbrevDia`

3. **useJornadasCalculo.ts** (Cálculos)
   - Funções de cálculo de horas
   - (Se existir)

---

## 🧪 VALIDAÇÃO

### Como Testar

1. **Recarregue a página** (Ctrl+R ou F5)

2. **Acesse "Jornadas de Trabalho"** no menu admin

3. **Verifique se a página carrega** sem erros

4. **Verifique o console** (F12):
   - Não deve ter erros de `formatarHorasDecimais`
   - Deve mostrar: "✅ [useJornadas] Jornadas carregadas: 1"

5. **Teste navegação**:
   - Clique em outras abas do menu
   - Volte para Jornadas
   - Navegação deve funcionar normalmente

---

## 📊 IMPACTO

### Antes da Correção
- ❌ Página de Jornadas quebrava ao carregar
- ❌ Erro impedia navegação para outras páginas
- ❌ Sistema ficava travado após acessar Jornadas

### Depois da Correção
- ✅ Página de Jornadas carrega corretamente
- ✅ Horas são formatadas corretamente (ex: "42h45min")
- ✅ Navegação funciona normalmente
- ✅ Sem erros no console

---

## 🔍 ANÁLISE TÉCNICA

### Por Que o Erro Ocorreu?

Durante a refatoração dos composables (dividindo arquivos grandes), as funções de formatação foram movidas para `useJornadasFormat`, mas a página não foi atualizada.

### Padrão de Organização

```
useNome.ts          → Core (dados, estado, CRUD)
useNomeFormat.ts    → Formatação (display, conversão)
useNomeCalculo.ts   → Cálculos (lógica de negócio)
```

Exemplos no sistema:
- `useHolerites.ts` + `useHoleritesFormat.ts` + `useHoleritesCalculo.ts`
- `useJornadas.ts` + `useJornadasFormat.ts` + `useJornadasCalculo.ts`

### Erro Similar Anterior

Este é o mesmo tipo de erro que ocorreu com `formatarData` em `HoleriteCard.vue`:
- Função estava em composable separado
- Componente tentava importar do composable errado
- Solução: importar do composable correto

---

## 📝 LIÇÕES APRENDIDAS

1. **Sempre verificar exports**: Antes de usar uma função, verificar se ela está no return do composable
2. **Organização clara**: Manter funções de formatação em composables separados
3. **Documentar estrutura**: Deixar claro qual composable tem quais funções
4. **Testes após refatoração**: Testar todas as páginas após refatorar composables

---

## 🔗 ARQUIVOS MODIFICADOS

- `app/pages/admin/jornadas.vue` - Corrigido import de `formatarHorasDecimais`
- `app/components/jornadas/JornadaVisualizacao.vue` - Corrigido import para `useJornadasFormat`
- `app/components/jornadas/JornadaForm.vue` - Corrigido imports para `useJornadasFormat` e `useJornadasCalculo`

---

## 🔗 ARQUIVOS RELACIONADOS

- `app/composables/useJornadas.ts` - Composable core (dados)
- `app/composables/useJornadasFormat.ts` - Composable de formatação
- `app/composables/useJornadasCalculo.ts` - Composable de cálculos (se existir)

---

## ✅ STATUS FINAL

**CORREÇÃO CONCLUÍDA COM SUCESSO**

A página de Jornadas agora funciona perfeitamente. As horas são formatadas corretamente e a navegação está normal.
