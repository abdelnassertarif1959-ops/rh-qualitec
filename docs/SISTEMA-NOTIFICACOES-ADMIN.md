# 🔔 Sistema de Notificações Admin

## 🎯 Funcionalidade

Sistema completo de notificações para administradores do Sistema RH, incluindo:
- **Notificações Toast** - Mensagens temporárias que aparecem no canto da tela
- **Painel de Notificações** - Central de notificações no sidebar e header mobile
- **Notificações do Sistema** - Alertas sobre adiantamentos, holerites e processos automáticos

## ✨ Componentes Implementados

### 1. Sistema de Notificações Toast

**Localização:** Integrado no layout principal (`app/layouts/default.vue`)

**Componentes:**
- `UiNotificationContainer.vue` - Container das notificações toast
- `UiNotification.vue` - Componente individual de notificação
- `useNotifications.ts` - Composable para gerenciar notificações

**Tipos de Notificação:**
- ✅ **Success** (Verde) - Operações bem-sucedidas
- ❌ **Error** (Vermelho) - Erros e falhas
- ⚠️ **Warning** (Amarelo) - Avisos e alertas
- ℹ️ **Info** (Azul) - Informações gerais

### 2. Painel de Notificações

**Desktop:** Sidebar esquerdo com botão "Notificações"
**Mobile:** Header com ícone de notificação

**Funcionalidades:**
- Badge com contador de notificações não lidas
- Painel deslizante com notificações do sistema
- Notificações sobre adiantamentos automáticos
- Lembretes de processos pendentes

### 3. Integração com Ações do Sistema

**Páginas Integradas:**
- `/admin/holerites` - Notificações ao gerar, disponibilizar e enviar holerites
- `/dashboard` - Botão de teste das notificações (apenas admins)

## 🚀 Como Usar

### Para Desenvolvedores

#### Usar Notificações Toast

```typescript
// Em qualquer componente Vue
const { notifySuccess, notifyError, notifyWarning, notifyInfo } = useNotifications()

// Notificação de sucesso
notifySuccess('Título', 'Mensagem de sucesso')

// Notificação de erro
notifyError('Erro!', 'Algo deu errado')

// Notificação com duração customizada (em ms)
notifyWarning('Atenção!', 'Mensagem importante', 10000)

// Notificação básica com controle total
const { addNotification } = useNotifications()
addNotification({
  title: 'Título',
  message: 'Mensagem',
  variant: 'info',
  duration: 5000
})
```

#### Gerenciar Notificações

```typescript
const { 
  notifications, 
  removeNotification, 
  clearNotifications 
} = useNotifications()

// Remover notificação específica
removeNotification('notification-id')

// Limpar todas as notificações
clearNotifications()

// Acessar lista de notificações (readonly)
console.log(notifications.value)
```

### Para Usuários Admin

#### Visualizar Notificações

**Desktop:**
1. No sidebar esquerdo, clique em "Notificações"
2. Painel abre ao lado com notificações do sistema
3. Badge mostra quantidade de notificações não lidas

**Mobile:**
1. No header, clique no ícone de notificação (🔔)
2. Painel sobrepõe a tela com notificações
3. Toque fora do painel para fechar

#### Testar Sistema

1. Acesse o **Dashboard**
2. Clique no card **"Testar Notificações"** (apenas admins)
3. Veja as diferentes notificações toast aparecerem

## 🎨 Exemplos de Uso

### Notificações de Adiantamentos

```typescript
// Quando adiantamentos são gerados
notifySuccess(
  'Adiantamentos Gerados!',
  '15 holerite(s) criado(s). Serão disponibilizados automaticamente no dia 17',
  7000
)

// Quando adiantamentos são disponibilizados automaticamente
notifyInfo(
  'Adiantamentos Disponibilizados!',
  '15 adiantamentos foram disponibilizados automaticamente no perfil dos funcionários'
)
```

### Notificações de Holerites

```typescript
// Quando folhas mensais são geradas
notifySuccess(
  'Folhas Mensais Geradas!',
  '25 holerite(s) criado(s). Aguardando disponibilização manual'
)

// Quando holerites são disponibilizados
notifySuccess(
  'Holerites Disponibilizados!',
  '25 folhas mensais agora estão visíveis no perfil dos funcionários'
)
```

### Notificações de Erro

```typescript
// Quando há erro na geração
notifyError(
  'Erro na Geração!',
  'Não foi possível gerar os holerites. Verifique a conexão com o banco de dados.'
)

// Quando há erro parcial
notifyWarning(
  'Disponibilização Parcial',
  '20 holerites disponibilizados, 5 erro(s). Verifique os logs.'
)
```

## 🔧 Configuração Técnica

### Estado Global

```typescript
// Estado compartilhado entre todos os componentes
const notifications = ref<Notification[]>([])

interface Notification {
  id: string
  title: string
  message?: string
  variant: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  show: boolean
}
```

### Auto-remoção

- **Duração padrão:** 5 segundos
- **Duração customizável:** Pode ser definida por notificação
- **Remoção manual:** Usuário pode fechar clicando no X
- **Animações:** Entrada e saída suaves

### Posicionamento

- **Toast:** Canto superior direito, empilhadas
- **Painel Desktop:** Ao lado do sidebar (posição fixa)
- **Painel Mobile:** Sobreposto na tela (modal)

## 📱 Responsividade

### Desktop (lg+)
- Sidebar com botão "Notificações"
- Painel abre ao lado (width: 320px)
- Toast no canto superior direito

### Mobile (< lg)
- Ícone no header mobile
- Painel sobrepõe a tela inteira
- Toast responsivo (max-width: sm)

## 🎯 Benefícios

### Para Admins
- ✅ Feedback imediato de todas as ações
- ✅ Central de notificações organizada
- ✅ Alertas sobre processos automáticos
- ✅ Interface moderna e intuitiva

### Para o Sistema
- ✅ UX consistente em todas as páginas
- ✅ Notificações não intrusivas
- ✅ Sistema extensível e reutilizável
- ✅ Performance otimizada

### Para Desenvolvedores
- ✅ API simples e intuitiva
- ✅ Composable reutilizável
- ✅ TypeScript completo
- ✅ Fácil customização

## 🔮 Futuras Melhorias

### Notificações Persistentes
- Salvar notificações no banco de dados
- Marcar como lida/não lida
- Histórico de notificações

### Notificações Push
- Integração com service workers
- Notificações do navegador
- Notificações por email

### Personalização
- Temas de cores customizáveis
- Posições configuráveis
- Sons de notificação

### Analytics
- Tracking de notificações visualizadas
- Métricas de engajamento
- Relatórios de uso

---

**Implementado em:** Janeiro 2026  
**Versão:** 1.0  
**Status:** ✅ Ativo e Funcional