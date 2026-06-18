<template>
  <div class="p-6 bg-white">
    <h1 class="text-2xl font-bold mb-4 text-green-600">🎉 FUNCIONÁRIO FORM TESTE FUNCIONANDO!</h1>
    
    <div class="space-y-4">
      <div class="p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 class="font-semibold text-blue-800">📋 Props Recebidas:</h2>
        <pre class="text-sm mt-2">{{ JSON.stringify({
          isEditing,
          loading,
          showEmpresaSelect,
          formExists: !!form
        }, null, 2) }}</pre>
      </div>
      
      <div v-if="form" class="p-4 bg-green-50 border border-green-200 rounded">
        <h2 class="font-semibold text-green-800">✅ Dados do Form:</h2>
        <div class="grid grid-cols-2 gap-4 mt-2 text-sm">
          <div><strong>Nome:</strong> {{ form.nome_completo || 'Vazio' }}</div>
          <div><strong>CPF:</strong> {{ form.cpf || 'Vazio' }}</div>
          <div><strong>Email:</strong> {{ form.email_login || 'Vazio' }}</div>
          <div><strong>Salário:</strong> {{ form.salario_base || 'Vazio' }}</div>
          <div><strong>Benefícios:</strong> {{ form.beneficios ? 'Existe' : 'Null' }}</div>
          <div><strong>Tipo Contrato:</strong> {{ form.tipo_contrato || 'Vazio' }}</div>
        </div>
      </div>
      
      <div v-else class="p-4 bg-red-50 border border-red-200 rounded">
        <h2 class="font-semibold text-red-800">❌ Form é null ou undefined</h2>
      </div>
      
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h2 class="font-semibold text-yellow-800">🧪 Teste de Input Simples:</h2>
        <input 
          v-if="form"
          v-model="form.nome_completo"
          placeholder="Digite o nome..."
          class="w-full p-3 border border-gray-300 rounded mt-2"
        />
        <p v-else class="text-red-600 mt-2">Não é possível testar input - form é null</p>
      </div>
      
      <div class="flex gap-3 pt-4">
        <button 
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button 
          @click="$emit('submit')"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: any
  isEditing: boolean
  showEmpresaSelect?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showEmpresaSelect: false,
  loading: false
})

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

// Log no console para debug
onMounted(() => {
  console.log('🧪 [FuncionarioFormTeste] Componente montado!')
  console.log('📋 [FuncionarioFormTeste] Props:', props)
  console.log('📝 [FuncionarioFormTeste] Form:', props.form)
})

watch(() => props.form, (newForm) => {
  console.log('👀 [FuncionarioFormTeste] Form alterado:', newForm)
}, { deep: true, immediate: true })
</script>