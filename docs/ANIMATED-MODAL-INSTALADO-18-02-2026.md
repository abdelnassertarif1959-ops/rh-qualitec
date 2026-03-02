# Animated Modal - Instalação Completa

**Data**: 18/02/2026  
**Componente**: Animated Modal do Inspira UI  
**Status**: ✅ Instalado com sucesso

## 📦 Dependências Instaladas

```bash
npm install @vueuse/core motion-v
```

## 📁 Estrutura de Arquivos Criada

```
app/components/ui/animated-modal/
├── AnimatedModal.vue              # Componente principal (provider)
├── AnimatedModalBody.vue          # Corpo do modal com animações
├── AnimatedModalContent.vue       # Área de conteúdo
├── AnimatedModalFooter.vue        # Rodapé do modal
├── AnimatedModalTrigger.vue       # Botão para abrir o modal
├── AnimatedModalContext.ts        # Context API
├── useAnimatedModal.ts            # Composable
└── index.ts                       # Exports
```

## 🎯 Características

- ✨ Animações 3D suaves com motion-v
- 🔒 Bloqueio de scroll automático
- ⌨️ Fecha com tecla ESC
- 🖱️ Fecha ao clicar fora
- ♿ Acessível (ARIA)
- 📱 Responsivo
- 🌙 Suporte a dark mode
- 🎨 Totalmente customizável

## 💻 Exemplo de Uso Básico

```vue
<template>
  <AnimatedModal>
    <AnimatedModalTrigger>
      <button class="bg-blue-500 text-white px-4 py-2 rounded">
        Abrir Modal
      </button>
    </AnimatedModalTrigger>

    <AnimatedModalBody>
      <AnimatedModalContent>
        <h2 class="text-2xl font-bold mb-4">Título do Modal</h2>
        <p class="text-gray-600">
          Conteúdo do modal aqui...
        </p>
      </AnimatedModalContent>

      <AnimatedModalFooter>
        <button class="bg-gray-200 px-4 py-2 rounded mr-2">
          Cancelar
        </button>
        <button class="bg-blue-500 text-white px-4 py-2 rounded">
          Confirmar
        </button>
      </AnimatedModalFooter>
    </AnimatedModalBody>
  </AnimatedModal>
</template>

<script setup lang="ts">
// Imports automáticos do Nuxt
</script>
```

## 🎨 Exemplo com Controle Programático

```vue
<template>
  <AnimatedModal v-model:open="isOpen">
    <AnimatedModalTrigger>
      <button class="bg-qualitec-600 text-white px-6 py-3 rounded-lg">
        Abrir Modal Controlado
      </button>
    </AnimatedModalTrigger>

    <AnimatedModalBody>
      <AnimatedModalContent>
        <h2 class="text-2xl font-bold mb-4">Modal Controlado</h2>
        <p class="mb-4">Este modal pode ser controlado programaticamente</p>
        
        <button 
          @click="isOpen = false"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          Fechar Programaticamente
        </button>
      </AnimatedModalContent>
    </AnimatedModalBody>
  </AnimatedModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)

// Abrir modal programaticamente
const openModal = () => {
  isOpen.value = true
}

// Fechar modal programaticamente
const closeModal = () => {
  isOpen.value = false
}
</script>
```

## 🔧 Props Disponíveis

### AnimatedModal
- `open?: boolean` - Controla o estado do modal (v-model)
- `defaultOpen?: boolean` - Estado inicial (default: false)
- `closeOnEsc?: boolean` - Fecha com ESC (default: true)

### AnimatedModalBody
- `class?: string` - Classes CSS customizadas
- `overlayClass?: string` - Classes para o overlay
- `contentClass?: string` - Classes para o conteúdo
- `showClose?: boolean` - Mostra botão X (default: true)
- `closeOnOutside?: boolean` - Fecha ao clicar fora (default: true)
- `lockScroll?: boolean` - Bloqueia scroll (default: true)
- `zIndex?: number` - Z-index do modal (default: 10000)
- `teleportTo?: string | HTMLElement` - Onde renderizar (default: 'body')

### AnimatedModalTrigger
- `as?: string` - Elemento HTML (default: 'button')
- `disabled?: boolean` - Desabilita o trigger (default: false)

## 🎭 Exemplo Avançado com useAnimatedModal

```vue
<template>
  <AnimatedModal>
    <AnimatedModalTrigger>
      <button class="btn-primary">Abrir</button>
    </AnimatedModalTrigger>

    <AnimatedModalBody>
      <AnimatedModalContent>
        <CustomModalContent />
      </AnimatedModalContent>
    </AnimatedModalBody>
  </AnimatedModal>
</template>

<script setup lang="ts">
// Componente filho que usa o composable
import { useAnimatedModal } from '~/components/ui/animated-modal'

// Dentro do componente filho:
const modal = useAnimatedModal()

const handleAction = () => {
  // Fazer algo...
  modal.closeModal()
}
</script>
```

## 🎨 Customização com Classes Tailwind

```vue
<AnimatedModalBody
  class="w-[900px] max-h-[90vh]"
  overlay-class="bg-black/70"
  content-class="bg-gradient-to-br from-blue-50 to-purple-50"
>
  <AnimatedModalContent class="p-12">
    <!-- Conteúdo customizado -->
  </AnimatedModalContent>
</AnimatedModalBody>
```

## 🌙 Suporte a Dark Mode

O componente já vem com suporte a dark mode usando as classes do Tailwind:
- `dark:bg-neutral-950` - Fundo escuro
- `dark:border-neutral-800` - Borda escura
- `dark:text-white` - Texto branco

## 📝 Eventos

```vue
<AnimatedModal
  @open="handleOpen"
  @close="handleClose"
  @update:open="handleUpdate"
>
  <!-- ... -->
</AnimatedModal>
```

## ⚠️ Notas Importantes

1. O componente usa `motion-v` para animações 3D
2. Requer `@vueuse/core` para funcionalidades como scroll lock
3. Funciona apenas no client-side (SSR safe)
4. Auto-importação do Nuxt funciona automaticamente
5. Z-index padrão é 10000 (pode ser ajustado)

## 🚀 Próximos Passos

Você pode usar este componente em qualquer lugar do seu projeto Nuxt. Exemplos de uso:
- Confirmações de ações
- Formulários em modal
- Visualização de detalhes
- Galeria de imagens
- Avisos importantes

## 📚 Referências

- [Inspira UI](https://inspira-ui.com)
- [Motion-v](https://motion-v.netlify.app)
- [VueUse](https://vueuse.org)
