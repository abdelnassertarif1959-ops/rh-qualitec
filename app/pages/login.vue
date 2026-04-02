<template>
  <div class="min-h-screen bg-gradient-to-br from-industrial-50 via-qualitec-50 to-industrial-100 flex items-center justify-center p-4 relative overflow-hidden font-corporate">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-[0.03]">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.4) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <div class="w-full max-w-sm relative z-10">
      <UiCardIndustrial class="border-2 border-industrial-200/30 shadow-2xl">

        <!-- Branding -->
        <div class="text-center mb-5">
          <div class="flex justify-center mb-3">
            <img src="/images/qualitec_logo.png" alt="Qualitec" class="h-16 object-contain drop-shadow-md" style="transform: scale(3); transform-origin: center;" />
          </div>
          <h1 class="text-lg font-bold text-industrial-800">Gestão de Recursos Humanos</h1>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleLogin" class="space-y-4" :class="{ 'shake': shakeForm }">

          <!-- Alerta de Erro -->
          <Transition name="fade">
            <div v-if="error || emailError" class="p-3 bg-safety-danger/10 border border-safety-danger/30 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-safety-danger flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-safety-danger text-sm font-medium">{{ emailError || error }}</p>
              </div>
            </div>
          </Transition>

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-industrial-700 mb-1.5">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
                E-mail Corporativo <span class="text-safety-danger">*</span>
              </span>
            </label>
            <input
              v-model="email"
              @input="clearErrors"
              type="email"
              placeholder="seu.email@qualitec.com.br"
              autocomplete="email"
              required
              :class="[
                'w-full px-3.5 py-2.5 text-sm border-2 rounded-xl outline-none transition-all duration-200 bg-white/95',
                'placeholder:text-industrial-400',
                emailError
                  ? 'border-safety-danger/50 focus:border-safety-danger focus:ring-2 focus:ring-safety-danger/10'
                  : 'border-industrial-300 focus:border-qualitec-500 focus:ring-2 focus:ring-qualitec-100 hover:border-industrial-400'
              ]"
            />
          </div>

          <!-- Senha -->
          <div>
            <label class="block text-xs font-semibold text-industrial-700 mb-1.5">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                Senha de Acesso <span class="text-safety-danger">*</span>
              </span>
            </label>
            <div class="relative">
              <input
                v-model="senha"
                @input="clearErrors"
                :type="passwordVisible ? 'text' : 'password'"
                placeholder="Digite sua senha"
                autocomplete="current-password"
                required
                :class="[
                  'w-full px-3.5 py-2.5 pr-10 text-sm border-2 rounded-xl outline-none transition-all duration-200 bg-white/95',
                  'placeholder:text-industrial-400',
                  error
                    ? 'border-safety-danger/50 focus:border-safety-danger focus:ring-2 focus:ring-safety-danger/10'
                    : 'border-industrial-300 focus:border-qualitec-500 focus:ring-2 focus:ring-qualitec-100 hover:border-industrial-400'
                ]"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400 hover:text-industrial-600 transition-colors"
                @click="passwordVisible = !passwordVisible"
                tabindex="-1"
              >
                <svg v-if="!passwordVisible" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Lembrar-me + Esqueci senha -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="rememberMe" type="checkbox" class="w-3.5 h-3.5 text-qualitec-600 border-2 border-industrial-300 rounded focus:ring-qualitec-500" />
              <span class="text-xs text-industrial-600 font-medium">Lembrar-me</span>
            </label>
            <button type="button" @click="showForgotPasswordModal = true" class="text-xs text-qualitec-600 hover:text-qualitec-800 font-medium underline decoration-dotted underline-offset-2">
              Esqueci minha senha
            </button>
          </div>

          <!-- Botão Login -->
          <UiButtonIndustrial type="submit" size="lg" :loading="loading" class="w-full">
            <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            <span>{{ loading ? 'Autenticando...' : 'Acessar Sistema' }}</span>
          </UiButtonIndustrial>
        </form>

        <!-- Rodapé compacto -->
        <div class="mt-5 pt-4 border-t border-industrial-100 text-center space-y-0.5">
          <p class="text-xs font-bold text-industrial-700">QUALITEC INSTRUMENTOS LTDA</p>
          <p class="text-xs text-industrial-500">© 2026 — Todos os direitos reservados</p>
        </div>
      </UiCardIndustrial>

      <!-- LGPD -->
      <p class="mt-3 text-center text-xs text-industrial-500 leading-relaxed">
        Ao acessar, você concorda com nossa
        <button class="text-qualitec-600 hover:text-qualitec-800 underline decoration-dotted">Política de Privacidade</button>
        e <button class="text-qualitec-600 hover:text-qualitec-800 underline decoration-dotted">Termos de Uso</button>.
        Dados protegidos conforme a LGPD.
      </p>
    </div>

    <!-- Modal Recuperação de Senha -->
    <Transition name="modal">
      <div
        v-if="showForgotPasswordModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click.self="closeForgotPasswordModal"
      >
        <UiCardIndustrial class="w-full max-w-sm">
          <div class="text-center mb-5">
            <div class="w-12 h-12 bg-qualitec-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-industrial-800">Recuperar Senha</h3>
            <p class="text-xs text-industrial-600 mt-1">Digite seu email para receber as instruções</p>
          </div>

          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <input
              v-model="forgotPasswordEmail"
              type="email"
              placeholder="seu.email@qualitec.com.br"
              required
              :disabled="forgotPasswordLoading"
              class="w-full px-3.5 py-2.5 text-sm border-2 rounded-xl outline-none transition-all bg-white/95 placeholder:text-industrial-400 border-industrial-300 focus:border-qualitec-500 focus:ring-2 focus:ring-qualitec-100 disabled:opacity-50"
            />

            <div v-if="forgotPasswordMessage" class="p-3 rounded-xl text-sm"
              :class="forgotPasswordMessageType === 'success'
                ? 'bg-safety-success/10 border border-safety-success/30 text-safety-success'
                : 'bg-safety-danger/10 border border-safety-danger/30 text-safety-danger'"
            >
              {{ forgotPasswordMessage }}
            </div>

            <div class="flex gap-2">
              <UiButtonIndustrial type="button" variant="secondary" size="md" class="flex-1" @click="closeForgotPasswordModal" :disabled="forgotPasswordLoading">
                Cancelar
              </UiButtonIndustrial>
              <UiButtonIndustrial type="submit" size="md" class="flex-1" :loading="forgotPasswordLoading">
                <span>{{ forgotPasswordLoading ? 'Enviando...' : 'Enviar' }}</span>
              </UiButtonIndustrial>
            </div>
          </form>
        </UiCardIndustrial>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()

const email = ref('')
const senha = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')
const emailError = ref('')
const passwordVisible = ref(false)
const shakeForm = ref(false)

const showForgotPasswordModal = ref(false)
const forgotPasswordEmail = ref('')
const forgotPasswordLoading = ref(false)
const forgotPasswordMessage = ref('')
const forgotPasswordMessageType = ref('error')

const triggerShake = () => {
  shakeForm.value = true
  setTimeout(() => { shakeForm.value = false }, 500)
}

const handleLogin = async () => {
  error.value = ''
  emailError.value = ''
  loading.value = true

  try {
    if (!email.value.trim()) {
      emailError.value = 'Email é obrigatório'
      loading.value = false
      triggerShake()
      return
    }
    if (!senha.value.trim()) {
      error.value = 'Senha é obrigatória'
      loading.value = false
      triggerShake()
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      emailError.value = 'Formato de email inválido'
      loading.value = false
      triggerShake()
      return
    }

    await new Promise(resolve => setTimeout(resolve, 800))
    const result = await login(email.value, senha.value)

    if (result.success) {
      if (rememberMe.value) {
        localStorage.setItem('qualitec_remember_email', email.value)
      } else {
        localStorage.removeItem('qualitec_remember_email')
      }
      sessionStorage.setItem('acabou_de_logar', 'true')
      await navigateTo('/dashboard')
    } else {
      const message = result.message.toLowerCase()
      if (message.includes('email') || message.includes('usuário') || message.includes('usuario') || message.includes('não encontrado') || message.includes('não existe')) {
        emailError.value = result.message
      } else {
        error.value = result.message
      }
      triggerShake()
    }
  } catch (err: any) {
    error.value = 'Erro inesperado. Tente novamente.'
    triggerShake()
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  forgotPasswordLoading.value = true
  forgotPasswordMessage.value = ''
  try {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: forgotPasswordEmail.value }
    })
    if (response.success) {
      forgotPasswordMessage.value = response.message
      forgotPasswordMessageType.value = 'success'
      setTimeout(() => { closeForgotPasswordModal() }, 4000)
    }
  } catch (err: any) {
    forgotPasswordMessage.value = err.data?.message || 'Erro ao enviar email de recuperação'
    forgotPasswordMessageType.value = 'error'
  } finally {
    forgotPasswordLoading.value = false
  }
}

const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false
  forgotPasswordEmail.value = ''
  forgotPasswordMessage.value = ''
  forgotPasswordLoading.value = false
}

const clearErrors = () => {
  error.value = ''
  emailError.value = ''
}

onMounted(() => {
  const savedEmail = localStorage.getItem('qualitec_remember_email')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
.shake { animation: shake 0.5s ease-in-out; }
</style>
