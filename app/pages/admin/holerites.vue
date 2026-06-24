<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <svg class="w-8 h-8 rounded-lg shadow-sm flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="url(#hol-logo-grad)"/>
            <rect x="2" y="2" width="28" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <circle cx="16" cy="16" r="8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <path d="M10 10 Q16 10 16 16 Q16 22 10 22 Q4 22 4 16 Q4 10 10 10 Z" fill="white" stroke="none"/>
            <circle cx="10" cy="16" r="3" fill="#1e40af"/>
            <rect x="18" y="12" width="8" height="1.5" rx="0.75" fill="white"/>
            <rect x="18" y="15" width="6" height="1.5" rx="0.75" fill="white"/>
            <rect x="18" y="18" width="8" height="1.5" rx="0.75" fill="white"/>
            <circle cx="28" cy="8" r="2" fill="#10b981"/>
            <defs>
              <linearGradient id="hol-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
          <h1 class="text-2xl font-bold text-gray-900">Gestão de Holerites</h1>
        </div>
        <p class="text-gray-600">Gerencie e envie holerites para os funcionários</p>
      </div>
      
      <div class="flex flex-wrap gap-2 sm:gap-3 w-full xl:w-auto">
        <UiButton 
          variant="secondary" 
          @click="abrirModalGerar('adiantamento')"
          :disabled="loading"
          class="flex-1 sm:flex-none justify-center text-xs sm:text-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Gerar Adiantamento (40%)
        </UiButton>
        
        <UiButton 
          @click="abrirModalGerar('mensal')"
          :disabled="loading"
          class="flex-1 sm:flex-none justify-center text-xs sm:text-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Gerar Folha Mensal
        </UiButton>
        
        <UiButton 
          variant="ghost"
          @click="abrirModalDisponibilizar"
          :disabled="loading || holerites.length === 0"
          class="flex-1 sm:flex-none justify-center text-xs sm:text-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Disponibilizar no Perfil
        </UiButton>
        
        <UiButton 
          variant="ghost"
          @click="abrirModalEnvio"
          :disabled="loading || holerites.length === 0"
          class="flex-1 sm:flex-none justify-center text-xs sm:text-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Enviar por Email
        </UiButton>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UiSelect 
          v-model="filtros.estilo" 
          :options="estiloHoleriteOptions" 
          label="Estilo de Holerite" 
          placeholder="Todos os estilos"
          :disabled="loading"
        />
        
        <UiSelect 
          v-model="filtros.mes" 
          :options="mesesOptions" 
          label="Mês/Ano" 
          placeholder="Selecione o período"
          :disabled="loading"
        />
        
        <UiSelect 
          v-model="filtros.status" 
          :options="statusOptions" 
          label="Status" 
          placeholder="Todos os status"
          :disabled="loading"
        />
      </div>
      
      <!-- Indicador de filtros automáticos -->
      <div v-if="loading" class="flex items-center justify-center mt-3 text-sm text-gray-600">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
        Aplicando filtros...
      </div>
      <div v-else class="text-xs text-gray-500 mt-3 text-center">
        ✨ Filtros aplicados automaticamente
      </div>
    </div>

    <!-- Lista de Holerites -->
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Holerites Gerados</h2>
        <p class="text-sm text-gray-600">{{ holerites.length }} holerite(s) encontrado(s)</p>
      </div>
      
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Carregando holerites...</p>
      </div>
      
      <div v-else-if="holerites.length === 0" class="p-8">
        <UiEmptyState 
          title="Nenhum holerite encontrado"
          description="Gere holerites automáticos ou ajuste os filtros"
          icon="document"
        />
      </div>
      
      <div v-else class="divide-y divide-gray-200">
        <div 
          v-for="holerite in holerites" 
          :key="holerite.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-start sm:items-center gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 font-semibold">{{ holerite.funcionario?.nome_completo?.charAt(0) || '?' }}</span>
              </div>
              
              <div class="min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">{{ holerite.funcionario?.nome_completo || 'Nome não disponível' }}</h3>
                <p class="text-sm text-gray-600 truncate">{{ holerite.funcionario?.cargo || 'Cargo não definido' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ holerite.funcionario?.empresa || 'Empresa não definida' }}</p>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 lg:text-right lg:block w-full sm:w-auto">
                <p class="font-semibold text-gray-900 lg:mb-0.5">
                  {{ formatarMoeda(holerite.salario_liquido) }}
                </p>
                <p class="text-sm text-gray-600 lg:mb-1">
                  {{ formatarPeriodo(holerite.periodo_inicio, holerite.periodo_fim, holerite.observacoes) }}
                </p>
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mr-2 border',
                    getHoleriteTypeInfo(holerite.observacoes).class
                  ]"
                >
                  {{ getHoleriteTypeInfo(holerite.observacoes).label }}
                </span>
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    holerite.status === 'enviado' ? 'bg-green-100 text-green-800' :
                    holerite.status === 'gerado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ getStatusLabel(holerite.status) }}
                </span>
              </div>
              
              <div class="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <UiButton 
                  variant="secondary" 
                  size="sm"
                  @click="visualizarHolerite(holerite)"
                  class="flex-1 sm:flex-none justify-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Ver
                </UiButton>
                
                <UiButton 
                  variant="secondary" 
                  size="sm"
                  @click="editarHolerite(holerite)"
                  class="flex-1 sm:flex-none justify-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Editar
                </UiButton>
                
                <UiButton 
                  size="sm"
                  @click="enviarHolerite(holerite)"
                  class="flex-1 sm:flex-none justify-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Enviar
                </UiButton>
                
                <UiButton 
                  variant="danger" 
                  size="sm"
                  @click="excluirHolerite(holerite)"
                  class="flex-1 sm:flex-none justify-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Excluir
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Visualização -->
    <UiModal 
      v-model="modalVisualizacao" 
      title="Visualizar Holerite"
      max-width="max-w-3xl"
      :close-on-backdrop="false"
    >
      <HoleriteModal 
        v-if="holeriteSelecionado" 
        :holerite="holeriteSelecionado"
        @close="modalVisualizacao = false"
        @download="baixarPDF"
      />
    </UiModal>

    <!-- Modal de Edição -->
    <UiModal 
      v-model="modalEdicao" 
      title="Editar Holerite"
      max-width="max-w-4xl"
      :close-on-backdrop="false"
    >
      <HoleriteEditForm
        v-if="holeriteSelecionado"
        :holerite="holeriteSelecionado"
        @save="salvarEdicaoHolerite"
        @cancel="modalEdicao = false"
      />
    </UiModal>

    <!-- Modal de Geração -->
    <UiModal 
      v-model="mostrarModalGerar" 
      :title="tipoGeracao === 'adiantamento' ? 'Gerar Adiantamento Salarial' : 'Gerar Folha Mensal'"
      max-width="max-w-lg"
    >
      <div class="space-y-4">
        <!-- Adiantamento -->
        <div v-if="tipoGeracao === 'adiantamento'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="text-sm text-blue-800">
              <strong>Adiantamento Salarial (40%):</strong><br>
              • Gerar adiantamento de 40% do salário base<br>
              • <strong>Data automática:</strong> Entre dia 15 e último dia do mês → gera adiantamento do mês vigente<br>
              • <strong>Pagamento:</strong> Dia 20 do mês vigente<br>
              • O valor será descontado automaticamente na folha mensal<br>
              • Sem cálculo de INSS e IRRF (apenas adiantamento)
            </div>
          </div>
        </div>

        <!-- Folha Mensal -->
        <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <div class="text-sm text-blue-800">
              <strong>Folha de Pagamento Mensal:</strong><br>
              • Gerar holerites completos para todos os funcionários ativos<br>
              • <strong>Data automática:</strong> Entre dia 01 e 25 do mês → gera folha do mês vigente<br>
              • <strong>Pagamento:</strong> 5º dia útil do mês vigente<br>
              • Cálculos automáticos de INSS, IRRF e descontos<br>
              • Desconto automático de adiantamentos já pagos
            </div>
          </div>
        </div>

        <!-- Mês de referência manual -->
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            📅 Mês de referência (competência)
          </label>
          <div class="flex gap-3">
            <select v-model="opcoesGeracao.mes" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
            <select v-model="opcoesGeracao.ano" class="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option v-for="a in [2024, 2025, 2026, 2027]" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <p class="text-xs text-gray-500 mt-1">Defina o mês/ano correto da competência antes de gerar.</p>
        </div>

        <div class="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <input 
            type="checkbox" 
            id="recriar" 
            v-model="opcoesGeracao.recriar"
            class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          >
          <label for="recriar" class="text-sm text-yellow-800 cursor-pointer flex items-start gap-2">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <div>
              <strong>Recriar holerites existentes</strong><br>
              <span class="text-xs">Se marcado, holerites já gerados para este período serão excluídos e recriados</span>
            </div>
          </label>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t">
          <UiButton 
            variant="secondary" 
            @click="mostrarModalGerar = false"
          >
            Cancelar
          </UiButton>
          <UiButton 
            @click="confirmarGeracaoHolerites"
            :disabled="loading"
          >
            <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ loading ? 'Gerando...' : 'Confirmar Geração' }}
          </UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Modal de Envio com Seleção de Funcionários -->
    <UiModal 
      v-model="mostrarModalEnvio" 
      title="Enviar Holerites por Email"
      max-width="max-w-2xl"
      content-max-height="calc(90vh - 120px)"
    >
      <div class="space-y-4">

        <!-- Tipo de holerite -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-xs font-semibold text-blue-800 mb-2">Tipo de holerite:</p>
          <div class="flex gap-2">
            <label v-for="opt in [{ value: 'todos', label: '📧 Todos' }, { value: 'adiantamento', label: '💰 Adiantamentos' }, { value: 'mensal', label: '📄 Folhas Mensais' }]" :key="opt.value"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors"
              :class="tipoEnvio === opt.value ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-blue-200 text-gray-700 hover:border-blue-400'"
            >
              <input type="radio" :value="opt.value" v-model="tipoEnvio" class="hidden" @change="atualizarHoleritesSelecionaveis" />
              {{ opt.label }}
            </label>
          </div>
        </div>

        <!-- Lista de funcionários com checkbox -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-semibold text-gray-700">
              Selecione os funcionários ({{ holeritesSelecionados.length }}/{{ holeritesSelecionaveis.length }})
            </p>
            <div class="flex gap-2">
              <button type="button" @click="selecionarTodos" class="text-xs text-blue-600 hover:text-blue-800 font-medium">Todos</button>
              <span class="text-gray-300">|</span>
              <button type="button" @click="deselecionarTodos" class="text-xs text-gray-500 hover:text-gray-700 font-medium">Nenhum</button>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div v-if="holeritesSelecionaveis.length === 0" class="p-6 text-center text-sm text-gray-500">
              Nenhum holerite disponível para envio com os filtros atuais
            </div>
            <div v-else class="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              <label
                v-for="h in holeritesSelecionaveis"
                :key="h.id"
                class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                :class="holeritesSelecionados.includes(h.id) ? 'bg-blue-50' : ''"
              >
                <input
                  type="checkbox"
                  :value="h.id"
                  v-model="holeritesSelecionados"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ h.funcionario?.nome_completo }}</p>
                  <p class="text-xs text-gray-500">{{ h.funcionario?.cargo }} · {{ formatarMoeda(h.salario_liquido) }}</p>
                </div>
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="h.status === 'enviado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                >
                  {{ h.status === 'enviado' ? 'Enviado' : 'Pendente' }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Rodapé -->
        <div class="flex items-center justify-between pt-3 border-t">
          <p class="text-sm text-gray-600">
            <strong>{{ holeritesSelecionados.length }}</strong> holerite(s) selecionado(s)
          </p>
          <div class="flex gap-3">
            <UiButton variant="secondary" @click="mostrarModalEnvio = false">Cancelar</UiButton>
            <UiButton
              @click="confirmarEnvioHolerites"
              :disabled="loading || holeritesSelecionados.length === 0"
            >
              <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              {{ loading ? 'Enviando...' : `Enviar ${holeritesSelecionados.length > 0 ? holeritesSelecionados.length : ''} Email(s)` }}
            </UiButton>
          </div>
        </div>
      </div>
    </UiModal>

    <!-- Modal de Disponibilização -->
    <UiModal 
      v-model="mostrarModalDisponibilizar" 
      title="Disponibilizar Holerites no Perfil"
      max-width="max-w-lg"
    >
      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3 mb-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <div class="text-sm text-blue-800">
              <strong>Selecione o tipo de holerite para disponibilizar:</strong><br>
              <span class="text-xs">Os holerites ficarão disponíveis para visualização no perfil do funcionário</span>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <input 
                type="radio" 
                id="disp-adiantamento" 
                value="adiantamento"
                v-model="tipoDisponibilizar"
                class="w-4 h-4 text-blue-600"
              >
              <label for="disp-adiantamento" class="flex-1 cursor-pointer">
                <strong class="text-gray-900">💰 Apenas Adiantamentos</strong><br>
                <span class="text-xs text-gray-600">Disponibilizar apenas holerites de adiantamento</span>
              </label>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <input 
                type="radio" 
                id="disp-mensal" 
                value="mensal"
                v-model="tipoDisponibilizar"
                class="w-4 h-4 text-blue-600"
              >
              <label for="disp-mensal" class="flex-1 cursor-pointer">
                <strong class="text-gray-900">📄 Apenas Folhas Mensais</strong><br>
                <span class="text-xs text-gray-600">Disponibilizar apenas holerites mensais completos</span>
              </label>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <input 
                type="radio" 
                id="disp-todos" 
                value="todos"
                v-model="tipoDisponibilizar"
                class="w-4 h-4 text-blue-600"
              >
              <label for="disp-todos" class="flex-1 cursor-pointer">
                <strong class="text-gray-900">📋 Todos os Holerites</strong><br>
                <span class="text-xs text-gray-600">Disponibilizar todos os holerites listados</span>
              </label>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-700">
            <strong>Total a disponibilizar:</strong> {{ contarHoleritesPorTipoDisp() }} holerite(s)
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Os funcionários poderão visualizar e baixar seus holerites na área "Meus Holerites"
          </p>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t">
          <UiButton 
            variant="secondary" 
            @click="mostrarModalDisponibilizar = false"
          >
            Cancelar
          </UiButton>
          <UiButton 
            @click="confirmarDisponibilizacao"
            :disabled="loading || contarHoleritesPorTipoDisp() === 0"
          >
            <svg v-if="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ loading ? 'Disponibilizando...' : 'Confirmar' }}
          </UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Notificação -->
    <UiNotification 
      v-if="mostrarNotificacao" 
      :show="mostrarNotificacao"
      :title="notificacao.title" 
      :message="notificacao.message" 
      :variant="notificacao.variant" 
      @close="mostrarNotificacao = false"
    />
  </div>
</template>

<script setup lang="ts">
// Imports
import HoleriteModal from '~/components/holerites/HoleriteModal.vue'
import HoleriteEditForm from '~/components/holerites/HoleriteEditForm.vue'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'default'
})

// Interfaces
interface Funcionario {
  nome_completo: string
  cargo: string
  empresa: string
}

interface Holerite {
  id: number
  funcionario_id: number
  funcionario: Funcionario
  periodo_inicio: string
  periodo_fim: string
  salario_base: number
  salario_liquido: number
  status: 'gerado' | 'enviado' | 'visualizado'
  bonus?: number
  horas_extras?: number
  adicional_noturno?: number
  adicional_periculosidade?: number
  adicional_insalubridade?: number
  comissoes?: number
  inss?: number
  irrf?: number
  vale_transporte?: number
  vale_refeicao_desconto?: number
  plano_saude?: number
  plano_odontologico?: number
  adiantamento?: number
  faltas?: number
  dias_trabalhados?: number
  data_pagamento?: string
  observacoes?: string
}

interface Notificacao {
  title: string
  message: string
  variant: 'success' | 'error' | 'warning' | 'info'
}

// Estados
const loading = ref(false)
const holerites = ref<Holerite[]>([])
const modalVisualizacao = ref(false)
const modalEdicao = ref(false)
const mostrarModalGerar = ref(false)
const mostrarModalEnvio = ref(false)
const mostrarModalDisponibilizar = ref(false)
const tipoGeracao = ref<'adiantamento' | 'mensal'>('mensal')
const tipoEnvio = ref<'adiantamento' | 'mensal' | 'todos'>('todos')
const holeritesSelecionaveis = ref<Holerite[]>([])
const holeritesSelecionados = ref<number[]>([])
const tipoDisponibilizar = ref<'adiantamento' | 'mensal' | 'todos'>('todos')
const holeriteSelecionado = ref<Holerite | null>(null)
const mostrarNotificacao = ref(false)
const notificacao = ref<Notificacao>({ title: '', message: '', variant: 'info' })

// Opções de geração
const opcoesGeracao = ref({
  recriar: false,
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear()
})

// Filtros
const obterMesAtualFormatado = () => {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  return `${ano}-${mes}`
}

const filtros = ref({
  estilo: '', // Mudança: empresa -> estilo (adiantamento/mensal)
  mes: obterMesAtualFormatado(),
  status: ''
})

// Opções para os selects
const estiloHoleriteOptions = computed(() => [
  { value: '', label: 'Todos os estilos' },
  { value: 'adiantamento', label: 'Adiantamentos (40%)' },
  { value: 'mensal', label: 'Folhas Mensais' }
])

// Meses disponíveis (carregados dinamicamente do banco)
const mesesDisponiveis = ref<string[]>([])

const mesesOptions = computed(() => {
  const opcoes = [{ value: '', label: 'Todos os períodos' }]
  
  // Adicionar apenas os meses que têm holerites
  mesesDisponiveis.value.forEach(mesAno => {
    const [ano, mes] = mesAno.split('-')
    const data = new Date(parseInt(ano), parseInt(mes) - 1, 1)
    const label = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    opcoes.push({ value: mesAno, label })
  })
  
  return opcoes
})

const statusOptions = computed(() => [
  { value: '', label: 'Todos os status' },
  { value: 'gerado', label: 'Gerado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'visualizado', label: 'Visualizado' }
])
// Watchers para filtros automáticos com debounce
let timeoutId: NodeJS.Timeout | null = null

const aplicarFiltrosComDebounce = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  timeoutId = setTimeout(() => {
    carregarHolerites()
  }, 300) // Debounce de 300ms
}

// Watchers para aplicar filtros automaticamente
watch(() => filtros.value.estilo, () => {
  aplicarFiltrosComDebounce()
})

watch(() => filtros.value.mes, () => {
  aplicarFiltrosComDebounce()
})

watch(() => filtros.value.status, () => {
  aplicarFiltrosComDebounce()
})

// Funções
const getHoleriteTypeInfo = (observacoes?: string) => {
  const obs = (observacoes || '').trim().toLowerCase()
  if (obs.startsWith('adiantamento salarial')) {
    return { label: 'Adiantamento', class: 'bg-orange-100 text-orange-800 border-orange-200' }
  } else if (obs.startsWith('recibo de férias')) {
    return { label: 'Férias', class: 'bg-purple-100 text-purple-800 border-purple-200' }
  } else {
    return { label: 'Mensal', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
  }
}

const carregarMesesDisponiveis = async () => {
  try {
    // Buscar meses únicos que têm holerites
    const response: any = await $fetch('/api/holerites/meses-disponiveis')
    mesesDisponiveis.value = response.meses || []
  } catch (error) {
    console.error('Erro ao carregar meses disponíveis:', error)
    mesesDisponiveis.value = []
  }
}

const abrirModalGerar = (tipo: 'adiantamento' | 'mensal') => {
  tipoGeracao.value = tipo
  mostrarModalGerar.value = true
}

const abrirModalEnvio = () => {
  tipoEnvio.value = 'todos'
  atualizarHoleritesSelecionaveis()
  mostrarModalEnvio.value = true
}

const atualizarHoleritesSelecionaveis = () => {
  if (tipoEnvio.value === 'adiantamento') {
    holeritesSelecionaveis.value = holerites.value.filter(h => {
      const dia = new Date(h.periodo_inicio + 'T00:00:00').getDate()
      return dia >= 14
    })
  } else if (tipoEnvio.value === 'mensal') {
    holeritesSelecionaveis.value = holerites.value.filter(h => {
      const dia = new Date(h.periodo_inicio + 'T00:00:00').getDate()
      return dia < 14
    })
  } else {
    holeritesSelecionaveis.value = [...holerites.value]
  }
  // Manter apenas selecionados que ainda estão na lista
  holeritesSelecionados.value = holeritesSelecionados.value.filter(id =>
    holeritesSelecionaveis.value.some(h => h.id === id)
  )
}

const selecionarTodos = () => {
  holeritesSelecionados.value = holeritesSelecionaveis.value.map(h => h.id)
}

const deselecionarTodos = () => {
  holeritesSelecionados.value = []
}

const abrirModalDisponibilizar = () => {
  tipoDisponibilizar.value = 'todos'
  mostrarModalDisponibilizar.value = true
}

const contarHoleritesPorTipo = () => {
  if (tipoEnvio.value === 'todos') {
    return holerites.value.filter(h => h.status !== 'enviado').length
  } else if (tipoEnvio.value === 'adiantamento') {
    // Adiantamentos têm periodo_fim até dia 15
    return holerites.value.filter(h => {
      const diaFim = new Date(h.periodo_fim).getDate()
      return diaFim <= 15 && h.status !== 'enviado'
    }).length
  } else {
    // Mensais têm periodo_fim após dia 15
    return holerites.value.filter(h => {
      const diaFim = new Date(h.periodo_fim).getDate()
      return diaFim > 15 && h.status !== 'enviado'
    }).length
  }
}

const contarHoleritesPorTipoDisp = () => {
  if (tipoDisponibilizar.value === 'todos') {
    return holerites.value.length
  } else if (tipoDisponibilizar.value === 'adiantamento') {
    return holerites.value.filter(h => {
      const diaFim = new Date(h.periodo_fim).getDate()
      return diaFim <= 15
    }).length
  } else {
    return holerites.value.filter(h => {
      const diaFim = new Date(h.periodo_fim).getDate()
      return diaFim > 15
    }).length
  }
}

const confirmarDisponibilizacao = async () => {
  mostrarModalDisponibilizar.value = false
  await disponibilizarHolerites()
}

const disponibilizarHolerites = async () => {
  loading.value = true
  try {
    let holeritesFiltrados: Holerite[] = []
    
    if (tipoDisponibilizar.value === 'todos') {
      holeritesFiltrados = holerites.value
    } else if (tipoDisponibilizar.value === 'adiantamento') {
      holeritesFiltrados = holerites.value.filter(h => {
        const diaFim = new Date(h.periodo_fim).getDate()
        return diaFim <= 15
      })
    } else {
      holeritesFiltrados = holerites.value.filter(h => {
        const diaFim = new Date(h.periodo_fim).getDate()
        return diaFim > 15
      })
    }
    
    if (holeritesFiltrados.length === 0) {
      const { notifyWarning } = useNotifications()
      notifyWarning('Nenhum Holerite', 'Nenhum holerite encontrado para disponibilizar')
      loading.value = false
      return
    }
    
    // Atualizar status para "visualizado" (disponível no perfil)
    let disponibilizados = 0
    let erros = 0
    
    for (const holerite of holeritesFiltrados) {
      try {
        await $fetch(`/api/holerites/${holerite.id}`, {
          method: 'PATCH',
          body: {
            status: 'visualizado' // Status que indica disponível no perfil
          }
        })
        disponibilizados++
      } catch (error) {
        console.error(`Erro ao disponibilizar holerite ${holerite.id}:`, error)
        erros++
      }
    }
    
    const tipoTexto = tipoDisponibilizar.value === 'adiantamento' 
      ? 'adiantamentos' 
      : tipoDisponibilizar.value === 'mensal' 
        ? 'folhas mensais' 
        : 'holerites'
    
    const { notifySuccess, notifyWarning } = useNotifications()
    
    if (erros > 0) {
      notifyWarning(
        'Disponibilização Parcial',
        `${disponibilizados} ${tipoTexto} disponibilizado(s), ${erros} erro(s)`
      )
    } else {
      notifySuccess(
        'Holerites Disponibilizados!',
        `${disponibilizados} ${tipoTexto} agora estão visíveis no perfil dos funcionários`
      )
    }
    
    // Recarregar lista
    await carregarHolerites()
  } catch (error: any) {
    const { notifyError } = useNotifications()
    notifyError(
      'Erro na Disponibilização!',
      error.data?.message || 'Erro ao disponibilizar holerites'
    )
  } finally {
    loading.value = false
  }
}

const carregarHolerites = async () => {
  loading.value = true
  try {
    // Buscar holerites da API com filtros funcionais
    const params: any = {}
    
    // Filtro por estilo (adiantamento/mensal)
    if (filtros.value.estilo) {
      params.estilo = filtros.value.estilo
    }
    
    // Filtro por mês/ano
    if (filtros.value.mes) {
      params.mes = filtros.value.mes
    }
    
    // Filtro por status - CORREÇÃO: Se não há filtro específico, incluir todos os status
    if (filtros.value.status) {
      params.status = filtros.value.status
    } else {
      // Quando não há filtro de status, incluir todos (pendente, enviado, etc.)
      params.incluir_todos_status = true
    }
    
    const data = await $fetch('/api/holerites', { params })
    holerites.value = data as Holerite[]
  } catch (error) {
    console.error('Erro ao carregar holerites:', error)
    notificacao.value = {
      title: 'Erro!',
      message: 'Erro ao carregar holerites do banco de dados',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  } finally {
    loading.value = false
  }
}

const gerarHoleritesAutomaticos = async () => {
  loading.value = true
  try {
    // Chamar API para gerar holerites com datas automáticas
    const resultado: any = await $fetch('/api/holerites/gerar', {
      method: 'POST',
      body: {
        tipo: tipoGeracao.value,
        recriar: opcoesGeracao.value.recriar,
        mes_referencia_manual: opcoesGeracao.value.mes,
        ano_referencia_manual: opcoesGeracao.value.ano
      }
    })
    
    // Usar o novo sistema de notificações toast
    const { notifySuccess } = useNotifications()
    
    const tipoTexto = tipoGeracao.value === 'adiantamento' ? 'Adiantamentos' : 'Folhas mensais'
    const detalhes = tipoGeracao.value === 'adiantamento' 
      ? 'Serão disponibilizados automaticamente no dia 17'
      : 'Aguardando disponibilização manual'
    
    notifySuccess(
      `${tipoTexto} Gerados!`,
      `${resultado.total_gerados || 0} holerite(s) criado(s). ${detalhes}`,
      7000
    )
    
    // Recarregar lista
    await carregarHolerites()
  } catch (error: any) {
    const { notifyError } = useNotifications()
    notifyError(
      'Erro na Geração!',
      error.data?.message || 'Erro ao gerar holerites automaticamente'
    )
  } finally {
    loading.value = false
  }
}

const confirmarGeracaoHolerites = async () => {
  mostrarModalGerar.value = false
  await gerarHoleritesAutomaticos()
}

const confirmarEnvioHolerites = async () => {
  mostrarModalEnvio.value = false
  loading.value = true
  try {
    const holeritesFiltrados = holerites.value.filter(h => holeritesSelecionados.value.includes(h.id))

    if (holeritesFiltrados.length === 0) {
      notificacao.value = { title: 'Aviso', message: 'Nenhum holerite selecionado', variant: 'warning' }
      mostrarNotificacao.value = true
      loading.value = false
      return
    }

    let enviados = 0
    let erros = 0

    for (const holerite of holeritesFiltrados) {
      try {
        await $fetch(`/api/holerites/${holerite.id}/enviar-email`, { method: 'POST' })
        enviados++
      } catch (error) {
        console.error(`Erro ao enviar holerite ${holerite.id}:`, error)
        erros++
      }
    }

    notificacao.value = {
      title: 'Envio Concluído!',
      message: `${enviados} holerite(s) enviado(s) com sucesso${erros > 0 ? ` (${erros} erro(s))` : ''}`,
      variant: erros > 0 ? 'warning' : 'success'
    }
    mostrarNotificacao.value = true
    holeritesSelecionados.value = []
    await carregarHolerites()
  } catch (error: any) {
    notificacao.value = { title: 'Erro!', message: error.data?.message || 'Erro ao enviar holerites', variant: 'error' }
    mostrarNotificacao.value = true
  } finally {
    loading.value = false
  }
}

const visualizarHolerite = (holerite: Holerite) => {
  holeriteSelecionado.value = holerite
  modalVisualizacao.value = true
}

const editarHolerite = (holerite: Holerite) => {
  holeriteSelecionado.value = { ...holerite }
  modalEdicao.value = true
}

const enviarHolerite = async (holerite: Holerite) => {
  try {
    loading.value = true
    
    // Chamar API para enviar email
    const resultado: any = await $fetch(`/api/holerites/${holerite.id}/enviar-email`, {
      method: 'POST'
    })
    
    // Atualizar status do holerite localmente
    holerite.status = 'enviado'
    
    notificacao.value = {
      title: 'Enviado!',
      message: `Holerite enviado para ${holerite.funcionario?.nome_completo || 'funcionário'} (${resultado.email})`,
      variant: 'success'
    }
    mostrarNotificacao.value = true
    
    // Recarregar lista apenas se não há filtro de status específico ou se inclui 'enviado'
    if (!filtros.value.status || filtros.value.status === 'enviado' || filtros.value.status === '') {
      await carregarHolerites()
    }
  } catch (error: any) {
    notificacao.value = {
      title: 'Erro!',
      message: error.data?.message || 'Erro ao enviar holerite',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  } finally {
    loading.value = false
  }
}

const salvarEdicaoHolerite = async (dadosAtualizados: any) => {
  if (!holeriteSelecionado.value) return
  
  try {
    loading.value = true
    
    // Chamar API para atualizar
    await $fetch(`/api/holerites/${holeriteSelecionado.value.id}`, {
      method: 'PATCH',
      body: dadosAtualizados
    })

    // Recalcular totais incluindo itens personalizados ativos na data de geração
    await $fetch(`/api/holerites/${holeriteSelecionado.value.id}/recalcular`, {
      method: 'POST'
    })
    
    modalEdicao.value = false
    
    notificacao.value = {
      title: 'Salvo!',
      message: 'Holerite atualizado com sucesso',
      variant: 'success'
    }
    mostrarNotificacao.value = true
    
    // Recarregar lista para garantir dados atualizados
    await carregarHolerites()
  } catch (error: any) {
    notificacao.value = {
      title: 'Erro!',
      message: error.data?.message || 'Erro ao salvar alterações',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  } finally {
    loading.value = false
  }
}


const baixarPDF = async (holerite: Holerite) => {
  try {
    loading.value = true
    
    // Abrir holerite em nova aba para visualização
    window.open(`/api/holerites/${holerite.id}/pdf`, '_blank')
    
    // Notificação de sucesso
    const { notifySuccess } = useNotifications()
    notifySuccess(
      'Holerite Aberto!',
      `Holerite de ${holerite.funcionario?.nome_completo || 'funcionário'} aberto em nova aba. Use Ctrl+P para imprimir como PDF.`
    )
  } catch (error) {
    console.error('Erro ao abrir holerite:', error)
    const { notifyError } = useNotifications()
    notifyError(
      'Erro ao Abrir!',
      'Erro ao abrir holerite. Tente novamente.'
    )
  } finally {
    loading.value = false
  }
}

const excluirHolerite = async (holerite: Holerite) => {
  // Confirmar exclusão
  if (!confirm(`Tem certeza que deseja excluir o holerite de ${holerite.funcionario?.nome_completo || 'funcionário'}?\n\nEsta ação não pode ser desfeita.`)) {
    return
  }
  
  try {
    loading.value = true
    
    // Chamar API para excluir
    await $fetch(`/api/holerites/${holerite.id}`, {
      method: 'DELETE'
    })
    
    notificacao.value = {
      title: 'Excluído!',
      message: `Holerite de ${holerite.funcionario?.nome_completo || 'funcionário'} excluído com sucesso`,
      variant: 'success'
    }
    mostrarNotificacao.value = true
    
    // Recarregar lista
    await carregarHolerites()
  } catch (error: any) {
    notificacao.value = {
      title: 'Erro!',
      message: error.data?.message || 'Erro ao excluir holerite',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  } finally {
    loading.value = false
  }
}

// Funções de formatação
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const formatarPeriodo = (inicio: string, fim: string, observacoes?: string) => {
  // Adicionar 'T00:00:00' para evitar problemas de timezone
  const dataInicio = new Date(inicio + 'T00:00:00')
  const dataFim = new Date(fim + 'T00:00:00')
  
  // Verificar se é adiantamento pela observação (mais confiável)
  const diaInicio = dataInicio.getDate()
  const isAdiantamento = observacoes?.startsWith('Adiantamento') || false
  
  if (isAdiantamento) {
    // Para adiantamentos, mostrar apenas o mês de referência (ex: "abril de 2026")
    const mesReferencia = dataInicio.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    })
    return mesReferencia
  } else {
    // Para folha mensal, mostrar o período trabalhado (mês do periodo_inicio)
    // Exemplo: periodo_inicio = 01/04/2026, periodo_fim = 30/04/2026 → "abril de 2026"
    const mesReferencia = dataInicio.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    })
    return mesReferencia
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    gerado: 'Gerado',
    enviado: 'Enviado',
    visualizado: 'Visualizado'
  }
  return labels[status] || status
}

// Carregar dados ao montar
onMounted(async () => {
  // Carregar meses disponíveis primeiro
  await carregarMesesDisponiveis()
  
  // Se o mês atual não tiver holerites e houver outros períodos, selecionar o mais recente
  const mesAtual = obterMesAtualFormatado()
  if (mesesDisponiveis.value.length > 0 && !mesesDisponiveis.value.includes(mesAtual)) {
    filtros.value.mes = mesesDisponiveis.value[0]
  }
  
  // Carregar holerites
  await carregarHolerites()
})
</script>