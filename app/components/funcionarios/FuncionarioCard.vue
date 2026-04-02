<template>
  <UiCard v-if="funcionario && funcionario.id" padding="p-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <UiAvatar 
          :name="funcionario.nome_completo" 
          :avatar-type="funcionario.avatar"
          size="lg"
        />
        
        <!-- Informações -->
        <div>
          <h3 class="text-xl font-bold text-gray-800">{{ funcionario.nome_completo }}</h3>
          <p class="text-lg text-gray-600">{{ funcionario.cargo }} - {{ funcionario.departamento }}</p>
          <p class="text-gray-500">{{ funcionario.email_login }}</p>
          <p class="text-sm text-gray-400">CPF: {{ funcionario.cpf }}</p>
          <p class="text-sm text-gray-400">Admissão: {{ formatarData(funcionario.data_admissao) }}</p>
          
          <!-- Responsável pelo Cadastro -->
          <div class="mt-1 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-700 flex items-center gap-1.5">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <strong>Cadastrado por:</strong> {{ funcionario.responsavel_cadastro_nome }}
              <span v-if="funcionario.responsavel_cadastro_email" class="text-blue-600">
                ({{ funcionario.responsavel_cadastro_email }})
              </span>
            </p>
          </div>
          
          <!-- Salário Bruto -->
          <div class="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
            <p class="text-lg font-bold text-green-700 flex items-center gap-1.5">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Salário: {{ formatarMoeda(funcionario.salario_base) }}
            </p>
          </div>
          
          <!-- Badges -->
          <div class="flex gap-2 mt-2">
            <UiBadge :variant="funcionario.status === 'ativo' ? 'success' : 'gray'">
              {{ funcionario.status === 'ativo' ? 'Ativo' : 'Inativo' }}
            </UiBadge>
            
            <UiBadge :variant="funcionario.tipo_acesso === 'admin' ? 'warning' : 'info'">
              {{ funcionario.tipo_acesso === 'admin' ? 'Administrador' : 'Funcionário' }}
            </UiBadge>
            
            <UiBadge variant="gray">
              {{ funcionario.telefone }}
            </UiBadge>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex gap-2 flex-wrap">
        <UiButton variant="ghost" @click="$emit('edit', funcionario)">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Editar
        </UiButton>
        
        <UiButton variant="ghost" @click="verHolerites">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Holerites
        </UiButton>

        <!-- Botão Anexar Arquivo -->
        <div class="relative">
          <input
            ref="inputAnexo"
            type="file"
            class="hidden"
            multiple
            @change="onAnexarArquivo"
          />
          <UiButton
            variant="ghost"
            :disabled="anexando"
            @click="inputAnexo?.click()"
          >
            <svg v-if="!anexando" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            {{ anexando ? 'Enviando...' : 'Anexar' }}
          </UiButton>
        </div>
        
        <UiButton 
          variant="ghost" 
          @click="enviarCredenciais"
          :disabled="enviandoEmail"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
          {{ enviandoEmail ? 'Enviando...' : 'Login' }}
        </UiButton>
        
        <UiButton 
          :variant="funcionario.status === 'ativo' ? 'danger' : 'success'"
          @click="$emit('toggle-status', funcionario)"
        >
          <svg v-if="funcionario.status === 'ativo'" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
          <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ funcionario.status === 'ativo' ? 'Inativar' : 'Ativar' }}
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
interface Props {
  funcionario: {
    id: number
    nome_completo: string
    cpf: string
    cargo: string
    departamento: string
    status: string
    tipo_acesso: string
    email_login: string
    telefone: string
    data_admissao: string
    salario_base: number
    avatar?: string
    responsavel_cadastro_nome?: string
    responsavel_cadastro_email?: string
    responsavel_direto_nome?: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [funcionario: any]
  'toggle-status': [funcionario: any]
  'email-enviado': [mensagem: string]
  'email-erro': [mensagem: string]
}>()

const enviandoEmail = ref(false)
const anexando = ref(false)
const inputAnexo = ref<HTMLInputElement | null>(null)

const onAnexarArquivo = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  anexando.value = true
  let sucesso = 0
  let falha = 0
  for (const file of Array.from(files)) {
    if (file.size > 10 * 1024 * 1024) { falha++; continue }
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('funcionario_id', String(props.funcionario.id))
      await $fetch('/api/admin/documentos/upload', { method: 'POST', body: form })
      sucesso++
    } catch { falha++ }
  }
  anexando.value = false
  if (inputAnexo.value) inputAnexo.value.value = ''
  if (sucesso > 0) emit('email-enviado', `${sucesso} arquivo(s) anexado(s) com sucesso!`)
  if (falha > 0) emit('email-erro', `${falha} arquivo(s) não puderam ser enviados.`)
}

const verHolerites = () => {
  // Navegar para página de holerites do funcionário
  navigateTo('/admin/holerites')
}

const enviarCredenciais = async () => {
  if (enviandoEmail.value) return
  
  enviandoEmail.value = true
  
  try {
    await $fetch('/api/funcionarios/enviar-acesso', {
      method: 'POST',
      body: {
        funcionario_id: props.funcionario.id
      }
    })
    
    emit('email-enviado', `Credenciais enviadas com sucesso para ${props.funcionario.email_login}!`)
  } catch (error: any) {
    emit('email-erro', error.data?.message || 'Erro ao enviar credenciais. Verifique se o funcionário possui email cadastrado.')
  } finally {
    enviandoEmail.value = false
  }
}

const formatarData = (data: string) => {
  if (!data) return ''
  try {
    // CORREÇÃO: Adicionar T00:00:00 para evitar problemas de timezone
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  } catch (error) {
    return 'Data inválida'
  }
}

const formatarMoeda = (valor: number) => {
  if (!valor) return 'R$ 0,00'
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  } catch (error) {
    return 'R$ 0,00'
  }
}
</script>