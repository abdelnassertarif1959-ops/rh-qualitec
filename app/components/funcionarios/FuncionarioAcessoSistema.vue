<template>
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-800 mb-4">🔐 Acesso ao Sistema</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiInput 
        v-model="form.email_login" 
        type="email" 
        :uppercase="false"
        label="Email de Login"
        required
        placeholder="email@empresa.com"
      />
      
      <UiInput 
        v-model="form.senha" 
        type="password" 
        label="Senha"
        required
        show-password-toggle
        placeholder="••••••••"
      />
      
      <UiSelect 
        v-model="form.tipo_acesso" 
        :options="tipoAcessoOptions" 
        label="Tipo de Acesso"
      />
      
      <UiSelect 
        v-model="form.status" 
        :options="statusOptions" 
        label="Status do Usuário"
      />
    </div>
    
    <div class="mt-4 p-4 bg-blue-50 rounded-xl">
      <h4 class="font-semibold text-blue-800 mb-2">📋 Tipos de Acesso:</h4>
      <ul class="text-sm text-blue-700 space-y-1">
        <li><strong>Funcionário:</strong> Visualiza apenas seus próprios dados</li>
        <li><strong>Administrador:</strong> Acesso total ao sistema</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: any
}

defineProps<Props>()

// Opções para os selects
const tipoAcessoOptions = [
  { value: 'funcionario', label: 'Funcionário' },
  { value: 'admin', label: 'Administrador' }
]

const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' }
]
</script>