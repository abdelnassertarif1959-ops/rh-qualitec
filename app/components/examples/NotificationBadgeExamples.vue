<template>
  <div class="p-8 space-y-8 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Exemplos de Badge de Notificação</h1>
      
      <!-- Controles de Teste -->
      <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 class="text-xl font-semibold mb-4">Controles de Teste</h2>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="testCount = 0"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Zero (0)
          </button>
          <button 
            @click="testCount = 1"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Um (1)
          </button>
          <button 
            @click="testCount = 5"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Cinco (5)
          </button>
          <button 
            @click="testCount = 99"
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Noventa e nove (99)
          </button>
          <button 
            @click="testCount = 150"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Mais de 99 (150)
          </button>
          <button 
            @click="testCount++"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Incrementar (+1)
          </button>
        </div>
        <p class="mt-4 text-sm text-gray-600">Contagem atual: {{ testCount }}</p>
      </div>

      <!-- Tamanhos -->
      <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 class="text-xl font-semibold mb-4">Tamanhos</h2>
        <div class="flex items-center gap-8">
          <div class="text-center">
            <UiNotificationBadge :count="testCount" size="sm">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="text-blue-600">SM</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Small</p>
          </div>
          
          <div class="text-center">
            <UiNotificationBadge :count="testCount" size="md">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="text-green-600">MD</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Medium</p>
          </div>
          
          <div class="text-center">
            <UiNotificationBadge :count="testCount" size="lg">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span class="text-purple-600">LG</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Large</p>
          </div>
        </div>
      </div>

      <!-- Cores -->
      <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 class="text-xl font-semibold mb-4">Cores</h2>
        <div class="flex items-center gap-8">
          <div class="text-center">
            <UiNotificationBadge :count="testCount" color="red">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-600">🔴</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Red</p>
          </div>
          
          <div class="text-center">
            <UiNotificationBadge :count="testCount" color="blue">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-600">🔵</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Blue</p>
          </div>
          
          <div class="text-center">
            <UiNotificationBadge :count="testCount" color="green">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-600">🟢</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Green</p>
          </div>
          
          <div class="text-center">
            <UiNotificationBadge :count="testCount" color="yellow">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-600">🟡</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Yellow</p>
          </div>
          
          <div class="text-center">
            <UiNotificationBadge :count="testCount" color="purple">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-600">🟣</span>
              </div>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Purple</p>
          </div>
        </div>
      </div>

      <!-- Casos de Uso Reais -->
      <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 class="text-xl font-semibold mb-4">Casos de Uso Reais</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Botão de Notificações -->
          <div class="text-center">
            <UiNotificationBadge :count="unreadCount" pulse>
              <button class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5V11"/>
                </svg>
                <span>Notificações</span>
              </button>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Botão de Notificações</p>
          </div>

          <!-- Ícone de Mensagens -->
          <div class="text-center">
            <UiNotificationBadge :count="5" color="green" size="sm">
              <button class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </button>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Mensagens</p>
          </div>

          <!-- Carrinho de Compras -->
          <div class="text-center">
            <UiNotificationBadge :count="3" color="purple" size="lg">
              <button class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                </svg>
              </button>
            </UiNotificationBadge>
            <p class="mt-2 text-sm text-gray-600">Carrinho</p>
          </div>
        </div>
      </div>

      <!-- Estado Atual do Sistema -->
      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="text-xl font-semibold mb-4">Estado Atual do Sistema</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Contagem de Notificações</h3>
            <p class="text-2xl font-bold text-blue-600">{{ unreadCount }}</p>
            <p class="text-sm text-gray-500">{{ hasUnreadNotifications ? 'Há notificações não lidas' : 'Nenhuma notificação não lida' }}</p>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 mb-2">Última Atualização</h3>
            <p class="text-sm text-gray-600">{{ lastUpdate ? lastUpdate.toLocaleString('pt-BR') : 'Nunca' }}</p>
            <button 
              @click="refresh"
              :disabled="isLoading"
              class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {{ isLoading ? 'Carregando...' : 'Atualizar' }}
            </button>
          </div>
        </div>
        
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">Erro: {{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Estado de teste local
const testCount = ref(5)

// Sistema de notificações real
const {
  unreadCount,
  hasUnreadNotifications,
  lastUpdate,
  isLoading,
  error,
  refresh
} = useNotificationCount()
</script>