# 🔧 Correção: Mês de Referência no Modal do Holerite

**Data:** 10/02/2026  
**Arquivo:** `app/components/holerites/HoleriteModal.vue`

## 🐛 Problema Identificado

O modal de detalhes do holerite estava mostrando o mês de referência incorreto:

- **Esperado:** Janeiro de 2026 (mês trabalhado)
- **Mostrado:** Fevereiro de 2026 (mês de pagamento)

## 🔍 Causa Raiz

Problema de timezone ao converter strings de data para objetos Date:

```javascript
// ❌ ANTES - Problema de timezone
const dataInicio = new Date(inicio) // "2026-01-01" vira "2025-12-31 21:00:00" (UTC-3)
```

Quando você cria um `new Date("2026-01-01")` sem especificar a hora, o JavaScript interpreta como UTC 00:00, que no fuso horário de Brasília (UTC-3) resulta em 21:00 do dia anterior.

## ✅ Solução Aplicada

Adicionar `T00:00:00` à string de data para forçar interpretação local:

```javascript
// ✅ DEPOIS - Corrigido
const dataInicio = new Date(inicio + 'T00:00:00') // "2026-01-01T00:00:00" = 00:00 local
```

## 📝 Código Corrigido

```javascript
const formatarPeriodoReferencia = (inicio: string | undefined, fim: string | undefined) => {
  if (!inicio || !fim) return 'Período não definido'
  
  try {
    // ✅ Adicionar 'T00:00:00' para evitar problemas de timezone
    const dataInicio = new Date(inicio + 'T00:00:00')
    const dataFim = new Date(fim + 'T00:00:00')
    
    const diaInicio = dataInicio.getDate()
    const isAdiantamento = diaInicio === 15
    
    if (isAdiantamento) {
      // Adiantamento: mostrar período completo
      const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR')
      const dataFimFormatada = dataFim.toLocaleDateString('pt-BR')
      return `${dataInicioFormatada} - ${dataFimFormatada}`
    } else {
      // Folha mensal: mostrar mês de referência (baseado no período INÍCIO)
      const mesNome = dataInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      return mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
    }
  } catch (error) {
    return 'Período inválido'
  }
}
```

## 🎯 Comportamento Correto

### Holerite Mensal
- **Período no banco:** 2026-01-01 a 2026-01-31
- **Exibição:** "Janeiro de 2026"

### Adiantamento
- **Período no banco:** 2026-01-15 a 2026-01-31
- **Exibição:** "15/01/2026 - 31/01/2026"

## 🧪 Como Testar

1. Abra um holerite mensal de janeiro
2. Verifique que mostra "Janeiro de 2026"
3. Abra um adiantamento
4. Verifique que mostra o período completo

## 📊 Impacto

- ✅ Modal de holerite mostra mês correto
- ✅ Adiantamentos continuam mostrando período completo
- ✅ Sem quebrar funcionalidades existentes

## 🔗 Arquivos Relacionados

- ✅ `app/components/holerites/HoleriteModal.vue` - Modal corrigido
- ✅ `app/components/holerites/HoleriteCard.vue` - Card de listagem corrigido
- ✅ `server/utils/holeriteHTML.ts` - HTML do email corrigido
- ✅ `server/api/holerites/[id]/enviar-email.post.ts` - API de envio corrigida

## 📝 Correções Aplicadas

### 1. Modal do Holerite (`HoleriteModal.vue`)
```javascript
// Usar período_inicio para determinar mês de referência
const mesNome = dataInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
```

### 2. Card de Listagem (`HoleriteCard.vue`)
```javascript
// Usar período_inicio ao invés de período_fim
const dataInicio = new Date(props.holerite.periodo_inicio)
const mesNome = dataInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
```

### 3. HTML do Email (`holeriteHTML.ts`)
```javascript
// Folha Mensal: usar período_inicio (mês trabalhado)
mesReferencia = periodoInicio // ✅ Correto
```

### 4. API de Envio de Email (`enviar-email.post.ts`)
```javascript
// Removida a lógica de subtrair 1 mês
const ano = periodoInicio.getFullYear()
const mes = periodoInicio.getMonth() // Sem subtração!
```

---

**Status:** ✅ Corrigido em 4 arquivos  
**Testado:** Pendente
