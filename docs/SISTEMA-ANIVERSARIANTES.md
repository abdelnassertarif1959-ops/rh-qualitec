# 🎂 Sistema de Aniversariantes

## 🎯 Funcionalidade

Sistema que exibe aniversariantes do mês atual em todo o Sistema RH, incluindo:
- **Ícone de Bolo** - Aparece no layout quando há aniversariantes no mês
- **Tooltip Interativo** - Mostra detalhes dos aniversariantes ao passar o mouse
- **Métricas Integradas** - Contador de aniversariantes nas estatísticas
- **Indicador de Hoje** - Destaque especial para aniversários do dia

## ✨ Componentes Implementados

### 1. Composable `useAniversariantes`

**Localização:** `app/composables/useAniversariantes.ts`

**Funcionalidades:**
- Busca aniversariantes do mês atual
- Cache inteligente (5 minutos)
- Filtros por data (hoje, próximos 7 dias)
- Cálculo de idade automático
- Formatação de datas em português

### 2. Tooltip de Aniversariantes

**Componente:** `UiAniversariantesTooltip.vue`

**Características:**
- Exibição ao passar o mouse ou clicar
- Lista completa dos aniversariantes
- Avatar e informações de cada pessoa
- Indicador visual para aniversários de hoje
- Responsivo e elegante

### 3. Integração no Layout

**Desktop:** Ícone no header do sidebar
**Mobile:** Ícone no header mobile

**Funcionalidades:**
- Badge com contador de aniversariantes
- Ícone de bolo (🎂) visível apenas quando há aniversariantes
- Tooltip com detalhes completos
- Animação sutil no badge

## 🚀 Como Funciona

### Detecção Automática

```typescript
// O sistema verifica automaticamente aniversariantes do mês
const hoje = new Date()
const mesAtual = hoje.getMonth() + 1

// Filtra funcionários cujo mês de nascimento = mês atual
const aniversariantesMes = funcionarios.filter(funcionario => {
  const dataNascimento = new Date(funcionario.data_nascimento)
  const mesNascimento = dataNascimento.getMonth() + 1
  return mesNascimento === mesAtual
})
```

### Exibição Condicional

```vue
<!-- Só aparece quando há aniversariantes -->
<UiAniversariantesTooltip 
  v-if="temAniversarianteMes"
  :aniversariantes="aniversariantes"
>
  <div class="relative p-2 rounded-lg bg-yellow-50 border border-yellow-200">
    <span class="text-xl">🎂</span>
    <span class="badge">{{ totalAniversariantes }}</span>
  </div>
</UiAniversariantesTooltip>
```

### Cache Inteligente

```typescript
// Evita chamadas desnecessárias à API
if (!forceRefresh && lastFetch.value) {
  const diffMinutos = (agora.getTime() - lastFetch.value.getTime()) / (1000 * 60)
  if (diffMinutos < 5) { // Cache por 5 minutos
    return aniversariantes.value
  }
}
```

## 🎨 Interface Visual

### Ícone de Bolo

**Aparência:**
- 🎂 Emoji de bolo
- Fundo amarelo claro (`bg-yellow-50`)
- Borda amarela (`border-yellow-200`)
- Hover com destaque (`hover:bg-yellow-100`)

**Badge:**
- Fundo amarelo (`bg-yellow-500`)
- Texto branco
- Formato circular
- Posição absoluta no canto superior direito

### Tooltip

**Layout:**
- Fundo branco com sombra
- Borda arredondada
- Máximo 4 aniversariantes visíveis (scroll se mais)
- Avatar + nome + data + idade

**Indicadores:**
- Ponto amarelo pulsante para aniversários de hoje
- Data formatada em português (ex: "25 de janeiro")
- Idade calculada automaticamente

## 📱 Responsividade

### Desktop (lg+)
- Ícone no header do sidebar (canto superior direito)
- Tooltip posicionado dinamicamente
- Tamanho do ícone: `text-xl` (20px)
- Badge menor: `w-4 h-4`

### Mobile (< lg)
- Ícone no header mobile (antes das notificações)
- Tooltip adaptado para tela pequena
- Tamanho do ícone: `text-2xl` (24px)
- Badge maior: `w-5 h-5`

## 🔧 APIs Utilizadas

### `/api/dashboard/aniversariantes`

**Retorna:**
```json
[
  {
    "id": "157",
    "nome_completo": "ANTONIO BARBOSA DA SILVA",
    "data_nascimento": "1965-01-25",
    "avatar": "soldador-1"
  }
]
```

**Características:**
- Filtra apenas funcionários ativos
- Ordena por dia do aniversário
- Inclui avatar para exibição

### `/api/dashboard/stats`

**Inclui contador:**
```json
{
  "totalAniversariantes": 1,
  "mesAtual": "janeiro de 2026"
}
```

## 🎯 Funcionalidades Avançadas

### Detecção de Aniversário Hoje

```typescript
const isAniversarioHoje = (dataString: string) => {
  const hoje = new Date()
  const dataNascimento = new Date(dataString)
  
  return hoje.getDate() === dataNascimento.getDate() &&
         hoje.getMonth() === dataNascimento.getMonth()
}
```

### Cálculo de Idade

```typescript
const calcularIdade = (dataString: string) => {
  const hoje = new Date()
  const nascimento = new Date(dataString)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  
  // Ajustar se ainda não fez aniversário este ano
  const mesAtual = hoje.getMonth()
  const diaAtual = hoje.getDate()
  const mesNascimento = nascimento.getMonth()
  const diaNascimento = nascimento.getDate()
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--
  }
  
  return idade
}
```

### Próximos Aniversariantes

```typescript
const getProximosAniversariantes = () => {
  const hoje = new Date()
  const diaHoje = hoje.getDate()
  
  return aniversariantes.value.filter(aniversariante => {
    const dataNascimento = new Date(aniversariante.data_nascimento)
    const diaNascimento = dataNascimento.getDate()
    
    // Próximos 7 dias
    for (let i = 1; i <= 7; i++) {
      const dataFutura = new Date(hoje.getFullYear(), hoje.getMonth(), diaHoje + i)
      if (dataFutura.getDate() === diaNascimento) {
        return true
      }
    }
    return false
  })
}
```

## 🎉 Exemplos de Uso

### No Dashboard Admin

```vue
<!-- Card de estatísticas -->
<DashboardStatCard 
  :value="stats.totalAniversariantes.toString()"
  label="Aniversariantes"
  color="orange"
  icon="🎂"
/>
```

### Em Notificações

```typescript
// Notificação automática para aniversários de hoje
const aniversariantesHoje = getAniversariantesHoje()
if (aniversariantesHoje.length > 0) {
  notifyInfo(
    '🎂 Aniversário Hoje!',
    `${aniversariantesHoje[0].nome_completo} está fazendo aniversário hoje!`
  )
}
```

### Em Relatórios

```typescript
// Relatório mensal de aniversariantes
const relatorio = {
  mes: mesAtual,
  total: totalAniversariantes.value,
  aniversariantes: aniversariantes.value.map(a => ({
    nome: a.nome_completo,
    data: formatarDataAniversario(a.data_nascimento),
    idade: calcularIdade(a.data_nascimento)
  }))
}
```

## 🔮 Futuras Melhorias

### Notificações Automáticas
- Notificação push no dia do aniversário
- Email automático para o RH
- Lembrete 1 dia antes

### Integração com Calendário
- Eventos no calendário do sistema
- Exportação para Google Calendar
- Sincronização com Outlook

### Personalização
- Mensagens personalizadas por funcionário
- Temas de aniversário
- Histórico de aniversários

### Analytics
- Relatório de aniversários por mês
- Estatísticas de idade média
- Gráficos de distribuição

## 🎯 Benefícios

### Para o RH
- ✅ Visibilidade imediata dos aniversariantes
- ✅ Não esquecer de parabenizar funcionários
- ✅ Melhor relacionamento interpessoal
- ✅ Dados sempre atualizados

### Para os Funcionários
- ✅ Reconhecimento no dia especial
- ✅ Integração social na empresa
- ✅ Valorização pessoal
- ✅ Ambiente mais humanizado

### Para a Empresa
- ✅ Cultura organizacional mais forte
- ✅ Engajamento dos colaboradores
- ✅ Retenção de talentos
- ✅ Ambiente de trabalho positivo

---

**Implementado em:** Janeiro 2026  
**Versão:** 1.0  
**Status:** ✅ Ativo e Funcional