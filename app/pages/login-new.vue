<template>
  <div class="min-h-screen bg-gradient-to-br from-industrial-50 via-qualitec-50 to-industrial-100 flex items-center justify-center p-4 relative overflow-hidden font-corporate">
    <!-- Background Industrial Pattern -->
    <div class="absolute inset-0 opacity-[0.03]">
      <!-- Grid Pattern Sutil -->
      <div 
        class="absolute inset-0" 
        style="background-image: radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.4) 1px, transparent 0); background-size: 40px 40px;"
      ></div>
      
      <!-- Elementos Geométricos Industriais -->
      <div class="absolute top-20 left-20 w-32 h-32 border border-qualitec-200 rounded-full"></div>
      <div class="absolute top-40 right-32 w-24 h-24 border border-industrial-300 rotate-45"></div>
      <div class="absolute bottom-32 left-32 w-40 h-40 border border-qualitec-200 rounded-full"></div>
      <div class="absolute bottom-20 right-20 w-28 h-28 border border-industrial-300 rotate-12"></div>
      
      <!-- Hexágonos Industriais -->
      <div 
        class="absolute top-1/3 left-1/4 w-16 h-16 border border-qualitec-300" 
        style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"
      ></div>
      <div 
        class="absolute bottom-1/3 right-1/4 w-12 h-12 border border-industrial-400 rotate-30" 
        style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"
      ></div>
    </div>
    
    <!-- Container Principal -->
    <div class="w-full max-w-md relative z-10">
      <!-- Card de Login Industrial -->
      <UiCardIndustrial class="border-2 border-industrial-200/30 shadow-2xl">
        <!-- Branding Qualitec -->
        <div class="text-center mb-8">
          <!-- Logo -->
          <div class="flex justify-center mb-4">
            <div class="relative">
              <img 
                src="/images/qualitec_logo.png" 
                alt="Qualitec Instrumentos" 
                class="object-contain w-32 h-32 drop-shadow-lg"
              />
              <!-- Anel decorativo ao redor do logo -->
              <div class="absolute inset-0 rounded-full border-2 border-qualitec-200 animate-pulse-slow"></div>
            </div>
          </div>
          
          <!-- Título e Subtítulo -->
          <div class="space-y-2 mb-4">
            <h1 class="text-2xl font-bold text-industrial-800">
              Sistema RH
            </h1>
            <p class="text-sm text-industrial-600 font-medium">
              Gestão de Recursos Humanos
            </p>
          </div>
          
          <!-- Linha Decorativa Industrial -->
          <div class="flex items-center justify-center mb-3">
            <div class="h-px bg-gradient-to-r from-transparent via-qualitec-300 to-transparent w-32"></div>
            <div class="mx-3 w-2 h-2 bg-qualitec-500 rounded-full"></div>
            <div class="h-px bg-gradient-to-r from-transparent via-qualitec-300 to-transparent w-32"></div>
          </div>
          
          <!-- Certificação -->
          <div class="flex items-center justify-center gap-2 text-xs text-industrial-500">
            <svg class="w-4 h-4 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="font-medium">ISO 9001:2015 | Instrumentação Industrial</span>
          </div>
        </div>

        <!-- Badge de Acesso Seguro -->
        <div class="mb-6 p-4 bg-gradient-to-r from-qualitec-50 to-industrial-50 border border-qualitec-200 rounded-xl">
          <div class="flex items-center justify-center gap-3">
            <div class="w-10 h-10 bg-qualitec-600 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="text-center">
              <p class="text-qualitec-800 font-bold text-sm">Acesso Corporativo</p>
              <p class="text-qualitec-600 text-xs">Credenciais fornecidas pelo RH</p>
            </div>
          </div>
        </div>

        <!-- Formulário de Login -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo Email -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-industrial-700 mb-2">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                E-mail Corporativo
                <span class="text-safety-danger">*</span>
              </span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="seu.email@qualitecinstrumentos.com.br"
              autocomplete="email"
              required
              :class="[
                'w-full px-4 py-3.5 text-base font-medium',
                'border-2 rounded-xl outline-none transition-all duration-200',
                'bg-white/95 backdrop-blur-sm',
                'placeholder:text-industrial-400 placeholder:font-normal',
                error && emailError 
                  ? 'border-safety-danger/50 focus:border-safety-danger focus:ring-4 focus:ring-safety-danger/10'
                  : 'border-industrial-300 focus:border-qualitec-500 focus:ring-4 focus:ring-qualitec-100 hover:border-industrial-400',
                'shadow-sm focus:shadow-md'
              ]"
            />
            <p v-if="!error || !emailError" class="text-xs text-industrial-500 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Use seu e-mail corporativo fornecido pelo RH
            </p>
            <p v-if="error && emailError" class="text-xs text-safety-danger mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ emailError }}
            </p>
          </div>

          <!-- Campo Senha -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-industrial-700 mb-2">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                Senha de Acesso
                <span class="text-safety-danger">*</span>
              </span>
            </label>
            <div class="relative">
              <input
                v-model="senha"
                :type="passwordVisible ? 'text' : 'password'"
                placeholder="Digite sua senha corporativa"
                autocomplete="current-password"
                required
                :class="[
                  'w-full px-4 py-3.5 pr-12 text-base font-medium',
                  'border-2 rounded-xl outline-none transition-all duration-200',
                  'bg-white/95 backdrop-blur-sm',
                  'placeholder:text-industrial-400 placeholder:font-normal',
                  error && !emailError 
                    ? 'border-safety-danger/50 focus:border-safety-danger focus:ring-4 focus:ring-safety-danger/10'
                    : 'border-industrial-300 focus:border-qualitec-500 focus:ring-4 focus:ring-qualitec-100 hover:border-industrial-400',
                  'shadow-sm focus:shadow-md'
                ]"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-industrial-400 hover:text-industrial-600 transition-colors rounded-lg hover:bg-industrial-50"
                @click="passwordVisible = !passwordVisible"
                tabindex="-1"
              >
                <svg v-if="!passwordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <p v-if="error && !emailError" class="text-xs text-safety-danger mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ error }}
            </p>
          </div>

          <!-- Checkbox Lembrar-me e Link Esqueci Senha -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-qualitec-600 bg-white border-2 border-industrial-300 rounded focus:ring-qualitec-500 focus:ring-2"
              />
              <span class="text-sm text-industrial-600 font-medium">Lembrar-me</span>
            </label>
            
            <button
              type="button"
              @click="showForgotPasswordModal = true"
              class="text-sm text-qualitec-600 hover:text-qualitec-800 font-medium transition-colors underline decoration-dotted underline-offset-2"
            >
              Esqueci minha senha
            </button>
          </div>

          <!-- CAPTCHA Placeholder -->
          <div class="p-4 bg-industrial-50 border border-industrial-200 rounded-xl">
            <div class="flex items-center justify-center gap-2 text-industrial-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span class="text-sm font-medium">Verificação de segurança ativada</span>
            </div>
          </div>

          <!-- Botão de Login -->
          <UiButtonIndustrial 
            type="submit" 
            size="xl" 
            :loading="loading" 
            class="w-full"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            <span v-if="!loading">Acessar Sistema</span>
            <span v-else>Autenticando...</span>
          </UiButtonIndustrial>
        </form>

        <!-- Informações de Segurança -->
        <div class="mt-8 p-6 bg-gradient-to-r from-industrial-50 to-qualitec-50 rounded-xl border border-industrial-200">
          <div class="text-center space-y-3">
            <div class="flex items-center justify-center gap-3">
              <div class="w-12 h-12 bg-qualitec-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="text-qualitec-800 font-bold text-sm">Sistema Seguro</p>
                <p class="text-qualitec-600 text-xs">Certificado ISO 9001:2015</p>
              </div>
            </div>
            <p class="text-industrial-600 text-xs leading-relaxed">
              Plataforma corporativa protegida por criptografia avançada.<br>
              Acesso monitorado e auditado para sua segurança.
            </p>
          </div>
        </div>
      </UiCardIndustrial>

      <!-- Modal Recuperação de Senha -->
      <Transition name="modal">
        <div 
          v-if="showForgotPasswordModal" 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click.self="closeForgotPasswordModal"
        >
          <UiCardIndustrial class="w-full max-w-md">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-qualitec-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-industrial-800 mb-2">Recuperar Senha</h3>
              <p class="text-sm text-industrial-600">
                Digite seu email corporativo para receber as instruções de recuperação
              </p>
            </div>

            <form @submit.prevent="handleForgotPassword" class="space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-industrial-700 mb-2">
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-qualitec-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                    </svg>
                    Email Corporativo
                    <span class="text-safety-danger">*</span>
                  </span>
                </label>
                <input
                  v-model="forgotPasswordEmail"
                  type="email"
                  placeholder="seu.email@qualitecinstrumentos.com.br"
                  required
                  :disabled="forgotPasswordLoading"
                  class="w-full px-4 py-3.5 text-base font-medium border-2 rounded-xl outline-none transition-all duration-200 bg-white/95 backdrop-blur-sm placeholder:text-industrial-400 placeholder:font-normal border-industrial-300 focus:border-qualitec-500 focus:ring-4 focus:ring-qualitec-100 hover:border-industrial-400 shadow-sm focus:shadow-md disabled:opacity-50"
                />
              </div>

              <div 
                v-if="forgotPasswordMessage" 
                class="p-4 rounded-xl" 
                :class="forgotPasswordMessageType === 'success' 
                  ? 'bg-safety-success/10 border border-safety-success/30 text-safety-success' 
                  : 'bg-safety-danger/10 border border-safety-danger/30 text-safety-danger'"
              >
                <div class="flex items-center gap-2">
                  <svg v-if="forgotPasswordMessageType === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-sm font-medium">{{ forgotPasswordMessage }}</p>
                </div>
              </div>

              <div class="flex gap-3">
                <UiButtonIndustrial
                  type="button"
                  variant="secondary"
                  size="lg"
                  class="flex-1"
                  @click="closeForgotPasswordModal"
                  :disabled="forgotPasswordLoading"
                >
                  Cancelar
                </UiButtonIndustrial>
                <UiButtonIndustrial
                  type="submit"
                  size="lg"
                  class="flex-1"
                  :loading="forgotPasswordLoading"
                >
                  <svg v-if="!forgotPasswordLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  <span v-if="!forgotPasswordLoading">Enviar</span>
                  <span v-else>Enviando...</span>
                </UiButtonIndustrial>
              </div>
            </form>
          </UiCardIndustrial>
        </div>
      </Transition>

      <!-- Rodapé Corporativo -->
      <div class="mt-8 text-center">
        <UiCardIndustrial class="bg-white/80 backdrop-blur-md border-industrial-200/50">
          <div class="text-center space-y-2">
            <p class="text-industrial-800 text-sm font-bold">
              QUALITEC INSTRUMENTOS LTDA
            </p>
            <p class="text-industrial-600 text-xs">
              Instrumentação Industrial | Criogenia | Óleo & Gás
            </p>
            <p class="text-industrial-500 text-xs">
              © 2026 - Todos os direitos reservados
            </p>
          </div>
        </UiCardIndustrial>
      </div>

      <!-- Textos Legais LGPD -->
      <div class="mt-4 text-center">
        <p class="text-xs text-industrial-500 leading-relaxed">
          Ao acessar o sistema, você concorda com nossa 
          <button class="text-qualitec-600 hover:text-qualitec-800 underline decoration-dotted">
            Política de Privacidade
          </button> e 
          <button class="text-qualitec-600 hover:text-qualitec-800 underline decoration-dotted">
            Termos de Uso
          </button>.
          <br>
          Seus dados são protegidos conforme a LGPD.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()

// Estados do formulário
const email = ref('')
const senha = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')
const emailError = ref('')
const passwordVisible = ref(false)

// Estados do modal de recuperação de senha
const showForgotPasswordModal = ref(false)
const forgotPasswordEmail = ref('')
const forgotPasswordLoading = ref(false)
const forgotPasswordMessage = ref('')
const forgotPasswordMessageType = ref('error')

const handleLogin = async () => {
  error.value = ''
  emailError.value = ''
  loading.value = true
  
  // Simular delay para UX
  await new Promise(resolve => setTimeout(resolve, 800))

  const result = await login(email.value, senha.value)
  
  if (result.success) {
    // Salvar preferência "lembrar-me" se necessário
    if (rememberMe.value) {
      localStorage.setItem('qualitec_remember_email', email.value)
    } else {
      localStorage.removeItem('qualitec_remember_email')
    }
    
    navigateTo('/dashboard')
  } else {
    // Verificar se é erro de email específico
    if (result.message.toLowerCase().includes('email') || result.message.toLowerCase().includes('usuário')) {
      emailError.value = result.message
    } else {
      error.value = result.message
    }
  }
  loading.value = false
}

const handleForgotPassword = async () => {
  forgotPasswordLoading.value = true
  forgotPasswordMessage.value = ''

  try {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: forgotPasswordEmail.value
      }
    })

    if (response.success) {
      forgotPasswordMessage.value = response.message
      forgotPasswordMessageType.value = 'success'
      
      // Fechar modal após 4 segundos
      setTimeout(() => {
        closeForgotPasswordModal()
      }, 4000)
    }
  } catch (error: any) {
    console.error('Erro na recuperação de senha:', error)
    forgotPasswordMessage.value = error.data?.message || 'Erro ao enviar email de recuperação'
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

// Carregar email salvo se "lembrar-me" estava ativo
onMounted(() => {
  const savedEmail = localStorage.getItem('qualitec_remember_email')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.3s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>