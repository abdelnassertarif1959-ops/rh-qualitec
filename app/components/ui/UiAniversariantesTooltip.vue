<template>
  <div class="relative inline-block">
    <!-- Trigger -->
    <div 
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @click="showTooltip = !showTooltip"
      class="cursor-pointer"
    >
      <slot />
    </div>

    <!-- Tooltip - Posicionado abaixo do ícone -->
    <div 
      v-if="showTooltip && aniversariantes.length > 0"
      class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-sm w-80"
    >
      <!-- Seta apontando para cima -->
      <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
      
      <div class="mb-3">
        <h3 class="font-semibold text-gray-900 flex items-center gap-2">
          🎂 Aniversariantes do Mês
        </h3>
        <p class="text-sm text-gray-600">{{ mesAtual }}</p>
      </div>
      
      <div class="space-y-3 max-h-64 overflow-y-auto">
        <div 
          v-for="aniversariante in aniversariantes" 
          :key="aniversariante.id"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
        >
          <UiAvatar 
            :name="aniversariante.nome_completo" 
            :avatar-type="aniversariante.avatar"
            size="sm"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">
              {{ aniversariante.nome_completo }}
            </p>
            <p class="text-sm text-gray-600">
              {{ formatarDataAniversario(aniversariante.data_nascimento) }}
              <span class="text-gray-400">
                ({{ calcularIdade(aniversariante.data_nascimento) }} anos)
              </span>
            </p>
          </div>
          
          <!-- Indicador se é hoje -->
          <div 
            v-if="isAniversarioHoje(aniversariante.data_nascimento)"
            class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
            title="Aniversário hoje!"
          ></div>
        </div>
      </div>
      
      <div v-if="aniversariantes.length === 0" class="text-center py-4 text-gray-500">
        Nenhum aniversariante este mês
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  aniversariantes: Array<{
    id: string
    nome_completo: string
    data_nascimento: string
    avatar?: string
  }>
}

const props = defineProps<Props>()

const showTooltip = ref(false)

const { formatarDataAniversario, calcularIdade } = useAniversariantes()

// Computed para o mês atual
const mesAtual = computed(() => {
  const hoje = new Date()
  return hoje.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  })
})

// Função para verificar se é aniversário hoje
const isAniversarioHoje = (dataString: string) => {
  const hoje = new Date()
  const dataNascimento = new Date(dataString)
  
  return hoje.getDate() === dataNascimento.getDate() &&
         hoje.getMonth() === dataNascimento.getMonth()
}
</script>