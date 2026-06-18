<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Redefinir Senha</h1>
          <p class="text-slate-300">Digite sua nova senha abaixo</p>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="resetPassword" class="space-y-6">
          <!-- Nova Senha -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Nova Senha
            </label>
            <div class="relative">
              <input
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Digite sua nova senha"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                :disabled="loading"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-slate-400 mt-1">Mínimo de 6 caracteres</p>
          </div>

          <!-- Confirmar Senha -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Confirme sua nova senha"
              :disabled="loading"
            />
          </div>

          <!-- Botão -->
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redefinindo...
            </span>
            <span v-else>Redefinir Senha</span>
          </button>
        </form>

        <!-- Link para Login -->
        <div class="mt-6 text-center">
          <NuxtLink
            to="/login"
            class="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            ← Voltar para o login
          </NuxtLink>
        </div>

        <!-- Mensagens -->
        <div v-if="message" class="mt-4 p-3 rounded-lg" :class="messageType === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'">
          <p class="text-sm">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()

const form = ref({
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const showPassword = ref(false)
const message = ref('')
const messageType = ref('error')

const token = computed(() => route.query.token)

const isFormValid = computed(() => {
  return form.value.newPassword.length >= 6 && 
         form.value.newPassword === form.value.confirmPassword
})

// Verificar se há token na URL
onMounted(() => {
  if (!token.value) {
    message.value = 'Token de recuperação não encontrado'
    messageType.value = 'error'
  }
})

const resetPassword = async () => {
  if (!isFormValid.value) {
    message.value = 'As senhas não coincidem ou são muito curtas'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        newPassword: form.value.newPassword
      }
    })

    if (response.success) {
      message.value = 'Senha redefinida com sucesso! Redirecionando...'
      messageType.value = 'success'
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error)
    message.value = error.data?.message || 'Erro ao redefinir senha. Tente novamente.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>