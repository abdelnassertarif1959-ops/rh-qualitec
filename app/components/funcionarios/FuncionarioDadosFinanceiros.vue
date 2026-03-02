<template>
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-800 mb-4">💰 Dados Financeiros</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiInput 
        v-model="form.salario_base" 
        type="number" 
        :uppercase="false"
        step="0.01"
        label="Salário Base (R$)"
        placeholder="0,00"
      />
      
      <UiSelect 
        v-model="form.tipo_salario" 
        :options="tipoSalarioOptions" 
        label="Tipo de Salário"
      />
      
      <UiInput 
        v-model="form.numero_dependentes" 
        type="number" 
        :uppercase="false"
        min="0"
        step="1"
        label="Número de Dependentes (IRRF)"
        placeholder="0"
      />
      
      <UiInput 
        v-model="form.banco" 
        label="Banco" 
        placeholder="Nome do banco"
      />
      
      <UiInput 
        v-model="form.agencia" 
        label="Agência" 
        placeholder="0000"
      />
      
      <UiInput 
        v-model="form.conta" 
        label="Conta" 
        placeholder="00000-0"
      />
      
      <UiSelect 
        v-model="form.tipo_conta" 
        :options="tipoContaOptions" 
        label="Tipo de Conta" 
        placeholder="Selecione..."
      />
      
      <UiSelect 
        v-model="form.forma_pagamento" 
        :options="formaPagamentoOptions" 
        label="Forma de Pagamento"
      />
      
      <UiInput 
        v-model="form.chave_pix" 
        label="Chave PIX (Opcional)" 
        placeholder="CPF, email, telefone ou chave aleatória"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: any
}

defineProps<Props>()

// Opções para os selects
const tipoSalarioOptions = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'horista', label: 'Horista' }
]

const formaPagamentoOptions = [
  { value: 'deposito', label: 'Depósito Bancário' }
]

const tipoContaOptions = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Conta Poupança' },
  { value: 'salario', label: 'Conta Salário' }
]
</script>