<template>
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-800 mb-4">👤 Dados Pessoais</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <UiInput 
          v-model="form.nome_completo" 
          label="Nome Completo" 
          required 
          placeholder="Digite o nome completo"
        />
      </div>
      
      <UiInput 
        v-model="form.cpf" 
        label="CPF" 
        required
        placeholder="000.000.000-00"
      />
      
      <UiInputPIS 
        v-model="form.pis_pasep" 
        label="PIS/PASEP" 
        placeholder="000.00000.00-0"
      />
      
      <UiInput 
        v-model="form.rg" 
        label="RG" 
        placeholder="00.000.000-0"
      />
      
      <UiInput 
        v-model="form.data_nascimento" 
        type="date" 
        label="Data de Nascimento"
      />
      
      <UiSelect 
        v-model="form.sexo" 
        :options="sexoOptions" 
        label="Sexo" 
        placeholder="Selecione..."
      />
      
      <UiInput 
        v-model="form.telefone" 
        label="Telefone"
        placeholder="(11) 99999-9999"
      />
      
      <UiInput 
        v-model="form.email_pessoal" 
        type="email" 
        :uppercase="false"
        label="Email Pessoal" 
        placeholder="email@pessoal.com"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: any
}

defineProps<Props>()

// Opções para o select de sexo
const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Outro' }
]
</script>