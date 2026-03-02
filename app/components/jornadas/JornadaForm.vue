<template>
  <div class="space-y-6">
    <form @submit.prevent="handleSubmit">
      <!-- Informações Básicas -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">📋 Informações Básicas</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput 
            v-model="form.nome" 
            label="Nome da Jornada" 
            required 
            placeholder="Ex: Jornada 42h45min"
          />
          
          <div class="flex gap-4">
            <UiCheckbox 
              v-model="form.ativa" 
              label="Jornada Ativa"
            />
            
            <UiCheckbox 
              v-model="form.padrao" 
              label="Jornada Padrão"
            />
          </div>
        </div>
        
        <UiInput 
          v-model="form.descricao" 
          label="Descrição" 
          placeholder="Descreva as características desta jornada"
        />
      </div>

      <!-- Horários por Dia da Semana -->
      <div class="space-y-4 mt-8">
        <h3 class="text-lg font-bold text-gray-800 mb-4">🕐 Horários por Dia da Semana</h3>
        
        <div class="space-y-4">
          <div 
            v-for="(horario, index) in form.horarios" 
            :key="horario.dia_semana"
            class="p-4 border border-gray-200 rounded-xl"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                  horario.trabalha ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                ]">
                  {{ obterAbrevDia(horario.dia_semana) }}
                </div>
                
                <div>
                  <h4 class="font-semibold text-gray-800">
                    {{ obterNomeDia(horario.dia_semana) }}
                  </h4>
                  <p v-if="horario.trabalha" class="text-sm text-gray-600">
                    {{ formatarHorasDecimais(horario.horas_liquidas) }} líquidas
                  </p>
                </div>
              </div>
              
              <UiCheckbox 
                v-model="horario.trabalha" 
                label="Trabalha neste dia"
                @change="recalcularHoras(index)"
              />
            </div>
            
            <!-- Horários (só aparece se trabalha) -->
            <div v-if="horario.trabalha" class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <UiInput 
                v-model="horario.entrada" 
                type="time" 
                label="Entrada" 
                required
                @change="recalcularHoras(index)"
              />
              
              <UiInput 
                v-model="horario.saida" 
                type="time" 
                label="Saída" 
                required
                @change="recalcularHoras(index)"
              />
              
              <UiInput 
                :model-value="horario.intervalo_inicio || ''"
                @update:model-value="horario.intervalo_inicio = $event || undefined"
                type="time" 
                label="Início Intervalo"
                @change="recalcularHoras(index)"
              />
              
              <UiInput 
                :model-value="horario.intervalo_fim || ''"
                @update:model-value="horario.intervalo_fim = $event || undefined"
                type="time" 
                label="Fim Intervalo"
                @change="recalcularHoras(index)"
              />
            </div>
            
            <!-- Resumo das Horas -->
            <div v-if="horario.trabalha" class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div class="font-semibold text-blue-600">
                    {{ formatarHorasDecimais(horario.horas_brutas) }}
                  </div>
                  <div class="text-gray-500">Horas Brutas</div>
                </div>
                
                <div>
                  <div class="font-semibold text-orange-600">
                    {{ formatarHorasDecimais(horario.horas_intervalo) }}
                  </div>
                  <div class="text-gray-500">Intervalo</div>
                </div>
                
                <div>
                  <div class="font-semibold text-green-600">
                    {{ formatarHorasDecimais(horario.horas_liquidas) }}
                  </div>
                  <div class="text-gray-500">Horas Líquidas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumo Total -->
      <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Resumo Total</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600">
              {{ formatarHorasDecimais(totalSemanal) }}
            </div>
            <div class="text-sm text-gray-600">Horas Semanais</div>
          </div>
          
          <div>
            <div class="text-2xl font-bold text-green-600">
              {{ formatarHorasDecimais(totalMensal) }}
            </div>
            <div class="text-sm text-gray-600">Horas Mensais</div>
          </div>
          
          <div>
            <div class="text-2xl font-bold text-purple-600">
              {{ diasTrabalhados }}/7
            </div>
            <div class="text-sm text-gray-600">Dias por Semana</div>
          </div>
        </div>
      </div>

      <!-- Validações -->
      <div v-if="errosValidacao.length > 0" class="mt-6">
        <UiAlert variant="error" title="Erros de Validação">
          <ul class="list-disc list-inside space-y-1">
            <li v-for="erro in errosValidacao" :key="erro">{{ erro }}</li>
          </ul>
        </UiAlert>
      </div>

      <!-- Botões -->
      <div class="flex justify-end gap-3 pt-6 border-t mt-8">
        <UiButton variant="secondary" @click="$emit('cancelar')">
          Cancelar
        </UiButton>
        
        <UiButton type="submit" :disabled="errosValidacao.length > 0">
          💾 {{ jornada ? 'Atualizar' : 'Criar' }} Jornada
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { JornadaTrabalho, JornadaHorario } from '~/composables/useJornadas'

interface Props {
  jornada?: JornadaTrabalho | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  salvar: [dados: any]
  cancelar: []
}>()

// Funções de formatação vêm de useJornadasFormat
const { 
  diasSemana, 
  formatarHorasDecimais, 
  obterNomeDia, 
  obterAbrevDia
} = useJornadasFormat()

// Funções de cálculo e validação
const { validarJornada } = useJornadasCalculo()

// Formulário
const form = ref({
  nome: '',
  descricao: '',
  ativa: true,
  padrao: false,
  horarios: [] as JornadaHorario[]
})

// Inicializar formulário
const inicializarForm = () => {
  if (props.jornada) {
    // Edição
    form.value = {
      nome: props.jornada.nome,
      descricao: props.jornada.descricao || '',
      ativa: props.jornada.ativa,
      padrao: props.jornada.padrao,
      horarios: props.jornada.horarios ? [...props.jornada.horarios] : criarHorariosVazios()
    }
  } else {
    // Novo
    form.value = {
      nome: '',
      descricao: '',
      ativa: true,
      padrao: false,
      horarios: criarHorariosVazios()
    }
  }
}

// Criar horários vazios para todos os dias
const criarHorariosVazios = (): JornadaHorario[] => {
  return diasSemana.map(dia => ({
    id: '',
    jornada_id: '',
    dia_semana: dia.id,
    entrada: '08:00',
    saida: '17:00',
    intervalo_inicio: '12:00',
    intervalo_fim: '13:00',
    horas_brutas: 0,
    horas_intervalo: 0,
    horas_liquidas: 0,
    trabalha: dia.id <= 5 // Segunda a sexta por padrão
  }))
}

// Recalcular horas de um dia específico
const recalcularHoras = (index: number) => {
  const horario = form.value.horarios[index]
  
  if (!horario) return
  
  if (!horario.trabalha) {
    horario.horas_brutas = 0
    horario.horas_intervalo = 0
    horario.horas_liquidas = 0
    return
  }

  // Calcular horas brutas
  const entrada = new Date(`2000-01-01T${horario.entrada}:00`)
  const saida = new Date(`2000-01-01T${horario.saida}:00`)
  horario.horas_brutas = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60)

  // Calcular horas de intervalo
  if (horario.intervalo_inicio && horario.intervalo_fim) {
    const inicioIntervalo = new Date(`2000-01-01T${horario.intervalo_inicio}:00`)
    const fimIntervalo = new Date(`2000-01-01T${horario.intervalo_fim}:00`)
    horario.horas_intervalo = (fimIntervalo.getTime() - inicioIntervalo.getTime()) / (1000 * 60 * 60)
  } else {
    horario.horas_intervalo = 0
  }

  // Calcular horas líquidas
  horario.horas_liquidas = Math.max(0, horario.horas_brutas - horario.horas_intervalo)
}

// Totais calculados
const totalSemanal = computed(() => {
  return form.value.horarios
    .filter(h => h.trabalha)
    .reduce((total, h) => total + h.horas_liquidas, 0)
})

const totalMensal = computed(() => {
  return totalSemanal.value * 4.33
})

const diasTrabalhados = computed(() => {
  return form.value.horarios.filter(h => h.trabalha).length
})

// Validações
const errosValidacao = computed(() => {
  const validacao = validarJornada(form.value.horarios)
  const erros = [...validacao.erros]

  // Validações adicionais
  if (!form.value.nome.trim()) {
    erros.push('Nome da jornada é obrigatório')
  }

  if (totalSemanal.value === 0) {
    erros.push('A jornada deve ter pelo menos um dia de trabalho')
  }

  return erros
})

// Submeter formulário
const handleSubmit = () => {
  if (errosValidacao.value.length === 0) {
    emit('salvar', {
      ...form.value,
      horas_semanais: totalSemanal.value,
      horas_mensais: totalMensal.value
    })
  }
}

// Inicializar ao montar e quando props mudam
onMounted(inicializarForm)
watch(() => props.jornada, inicializarForm)

// Recalcular todas as horas ao inicializar
onMounted(() => {
  form.value.horarios.forEach((_, index) => {
    recalcularHoras(index)
  })
})
</script>