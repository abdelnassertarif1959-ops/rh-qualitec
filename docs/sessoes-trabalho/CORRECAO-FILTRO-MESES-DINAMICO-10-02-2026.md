# Correção: Filtro de Meses Dinâmico

**Data:** 10/02/2026  
**Status:** ✅ Corrigido

## 🐛 Problema

O filtro de meses na página de holerites mostrava todos os últimos 12 meses (incluindo meses de 2025 e outros sem holerites), mesmo que não houvesse holerites gerados para esses períodos.

### Comportamento Anterior

```typescript
// Gerava últimos 12 meses automaticamente
for (let i = 0; i < 12; i++) {
  const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
  // Adicionava todos os meses, mesmo sem holerites
}
```

Resultado:
- ❌ Mostrava meses de 2025 sem holerites
- ❌ Mostrava meses futuros
- ❌ Poluía o filtro com opções inúteis

## ✅ Solução Implementada

### 1. Nova API - Meses Disponíveis

Criada API que busca apenas os meses que têm holerites no banco:

**Arquivo:** `server/api/holerites/meses-disponiveis.get.ts`

```typescript
// Buscar todos os períodos únicos de holerites
const { data: holerites } = await supabase
  .from('holerites')
  .select('periodo_inicio, periodo_fim')
  .order('periodo_inicio', { ascending: false })

// Extrair meses únicos no formato YYYY-MM
const mesesSet = new Set<string>()

holerites?.forEach(holerite => {
  if (holerite.periodo_inicio) {
    const data = new Date(holerite.periodo_inicio)
    const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
    mesesSet.add(mesAno)
  }
})

// Ordenar (mais recente primeiro)
const meses = Array.from(mesesSet).sort((a, b) => b.localeCompare(a))
```

### 2. Frontend - Carregar Meses Dinamicamente

**Arquivo:** `app/pages/admin/holerites.vue`

```typescript
// Estado para armazenar meses disponíveis
const mesesDisponiveis = ref<string[]>([])

// Computed que gera opções apenas com meses que têm holerites
const mesesOptions = computed(() => {
  const opcoes = [{ value: '', label: 'Todos os períodos' }]
  
  mesesDisponiveis.value.forEach(mesAno => {
    const [ano, mes] = mesAno.split('-')
    const data = new Date(parseInt(ano), parseInt(mes) - 1, 1)
    const label = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    opcoes.push({ value: mesAno, label })
  })
  
  return opcoes
})

// Função para carregar meses do banco
const carregarMesesDisponiveis = async () => {
  try {
    const response: any = await $fetch('/api/holerites/meses-disponiveis')
    mesesDisponiveis.value = response.meses || []
  } catch (error) {
    console.error('Erro ao carregar meses disponíveis:', error)
    mesesDisponiveis.value = []
  }
}

// Carregar ao montar a página
onMounted(async () => {
  await carregarMesesDisponiveis()
  await carregarHolerites()
})
```

## 📁 Arquivos Modificados

1. **Backend:**
   - `server/api/holerites/meses-disponiveis.get.ts` (NOVO)

2. **Frontend:**
   - `app/pages/admin/holerites.vue`

## 🎯 Resultado

### Antes:
```
Mês/Ano:
- Todos os períodos
- fevereiro de 2026
- janeiro de 2026
- dezembro de 2025  ❌ (sem holerites)
- novembro de 2025  ❌ (sem holerites)
- outubro de 2025   ❌ (sem holerites)
- ... (mais 7 meses sem holerites)
```

### Depois:
```
Mês/Ano:
- Todos os períodos
- fevereiro de 2026  ✅ (tem holerites)
- janeiro de 2026    ✅ (tem holerites)
```

## 🔄 Fluxo de Funcionamento

1. **Ao abrir a página:**
   - Chama `carregarMesesDisponiveis()`
   - API busca todos os holerites
   - Extrai meses únicos
   - Retorna lista ordenada

2. **Ao gerar novos holerites:**
   - Após geração, recarrega meses disponíveis
   - Novo mês aparece automaticamente no filtro

3. **Ao excluir holerites:**
   - Se foi o último holerite do mês
   - Mês desaparece do filtro na próxima recarga

## 🧪 Como Testar

1. Abra a página de holerites
2. Clique no filtro "Mês/Ano"
3. ✅ Deve mostrar apenas meses com holerites gerados
4. ❌ Não deve mostrar meses de 2025 ou outros sem holerites

## 📊 Exemplo de Resposta da API

```json
{
  "success": true,
  "meses": [
    "2026-02",
    "2026-01"
  ]
}
```

## 💡 Benefícios

- ✅ Filtro limpo e relevante
- ✅ Apenas meses com dados reais
- ✅ Atualização automática ao gerar/excluir
- ✅ Ordenação cronológica (mais recente primeiro)
- ✅ Performance otimizada (busca única)

## 🔍 Detalhes Técnicos

### Formato de Data

- **Armazenado:** `YYYY-MM` (ex: `2026-02`)
- **Exibido:** `mês de ano` (ex: `fevereiro de 2026`)

### Ordenação

```typescript
// Mais recente primeiro
meses.sort((a, b) => b.localeCompare(a))
// Resultado: ['2026-02', '2026-01', '2025-12', ...]
```

### Extração de Mês

```typescript
const data = new Date(holerite.periodo_inicio)
const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
// Exemplo: '2026-02'
```

## 📝 Observações

- A API usa `periodo_inicio` para determinar o mês
- Meses duplicados são automaticamente removidos (Set)
- Se não houver holerites, o filtro mostra apenas "Todos os períodos"
- A lista é recarregada automaticamente após operações de CRUD

## 🚀 Melhorias Futuras

Possíveis melhorias:
- Cache de meses disponíveis (evitar busca repetida)
- Indicador de quantidade de holerites por mês
- Filtro por ano (se houver muitos meses)
- Agrupamento por ano no dropdown

---

**Resultado:** Filtro de meses agora mostra apenas períodos relevantes, melhorando a experiência do usuário.
