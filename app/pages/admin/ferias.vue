<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestão de Férias</h1>
            <p class="text-sm text-gray-500">Controle de períodos conforme CLT 2026</p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 sm:gap-3 w-full xl:w-auto">
        <button
          @click="abrirModalCadastro()"
          class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nova Programação de Férias
        </button>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div class="bg-white rounded-xl border border-amber-200 p-4 bg-amber-50/50">
        <p class="text-xs text-amber-700 font-medium uppercase tracking-wider">⏳ Pendentes</p>
        <p class="text-2xl font-bold text-amber-600 mt-1">{{ stats.pendente }}</p>
        <p class="text-xs text-amber-500 mt-0.5">solicitações</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Em Gozo</p>
        <p class="text-2xl font-bold text-emerald-600 mt-1">{{ stats.em_gozo }}</p>
        <p class="text-xs text-gray-400 mt-0.5">funcionário(s) agora</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Programadas</p>
        <p class="text-2xl font-bold text-blue-600 mt-1">{{ stats.programado }}</p>
        <p class="text-xs text-gray-400 mt-0.5">próximas</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Concluídas</p>
        <p class="text-2xl font-bold text-gray-600 mt-1">{{ stats.concluido }}</p>
        <p class="text-xs text-gray-400 mt-0.5">no histórico</p>
      </div>
      <div class="bg-white rounded-xl border border-yellow-200 p-4 bg-yellow-50 col-span-2 md:col-span-1">
        <p class="text-xs text-yellow-700 font-medium uppercase tracking-wider">⚠ Atenção</p>
        <p class="text-2xl font-bold text-yellow-600 mt-1">{{ stats.vencendo }}</p>
        <p class="text-xs text-yellow-600 mt-0.5">prazo a vencer</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Funcionário</label>
          <select v-model="filtros.funcionario_id" class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Todos os funcionários</option>
            <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome_completo }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filtros.status" class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Todos os status</option>
            <option value="pendente">⏳ Solicitadas (Pendentes)</option>
            <option value="programado">📅 Programadas</option>
            <option value="em_gozo">🌴 Em Gozo</option>
            <option value="concluido">✅ Concluídas</option>
            <option value="cancelado">❌ Canceladas</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <select v-model="filtros.ano" class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Todos os anos</option>
            <option v-for="ano in anosDisponiveis" :key="ano" :value="ano">{{ ano }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
    </div>

    <!-- Lista de Férias -->
    <div v-else-if="feriasFiltradas.length > 0" class="space-y-3">
      <div
        v-for="ferias in feriasFiltradas"
        :key="ferias.id"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-4 sm:p-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <!-- Funcionário -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span class="text-emerald-700 font-bold text-sm">{{ iniciais(ferias.funcionarios?.nome_completo) }}</span>
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{{ ferias.funcionarios?.nome_completo }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatarData(ferias.data_inicio) }} → {{ formatarData(ferias.data_fim) }}
                  · {{ ferias.dias_corridos }} dias corridos
                </p>
              </div>
            </div>

            <!-- Status + Ações -->
            <div class="flex items-center gap-2 flex-wrap">
              <span :class="statusBadgeClass(ferias.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold">
                {{ statusLabel(ferias.status) }}
              </span>

              <!-- Aprovar (Apenas se status for pendente) -->
              <button
                v-if="ferias.status === 'pendente'"
                @click="aprovarSolicitacao(ferias)"
                :disabled="loadingAprovar === ferias.id"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 animate-pulse"
              >
                <svg v-if="loadingAprovar !== ferias.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Aprovar
              </button>

              <button
                v-if="ferias.status !== 'pendente' && !ferias.holerite_id"
                @click="gerarHolerite(ferias)"
                :disabled="loadingHolerite === ferias.id"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <svg v-if="loadingHolerite !== ferias.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                {{ loadingHolerite === ferias.id ? 'Gerando...' : 'Gerar Recibo' }}
              </button>

              <a
                v-if="ferias.holerite_id"
                :href="`/api/holerites/${ferias.holerite_id}/pdf`"
                target="_blank"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Ver Recibo
              </a>

              <button
                @click="abrirModalCadastro(ferias)"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Editar
              </button>

              <button
                @click="confirmarExcluir(ferias)"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Excluir
              </button>
            </div>
          </div>

          <!-- Valores calculados -->
          <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p class="text-xs text-gray-400">Remuneração</p>
              <p class="text-sm font-semibold text-gray-800">{{ formatarValor(ferias.valor_remuneracao) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">1/3 Constitucional</p>
              <p class="text-sm font-semibold text-gray-800">{{ formatarValor(ferias.valor_um_terco) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Descontos (INSS+IRRF+Pensão)</p>
              <p class="text-sm font-semibold text-red-600">- {{ formatarValor((ferias.inss || 0) + (ferias.irrf || 0) + (ferias.pensao_alimenticia || 0)) }}</p>
            </div>
            <div class="bg-emerald-50 rounded-lg py-1 px-2">
              <p class="text-xs text-emerald-600 font-medium">Valor Líquido</p>
              <p class="text-sm font-bold text-emerald-700">{{ formatarValor(ferias.valor_liquido) }}</p>
            </div>
          </div>

          <!-- Abono + Período aquisitivo -->
          <div class="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
            <span>
              📅 Período aquisitivo: {{ formatarData(ferias.periodo_aquisitivo_inicio) }} → {{ formatarData(ferias.periodo_aquisitivo_fim) }}
            </span>
            <span v-if="ferias.abono_pecuniario" class="text-amber-600">
              💰 Abono pecuniário: {{ ferias.dias_abono }} dias ({{ formatarValor(ferias.valor_abono_pecuniario) }})
            </span>
            <span v-if="ferias.pensao_alimenticia > 0" class="text-red-500 font-medium">
              💸 Pensão: {{ formatarValor(ferias.pensao_alimenticia) }}
            </span>
            <span v-if="ferias.data_pagamento">
              💳 Pagamento: {{ formatarData(ferias.data_pagamento) }}
            </span>
            <span v-if="ferias.observacoes" class="text-gray-500 italic">
              📝 {{ ferias.observacoes }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Nenhum período de férias encontrado</h3>
      <p class="text-gray-500 text-sm mb-6">Clique em "Nova Programação de Férias" para cadastrar.</p>
      <button
        @click="abrirModalCadastro()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Programar Férias
      </button>
    </div>

    <!-- ─── MODAL DE CADASTRO / EDIÇÃO ─────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="fecharModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h2 class="text-lg font-bold text-gray-900">
                  {{ editando ? 'Editar Férias' : 'Programar Férias' }}
                </h2>
              </div>
              <button @click="fecharModal" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="p-6 space-y-5">
              <!-- Funcionário -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Funcionário *</label>
                <select
                  v-model="form.funcionario_id"
                  @change="onFuncionarioChange"
                  class="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  :disabled="!!editando"
                >
                  <option value="">Selecione o funcionário</option>
                  <option v-for="f in funcionarios" :key="f.id" :value="f.id">
                    {{ f.nome_completo }} — R$ {{ formatarValor(f.salario_base) }}
                  </option>
                </select>
              </div>

              <!-- Status (apenas quando editando) -->
              <div v-if="editando">
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Status *</label>
                <select
                  v-model="form.status"
                  class="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="pendente">⏳ Pendente (Aguardando Aprovação)</option>
                  <option value="programado">📅 Programada</option>
                  <option value="em_gozo">🌴 Em Gozo</option>
                  <option value="concluido">✅ Concluída</option>
                  <option value="cancelado">❌ Cancelada</option>
                </select>
              </div>

              <!-- Período aquisitivo -->
              <div v-if="form.funcionario_id" class="bg-gray-50 rounded-xl p-4">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Período Aquisitivo</p>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Início *</label>
                    <input
                      type="date"
                      v-model="form.periodo_aquisitivo_inicio"
                      class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Fim *</label>
                    <input
                      type="date"
                      v-model="form.periodo_aquisitivo_fim"
                      class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Datas de Gozo -->
              <div>
                <p class="text-sm font-semibold text-gray-700 mb-3">Período de Gozo das Férias</p>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Data de Início *</label>
                    <input
                      type="date"
                      v-model="form.data_inicio"
                      @change="recalcularPreview"
                      class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Data de Fim *</label>
                    <input
                      type="date"
                      v-model="form.data_fim"
                      @change="recalcularPreview"
                      class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Abono Pecuniário -->
              <div class="flex items-start gap-3 bg-amber-50 rounded-xl p-4">
                <input
                  type="checkbox"
                  v-model="form.abono_pecuniario"
                  @change="recalcularPreview"
                  id="abono_pecuniario"
                  class="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div class="flex-1">
                  <label for="abono_pecuniario" class="text-sm font-semibold text-amber-800 cursor-pointer">
                    Abono Pecuniário (Venda de Férias)
                  </label>
                  <p class="text-xs text-amber-600 mt-0.5">O funcionário pode "vender" até 10 dias de férias em dinheiro (isento de INSS e IRRF)</p>
                  <div v-if="form.abono_pecuniario" class="mt-2">
                    <label class="block text-xs font-medium text-amber-700 mb-1">Dias de Abono (máx. 10)</label>
                    <input
                      type="number"
                      v-model.number="form.dias_abono"
                      @input="recalcularPreview"
                      min="1"
                      max="10"
                      class="w-24 rounded-xl border border-amber-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Data de Pagamento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Data de Pagamento
                  <span v-if="form.status !== 'pendente' && form.status !== 'cancelado'" class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  v-model="form.data_pagamento"
                  :required="form.status !== 'pendente' && form.status !== 'cancelado'"
                  class="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all"
                  :class="[
                    form.status !== 'pendente' && form.status !== 'cancelado' && !form.data_pagamento
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900 bg-red-50/20'
                      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900'
                  ]"
                />
                <p v-if="form.status !== 'pendente' && form.status !== 'cancelado' && !form.data_pagamento" class="text-xs text-red-500 mt-1">
                  ⚠ A data de pagamento é obrigatória para programar ou aprovar as férias.
                </p>
                <p v-else class="text-xs text-gray-400 mt-1">Deve ser pago até 2 dias antes do início das férias (CLT Art. 145)</p>
              </div>

              <!-- Observações -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Observações</label>
                <textarea
                  v-model="form.observacoes"
                  rows="2"
                  placeholder="Informações adicionais sobre este período de férias..."
                  class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>

              <!-- Preview de Cálculo -->
              <div v-if="preview" class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <h4 class="font-bold text-emerald-800 text-sm">Cálculo Previsto — CLT 2026</h4>
                </div>

                <div class="space-y-2 text-sm">
                  <div class="flex justify-between items-center py-1.5 border-b border-emerald-100">
                    <span class="text-gray-600">{{ preview.diasFerias }} dias × R$ {{ formatarValor(preview.salarioDia) }}/dia</span>
                    <span class="font-semibold text-gray-800">{{ formatarValor(preview.valorRemuneracao) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-1.5 border-b border-emerald-100">
                    <span class="text-gray-600">1/3 Constitucional</span>
                    <span class="font-semibold text-gray-800">{{ formatarValor(preview.valorUmTerco) }}</span>
                  </div>
                  <div v-if="preview.valorAbonoPecuniario > 0" class="flex justify-between items-center py-1.5 border-b border-emerald-100">
                    <span class="text-amber-600">Abono Pecuniário ({{ preview.diasAbono }} dias)</span>
                    <span class="font-semibold text-amber-700">{{ formatarValor(preview.valorAbonoPecuniario) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-1.5 border-b border-emerald-100">
                    <span class="font-medium text-gray-700">Total Bruto</span>
                    <span class="font-bold text-gray-900">{{ formatarValor(preview.valorBruto) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-1.5 text-red-600">
                    <span>INSS (Tabela Progressiva 2026)</span>
                    <span class="font-semibold">- {{ formatarValor(preview.inss) }}</span>
                  </div>
                  <div v-if="preview.irrf > 0" class="flex justify-between items-center py-1.5 text-red-600">
                    <span>IRRF ({{ preview.faixaIRRF }})</span>
                    <span class="font-semibold">- {{ formatarValor(preview.irrf) }}</span>
                  </div>
                  <div v-else class="flex justify-between items-center py-1.5 text-emerald-600">
                    <span>IRRF</span>
                    <span class="font-semibold">Isento</span>
                  </div>
                  <div v-if="preview.pensaoAlimenticia > 0" class="flex justify-between items-center py-1.5 text-red-600">
                    <span>Pensão Alimentícia</span>
                    <span class="font-semibold">- {{ formatarValor(preview.pensaoAlimenticia) }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-3 mt-2 border-t-2 border-emerald-300">
                    <span class="font-bold text-emerald-800 text-base">💰 Valor Líquido</span>
                    <span class="font-bold text-emerald-700 text-xl">{{ formatarValor(preview.valorLiquido) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                @click="fecharModal"
                class="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="salvar"
                :disabled="salvando || !formValido"
                class="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <div v-if="salvando" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {{ salvando ? 'Salvando...' : (editando ? 'Salvar Alterações' : 'Cadastrar Férias') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Confirmação de Aprovação (Definir data de pagamento obrigatoriamente) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showAprovarModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="fecharAprovarModal">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-sm font-bold text-gray-900">Aprovar Solicitação de Férias</h3>
              <button @click="fecharAprovarModal" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <!-- Modal Body -->
            <div class="p-6 space-y-4">
              <p class="text-sm text-gray-600">
                Para aprovar as férias de <strong>{{ feriasParaAprovar?.funcionarios?.nome_completo }}</strong>, você deve obrigatoriamente definir a data de pagamento.
              </p>
              
              <div class="bg-gray-50 p-3 rounded-lg text-xs space-y-1.5 text-gray-600">
                <p><strong>Período:</strong> {{ formatarData(feriasParaAprovar?.data_inicio) }} a {{ formatarData(feriasParaAprovar?.data_fim) }} ({{ feriasParaAprovar?.dias_corridos }} dias)</p>
                <p><strong>Abono pecuniário:</strong> {{ feriasParaAprovar?.abono_pecuniario ? 'Sim (' + feriasParaAprovar?.dias_abono + ' dias)' : 'Não' }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Data de Pagamento *</label>
                <input
                  type="date"
                  v-model="dataPagamentoAprovar"
                  class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <p class="text-xs text-amber-600 mt-1">
                  💡 Pela CLT, o pagamento deve ocorrer até 2 dias antes do início das férias.
                </p>
              </div>
            </div>
            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button 
                @click="fecharAprovarModal"
                class="px-4 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                Cancelar
              </button>
              <button 
                @click="confirmarAprovar"
                :disabled="!dataPagamentoAprovar || loadingAprovar"
                class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <div v-if="loadingAprovar" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                Confirmar Aprovação
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth'] })

// ─── State ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const salvando = ref(false)
const loadingHolerite = ref<number | null>(null)
const loadingAprovar = ref<number | null>(null)
const showModal = ref(false)
const showAprovarModal = ref(false)
const feriasParaAprovar = ref<any | null>(null)
const dataPagamentoAprovar = ref('')
const editando = ref<any | null>(null)

const todasFerias = ref<any[]>([])
const funcionarios = ref<any[]>([])

const filtros = reactive({
  funcionario_id: '',
  status: '',
  ano: new Date().getFullYear().toString(),
})

const form = reactive({
  funcionario_id: '',
  periodo_aquisitivo_inicio: '',
  periodo_aquisitivo_fim: '',
  data_inicio: '',
  data_fim: '',
  abono_pecuniario: false,
  dias_abono: 10,
  data_pagamento: '',
  observacoes: '',
  status: 'programado',
})

const preview = ref<any>(null)

// ─── Computed ─────────────────────────────────────────────────────────────────
const anosDisponiveis = computed(() => {
  const anos = new Set<string>()
  const anoAtual = new Date().getFullYear()
  for (let i = anoAtual - 2; i <= anoAtual + 2; i++) anos.add(String(i))
  return Array.from(anos).sort().reverse()
})

const feriasFiltradas = computed(() => {
  let lista = [...todasFerias.value]
  if (filtros.funcionario_id) {
    lista = lista.filter(f => String(f.funcionario_id) === String(filtros.funcionario_id))
  }
  if (filtros.status) {
    lista = lista.filter(f => {
      const statusAuto = calcStatusAuto(f)
      return statusAuto === filtros.status
    })
  }
  if (filtros.ano) {
    lista = lista.filter(f => f.data_inicio?.startsWith(filtros.ano))
  }
  return lista
})

const stats = computed(() => {
  const hoje = new Date()
  const s = { pendente: 0, em_gozo: 0, programado: 0, concluido: 0, cancelado: 0, vencendo: 0 }
  todasFerias.value.forEach(f => {
    const status = calcStatusAuto(f)
    if (status in s) s[status as keyof typeof s]++
    // Alerta de vencimento: período concessivo a menos de 60 dias
    if (f.periodo_aquisitivo_fim) {
      const concessivoFim = new Date(f.periodo_aquisitivo_fim)
      concessivoFim.setFullYear(concessivoFim.getFullYear() + 1)
      const diasRestantes = Math.floor((concessivoFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
      if (diasRestantes <= 60 && diasRestantes > 0 && status !== 'concluido' && status !== 'cancelado') s.vencendo++
    }
  })
  return s
})

const formValido = computed(() => {
  const camposBasicos = form.funcionario_id && form.data_inicio && form.data_fim &&
    form.periodo_aquisitivo_inicio && form.periodo_aquisitivo_fim
  
  if (!camposBasicos) return false

  if (form.status !== 'pendente' && form.status !== 'cancelado') {
    return !!form.data_pagamento
  }

  return true
})

const funcionarioSelecionado = computed(() =>
  funcionarios.value.find(f => String(f.id) === String(form.funcionario_id))
)

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatarData = (data: string | null) => {
  if (!data) return '—'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const formatarValor = (v: any) => {
  const n = Number(v) || 0
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const iniciais = (nome: string) => {
  if (!nome) return '?'
  return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

const calcStatusAuto = (ferias: any) => {
  if (ferias.status === 'cancelado') return 'cancelado'
  if (ferias.status === 'pendente') return 'pendente'
  const hoje = new Date()
  const inicio = new Date(ferias.data_inicio + 'T00:00:00')
  const fim = new Date(ferias.data_fim + 'T00:00:00')
  if (inicio <= hoje && fim >= hoje) return 'em_gozo'
  if (fim < hoje) return 'concluido'
  return 'programado'
}

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pendente: '⏳ Pendente',
    programado: '📅 Programadas',
    em_gozo: '🌴 Em Gozo',
    concluido: '✅ Concluído',
    cancelado: '❌ Cancelado',
  }
  return map[status] || status
}

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    pendente: 'bg-amber-100 text-amber-700',
    programado: 'bg-blue-100 text-blue-700',
    em_gozo: 'bg-emerald-100 text-emerald-700',
    concluido: 'bg-gray-100 text-gray-600',
    cancelado: 'bg-red-100 text-red-600',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

// ─── Cálculo preview em tempo real ───────────────────────────────────────────
const recalcularPreview = () => {
  preview.value = null
  if (!form.data_inicio || !form.data_fim || !form.funcionario_id) return
  const func = funcionarioSelecionado.value
  if (!func) return

  const dtInicio = new Date(form.data_inicio + 'T00:00:00')
  const dtFim = new Date(form.data_fim + 'T00:00:00')
  const diasCorridos = Math.floor((dtFim.getTime() - dtInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1
  if (diasCorridos <= 0) return

  const diasAbono = form.abono_pecuniario ? (form.dias_abono || 0) : 0
  const diasFerias = diasCorridos

  const salarioBase = Number(func.salario_base) || 0
  const numeroDependentes = Number(func.numero_dependentes) || 0
  const salarioDia = salarioBase / 30

  const valorRemuneracao = salarioDia * diasFerias
  const valorUmTerco = valorRemuneracao / 3
  const valorAbonoPecuniario = diasAbono > 0 ? salarioDia * diasAbono : 0

  const baseInss = valorRemuneracao + valorUmTerco
  
  // INSS progressivo 2026
  const faixasInss = [
    { ate: 1621.00, aliquota: 0.075 },
    { ate: 2902.84, aliquota: 0.09 },
    { ate: 4354.27, aliquota: 0.12 },
    { ate: 8475.55, aliquota: 0.14 },
  ]
  
  const baseInssLimitada = Math.min(baseInss, 8475.55)
  let inss = 0, anterior = 0
  for (const faixa of faixasInss) {
    if (baseInssLimitada <= anterior) break
    inss += (Math.min(baseInssLimitada, faixa.ate) - anterior) * faixa.aliquota
    anterior = faixa.ate
    if (baseInssLimitada <= faixa.ate) break
  }
  inss = Math.round(inss * 100) / 100

  // Calcular Pensão Alimentícia
  let pensaoAlimenticia = 0
  if (func.pensao_config_ativa) {
    if (func.pensao_config_tipo === 'fixo') {
      pensaoAlimenticia = Number(func.pensao_config_valor_fixo) || 0
    } else {
      const salarioLiquidoBase = baseInss + valorAbonoPecuniario - inss
      pensaoAlimenticia = (salarioLiquidoBase * (Number(func.pensao_config_percentual) || 0)) / 100
    }
  }
  pensaoAlimenticia = Math.round(pensaoAlimenticia * 100) / 100

  // IRRF 2026
  const deducaoDep = numeroDependentes * 189.59
  const baseIRRF = Math.max(0, baseInss - inss - pensaoAlimenticia)
  const baseIRRFAposDep = Math.max(0, baseIRRF - deducaoDep)
  
  // 1. Calcular imposto base pela tabela progressiva oficial de 2026
  let impostoTabela = 0
  let faixaIRRF = 'Isento'

  if (baseIRRFAposDep <= 2428.80) {
    impostoTabela = 0
    faixaIRRF = 'Isento'
  } else if (baseIRRFAposDep <= 3051.00) {
    impostoTabela = (baseIRRFAposDep * 0.075) - 182.16
    faixaIRRF = '7.5%'
  } else if (baseIRRFAposDep <= 4052.00) {
    impostoTabela = (baseIRRFAposDep * 0.15) - 394.16
    faixaIRRF = '15.0%'
  } else if (baseIRRFAposDep <= 5050.00) {
    impostoTabela = (baseIRRFAposDep * 0.225) - 675.49
    faixaIRRF = '22.5%'
  } else {
    impostoTabela = (baseIRRFAposDep * 0.275) - 896.00
    faixaIRRF = '27.5%'
  }

  // 2. Calcular redutor progressivo da Lei 15.270/2025
  let redutor = 0
  if (baseIRRFAposDep <= 5000.00) {
    redutor = impostoTabela // Zera o imposto
  } else if (baseIRRFAposDep <= 7350.00) {
    redutor = 978.62 - (0.133145 * baseIRRFAposDep)
  }

  let irrf = Math.max(0, impostoTabela - redutor)
  irrf = Math.round(irrf * 100) / 100

  if (irrf === 0) {
    faixaIRRF = 'Isento'
  }

  const valorBruto = baseInss + valorAbonoPecuniario
  const valorLiquido = valorBruto - inss - irrf - pensaoAlimenticia

  preview.value = {
    diasFerias,
    diasAbono,
    salarioDia: Math.round(salarioDia * 100) / 100,
    valorRemuneracao: Math.round(valorRemuneracao * 100) / 100,
    valorUmTerco: Math.round(valorUmTerco * 100) / 100,
    valorAbonoPecuniario: Math.round(valorAbonoPecuniario * 100) / 100,
    valorBruto: Math.round(valorBruto * 100) / 100,
    inss,
    irrf,
    faixaIRRF,
    pensaoAlimenticia,
    valorLiquido: Math.round(valorLiquido * 100) / 100,
  }
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([carregarFerias(), carregarFuncionarios()])
})

watch(filtros, () => {}, { deep: true })

watch(
  [() => form.data_inicio, () => form.abono_pecuniario, () => form.dias_abono],
  ([dataInicio, abono, diasAbono]) => {
    if (!dataInicio) return
    try {
      const data = new Date(dataInicio + 'T00:00:00')
      if (isNaN(data.getTime())) return
      const diasVenda = abono ? (Number(diasAbono) || 0) : 0
      const diasGozo = 30 - diasVenda
      data.setDate(data.getDate() + diasGozo - 1)
      form.data_fim = data.toISOString().split('T')[0]
      recalcularPreview()
    } catch (e) {
      console.error('Erro ao calcular data de fim das férias:', e)
    }
  }
)

// ─── API ─────────────────────────────────────────────────────────────────────
const carregarFerias = async () => {
  loading.value = true
  try {
    const res: any = await $fetch('/api/ferias')
    todasFerias.value = res.data || []
  } catch (err) {
    console.error('Erro ao carregar férias:', err)
  } finally {
    loading.value = false
  }
}

const carregarFuncionarios = async () => {
  try {
    const res: any = await $fetch('/api/funcionarios')
    funcionarios.value = Array.isArray(res) ? res : (res?.data || [])
  } catch (err) {
    console.error('Erro ao carregar funcionários:', err)
  }
}

const onFuncionarioChange = () => {
  const func = funcionarioSelecionado.value
  if (func?.data_admissao) {
    // Calcular período aquisitivo automaticamente (1º período = data admissão)
    const admissao = new Date(func.data_admissao + 'T00:00:00')
    form.periodo_aquisitivo_inicio = func.data_admissao

    // Encontrar períodos aquisitivos existentes para sugerir o próximo
    const feriasDoFunc = todasFerias.value.filter(f => String(f.funcionario_id) === String(func.id))
    const periodoNum = feriasDoFunc.length + 1
    const inicioPeriodo = new Date(admissao)
    inicioPeriodo.setFullYear(inicioPeriodo.getFullYear() + periodoNum - 1)
    const fimPeriodo = new Date(inicioPeriodo)
    fimPeriodo.setFullYear(fimPeriodo.getFullYear() + 1)
    fimPeriodo.setDate(fimPeriodo.getDate() - 1)

    form.periodo_aquisitivo_inicio = inicioPeriodo.toISOString().split('T')[0]
    form.periodo_aquisitivo_fim = fimPeriodo.toISOString().split('T')[0]
  }
  recalcularPreview()
}

const salvar = async () => {
  if (!formValido.value) return
  salvando.value = true
  try {
    const payload = { ...form }
    if (editando.value) {
      await $fetch(`/api/ferias/${editando.value.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/ferias', { method: 'POST', body: payload })
    }
    fecharModal()
    await carregarFerias()
  } catch (err: any) {
    alert(err?.data?.message || 'Erro ao salvar férias')
  } finally {
    salvando.value = false
  }
}

const gerarHolerite = async (ferias: any) => {
  loadingHolerite.value = ferias.id
  try {
    const res: any = await $fetch(`/api/ferias/${ferias.id}/gerar-holerite`, { method: 'POST' })
    alert('✅ Recibo de férias gerado com sucesso!')
    await carregarFerias()
    if (res.holerite_id) {
      window.open(`/api/holerites/${res.holerite_id}/pdf`, '_blank')
    }
  } catch (err: any) {
    alert(err?.data?.message || 'Erro ao gerar recibo de férias')
  } finally {
    loadingHolerite.value = null
  }
}

const confirmarExcluir = async (ferias: any) => {
  const nome = ferias.funcionarios?.nome_completo || 'funcionário'
  const inicio = formatarData(ferias.data_inicio)
  if (!confirm(`Deseja remover as férias de ${nome} (início: ${inicio})?`)) return
  try {
    await $fetch(`/api/ferias/${ferias.id}`, { method: 'DELETE' })
    await carregarFerias()
  } catch (err: any) {
    alert(err?.data?.message || 'Erro ao excluir férias')
  }
}

const aprovarSolicitacao = (ferias: any) => {
  const dtInicioStr = ferias.data_inicio
  if (!dtInicioStr) return
  
  // Sugerir data de pagamento sendo 2 dias antes do início das férias
  const dtInicio = new Date(dtInicioStr + 'T00:00:00')
  dtInicio.setDate(dtInicio.getDate() - 2)
  const dataPagamentoSugestao = dtInicio.toISOString().split('T')[0]
  
  feriasParaAprovar.value = ferias
  dataPagamentoAprovar.value = ferias.data_pagamento || dataPagamentoSugestao
  showAprovarModal.value = true
}

const fecharAprovarModal = () => {
  showAprovarModal.value = false
  feriasParaAprovar.value = null
  dataPagamentoAprovar.value = ''
}

const confirmarAprovar = async () => {
  const ferias = feriasParaAprovar.value
  if (!ferias || !dataPagamentoAprovar.value) return
  
  loadingAprovar.value = ferias.id
  try {
    const payload = {
      funcionario_id: ferias.funcionario_id,
      periodo_aquisitivo_inicio: ferias.periodo_aquisitivo_inicio,
      periodo_aquisitivo_fim: ferias.periodo_aquisitivo_fim,
      data_inicio: ferias.data_inicio,
      data_fim: ferias.data_fim,
      abono_pecuniario: ferias.abono_pecuniario,
      dias_abono: ferias.dias_abono,
      observacoes: ferias.observacoes,
      status: 'programado',
      data_pagamento: dataPagamentoAprovar.value
    }
    
    const response: any = await $fetch(`/api/ferias/${ferias.id}`, {
      method: 'PUT',
      body: payload
    })
    
    if (response.success) {
      alert('✅ Solicitação de férias aprovada com sucesso!')
      fecharAprovarModal()
      await carregarFerias()
    }
  } catch (err: any) {
    console.error('Erro ao aprovar solicitação:', err)
    alert(err?.data?.message || 'Erro ao aprovar solicitação de férias')
  } finally {
    loadingAprovar.value = null
  }
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const abrirModalCadastro = (ferias?: any) => {
  if (ferias) {
    editando.value = ferias
    form.funcionario_id = String(ferias.funcionario_id)
    form.periodo_aquisitivo_inicio = ferias.periodo_aquisitivo_inicio || ''
    form.periodo_aquisitivo_fim = ferias.periodo_aquisitivo_fim || ''
    form.data_inicio = ferias.data_inicio || ''
    form.data_fim = ferias.data_fim || ''
    form.abono_pecuniario = ferias.abono_pecuniario || false
    form.dias_abono = ferias.dias_abono || 10
    form.data_pagamento = ferias.data_pagamento || ''
    form.observacoes = ferias.observacoes || ''
    form.status = ferias.status || 'programado'
    recalcularPreview()
  } else {
    editando.value = null
    Object.assign(form, {
      funcionario_id: '',
      periodo_aquisitivo_inicio: '',
      periodo_aquisitivo_fim: '',
      data_inicio: '',
      data_fim: '',
      abono_pecuniario: false,
      dias_abono: 10,
      data_pagamento: '',
      observacoes: '',
      status: 'programado',
    })
    preview.value = null
  }
  showModal.value = true
}

const fecharModal = () => {
  showModal.value = false
  editando.value = null
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
