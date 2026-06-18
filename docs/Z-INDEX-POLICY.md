# Política de Z-Index - Sistema RH

## 🎯 Objetivo

Estabelecer uma hierarquia clara de z-index para evitar conflitos de sobreposição e garantir que elementos críticos (modais, notificações) sempre apareçam corretamente.

## 📊 Hierarquia de Z-Index

### **Base (0-99)** - Elementos Normais
```css
z-0     /* 0   - Elementos padrão */
z-1     /* 1   - Elementos ligeiramente elevados */
z-10    /* 10  - Sidebar, navegação */
z-20    /* 20  - Header, topbar */
z-30    /* 30  - Conteúdo principal */
```

### **Elevated (100-199)** - Elementos Flutuantes
```css
z-[100] /* 100 - Dropdowns */
z-[110] /* 110 - Tooltips */
z-[120] /* 120 - Popovers */
```

### **Overlay (200-299)** - Modais Pequenos
```css
z-[200] /* 200 - Overlay pequeno */
z-[210] /* 210 - Modal pequeno */
```

### **Modal (1000-1099)** - Modais Principais
```css
z-[1000] /* 1000 - Overlay principal */
z-[1010] /* 1010 - Modal principal */
```

### **Notification (1100-1199)** - Sistema de Notificações
```css
z-[1100] /* 1100 - Toasts, alertas */
```

### **Critical (9000-9999)** - Elementos Críticos
```css
z-[9000] /* 9000 - Loading overlay */
z-[9100] /* 9100 - Error boundary */
z-[9200] /* 9200 - Debug panel */
z-[9999] /* 9999 - Máximo (último recurso) */
```

## 🛠️ Implementação

### **1. Componentes Atualizados**

#### NotificationsDrawer.vue
```vue
<!-- Overlay -->
<div class="fixed inset-0 bg-black/40 z-[1000]">

<!-- Drawer -->
<div class="fixed right-0 top-0 h-dvh w-[420px] z-[1010]">
```

#### Teleport Container
```vue
<!-- app.vue -->
<div id="teleports" class="relative z-[9999]"></div>
```

### **2. Classes Tailwind Disponíveis**

```typescript
// Configuração no tailwind.config.ts
zIndex: {
  '100': '100',   // Dropdowns
  '110': '110',   // Tooltips  
  '120': '120',   // Popovers
  '200': '200',   // Overlay pequeno
  '210': '210',   // Modal pequeno
  '1000': '1000', // Overlay principal
  '1010': '1010', // Modal principal
  '1100': '1100', // Toasts
  '9000': '9000', // Loading
  '9100': '9100', // Error
  '9200': '9200', // Debug
  '9999': '9999', // Máximo
}
```

## 🚨 Problemas Comuns e Soluções

### **1. Stacking Context**

**Problema**: Elementos com `transform`, `filter`, `opacity < 1` criam novos contextos de empilhamento.

**Solução**: Usar `Teleport` para renderizar fora da árvore limitada.

```vue
<!-- ❌ Problemático -->
<div class="transform scale-100"> <!-- Cria stacking context -->
  <Modal class="z-[1000]" /> <!-- Limitado pelo pai -->
</div>

<!-- ✅ Correto -->
<Teleport to="#teleports">
  <Modal class="z-[1000]" /> <!-- Livre de limitações -->
</Teleport>
```

### **2. Inputs e Selects**

**Problema**: Inputs nativos podem ter z-index alto por padrão.

**Solução**: Garantir que modais tenham z-index superior.

```css
/* Inputs problemáticos */
select, input[type="date"] {
  z-index: auto; /* Resetar se necessário */
}

/* Modal sempre superior */
.modal-overlay {
  z-index: 1000;
}
```

### **3. Bibliotecas Externas**

**Problema**: Componentes de terceiros podem usar z-index altos.

**Solução**: Documentar e ajustar conforme necessário.

```css
/* Exemplo: Ajustar biblioteca externa */
.external-component {
  z-index: 100 !important; /* Forçar nível correto */
}
```

## 🔧 Ferramentas de Debug

### **1. Comandos do Console**

```javascript
// Ativar debug visual
debugZIndex.start()

// Analisar elemento específico
debugZIndex.analyze('.notifications-drawer-container')

// Encontrar z-index altos
debugZIndex.findHigh(1000)

// Verificar conflitos
debugZIndex.checkConflicts()
```

### **2. Composable de Debug**

```vue
<script setup>
const { toggleDebug, analyzeElement } = useZIndexDebug()

// Ativar debug
toggleDebug()

// Analisar elemento
analyzeElement('.my-component')
</script>
```

## 📋 Checklist de Implementação

### **Antes de Adicionar Novo Modal/Overlay:**

- [ ] Verificar se precisa de Teleport
- [ ] Escolher z-index apropriado da hierarquia
- [ ] Testar em diferentes telas/componentes
- [ ] Verificar acessibilidade (ESC, focus trap)
- [ ] Documentar se usar z-index customizado

### **Ao Encontrar Conflito:**

- [ ] Identificar elementos com stacking context
- [ ] Verificar hierarquia de z-index
- [ ] Considerar usar Teleport
- [ ] Testar em diferentes navegadores
- [ ] Atualizar documentação se necessário

## 🎯 Boas Práticas

### **1. Sempre Usar Teleport para Modais**
```vue
<Teleport to="#teleports">
  <Modal />
</Teleport>
```

### **2. Seguir a Hierarquia**
```vue
<!-- ✅ Correto -->
<div class="z-[1000]"> <!-- Overlay -->
<div class="z-[1010]"> <!-- Modal -->

<!-- ❌ Incorreto -->
<div class="z-[5000]"> <!-- Z-index muito alto -->
```

### **3. Documentar Z-Index Customizados**
```vue
<!-- Comentar quando usar z-index fora da hierarquia -->
<div class="z-[1500]"> <!-- Necessário para ficar acima de biblioteca X -->
```

### **4. Testar Regularmente**
```bash
# Executar debug periodicamente
debugZIndex.checkConflicts()
```

## 🔄 Manutenção

### **Revisão Mensal:**
- Executar `debugZIndex.findHigh(500)` para encontrar z-index altos
- Verificar se novos componentes seguem a hierarquia
- Atualizar documentação com novos casos

### **Ao Adicionar Bibliotecas:**
- Verificar z-index padrão da biblioteca
- Ajustar se necessário
- Documentar ajustes feitos

## 📚 Referências

- [MDN: CSS Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [Tailwind CSS Z-Index](https://tailwindcss.com/docs/z-index)
- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)

---

**Última atualização**: 28/01/2026  
**Versão**: 1.0  
**Responsável**: Sistema RH - Equipe Frontend