<template>
  <div class="space-y-4">
    <h3 class="text-lg font-bold text-gray-800 mb-4">💼 Dados Profissionais</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Empresa -->
      <div v-if="showEmpresaSelect" class="md:col-span-2">
        <UiSelect 
          v-model="form.empresa_id" 
          :options="empresasOptions" 
          label="Empresa" 
          placeholder="Selecione a empresa..."
        />
      </div>
      
      <UiSelect 
        v-model="form.departamento_id" 
        :options="departamentosOptions" 
        label="Departamento" 
        placeholder="Selecione..."
      />
      
      <UiSelect 
        v-model="form.cargo_id" 
        :options="cargosOptions" 
        label="Cargo" 
        placeholder="Selecione..."
      />
      
      <UiSelect 
        v-model="form.tipo_contrato" 
        :options="tipoContratoOptions" 
        label="Tipo de Contrato"
      />
      
      <UiInput 
        v-model="form.data_admissao" 
        type="date" 
        label="Data de Admissão"
      />
      
      <UiInput 
        v-model="form.matricula" 
        label="Matrícula/Registro" 
        placeholder="Gerado automaticamente"
      />
      
      <UiSelect 
        v-model="form.responsavel_id" 
        :options="responsavelOptions" 
        label="Responsável Direto" 
        placeholder="Selecione..."
      />
    </div>
    
    <div class="mt-4 p-4 bg-blue-50 rounded-xl">
      <p class="text-sm text-blue-700">
        👩‍💼 <strong>Responsável Padrão:</strong> Silvana é automaticamente definida como responsável direto de todos os funcionários. 
        Você pode alterar se necessário, mas por padrão ela supervisiona toda a equipe.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: any
  showEmpresaSelect?: boolean
  empresasOptions: Array<{ value: string | number, label: string }>
  departamentosOptions: Array<{ value: string | number, label: string }>
  cargosOptions: Array<{ value: string | number, label: string }>
  responsavelOptions: Array<{ value: string | number | null, label: string }>
}

withDefaults(defineProps<Props>(), {
  showEmpresaSelect: false
})

// Opções para o select de tipo de contrato
const tipoContratoOptions = [
  { value: 'CLT', label: 'CLT' },
  { value: 'PJ', label: 'PJ' },
  { value: 'Estagio', label: 'Estágio' },
  { value: 'Temporario', label: 'Temporário' }
]
</script>