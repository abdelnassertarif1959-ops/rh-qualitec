<template>
  <UiModal 
    v-if="holerite"
    :model-value="true"
    title="Detalhes do Holerite"
    max-width="max-w-4xl"
    :close-on-backdrop="false"
    @update:model-value="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Dados do Funcionário -->
      <div class="bg-gray-50 rounded-xl p-4">
        <p class="font-semibold text-gray-800">
          {{ holerite?.funcionario?.nome_completo || userName || 'Funcionário' }}
        </p>
        <p class="text-gray-500">
          {{ holerite?.funcionario?.cargo || userCargo || 'Cargo não informado' }} - 
          {{ holerite?.funcionario?.empresa || 'Empresa' }}
        </p>
        <p class="text-sm text-gray-400 mt-1">
          Período: {{ formatarPeriodoReferencia(holerite?.periodo_inicio, holerite?.periodo_fim) }}
        </p>
      </div>

    <!-- Proventos -->
    <div>
      <h3 class="text-lg font-bold text-green-600 mb-3">Proventos</h3>
      <div class="space-y-2">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Salário Base</span>
          <span class="font-semibold">{{ formatarMoeda(holerite.salario_base) }}</span>
        </div>
        
        <!-- Benefícios -->
        <div v-if="holerite.beneficios && holerite.beneficios.length > 0">
          <div 
            v-for="beneficio in holerite.beneficios" 
            :key="beneficio.tipo"
            class="flex justify-between py-2 border-b border-gray-100"
          >
            <span class="text-gray-600">{{ beneficio.tipo }}</span>
            <span class="font-semibold text-green-600">+ {{ formatarMoeda(beneficio.valor) }}</span>
          </div>
        </div>
        
        <div v-if="holerite.bonus" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Bônus</span>
          <span class="font-semibold">{{ formatarMoeda(holerite.bonus) }}</span>
        </div>
        <div v-if="holerite.horas_extras" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Horas Extras</span>
          <span class="font-semibold">{{ formatarMoeda(holerite.horas_extras) }}</span>
        </div>
      </div>
      <div class="flex justify-between py-2 mt-2 bg-green-50 px-3 rounded-lg">
        <span class="font-bold text-green-700">Total Proventos</span>
        <span class="font-bold text-green-700">{{ formatarMoeda(holerite.total_proventos) }}</span>
      </div>
    </div>

    <!-- Descontos -->
    <div>
      <h3 class="text-lg font-bold text-red-600 mb-3">Descontos</h3>
      <div class="space-y-2">
        <div v-if="holerite.inss" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">INSS</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.inss) }}</span>
        </div>
        <div v-if="holerite.irrf" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">IRRF</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.irrf) }}</span>
        </div>
        
        <!-- Descontos de Benefícios -->
        <template v-if="holerite.beneficios && holerite.beneficios.length > 0">
          <div 
            v-for="beneficio in holerite.beneficios.filter((b: any) => b.desconto && b.desconto > 0)" 
            :key="beneficio.tipo"
            class="flex justify-between py-2 border-b border-gray-100"
          >
            <span class="text-gray-600">{{ beneficio.tipo }} (Desconto)</span>
            <span class="font-semibold text-red-600">- {{ formatarMoeda(beneficio.desconto) }}</span>
          </div>
        </template>
        
        <!-- Pensão Alimentícia -->
        <div v-if="holerite.pensao_alimenticia && holerite.pensao_alimenticia > 0" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">PENSÃO ALIMENTÍCIA</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.pensao_alimenticia) }}</span>
        </div>
        
        <!-- Itens Personalizados (apenas para detalhamento) -->
        <div v-if="descontosPersonalizados.length > 0">
          <div 
            v-for="desconto in descontosPersonalizados" 
            :key="desconto.id"
            class="flex justify-between py-2 border-b border-gray-100"
          >
            <span class="text-gray-600">{{ desconto.descricao }}</span>
            <span class="font-semibold text-red-600">- {{ formatarMoeda(desconto.valor) }}</span>
          </div>
        </div>
        
        <div v-if="holerite.vale_transporte" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Vale Transporte</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.vale_transporte) }}</span>
        </div>
        
        <!-- Adiantamento -->
        <div v-if="holerite.adiantamento && holerite.adiantamento > 0" class="flex justify-between py-2 border-b border-gray-100 bg-yellow-50">
          <span class="text-gray-600 font-semibold flex items-center gap-1.5">
            <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Adiantamento Pago
          </span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.adiantamento) }}</span>
        </div>
      </div>
      <div class="flex justify-between py-2 mt-2 bg-red-50 px-3 rounded-lg">
        <span class="font-bold text-red-700">Total Descontos</span>
        <span class="font-bold text-red-700">- {{ formatarMoeda(totalDescontosComItens) }}</span>
      </div>
    </div>

    <!-- Líquido -->
    <div class="bg-primary-50 rounded-xl p-4">
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-primary-800">Salário Líquido</span>
        <span class="text-2xl font-bold text-primary-700">{{ formatarMoeda(salarioLiquidoCorreto) }}</span>
      </div>
    </div>

    <!-- Ações -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <UiButton variant="secondary" @click="$emit('close')">
        Fechar
      </UiButton>
      <div @mousedown.stop @click.stop>
        <UiButton @mousedown.stop.prevent @click.stop.prevent="baixarPDF">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          Visualizar/Imprimir
        </UiButton>
      </div>
    </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  holerite: any
  userName?: string
  userCargo?: string
  userDepartamento?: string
}>()

const emit = defineEmits<{
  close: []
  download: [holerite: any]
}>()

// Estado para itens personalizados
const itensPersonalizados = ref<any[]>([])
const carregandoItens = ref(false)

// Buscar itens personalizados ao montar o componente
onMounted(async () => {
  if (props.holerite?.funcionario_id) {
    await carregarItensPersonalizados()
  }
})

// Função para carregar itens personalizados
const carregarItensPersonalizados = async () => {
  carregandoItens.value = true
  try {
    const response = await fetch(`/api/holerites/itens-personalizados/${props.holerite.funcionario_id}`)
    const result = await response.json()
    
    if (result.success && result.data) {
      // Filtrar apenas itens vigentes no período do holerite
      const periodoInicio = new Date(props.holerite.periodo_inicio)
      const periodoFim = new Date(props.holerite.periodo_fim)
      
      itensPersonalizados.value = result.data.filter((item: any) => {
        const dataInicio = new Date(item.data_inicio)
        const dataFim = item.data_fim ? new Date(item.data_fim) : null
        
        // Item está vigente se:
        // - data_inicio <= periodo_fim
        // - data_fim é null OU data_fim >= periodo_inicio
        return dataInicio <= periodoFim && (!dataFim || dataFim >= periodoInicio)
      })
      
      console.log(`📋 Itens personalizados vigentes: ${itensPersonalizados.value.length}`)
      console.log(`   ⚠️  Estes itens JÁ ESTÃO incluídos no total_descontos do banco`)
      console.log(`   📊 Exibindo apenas para detalhamento, sem somar novamente`)
    }
  } catch (error) {
    console.error('Erro ao carregar itens personalizados:', error)
  } finally {
    carregandoItens.value = false
  }
}

// Computed para separar benefícios e descontos
const beneficiosPersonalizados = computed(() => {
  const beneficios = itensPersonalizados.value.filter((item: any) => item.tipo === 'beneficio')
  console.log(`📋 Benefícios personalizados: ${beneficios.length}`, beneficios)
  return beneficios
})

const descontosPersonalizados = computed(() => {
  const descontos = itensPersonalizados.value.filter((item: any) => item.tipo === 'desconto')
  console.log(`📋 Descontos personalizados: ${descontos.length}`, descontos)
  return descontos
})

// Computed para calcular total de descontos
// IMPORTANTE: O total_descontos do banco JÁ INCLUI os itens personalizados
// Não devemos somar novamente!
const totalDescontosComItens = computed(() => {
  const descontosBase = props.holerite.total_descontos || 0
  
  console.log(`💰 Total de Descontos (do banco): R$ ${descontosBase.toFixed(2)}`)
  console.log(`   ⚠️  Itens personalizados JÁ ESTÃO incluídos neste valor`)
  
  return descontosBase
})

// Computed para calcular salário líquido correto
const salarioLiquidoCorreto = computed(() => {
  const proventos = props.holerite.total_proventos || 0
  const liquido = proventos - totalDescontosComItens.value
  
  console.log(`💵 Cálculo de Salário Líquido:`)
  console.log(`   Proventos: R$ ${proventos.toFixed(2)}`)
  console.log(`   Descontos: R$ ${totalDescontosComItens.value.toFixed(2)}`)
  console.log(`   Líquido: R$ ${liquido.toFixed(2)}`)
  
  return liquido
})

const formatarMoeda = (valor: number | undefined | null) => {
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

const formatarPeriodo = (inicio: string | undefined, fim: string | undefined) => {
  if (!inicio || !fim) return 'Período não definido'
  try {
    const dataInicio = new Date(inicio).toLocaleDateString('pt-BR')
    const dataFim = new Date(fim).toLocaleDateString('pt-BR')
    return `${dataInicio} - ${dataFim}`
  } catch (error) {
    return 'Período inválido'
  }
}

const formatarPeriodoReferencia = (inicio: string | undefined, fim: string | undefined) => {
  if (!inicio || !fim) return 'Período não definido'
  
  try {
    // Adicionar 'T00:00:00' para evitar problemas de timezone
    const dataInicio = new Date(inicio + 'T00:00:00')
    const dataFim = new Date(fim + 'T00:00:00')
    
    // Verificar se é adiantamento (período do dia 15 ao último dia do mês)
    const diaInicio = dataInicio.getDate()
    const isAdiantamento = diaInicio === 15
    
    if (isAdiantamento) {
      // Para adiantamentos, mostrar o período completo
      const dataInicioFormatada = dataInicio.toLocaleDateString('pt-BR')
      const dataFimFormatada = dataFim.toLocaleDateString('pt-BR')
      return `${dataInicioFormatada} - ${dataFimFormatada}`
    } else {
      // Para folha mensal, mostrar o mês ANTERIOR completo
      // Exemplo: Holerite gerado em 09/02/2026 deve mostrar "Janeiro de 2026"
      const mesAnterior = new Date(dataInicio)
      mesAnterior.setMonth(mesAnterior.getMonth() - 1)
      
      const mesNome = mesAnterior.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      return mesNome.charAt(0).toUpperCase() + mesNome.slice(1) // Capitalizar primeira letra
    }
  } catch (error) {
    return 'Período inválido'
  }
}

const baixarPDF = () => {
  try {
    console.log('📄 Abrindo PDF do holerite:', props.holerite.id)
    
    // Abrir PDF em nova aba de forma síncrona (importante para evitar bloqueio de popup)
    const url = `/api/holerites/${props.holerite.id}/pdf`
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Se o popup foi bloqueado, mostrar mensagem
      alert('Por favor, permita popups para visualizar o holerite')
    } else {
      console.log('✅ PDF aberto com sucesso em nova aba')
    }
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
    alert('Erro ao baixar PDF do holerite')
  }
}
</script>
