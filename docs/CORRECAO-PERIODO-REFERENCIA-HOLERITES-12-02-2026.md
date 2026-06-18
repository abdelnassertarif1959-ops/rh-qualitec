# Correção: Período de Referência para Holerites Mensais

**Data:** 12/02/2026  
**Tipo:** Correção de Lógica de Negócio  
**Status:** ✅ Concluído

---

## 📋 Problema Identificado

Holerites mensais estavam mostrando o período incorreto na interface:

### Comportamento Anterior (Incorreto)
- Holerite gerado em 09/02/2026
- Mostrava: "31/01/2026 - 27/02/2026"
- ❌ Período confuso e não representa o mês trabalhado

### Comportamento Esperado (Correto)
- Holerite gerado em 09/02/2026
- Deve mostrar: "01/01/2026 - 31/01/2026" ou "Janeiro de 2026"
- ✅ Representa claramente o mês trabalhado (mês ANTERIOR)

---

## 🎯 Regra de Negócio

### Holerites Mensais
- **Mês de Referência:** Mês ANTERIOR ao período de geração
- **Exemplo:** Holerite gerado em fevereiro = Janeiro trabalhado
- **Formato Completo:** "01/01/2026 - 31/01/2026"
- **Formato Resumido:** "Janeiro de 2026"

### Adiantamentos Salariais
- **Mês de Referência:** Mês VIGENTE (mesmo mês)
- **Período:** Do dia 15 ao último dia do mês
- **Formato:** "15/01/2026 - 31/01/2026"

---

## 🔧 Arquivos Modificados

### 1. `app/pages/admin/holerites.vue`
**Função:** `formatarPeriodo()`

```typescript
// ANTES
const formatarPeriodo = (inicio: string, fim: string) => {
  const dataInicio = new Date(inicio).toLocaleDateString('pt-BR')
  const dataFim = new Date(fim).toLocaleDateString('pt-BR')
  return `${dataInicio} - ${dataFim}`
}

// DEPOIS
const formatarPeriodo = (inicio: string, fim: string) => {
  const dataInicio = new Date(inicio + 'T00:00:00')
  const dataFim = new Date(fim + 'T00:00:00')
  const diaInicio = dataInicio.getDate()
  const isAdiantamento = diaInicio === 15
  
  if (isAdiantamento) {
    // Adiantamento: mostrar período completo
    return `${dataInicio.toLocaleDateString('pt-BR')} - ${dataFim.toLocaleDateString('pt-BR')}`
  } else {
    // Folha Mensal: mostrar mês ANTERIOR completo
    const mesAnterior = new Date(dataInicio)
    mesAnterior.setMonth(mesAnterior.getMonth() - 1)
    
    const primeiroDia = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1)
    const ultimoDia = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0)
    
    return `${primeiroDia.toLocaleDateString('pt-BR')} - ${ultimoDia.toLocaleDateString('pt-BR')}`
  }
}
```

### 2. `app/components/holerites/HoleriteCard.vue`
**Função:** `formatarPeriodoReferencia()`

```typescript
// Atualizado para calcular mês ANTERIOR para folhas mensais
const mesAnterior = new Date(dataInicio)
mesAnterior.setMonth(mesAnterior.getMonth() - 1)

const mesNome = mesAnterior.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
return mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
```

### 3. `app/components/holerites/HoleriteModal.vue`
**Função:** `formatarPeriodoReferencia()`

```typescript
// Mesma lógica aplicada para consistência
```

### 4. `app/composables/useHolerites.ts`
**Nova Função:** `formatarPeriodoReferencia()`

```typescript
// Função helper centralizada para reutilização
const formatarPeriodoReferencia = (
  periodoInicio: string, 
  periodoFim: string, 
  formato: 'completo' | 'mes' = 'mes'
): string => {
  // Lógica centralizada para formatar período de referência
  // Suporta dois formatos:
  // - 'completo': "01/01/2026 - 31/01/2026"
  // - 'mes': "Janeiro de 2026"
}
```

---

## 📊 Exemplos de Uso

### Exemplo 1: Holerite Mensal de Janeiro
```
Período no Banco: 01/02/2026 - 28/02/2026
Exibição na Tela: "01/01/2026 - 31/01/2026" ou "Janeiro de 2026"
Mês Trabalhado: Janeiro de 2026
Pagamento: 06/02/2026 (5º dia útil de fevereiro)
```

### Exemplo 2: Adiantamento de Janeiro
```
Período no Banco: 15/01/2026 - 31/01/2026
Exibição na Tela: "15/01/2026 - 31/01/2026"
Mês Vigente: Janeiro de 2026
Pagamento: 20/01/2026
```

### Exemplo 3: Holerite Mensal de Fevereiro
```
Período no Banco: 01/03/2026 - 31/03/2026
Exibição na Tela: "01/02/2026 - 28/02/2026" ou "Fevereiro de 2026"
Mês Trabalhado: Fevereiro de 2026
Pagamento: 06/03/2026 (5º dia útil de março)
```

---

## ✅ Validação

### Checklist de Testes

- [ ] Holerite mensal mostra mês ANTERIOR completo
- [ ] Adiantamento mostra período do dia 15 ao último dia do mês vigente
- [ ] Formato de data está correto (dd/mm/aaaa)
- [ ] Capitalização do nome do mês está correta
- [ ] Não há problemas de timezone
- [ ] Funciona em todas as páginas:
  - [ ] `/admin/holerites` (listagem admin)
  - [ ] `/holerites` (listagem funcionário)
  - [ ] Modal de visualização
  - [ ] Card de holerite

### Comandos de Teste

```bash
# Verificar holerites no banco
npm run dev

# Acessar como admin
http://localhost:3000/admin/holerites

# Acessar como funcionário
http://localhost:3000/holerites
```

---

## 🎨 Impacto Visual

### Antes
```
📊 Folha Mensal
31/01/2026 - 27/02/2026
```

### Depois
```
📊 Folha Mensal
01/01/2026 - 31/01/2026
ou
Janeiro de 2026
```

---

## 📝 Notas Técnicas

1. **Timezone:** Adicionado `'T00:00:00'` ao criar objetos Date para evitar problemas de timezone
2. **Consistência:** Mesma lógica aplicada em todos os componentes
3. **Reutilização:** Função helper criada no composable para facilitar manutenção
4. **Flexibilidade:** Suporta dois formatos (completo e resumido)

---

## 🔗 Arquivos Relacionados

- `app/pages/admin/holerites.vue`
- `app/pages/holerites.vue`
- `app/components/holerites/HoleriteCard.vue`
- `app/components/holerites/HoleriteModal.vue`
- `app/composables/useHolerites.ts`
- `server/utils/holeriteHTML.ts` (já estava correto)

---

## 📚 Documentação Relacionada

- [PRD Sistema RH Qualitec](./PRD-SISTEMA-RH-QUALITEC-ATUALIZADO-2026.md)
- [Sistema de Adiantamento Salarial](./SISTEMA-ADIANTAMENTO-SALARIAL.md)
- [Datas Automáticas de Holerites](./DATAS-AUTOMATICAS-HOLERITES.md)
