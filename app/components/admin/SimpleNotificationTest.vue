<template>
  <div>
    <!-- Botão de teste -->
    <button 
      @click="toggle"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {{ isOpen ? 'Fechar' : 'Abrir' }} Teste ({{ isOpen }})
    </button>
    
    <!-- Modal simples -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center"
      @click="close"
    >
      <div 
        class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-4">🔔 Teste de Notificações</h2>
        <p class="mb-4">Este é um teste simples para verificar se o sistema de modal está funcionando.</p>
        <p class="text-sm text-gray-600 mb-4">Estado: {{ isOpen }}</p>
        <button 
          @click="close"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const toggle = () => {
  console.log('🧪 [SIMPLE-TEST] Toggle clicado, estado atual:', isOpen.value)
  isOpen.value = !isOpen.value
  console.log('🧪 [SIMPLE-TEST] Novo estado:', isOpen.value)
}

const close = () => {
  console.log('🧪 [SIMPLE-TEST] Close clicado')
  isOpen.value = false
}

// Watcher para debug
watch(isOpen, (newValue, oldValue) => {
  console.log('🧪 [SIMPLE-TEST] WATCHER: isOpen mudou:', oldValue, '->', newValue)
})
</script>