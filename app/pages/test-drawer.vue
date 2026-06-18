<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Teste do Drawer de Notificações</h1>
    
    <div class="space-y-4">
      <div>
        <p><strong>Estado showNotifications:</strong> {{ showNotifications }}</p>
        <p><strong>isAdmin:</strong> {{ isAdmin }}</p>
        <p><strong>Condição drawer:</strong> {{ showNotifications && isAdmin }}</p>
      </div>
      
      <button 
        @click="toggleDrawer"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {{ showNotifications ? 'Fechar' : 'Abrir' }} Drawer
      </button>
      
      <div class="mt-4">
        <h2 class="text-lg font-semibold mb-2">Debug Info:</h2>
        <ul class="text-sm space-y-1">
          <li>Container teleports existe: {{ !!teleportContainer }}</li>
          <li>Drawer component renderizado: {{ drawerRendered }}</li>
        </ul>
      </div>
    </div>
    
    <!-- Drawer de teste -->
    <NotificationsDrawer 
      :is-open="showNotifications && isAdmin"
      @close="closeDrawer"
    />
  </div>
</template>

<script setup lang="ts">
// Simular admin para teste
const isAdmin = ref(true)

// Estado global das notificações
const showNotifications = useState('notifications-open', () => false)

// Refs para debug
const teleportContainer = ref<HTMLElement | null>(null)
const drawerRendered = ref(false)

const toggleDrawer = () => {
  console.log('🧪 [TEST] Toggling drawer:', !showNotifications.value)
  showNotifications.value = !showNotifications.value
}

const closeDrawer = () => {
  console.log('🧪 [TEST] Closing drawer')
  showNotifications.value = false
}

onMounted(() => {
  console.log('🧪 [TEST] Página de teste montada')
  
  // Verificar container teleports
  teleportContainer.value = document.getElementById('teleports')
  console.log('🧪 [TEST] Container teleports:', teleportContainer.value)
  
  // Verificar se drawer é renderizado
  nextTick(() => {
    const drawer = document.querySelector('.notifications-drawer-container')
    drawerRendered.value = !!drawer
    console.log('🧪 [TEST] Drawer renderizado:', drawerRendered.value)
  })
})

// Watcher para debug
watch(showNotifications, (newValue) => {
  console.log('🧪 [TEST] showNotifications mudou para:', newValue)
  
  nextTick(() => {
    const drawer = document.querySelector('.notifications-drawer-container')
    console.log('🧪 [TEST] Drawer no DOM após mudança:', !!drawer)
  })
})
</script>