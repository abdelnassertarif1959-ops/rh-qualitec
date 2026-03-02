<template>
  <div class="space-y-6">
    <!-- Navegação por Abas -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="abaAtiva = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
            abaAtiva === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.iconPath"/>
          </svg>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Conteúdo das Abas -->
    <div class="min-h-[400px]">
      <!-- Aba: Dados Pessoais -->
      <FuncionarioDadosPessoais 
        v-if="abaAtiva === 'pessoais'" 
        :form="form" 
      />

      <!-- Aba: Dados Profissionais -->
      <div v-if="abaAtiva === 'profissionais'">
        <!-- Debug: Verificar se props existem -->
        <div v-if="!form || !empresasOptions || !departamentosOptions || !cargosOptions" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-sm text-gray-500">Carregando dados profissionais...</p>
          <p class="text-xs text-gray-400 mt-2">
            Form: {{ !!form }} | 
            Empresas: {{ empresasOptions?.length || 0 }} | 
            Departamentos: {{ departamentosOptions?.length || 0 }} | 
            Cargos: {{ cargosOptions?.length || 0 }}
          </p>
        </div>
        
        <FuncionarioDadosProfissionais 
          v-else
          :form="form"
          :show-empresa-select="showEmpresaSelect"
          :empresas-options="empresasOptions || []"
          :departamentos-options="departamentosOptions || []"
          :cargos-options="cargosOptions || []"
          :jornada-options-computed="jornadaOptionsComputed || []"
          :responsavel-options="responsavelOptions || []"
        />
      </div>

      <!-- Aba: Acesso ao Sistema -->
      <FuncionarioAcessoSistema 
        v-if="abaAtiva === 'acesso'" 
        :form="form" 
      />

      <!-- Aba: Dados Financeiros -->
      <FuncionarioDadosFinanceiros 
        v-if="abaAtiva === 'financeiros'" 
        :form="form" 
      />

      <!-- Aba: Benefícios e Descontos -->
      <div v-if="abaAtiva === 'beneficios'" class="space-y-6">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
          </svg>
          <h3 class="text-lg font-bold text-gray-800">Benefícios e Descontos</h3>
        </div>
        
        <!-- Aviso para funcionários PJ -->
        <div v-if="form.tipo_contrato === 'PJ'" class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div class="flex items-center gap-2 text-yellow-700">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <h4 class="font-semibold">Funcionário PJ - Sem Descontos em Folha</h4>
              <p class="text-sm">Funcionários PJ não podem ter descontos em folha de pagamento. Apenas benefícios sem desconto são permitidos.</p>
            </div>
          </div>
        </div>
        
        <!-- Benefícios Padrão -->
        <div v-if="form.beneficios" class="space-y-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            <h4 class="text-md font-semibold text-gray-700">Benefícios Padrão</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Vale Transporte -->
            <div v-if="form.beneficios.vale_transporte" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                  <h5 class="font-semibold text-gray-800">Vale Transporte</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.vale_transporte.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.vale_transporte.ativo" class="space-y-3">
                <UiInput 
                  v-model="form.beneficios.vale_transporte.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor Diário (R$)" 
                  placeholder="0,00"
                />
                
                <!-- Descontos apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiSelect 
                    v-model="form.beneficios.vale_transporte.tipo_desconto" 
                    :options="tipoDescontoOptions" 
                    label="Tipo de Desconto" 
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.vale_transporte.tipo_desconto === 'percentual'"
                    v-model="form.beneficios.vale_transporte.percentual_desconto" 
                    type="number" 
                    step="0.01"
                    label="% de Desconto" 
                    placeholder="6.00"
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.vale_transporte.tipo_desconto === 'valor_fixo'"
                    v-model="form.beneficios.vale_transporte.valor_desconto" 
                    type="number" 
                    step="0.01"
                    label="Valor do Desconto (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700 flex items-center gap-1.5">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <strong>Funcionário PJ:</strong> Benefício sem desconto em folha
                  </p>
                </div>
              </div>
            </div>

            <!-- Cesta Básica -->
            <div v-if="form.beneficios.cesta_basica" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <h5 class="font-semibold text-gray-800">Cesta Básica</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.cesta_basica.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.cesta_basica.ativo" class="space-y-3">
                <UiInput 
                  v-model="form.beneficios.cesta_basica.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor Diário (R$)" 
                  placeholder="0,00"
                />
                
                <!-- Descontos apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiSelect 
                    v-model="form.beneficios.cesta_basica.tipo_desconto" 
                    :options="tipoDescontoOptions" 
                    label="Tipo de Desconto" 
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.cesta_basica.tipo_desconto === 'percentual'"
                    v-model="form.beneficios.cesta_basica.percentual_desconto" 
                    type="number" 
                    step="0.01"
                    label="% de Desconto" 
                    placeholder="20.00"
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.cesta_basica.tipo_desconto === 'valor_fixo'"
                    v-model="form.beneficios.cesta_basica.valor_desconto" 
                    type="number" 
                    step="0.01"
                    label="Valor do Desconto (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700 flex items-center gap-1.5">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <strong>Funcionário PJ:</strong> Benefício sem desconto em folha
                  </p>
                </div>
              </div>
            </div>

            <!-- Plano de Saúde -->
            <div v-if="form.beneficios.plano_saude" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  <h5 class="font-semibold text-gray-800">Plano de Saúde</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.plano_saude.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.plano_saude.ativo" class="space-y-3">
                <UiSelect 
                  v-model="form.beneficios.plano_saude.plano" 
                  :options="planoSaudeOptions" 
                  label="Tipo de Plano" 
                />
                
                <UiInput 
                  v-model="form.beneficios.plano_saude.valor_empresa" 
                  type="number" 
                  step="0.01"
                  label="Valor Pago pela Empresa (R$)" 
                  placeholder="0,00"
                />
                
                <!-- Desconto apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiInput 
                    v-model="form.beneficios.plano_saude.valor_funcionario" 
                    type="number" 
                    step="0.01"
                    label="Valor Descontado do Funcionário (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700 flex items-center gap-1.5">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <strong>Funcionário PJ:</strong> Sem desconto em folha para plano de saúde
                  </p>
                </div>
                
                <UiInput 
                  v-model="form.beneficios.plano_saude.dependentes" 
                  type="number" 
                  label="Número de Dependentes" 
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Plano Odontológico -->
            <div v-if="form.beneficios.plano_odonto" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <h5 class="font-semibold text-gray-800">Plano Odontológico</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.plano_odonto.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.plano_odonto.ativo" class="space-y-3">
                <!-- Desconto apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiInput 
                    v-model="form.beneficios.plano_odonto.valor_funcionario" 
                    type="number" 
                    step="0.01"
                    label="Valor Descontado (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700 flex items-center gap-1.5">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <strong>Funcionário PJ:</strong> Sem desconto em folha para plano odontológico
                  </p>
                </div>
                
                <UiInput 
                  v-model="form.beneficios.plano_odonto.dependentes" 
                  type="number" 
                  label="Número de Dependentes" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mensagem de erro se benefícios não existirem -->
        <div v-else class="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <h4 class="font-semibold">Benefícios não inicializados</h4>
              <p class="text-sm">Clique no botão abaixo para inicializar os benefícios.</p>
              <button 
                @click="inicializarBeneficios" 
                class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Inicializar Benefícios
              </button>
            </div>
          </div>
        </div>

        <!-- Benefícios Personalizados -->
        <div v-if="form.beneficios" class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
              <h4 class="text-md font-semibold text-gray-700">Benefícios Personalizados</h4>
            </div>
            <UiButton 
              variant="secondary" 
              size="sm"
              @click="adicionarBeneficioPersonalizado"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Adicionar Benefício
            </UiButton>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(beneficio, index) in form.beneficios.personalizados" 
              :key="index"
              class="p-4 border border-gray-200 rounded-xl"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <UiInput 
                    v-model="beneficio.icone" 
                    label=""
                    placeholder="🎯"
                    class="w-12 text-center text-xl"
                  />
                  <UiInput 
                    v-model="beneficio.nome" 
                    label=""
                    placeholder="Nome do benefício"
                    class="font-semibold"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <UiCheckbox 
                    v-model="beneficio.ativo" 
                    label=""
                  />
                  <UiButton 
                    variant="danger" 
                    size="sm" 
                    @click="removerBeneficioPersonalizado(Number(index))"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </UiButton>
                </div>
              </div>
              
              <div v-if="beneficio.ativo" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UiInput 
                    v-model="beneficio.valor" 
                    type="number" 
                    step="0.01"
                    label="Valor do Benefício (R$)" 
                    placeholder="0,00"
                  />
                  
                  <UiSelect 
                    v-model="beneficio.tipo_valor" 
                    :options="tipoBeneficioOptions" 
                    label="Tipo de Valor" 
                  />
                </div>
                
                <!-- Descontos apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UiSelect 
                    v-model="beneficio.tipo_desconto" 
                    :options="tipoDescontoOptions" 
                    label="Tipo de Desconto" 
                  />
                  
                  <UiInput 
                    v-if="beneficio.tipo_desconto === 'percentual'"
                    v-model="beneficio.percentual_desconto" 
                    type="number" 
                    step="0.01"
                    label="% de Desconto" 
                    placeholder="0,00"
                  />
                  
                  <UiInput 
                    v-if="beneficio.tipo_desconto === 'valor_fixo'"
                    v-model="beneficio.valor_desconto" 
                    type="number" 
                    step="0.01"
                    label="Valor do Desconto (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700 flex items-center gap-1.5">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <strong>Funcionário PJ:</strong> Benefício sem desconto em folha
                  </p>
                </div>
                
                <UiInput 
                  v-model="beneficio.descricao" 
                  label="Descrição (opcional)" 
                  placeholder="Ex: Auxílio creche, seguro de vida, etc."
                />
              </div>
            </div>
            
            <div v-if="!form.beneficios.personalizados || form.beneficios.personalizados.length === 0" class="p-4 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
              <p class="mt-2">Nenhum benefício personalizado adicionado</p>
              <p class="text-sm">Clique em "Adicionar Benefício" para criar um novo</p>
            </div>
          </div>
        </div>

        <!-- Descontos Personalizados - Apenas para CLT -->
        <div v-if="form.descontos_personalizados && form.tipo_contrato !== 'PJ'" class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
              </svg>
              <h4 class="text-md font-semibold text-gray-700">Descontos Personalizados</h4>
            </div>
            <UiButton 
              variant="secondary" 
              size="sm"
              @click="adicionarDesconto"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Adicionar Desconto
            </UiButton>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="(desconto, index) in form.descontos_personalizados" 
              :key="index"
              class="p-4 border border-gray-200 rounded-xl"
            >
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <UiInput 
                  v-model="desconto.descricao" 
                  label="Descrição" 
                  placeholder="Ex: Empréstimo, Seguro de Vida"
                />
                
                <UiInput 
                  v-model="desconto.referencia" 
                  label="Nº de Referência" 
                  placeholder="Ex: 001/2026"
                />
                
                <UiSelect 
                  v-model="desconto.tipo" 
                  :options="tipoDescontoOptions" 
                  label="Tipo" 
                />
                
                <UiInput 
                  v-if="desconto.tipo === 'percentual'"
                  v-model="desconto.percentual" 
                  type="number" 
                  step="0.01"
                  label="Percentual (%)" 
                  placeholder="0,00"
                />
                
                <UiInput 
                  v-if="desconto.tipo === 'valor_fixo'"
                  v-model="desconto.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor (R$)" 
                  placeholder="0,00"
                />
                
                <div class="flex items-end">
                  <UiButton 
                    variant="danger" 
                    size="sm" 
                    @click="removerDesconto(Number(index))"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Remover
                  </UiButton>
                </div>
              </div>
              
              <div class="mt-3 flex gap-4">
                <UiCheckbox 
                  v-model="desconto.recorrente" 
                  label="Desconto recorrente"
                />
                
                <UiInput 
                  v-if="!desconto.recorrente"
                  v-model="desconto.parcelas" 
                  type="number" 
                  label="Número de parcelas" 
                  placeholder="1"
                  class="w-32"
                />
              </div>
            </div>
            
            <div v-if="form.descontos_personalizados.length === 0" class="p-4 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="mt-2">Nenhum desconto personalizado adicionado</p>
              <p class="text-sm">Clique em "Adicionar Desconto" para criar um novo</p>
            </div>
          </div>
        </div>
        
        <!-- Aviso para funcionários PJ sobre descontos -->
        <div v-else-if="form.tipo_contrato === 'PJ'" class="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <div>
              <h4 class="font-semibold">Funcionário PJ - Descontos Não Aplicáveis</h4>
              <p class="text-sm">Funcionários PJ não podem ter descontos personalizados em folha de pagamento.</p>
            </div>
          </div>
        </div>
        
        <!-- Mensagem de erro se descontos não existirem -->
        <div v-else class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div class="flex items-center gap-2 text-orange-700">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <h4 class="font-semibold">Descontos personalizados não inicializados</h4>
              <p class="text-sm">Clique no botão abaixo para inicializar os descontos.</p>
              <button 
                @click="inicializarBeneficios" 
                class="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Inicializar Descontos
              </button>
            </div>
          </div>
        </div>

        <!-- Resumo dos Benefícios -->
        <div class="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <h4 class="text-lg font-bold text-gray-800">Resumo dos Benefícios</h4>
          </div>
          
          <div v-if="form.tipo_contrato === 'PJ'" class="text-center">
            <div class="text-xl font-bold text-blue-600 mb-2">
              R$ {{ calcularTotalBeneficios().toFixed(2).replace('.', ',') }}
            </div>
            <div class="text-sm text-gray-600 mb-4">Total de Benefícios (Sem Descontos)</div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <p class="text-sm text-blue-700 flex items-center gap-1.5">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <strong>Funcionário PJ:</strong> Recebe benefícios integralmente, sem descontos em folha
              </p>
            </div>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-xl font-bold text-green-600">
                R$ {{ calcularTotalBeneficios().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Total de Benefícios</div>
            </div>
            
            <div>
              <div class="text-xl font-bold text-red-600">
                R$ {{ calcularTotalDescontos().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Total de Descontos</div>
            </div>
            
            <div>
              <div class="text-xl font-bold text-blue-600">
                R$ {{ calcularSaldoLiquido().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Impacto no Salário</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <UiButton variant="secondary" @click="$emit('cancel')">
        Cancelar
      </UiButton>
      
      <UiButton 
        variant="success" 
        @click="salvarEEnviarAcesso"
        :disabled="loading"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
        </svg>
        Salvar e Enviar Acesso
      </UiButton>
      
      <UiButton 
        @click="handleSubmit"
        :disabled="loading"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
        </svg>
        {{ isEditing ? 'Atualizar' : 'Salvar' }} Funcionário
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, isReactive } from 'vue'
import FuncionarioDadosPessoais from './FuncionarioDadosPessoais.vue'
import FuncionarioDadosProfissionais from './FuncionarioDadosProfissionais.vue'
import FuncionarioAcessoSistema from './FuncionarioAcessoSistema.vue'
import FuncionarioDadosFinanceiros from './FuncionarioDadosFinanceiros.vue'

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
  'salvar-e-enviar': []
}>()

// Estado da aba ativa
const abaAtiva = ref('pessoais')

// Abas do formulário
const tabs = [
  { 
    id: 'pessoais', 
    label: 'Dados Pessoais', 
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  { 
    id: 'profissionais', 
    label: 'Dados Profissionais', 
    iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  { 
    id: 'acesso', 
    label: 'Acesso ao Sistema', 
    iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
  },
  { 
    id: 'financeiros', 
    label: 'Dados Financeiros', 
    iconPath: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  },
  { 
    id: 'beneficios', 
    label: 'Benefícios e Descontos', 
    iconPath: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
  }
]

// Opções para os selects (apenas as que ainda são usadas no componente principal)
const jornadaOptions = [
  { value: '44h', label: '44h semanais' },
  { value: '40h', label: '40h semanais' },
  { value: '36h', label: '36h semanais' },
  { value: '30h', label: '30h semanais' }
]

const tipoDescontoOptions = [
  { value: 'sem_desconto', label: 'Sem Desconto' },
  { value: 'percentual', label: 'Percentual (%)' },
  { value: 'valor_fixo', label: 'Valor Fixo (R$)' }
]

const planoSaudeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'coparticipacao', label: 'Coparticipação' }
]

const tipoBeneficioOptions = [
  { value: 'diario', label: 'Valor Diário' },
  { value: 'mensal', label: 'Valor Mensal' },
  { value: 'fixo', label: 'Valor Fixo' }
]

// Função para calcular valor diário da Cesta Básica
const calcularValorDiarioCB = () => {
  if (props.form.beneficios?.cesta_basica?.valor_mensal) {
    props.form.beneficios.cesta_basica.valor = props.form.beneficios.cesta_basica.valor_mensal / 22
  }
}

const { 
  formatarHorario, 
  formatarHorasDecimais, 
  obterNomeDia, 
  obterAbrevDia 
} = useJornadas()

const { opcoesJornadas, carregarJornadas } = useJornadas()
const { empresas, carregarEmpresas, obterOpcoesEmpresas } = useEmpresas()
const { opcoesDepartamentos, carregarDepartamentos } = useDepartamentos()
const { opcoesCargos, carregarCargos } = useCargos()
const { adminInfo, buscarAdmin } = useAdmin()

// Computed para extrair dados do admin
const nomeAdmin = computed(() => adminInfo.value?.nome_completo || '')
const idAdmin = computed(() => adminInfo.value?.id || null)

// Função para inicializar benefícios de forma reativa
const inicializarBeneficios = () => {
  console.log('🔧 [FuncionarioForm] Inicializando benefícios...')
  
  if (!props.form) {
    console.error('❌ [FuncionarioForm] ERRO: Não é possível inicializar benefícios - form é null!')
    return
  }
  
  if (!props.form.beneficios) {
    console.log('📋 [FuncionarioForm] Criando estrutura de benefícios')
    props.form.beneficios = reactive({
      vale_transporte: {
        ativo: false,
        valor: 0,
        valor_mensal: 0,
        tipo_desconto: 'percentual',
        percentual_desconto: 6,
        valor_desconto: 0
      },
      cesta_basica: {
        ativo: false,
        valor: 0,
        valor_mensal: 0,
        tipo_desconto: 'sem_desconto',
        percentual_desconto: 0,
        valor_desconto: 0
      },
      plano_saude: {
        ativo: false,
        plano: 'individual',
        valor_empresa: 0,
        valor_funcionario: 0,
        dependentes: 0
      },
      plano_odonto: {
        ativo: false,
        valor_funcionario: 0,
        dependentes: 0
      },
      personalizados: []
    })
  } else {
    console.log('✅ [FuncionarioForm] Benefícios já existem')
  }

  // Garantir que benefícios personalizados existam e sejam reativos
  if (!props.form.beneficios.personalizados) {
    console.log('📋 [FuncionarioForm] Criando array de benefícios personalizados')
    props.form.beneficios.personalizados = reactive([])
  } else if (!isReactive(props.form.beneficios.personalizados)) {
    // Se existir mas não for reativo, tornar reativo e converter tipos
    console.log('🔄 [FuncionarioForm] Tornando benefícios personalizados reativos e convertendo tipos')
    const beneficiosConvertidos = props.form.beneficios.personalizados.map((beneficio: any) => ({
      ...beneficio,
      valor: typeof beneficio.valor === 'string' ? parseFloat(beneficio.valor) || 0 : beneficio.valor,
      percentual_desconto: typeof beneficio.percentual_desconto === 'string' ? parseFloat(beneficio.percentual_desconto) || 0 : beneficio.percentual_desconto,
      valor_desconto: typeof beneficio.valor_desconto === 'string' ? parseFloat(beneficio.valor_desconto) || 0 : beneficio.valor_desconto
    }))
    props.form.beneficios.personalizados = reactive(beneficiosConvertidos)
  } else {
    // Se já for reativo, apenas converter tipos se necessário
    props.form.beneficios.personalizados.forEach((beneficio: any) => {
      if (typeof beneficio.valor === 'string') {
        beneficio.valor = parseFloat(beneficio.valor) || 0
      }
      if (typeof beneficio.percentual_desconto === 'string') {
        beneficio.percentual_desconto = parseFloat(beneficio.percentual_desconto) || 0
      }
      if (typeof beneficio.valor_desconto === 'string') {
        beneficio.valor_desconto = parseFloat(beneficio.valor_desconto) || 0
      }
    })
  }

  if (!props.form.descontos_personalizados) {
    console.log('📉 [FuncionarioForm] Criando array de descontos personalizados')
    props.form.descontos_personalizados = reactive([])
  } else if (!isReactive(props.form.descontos_personalizados)) {
    // Se existir mas não for reativo, tornar reativo
    console.log('🔄 [FuncionarioForm] Tornando descontos personalizados reativos')
    props.form.descontos_personalizados = reactive([...props.form.descontos_personalizados])
  }
  
  console.log('✅ [FuncionarioForm] Benefícios inicializados:', {
    beneficiosExist: !!props.form.beneficios,
    valeTransporte: !!props.form.beneficios?.vale_transporte,
    cestaBasica: !!props.form.beneficios?.cesta_basica,
    personalizadosCount: props.form.beneficios?.personalizados?.length || 0
  })
}

// Função para definir responsável padrão (Silvana - ID 1)
const definirResponsavelPadrao = () => {
  // Se não há responsável definido, definir Silvana (ID 1) como padrão
  if (!props.form.responsavel_id) {
    props.form.responsavel_id = 1
    console.log('👩‍💼 Silvana definida como responsável padrão (ID: 1)')
  }
}

// Carregar dados ao montar o componente
onMounted(async () => {
  console.log('🚀 [FuncionarioForm] Montando componente')
  console.log('📋 [FuncionarioForm] Props recebidas:', {
    isEditing: props.isEditing,
    showEmpresaSelect: props.showEmpresaSelect,
    loading: props.loading,
    formExists: !!props.form,
    formKeys: props.form ? Object.keys(props.form) : 'null'
  })
  
  // Verificar se form existe
  if (!props.form) {
    console.error('❌ [FuncionarioForm] ERRO: Form é null/undefined!')
    return
  }
  
  console.log('📝 [FuncionarioForm] Dados do form:', {
    nome: props.form.nome_completo,
    cpf: props.form.cpf,
    email: props.form.email_login,
    beneficios: props.form.beneficios ? 'Existe' : 'Null',
    beneficiosKeys: props.form.beneficios ? Object.keys(props.form.beneficios) : 'null'
  })
  
  try {
    // Inicializar benefícios primeiro
    console.log('🔧 [FuncionarioForm] Inicializando benefícios...')
    inicializarBeneficios()
    
    // Definir responsável padrão
    console.log('👩‍💼 [FuncionarioForm] Definindo responsável padrão...')
    definirResponsavelPadrao()
    
    // Carregar dados das APIs
    console.log('📡 [FuncionarioForm] Carregando dados das APIs...')
    await Promise.all([
      carregarJornadas().catch(e => console.error('❌ Erro jornadas:', e)),
      carregarEmpresas().catch(e => console.error('❌ Erro empresas:', e)),
      carregarDepartamentos().catch(e => console.error('❌ Erro departamentos:', e)),
      carregarCargos().catch(e => console.error('❌ Erro cargos:', e)),
      buscarAdmin().catch(e => console.error('❌ Erro admin:', e))
    ])
    
    console.log('✅ [FuncionarioForm] Componente montado com sucesso')
    
  } catch (error) {
    console.error('❌ [FuncionarioForm] Erro durante montagem:', error)
  }
})

// Watch para garantir que benefícios estejam sempre inicializados
watch(() => props.form, (novoForm, formAnterior) => {
  console.log('👀 [FuncionarioForm] Watch form disparado:', {
    novoFormExists: !!novoForm,
    formAnteriorExists: !!formAnterior,
    novoFormKeys: novoForm ? Object.keys(novoForm) : 'null',
    beneficiosExists: novoForm?.beneficios ? 'Sim' : 'Não'
  })
  
  if (novoForm && !novoForm.beneficios) {
    console.log('⚠️ [FuncionarioForm] Benefícios não encontrados no watch, inicializando...')
    inicializarBeneficios()
  } else if (novoForm?.beneficios) {
    console.log('✅ [FuncionarioForm] Benefícios já existem no form')
  }
}, { deep: true, immediate: true })

// Watch específico para benefícios personalizados (debug e conversão)
watch(() => props.form.beneficios?.personalizados, (novos, antigos) => {
  if (novos && novos.length > 0) {
    console.log('🔍 Benefícios personalizados alterados:', novos)
    novos.forEach((beneficio: any, index: number) => {
      // Garantir que valores sejam numéricos
      garantirValoresNumericos(beneficio)
      
      console.log(`Benefício ${index}:`, {
        nome: beneficio.nome,
        tipo_valor: beneficio.tipo_valor,
        valor: beneficio.valor,
        valor_tipo: typeof beneficio.valor,
        ativo: beneficio.ativo
      })
    })
  }
}, { deep: true })

// Watch para limpar descontos quando mudar para PJ
watch(() => props.form.tipo_contrato, (novoTipo, tipoAnterior) => {
  if (novoTipo === 'PJ' && tipoAnterior !== 'PJ') {
    console.log('🚫 Funcionário alterado para PJ - removendo descontos em folha')
    
    // Limpar descontos dos benefícios padrão
    if (props.form.beneficios) {
      if (props.form.beneficios.vale_transporte) {
        props.form.beneficios.vale_transporte.tipo_desconto = 'sem_desconto'
        props.form.beneficios.vale_transporte.percentual_desconto = 0
        props.form.beneficios.vale_transporte.valor_desconto = 0
      }
      
      if (props.form.beneficios.cesta_basica) {
        props.form.beneficios.cesta_basica.tipo_desconto = 'sem_desconto'
        props.form.beneficios.cesta_basica.percentual_desconto = 0
        props.form.beneficios.cesta_basica.valor_desconto = 0
      }
      
      if (props.form.beneficios.plano_saude) {
        props.form.beneficios.plano_saude.valor_funcionario = 0
      }
      
      if (props.form.beneficios.plano_odonto) {
        props.form.beneficios.plano_odonto.valor_funcionario = 0
      }
      
      // Limpar descontos dos benefícios personalizados
      if (props.form.beneficios.personalizados) {
        props.form.beneficios.personalizados.forEach((beneficio: any) => {
          beneficio.tipo_desconto = 'sem_desconto'
          beneficio.percentual_desconto = 0
          beneficio.valor_desconto = 0
        })
      }
    }
    
    // Limpar descontos personalizados
    if (props.form.descontos_personalizados) {
      props.form.descontos_personalizados.splice(0)
    }
    
    console.log('✅ Descontos removidos para funcionário PJ')
  }
})

// Recarregar dados sempre que o formulário for exibido (detectando mudanças no form)
watch(() => props.form.nome_completo, async (novoNome, nomeAntigo) => {
  // Se o nome mudou de vazio para preenchido ou vice-versa, recarregar dados
  if ((novoNome && !nomeAntigo) || (!novoNome && nomeAntigo)) {
    console.log('🔄 Recarregando dados dos selects...')
    await Promise.all([
      carregarJornadas(),
      carregarEmpresas(),
      carregarDepartamentos(),
      carregarCargos()
    ])
  }
})

// Opções de departamentos vindas da API
const departamentosOptions = computed(() => opcoesDepartamentos.value)

// Opções de cargos vindas da API
const cargosOptions = computed(() => opcoesCargos.value)

// Opções de responsável direto (Silvana como padrão)
const responsavelOptions = computed(() => {
  const options = []
  
  // Silvana sempre como primeira opção (ID 1)
  options.push({ 
    value: 1, 
    label: 'Silvana (Responsável Padrão) ⭐' 
  })
  
  // Adicionar admin se disponível e diferente de Silvana
  if (idAdmin.value && nomeAdmin.value && idAdmin.value !== 1) {
    options.push({ 
      value: idAdmin.value, 
      label: `${nomeAdmin.value} (Admin)` 
    })
  }
  
  // Opção para remover responsável (apenas se necessário)
  options.push({ 
    value: null, 
    label: 'Nenhum responsável' 
  })
  
  return options
})

// Opções de empresas vindas do banco de dados
const empresasOptions = computed(() => obterOpcoesEmpresas.value)

// Opções de jornadas
const jornadaOptionsComputed = computed(() => opcoesJornadas.value)

// Funções para gerenciar descontos personalizados
const adicionarDesconto = () => {
  props.form.descontos_personalizados.push({
    descricao: '',
    referencia: '',
    tipo: 'valor_fixo',
    valor: 0,
    percentual: 0,
    recorrente: true,
    parcelas: 1
  })
}

const removerDesconto = (index: number) => {
  if (props.form.descontos_personalizados) {
    props.form.descontos_personalizados.splice(index, 1)
  }
}

// Funções para gerenciar benefícios personalizados
const adicionarBeneficioPersonalizado = () => {
  if (!props.form.beneficios.personalizados) {
    props.form.beneficios.personalizados = reactive([])
  }
  
  props.form.beneficios.personalizados.push({
    icone: '🎯',
    nome: '',
    ativo: false,
    valor: 0, // Garantir que seja número
    tipo_valor: 'mensal',
    tipo_desconto: 'sem_desconto',
    percentual_desconto: 0, // Garantir que seja número
    valor_desconto: 0, // Garantir que seja número
    descricao: ''
  })
}

const removerBeneficioPersonalizado = (index: number) => {
  if (props.form.beneficios.personalizados) {
    props.form.beneficios.personalizados.splice(index, 1)
  }
}

// Função para garantir que valores sejam numéricos
const garantirValoresNumericos = (beneficio: any) => {
  if (typeof beneficio.valor === 'string') {
    beneficio.valor = parseFloat(beneficio.valor) || 0
  }
  if (typeof beneficio.percentual_desconto === 'string') {
    beneficio.percentual_desconto = parseFloat(beneficio.percentual_desconto) || 0
  }
  if (typeof beneficio.valor_desconto === 'string') {
    beneficio.valor_desconto = parseFloat(beneficio.valor_desconto) || 0
  }
}

// Funções para calcular totais
const calcularTotalBeneficios = () => {
  let total = 0
  
  // Vale Transporte - usar valor_mensal se existir, senão calcular
  if (props.form.beneficios?.vale_transporte?.ativo) {
    const valorMensal = props.form.beneficios.vale_transporte.valor_mensal || 
                        (props.form.beneficios.vale_transporte.valor || 0) * 22
    total += valorMensal
  }
  
  // Cesta Básica - usar valor_mensal se existir, senão calcular
  if (props.form.beneficios?.cesta_basica?.ativo) {
    const valorMensal = props.form.beneficios.cesta_basica.valor_mensal || 
                        (props.form.beneficios.cesta_basica.valor || 0) * 22
    total += valorMensal
  }
  
  // Plano de Saúde (valor pago pela empresa)
  if (props.form.beneficios?.plano_saude?.ativo) {
    total += props.form.beneficios.plano_saude.valor_empresa || 0
  }
  
  // Benefícios Personalizados
  if (props.form.beneficios?.personalizados) {
    props.form.beneficios.personalizados.forEach((beneficio: any) => {
      if (beneficio.ativo) {
        let valorBeneficio = beneficio.valor || 0
        
        // Converter para valor mensal se necessário
        if (beneficio.tipo_valor === 'diario') {
          valorBeneficio = valorBeneficio * 22
        }
        
        total += valorBeneficio
      }
    })
  }
  
  return total
}

const calcularTotalDescontos = () => {
  let total = 0
  const salarioBase = parseFloat(props.form.salario_base) || 0
  
  // Funcionários PJ não têm descontos em folha
  if (props.form.tipo_contrato === 'PJ') {
    return 0
  }
  
  // Descontos dos benefícios padrão
  if (props.form.beneficios?.vale_transporte?.ativo) {
    const vt = props.form.beneficios.vale_transporte
    if (vt.tipo_desconto === 'percentual') {
      total += salarioBase * (vt.percentual_desconto || 0) / 100
    } else if (vt.tipo_desconto === 'valor_fixo') {
      total += vt.valor_desconto || 0
    }
  }
  
  if (props.form.beneficios?.cesta_basica?.ativo) {
    const cb = props.form.beneficios.cesta_basica
    if (cb.tipo_desconto === 'percentual') {
      total += salarioBase * (cb.percentual_desconto || 0) / 100
    } else if (cb.tipo_desconto === 'valor_fixo') {
      total += cb.valor_desconto || 0
    }
  }
  
  // Plano de Saúde
  if (props.form.beneficios?.plano_saude?.ativo) {
    total += props.form.beneficios.plano_saude.valor_funcionario || 0
  }
  
  // Plano Odontológico
  if (props.form.beneficios?.plano_odonto?.ativo) {
    total += props.form.beneficios.plano_odonto.valor_funcionario || 0
  }
  
  // Descontos dos benefícios personalizados
  if (props.form.beneficios?.personalizados) {
    props.form.beneficios.personalizados.forEach((beneficio: any) => {
      if (beneficio.ativo) {
        if (beneficio.tipo_desconto === 'percentual') {
          total += salarioBase * (beneficio.percentual_desconto || 0) / 100
        } else if (beneficio.tipo_desconto === 'valor_fixo') {
          total += beneficio.valor_desconto || 0
        }
      }
    })
  }
  
  // Descontos personalizados
  props.form.descontos_personalizados?.forEach((desconto: any) => {
    if (desconto.tipo === 'percentual') {
      total += salarioBase * (desconto.percentual || 0) / 100
    } else if (desconto.tipo === 'valor_fixo') {
      total += desconto.valor || 0
    }
  })
  
  return total
}

const calcularSaldoLiquido = () => {
  return calcularTotalBeneficios() - calcularTotalDescontos()
}

// Handlers
const handleSubmit = () => {
  emit('submit')
}

const salvarEEnviarAcesso = () => {
  emit('salvar-e-enviar')
}
</script>