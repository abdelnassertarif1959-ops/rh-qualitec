<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Teste de Erros de Login</h1>
      
      <div class="space-y-4">
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-bold text-blue-800 mb-2">Como testar:</h3>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• Email inválido: teste@inexistente.com</li>
            <li>• Senha incorreta: qualquer senha errada</li>
            <li>• Email vazio: deixar campo em branco</li>
            <li>• Formato inválido: email sem @</li>
          </ul>
        </div>
        
        <div class="space-y-4">
          <button 
            @click="testarEmailInexistente"
            class="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Testar Email Inexistente
          </button>
          
          <button 
            @click="testarSenhaIncorreta"
            class="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Testar Senha Incorreta
          </button>
          
          <button 
            @click="testarCamposVazios"
            class="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Testar Campos Vazios
          </button>
        </div>
        
        <div v-if="resultado" class="p-4 rounded-lg" :class="resultado.sucesso ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
          <h4 class="font-bold mb-2" :class="resultado.sucesso ? 'text-green-800' : 'text-red-800'">
            {{ resultado.sucesso ? 'Sucesso' : 'Erro' }}
          </h4>
          <p class="text-sm" :class="resultado.sucesso ? 'text-green-700' : 'text-red-700'">
            {{ resultado.mensagem }}
          </p>
        </div>
        
        <div class="text-center">
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800 underline">
            Voltar para Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()
const resultado = ref<{ sucesso: boolean; mensagem: string } | null>(null)

const testarEmailInexistente = async () => {
  resultado.value = null
  const result = await login('teste@inexistente.com', 'senha123')
  resultado.value = {
    sucesso: result.success,
    mensagem: result.message
  }
}

const testarSenhaIncorreta = async () => {
  resultado.value = null
  // Usar um email que existe no sistema (substitua por um email real do seu sistema)
  const result = await login('admin@qualitecinstrumentos.com.br', 'senhaerrada123')
  resultado.value = {
    sucesso: result.success,
    mensagem: result.message
  }
}

const testarCamposVazios = async () => {
  resultado.value = null
  const result = await login('', '')
  resultado.value = {
    sucesso: result.success,
    mensagem: result.message
  }
}
</script>