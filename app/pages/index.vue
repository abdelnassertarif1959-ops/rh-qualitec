<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Carregando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

// Executar redirecionamento apenas no cliente
onMounted(() => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>
