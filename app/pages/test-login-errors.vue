<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Teste de Erros de Login</h1>
      
      <div class="space-y-4">
        <button 
          @click="testEmailError"
          class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Testar Erro de Email
        </button>
        
        <button 
          @click="testPasswordError"
          class="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
        >
          Testar Erro de Senha
        </button>
        
        <button 
          @click="testGenericError"
          class="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
        >
          Testar Erro Genérico
        </button>
        
        <button 
          @click="testRealLogin"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Testar Login Real (email/senha incorretos)
        </button>
      </div>
      
      <!-- Exibir erros -->
      <div v-if="error" class="mt-6 p-4 bg-red-100 border border-red-300 rounded">
        <h3 class="font-bold text-red-800">Erro:</h3>
        <p class="text-red-700">{{ error }}</p>
      </div>
      
      <div v-if="emailError" class="mt-6 p-4 bg-orange-100 border border-orange-300 rounded">
        <h3 class="font-bold text-orange-800">Erro de Email:</h3>
        <p class="text-orange-700">{{ emailError }}</p>
      </div>
      
      <!-- Logs -->
      <div class="mt-6">
        <h3 class="font-bold mb-2">Logs:</h3>
        <div class="bg-gray-100 p-3 rounded text-xs max-h-40 overflow-y-auto">
          <div v-for="(log, index) in logs" :key="index" class="mb-1">
            {{ log }}
          </div>
        </div>
      </div>
      
      <div class="mt-6 text-center">
        <button 
          @click="navigateTo('/login')"
          class="text-blue-600 hover:text-blue-800 underline"
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()

const error = ref('')
const emailError = ref('')
const logs = ref<string[]>([])

const addLog = (message: string) => {
  logs.value.push(`${new Date().toLocaleTimeString()}: ${message}`)
}

const testEmailError = async () => {
  error.value = ''
  emailError.value = ''
  addLog('Testando erro de email...')
  
  // Simular erro de email não encontrado
  emailError.value = 'Email não encontrado. Verifique se o email está correto.'
  addLog('Erro de email definido: ' + emailError.value)
}

const testPasswordError = async () => {
  error.value = ''
  emailError.value = ''
  addLog('Testando erro de senha...')
  
  // Simular erro de senha incorreta
  error.value = 'Senha incorreta. Verifique sua senha e tente novamente.'
  addLog('Erro de senha definido: ' + error.value)
}

const testGenericError = async () => {
  error.value = ''
  emailError.value = ''
  addLog('Testando erro genérico...')
  
  // Simular erro genérico
  error.value = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.'
  addLog('Erro genérico definido: ' + error.value)
}

const testRealLogin = async () => {
  error.value = ''
  emailError.value = ''
  addLog('Testando login real com credenciais incorretas...')
  
  try {
    const result = await login('email@inexistente.com', 'senhaerrada123')
    addLog('Resultado do login: ' + JSON.stringify(result))
    
    if (!result.success) {
      if (result.message.toLowerCase().includes('email') || result.message.toLowerCase().includes('usuário')) {
        emailError.value = result.message
        addLog('Erro de email definido: ' + result.message)
      } else {
        error.value = result.message
        addLog('Erro genérico definido: ' + result.message)
      }
    }
  } catch (err: any) {
    addLog('Erro capturado: ' + JSON.stringify(err))
    error.value = 'Erro de conexão'
  }
}

onMounted(() => {
  addLog('Página de teste carregada')
})
</script>