<template>
  <div>
    <UiPageHeader title="Meus Dados" description="Visualize e atualize suas informações pessoais" />

    <!-- Loading -->
    <div v-if="carregando" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Carregando seus dados...</p>
      </div>
    </div>

    <!-- Conteúdo -->
    <div v-else>
    <!-- Foto e Dados Básicos -->
    <UiCard class="mb-6">
      <div class="flex flex-col md:flex-row items-start gap-6">
        <div class="flex flex-col items-center">
          <UiAvatar 
            :name="user?.nome || ''" 
            :avatar-type="dadosOriginais?.avatar"
            size="xl" 
          />
          <UiButton variant="ghost" class="mt-4" @click="mostrarSeletorAvatar = true">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Alterar Foto
          </UiButton>
        </div>
        <div class="flex-1 w-full">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">{{ dadosOriginais?.nome_completo || user?.nome }}</h2>
          <p class="text-lg text-gray-500 mb-4">
            <template v-if="dadosOriginais && Object.keys(cargosMap).length > 0">
              {{ obterNomeCargo(dadosOriginais.cargo_id) }} - {{ obterNomeDepartamento(dadosOriginais.departamento_id) }}
            </template>
            <template v-else>
              Carregando...
            </template>
          </p>
          <div class="flex flex-wrap gap-3">
            <UiBadge variant="success" class="flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Funcionário Ativo
            </UiBadge>
            <UiBadge variant="info" class="flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {{ formatarDataContratacao() }}
            </UiBadge>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Dados Pessoais -->
    <UiCard class="mb-6">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="font-semibold text-gray-900">Dados Pessoais</span>
          </div>
          <UiButton variant="ghost" @click="editandoDadosPessoais = !editandoDadosPessoais">
            <svg v-if="editandoDadosPessoais" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            {{ editandoDadosPessoais ? 'Cancelar' : 'Editar' }}
          </UiButton>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nome Completo -->
        <UiInput 
          v-model="dadosPessoais.nome" 
          label="Nome Completo" 
          :disabled="!editandoDadosPessoais || !isAdmin" 
          :hint="!isAdmin ? 'Apenas administradores podem alterar o nome' : ''" 
        />
        
        <!-- CPF -->
        <UiInputCPF 
          v-model="dadosPessoais.cpf" 
          label="CPF" 
          :disabled="!editandoDadosPessoais || !isAdmin || (camposEditadosUmaVez.cpf && !isAdmin)" 
          :hint="!isAdmin && camposEditadosUmaVez.cpf ? 'CPF já foi editado uma vez' : (!isAdmin ? 'Apenas administradores podem alterar o CPF' : '')" 
        />
        
        <!-- RG -->
        <UiInput 
          v-model="dadosPessoais.rg" 
          label="RG" 
          :disabled="!editandoDadosPessoais || (camposEditadosUmaVez.rg && !isAdmin)" 
          :hint="camposEditadosUmaVez.rg && !isAdmin ? 'RG já foi editado uma vez' : ''" 
        />
        
        <!-- Data de Nascimento -->
        <UiInput 
          v-model="dadosPessoais.dataNascimento" 
          type="date" 
          label="Data de Nascimento" 
          :disabled="!editandoDadosPessoais || (camposEditadosUmaVez.dataNascimento && !isAdmin)" 
          :hint="camposEditadosUmaVez.dataNascimento && !isAdmin ? 'Data de nascimento já foi editada uma vez' : ''" 
        />
        
        <!-- Sexo -->
        <UiSelect 
          v-model="dadosPessoais.sexo" 
          :options="sexoOptions"
          label="Sexo" 
          :disabled="!editandoDadosPessoais || (camposEditadosUmaVez.sexo && !isAdmin)"
          :hint="camposEditadosUmaVez.sexo && !isAdmin ? 'Sexo já foi editado uma vez' : ''"
        />
        
        <!-- Telefone -->
        <UiInputPhone 
          v-model="dadosPessoais.telefone" 
          label="Telefone" 
          :disabled="!editandoDadosPessoais" 
        />
        
        <!-- Email Pessoal -->
        <UiInput 
          v-model="dadosPessoais.email_pessoal" 
          type="email" 
          label="Email Pessoal" 
          :disabled="!editandoDadosPessoais" 
        />
        
        <!-- PIS/PASEP -->
        <UiInputPIS 
          v-model="dadosPessoais.pis_pasep" 
          label="PIS/PASEP" 
          :disabled="!editandoDadosPessoais" 
        />
      </div>

      <div v-if="editandoDadosPessoais" class="mt-6 flex justify-end">
        <UiButton @click="salvarDadosPessoais" :disabled="salvando">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
          </svg>
          {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
        </UiButton>
      </div>
    </UiCard>

    <!-- Dados Profissionais -->
    <UiCard class="mb-6">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="font-semibold text-gray-900">Dados Profissionais</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="!isAdmin" class="text-sm text-gray-500">(somente visualização)</span>
            <UiButton v-if="isAdmin" variant="ghost" @click="editandoDadosProfissionais = !editandoDadosProfissionais">
              <svg v-if="editandoDadosProfissionais" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              {{ editandoDadosProfissionais ? 'Cancelar' : 'Editar' }}
            </UiButton>
          </div>
        </div>
      </template>

      <UiAlert v-if="!isAdmin" variant="warning" class="mb-6">
        Estes dados são gerenciados pelo RH e não podem ser alterados por você.
      </UiAlert>
      
      <UiAlert v-else variant="info" class="mb-6">
        Como administrador, você pode editar seus próprios dados profissionais.
      </UiAlert>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="!isAdmin || !editandoDadosProfissionais">
          <label class="block text-sm font-medium text-gray-500 mb-1">Cargo</label>
          <p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{{ obterNomeCargo(dadosOriginais?.cargo_id) || user?.cargo || '--' }}</p>
        </div>
        <UiSelect 
          v-else
          v-model="dadosProfissionais.cargo" 
          :options="cargosOptions"
          label="Cargo"
          placeholder="Selecione um cargo..."
        />
        
        <div v-if="!isAdmin || !editandoDadosProfissionais">
          <label class="block text-sm font-medium text-gray-500 mb-1">Departamento</label>
          <p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{{ obterNomeDepartamento(dadosOriginais?.departamento_id) || user?.departamento || '--' }}</p>
        </div>
        <UiSelect 
          v-else
          v-model="dadosProfissionais.departamento" 
          :options="departamentosOptions"
          label="Departamento"
          placeholder="Selecione um departamento..."
        />
        
        <div v-if="!isAdmin || !editandoDadosProfissionais">
          <label class="block text-sm font-medium text-gray-500 mb-1">Data de Admissão</label>
          <p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{{ formatarData(dadosProfissionais.dataAdmissao) }}</p>
        </div>
        <UiInput 
          v-else
          v-model="dadosProfissionais.dataAdmissao" 
          type="date"
          label="Data de Admissão" 
        />
        
        <div v-if="!isAdmin || !editandoDadosProfissionais">
          <label class="block text-sm font-medium text-gray-500 mb-1">Tipo de Contrato</label>
          <p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{{ dadosProfissionais.tipoContrato }}</p>
        </div>
        <UiSelect 
          v-else
          v-model="dadosProfissionais.tipoContrato" 
          :options="tipoContratoOptions"
          label="Tipo de Contrato" 
        />
        
        <div v-if="!isAdmin || !editandoDadosProfissionais">
          <label class="block text-sm font-medium text-gray-500 mb-1">Empresa</label>
          <p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{{ obterNomeEmpresa(dadosOriginais?.empresa_id) || '--' }}</p>
        </div>
        <UiSelect 
          v-else
          v-model="dadosProfissionais.empresa" 
          :options="empresasOptions"
          label="Empresa"
          placeholder="Selecione uma empresa..."
        />
      </div>
      
      <div v-if="isAdmin && editandoDadosProfissionais" class="mt-6 flex justify-end">
        <UiButton @click="salvarDadosProfissionais" :disabled="salvando">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
          </svg>
          {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
        </UiButton>
      </div>
    </UiCard>

    <!-- Dados Financeiros -->
    <UiCard class="mb-6">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="font-semibold text-gray-900">Dados Financeiros</span>
          </div>
          <UiButton variant="ghost" @click="editandoPagamento = !editandoPagamento">
            <svg v-if="editandoPagamento" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            {{ editandoPagamento ? 'Cancelar' : 'Editar' }}
          </UiButton>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Salário Base (Bloqueado) -->
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Salário Base (R$)</label>
          <div 
            class="p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            @click="mostrarSalario = !mostrarSalario"
          >
            <div class="flex items-center justify-between">
              <p class="text-lg font-bold text-green-700">
                {{ mostrarSalario ? formatarMoeda(dadosFinanceiros.salario_base) : '••••••••' }}
              </p>
              <svg 
                class="w-5 h-5 text-gray-400" 
                :class="{ 'text-green-600': mostrarSalario }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  v-if="!mostrarSalario"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            </div>
            <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              {{ mostrarSalario ? 'Clique para ocultar' : 'Clique para revelar' }} • Campo bloqueado para edição
            </p>
          </div>
        </div>
        
        <!-- Forma de Pagamento -->
        <UiSelect 
          v-model="dadosFinanceiros.forma_pagamento" 
          :options="formaPagamentoOptions"
          label="Forma de Pagamento" 
          :disabled="!editandoPagamento" 
        />
        
        <!-- Banco -->
        <UiSelect 
          v-model="dadosFinanceiros.banco" 
          :options="bancosOptions" 
          label="Banco" 
          :disabled="!editandoPagamento" 
        />
        
        <!-- Tipo de Conta -->
        <UiSelect 
          v-model="dadosFinanceiros.tipo_conta" 
          :options="tipoContaOptions" 
          label="Tipo de Conta" 
          :disabled="!editandoPagamento" 
        />
        
        <!-- Agência -->
        <UiInput 
          v-model="dadosFinanceiros.agencia" 
          label="Agência" 
          :disabled="!editandoPagamento" 
        />
        
        <!-- Conta -->
        <UiInput 
          v-model="dadosFinanceiros.conta" 
          label="Conta" 
          :disabled="!editandoPagamento" 
        />
        
        <!-- Chave PIX (sempre visível) -->
        <UiInput 
          v-model="dadosFinanceiros.chave_pix" 
          label="Chave PIX (Opcional)" 
          placeholder="Digite sua chave PIX (CPF, email, telefone ou chave aleatória)"
          :disabled="!editandoPagamento" 
        />
      </div>

      <div v-if="editandoPagamento" class="mt-6 flex justify-end">
        <UiButton @click="salvarDadosFinanceiros" :disabled="salvando">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
          </svg>
          {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
        </UiButton>
      </div>
    </UiCard>

    <!-- Benefícios -->
    <UiCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
          </svg>
          <span class="font-semibold text-gray-900">Benefícios</span>
        </div>
      </template>
      <UiAlert variant="info" class="mb-6">
        Estes benefícios são gerenciados pelo RH e não podem ser alterados por você.
      </UiAlert>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Vale Transporte -->
        <div v-if="beneficiosAtivos.vale_transporte">
          <label class="block text-sm font-medium text-gray-500 mb-1">Vale Transporte</label>
          <div class="p-3 bg-green-50 rounded-xl border border-green-200">
            <p class="text-lg font-semibold text-green-800">
              {{ formatarMoeda(beneficiosAtivos.vale_transporte.valor) }}
            </p>
            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Ativo • Gerenciado pelo RH
            </p>
          </div>
        </div>
        
        <!-- Cesta Básica -->
        <div v-if="beneficiosAtivos.cesta_basica">
          <label class="block text-sm font-medium text-gray-500 mb-1">Cesta Básica</label>
          <div class="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p class="text-lg font-semibold text-blue-800">
              {{ formatarMoeda(beneficiosAtivos.cesta_basica.valor) }}
            </p>
            <p class="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Ativo • Gerenciado pelo RH
            </p>
          </div>
        </div>

        <!-- Plano de Saúde -->
        <div v-if="beneficiosAtivos.plano_saude">
          <label class="block text-sm font-medium text-gray-500 mb-1">Plano de Saúde</label>
          <div class="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <p class="text-lg font-semibold text-purple-800">
              {{ formatarMoeda(beneficiosAtivos.plano_saude.valor_funcionario) }}
            </p>
            <p class="text-xs text-purple-600 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Ativo • Gerenciado pelo RH
            </p>
          </div>
        </div>

        <!-- Plano Odontológico -->
        <div v-if="beneficiosAtivos.plano_odonto">
          <label class="block text-sm font-medium text-gray-500 mb-1">Plano Odontológico</label>
          <div class="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
            <p class="text-lg font-semibold text-indigo-800">
              {{ formatarMoeda(beneficiosAtivos.plano_odonto.valor_funcionario) }}
            </p>
            <p class="text-xs text-indigo-600 mt-1 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Ativo • Gerenciado pelo RH
            </p>
          </div>
        </div>

        <!-- Benefícios Personalizados -->
        <div 
          v-for="beneficio in beneficiosPersonalizadosAtivos" 
          :key="beneficio.nome"
          class="beneficio-personalizado"
        >
          <label class="block text-sm font-medium text-gray-500 mb-1">{{ beneficio.nome }}</label>
          <div class="p-3 bg-orange-50 rounded-xl border border-orange-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
              </svg>
              <p class="text-lg font-semibold text-orange-800">
                {{ formatarMoeda(beneficio.valor) }}
              </p>
            </div>
            <p class="text-xs text-orange-600 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Ativo • Gerenciado pelo RH
            </p>
            <p v-if="beneficio.descricao" class="text-xs text-gray-600 mt-1">{{ beneficio.descricao }}</p>
          </div>
        </div>

        <!-- Mensagem quando não há benefícios -->
        <div v-if="!temBeneficios" class="col-span-full">
          <div class="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p class="text-gray-600 font-medium">Nenhum benefício configurado</p>
            <p class="text-sm text-gray-500 mt-1">Entre em contato com o RH para mais informações</p>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Notificação -->
    <UiNotification 
      :show="mostrarNotificacao"
      :title="notificacao.title"
      :message="notificacao.message"
      :variant="notificacao.variant"
      @close="mostrarNotificacao = false"
    />

    <!-- Seletor de Avatar -->
    <UiAvatarSelector
      :show="mostrarSeletorAvatar"
      :user-name="dadosOriginais?.nome_completo || user?.nome || ''"
      :current-avatar="dadosOriginais?.avatar"
      @close="mostrarSeletorAvatar = false"
      @save="salvarAvatar"
    />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, isAdmin, updateUser } = useAuth()

const editandoDadosPessoais = ref(false)
const editandoDadosProfissionais = ref(false)
const editandoPagamento = ref(false)
const salvando = ref(false)
const carregando = ref(true)
const mostrarNotificacao = ref(false)
const mostrarSeletorAvatar = ref(false)
const mostrarSalario = ref(false)
const notificacao = ref({
  title: '',
  message: '',
  variant: 'success' as 'success' | 'error'
})

const dadosOriginais = ref<any>(null)

const dadosPessoais = ref({
  nome: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  email_pessoal: '',
  pis_pasep: ''
})

const dadosProfissionais = ref({
  cargo: '',
  departamento: '',
  dataAdmissao: '',
  tipoContrato: '',
  empresa: ''
})

const dadosFinanceiros = ref({
  salario_base: '',
  banco: '',
  agencia: '',
  conta: '',
  tipo_conta: '',
  forma_pagamento: 'deposito',
  chave_pix: ''
})

// Controle de campos editados apenas uma vez
const camposEditadosUmaVez = ref({
  sexo: false,
  dataNascimento: false,
  rg: false,
  cpf: false
})

const bancosOptions = [
  { value: '001', label: 'Banco do Brasil' },
  { value: '104', label: 'Caixa Econômica' },
  { value: '237', label: 'Bradesco' },
  { value: '341', label: 'Itaú' },
  { value: '033', label: 'Santander' },
  { value: '260', label: 'Nubank' }
]

const tipoContaOptions = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Conta Poupança' }
]

const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Outro' }
]

const formaPagamentoOptions = [
  { value: 'deposito', label: 'Depósito em Conta' },
  { value: 'dinheiro', label: 'Dinheiro' }
]

const tipoContratoOptions = [
  { value: 'CLT', label: 'CLT' },
  { value: 'PJ', label: 'PJ' },
  { value: 'Estagio', label: 'Estágio' },
  { value: 'Temporario', label: 'Temporário' }
]

// Carregar opções de cargos, departamentos e empresas
const cargosOptions = ref<Array<{ value: string; label: string }>>([])
const departamentosOptions = ref<Array<{ value: string; label: string }>>([])
const empresasOptions = ref<Array<{ value: string; label: string }>>([])

// Mapas para converter ID em nome
const cargosMap = ref<Record<string, string>>({})
const departamentosMap = ref<Record<string, string>>({})
const empresasMap = ref<Record<string, string>>({})

// Função para formatar data
const formatarData = (data: string) => {
  if (!data) return '--'
  // CORREÇÃO: Adicionar T00:00:00 para evitar problemas de timezone
  const date = new Date(data + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}

// Função para formatar data de contratação no formato "Desde Mês/Ano"
const formatarDataContratacao = () => {
  if (!dadosProfissionais.value.dataAdmissao) return 'Desde --/--'
  
  try {
    const data = new Date(dadosProfissionais.value.dataAdmissao + 'T00:00:00') // Adicionar horário para evitar problemas de timezone
    
    // Verificar se a data é válida
    if (isNaN(data.getTime())) {
      return 'Desde --/--'
    }
    
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ]
    
    const mes = meses[data.getMonth()]
    const ano = data.getFullYear()
    
    return `Desde ${mes}/${ano}`
  } catch (error) {
    console.error('Erro ao formatar data de contratação:', error)
    return 'Desde --/--'
  }
}

// Função para formatar moeda
const formatarMoeda = (valor: number | string) => {
  const num = typeof valor === 'string' ? parseFloat(valor) : valor
  if (num === null || num === undefined || isNaN(num)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num)
}

// Funções para obter nomes
const obterNomeCargo = (id: string | number) => {
  const idStr = id?.toString()
  return cargosMap.value[idStr] || idStr || '--'
}

const obterNomeDepartamento = (id: string | number) => {
  const idStr = id?.toString()
  return departamentosMap.value[idStr] || idStr || '--'
}

const obterNomeEmpresa = (id: string | number) => {
  const idStr = id?.toString()
  return empresasMap.value[idStr] || idStr || '--'
}

// Computed para processar benefícios do JSON
const beneficiosAtivos = computed(() => {
  if (!dadosOriginais.value?.beneficios) return {}
  
  let beneficios = {}
  try {
    beneficios = typeof dadosOriginais.value.beneficios === 'string' 
      ? JSON.parse(dadosOriginais.value.beneficios) 
      : dadosOriginais.value.beneficios
  } catch (error) {
    console.error('Erro ao parsear benefícios:', error)
    return {}
  }
  
  const ativos = {}
  
  // Vale Transporte
  if (beneficios.vale_transporte?.ativo && beneficios.vale_transporte?.valor > 0) {
    ativos.vale_transporte = beneficios.vale_transporte
  }
  
  // Cesta Básica
  if (beneficios.cesta_basica?.ativo && beneficios.cesta_basica?.valor > 0) {
    ativos.cesta_basica = beneficios.cesta_basica
  }
  
  // Plano de Saúde
  if (beneficios.plano_saude?.ativo && beneficios.plano_saude?.valor_funcionario > 0) {
    ativos.plano_saude = beneficios.plano_saude
  }
  
  // Plano Odontológico
  if (beneficios.plano_odonto?.ativo && beneficios.plano_odonto?.valor_funcionario > 0) {
    ativos.plano_odonto = beneficios.plano_odonto
  }
  
  return ativos
})

// Computed para benefícios personalizados ativos
const beneficiosPersonalizadosAtivos = computed(() => {
  if (!dadosOriginais.value?.beneficios) return []
  
  let beneficios = {}
  try {
    beneficios = typeof dadosOriginais.value.beneficios === 'string' 
      ? JSON.parse(dadosOriginais.value.beneficios) 
      : dadosOriginais.value.beneficios
  } catch (error) {
    console.error('Erro ao parsear benefícios:', error)
    return []
  }
  
  if (!beneficios.personalizados || !Array.isArray(beneficios.personalizados)) {
    return []
  }
  
  return beneficios.personalizados.filter(b => b.ativo && b.valor > 0)
})

// Computed para verificar se há benefícios
const temBeneficios = computed(() => {
  return Object.keys(beneficiosAtivos.value).length > 0 || beneficiosPersonalizadosAtivos.value.length > 0
})

// Carregar dados do funcionário ao montar
onMounted(async () => {
  await carregarOpcoes()
  await carregarDados()
})

// Carregar opções de cargos, departamentos e empresas
const carregarOpcoes = async () => {
  try {
    // Carregar cargos
    const cargosRes: any = await $fetch('/api/cargos')
    if (cargosRes.success && cargosRes.data) {
      cargosOptions.value = cargosRes.data.map((c: any) => ({
        value: c.id.toString(),
        label: c.nome
      }))
      cargosRes.data.forEach((c: any) => {
        cargosMap.value[c.id.toString()] = c.nome
      })
    }

    // Carregar departamentos
    const deptosRes: any = await $fetch('/api/departamentos')
    if (deptosRes.success && deptosRes.data) {
      departamentosOptions.value = deptosRes.data.map((d: any) => ({
        value: d.id.toString(),
        label: d.nome
      }))
      deptosRes.data.forEach((d: any) => {
        departamentosMap.value[d.id.toString()] = d.nome
      })
    }

    // Carregar empresas
    const empresasRes: any = await $fetch('/api/empresas')
    if (empresasRes.success && empresasRes.data) {
      empresasOptions.value = empresasRes.data.map((e: any) => ({
        value: e.id.toString(),
        label: e.nome_fantasia || e.nome
      }))
      empresasRes.data.forEach((e: any) => {
        empresasMap.value[e.id.toString()] = e.nome_fantasia || e.nome
      })
    }
  } catch (error) {
    console.error('Erro ao carregar opções:', error)
  }
}

// Função para converter valores antigos de sexo para o formato atual
const converterSexoParaFormato = (sexo: string) => {
  if (!sexo) return ''
  
  // Se já está no formato correto (M, F, O), retorna como está
  if (['M', 'F', 'O'].includes(sexo)) {
    return sexo
  }
  
  // Converter valores antigos
  const sexoLower = sexo.toLowerCase()
  if (sexoLower === 'masculino' || sexoLower === 'm') return 'M'
  if (sexoLower === 'feminino' || sexoLower === 'f') return 'F'
  if (sexoLower === 'outro' || sexoLower === 'o' || sexoLower === 'nao_informar') return 'O'
  
  return ''
}

// Função para carregar dados do banco
const carregarDados = async () => {
  if (!user.value?.id) {
    mostrarMensagem('Erro!', 'Usuário não autenticado', 'error')
    return
  }

  carregando.value = true
  try {
    const response: any = await $fetch(`/api/funcionarios/meus-dados?userId=${user.value.id}`)
    
    if (response.success && response.data) {
      dadosOriginais.value = response.data
      
      // Preencher dados pessoais
      dadosPessoais.value = {
        nome: response.data.nome_completo || '',
        cpf: response.data.cpf || '',
        rg: response.data.rg || '',
        dataNascimento: response.data.data_nascimento || '',
        sexo: converterSexoParaFormato(response.data.sexo) || '',
        telefone: response.data.telefone || '',
        email_pessoal: response.data.email_pessoal || '',
        pis_pasep: response.data.pis_pasep || ''
      }
      
      // Preencher dados profissionais
      dadosProfissionais.value = {
        cargo: response.data.cargo_id?.toString() || '',
        departamento: response.data.departamento_id?.toString() || '',
        dataAdmissao: response.data.data_admissao || '',
        tipoContrato: response.data.tipo_contrato || 'CLT',
        empresa: response.data.empresa_id?.toString() || ''
      }
      
      // Preencher dados financeiros
      dadosFinanceiros.value = {
        salario_base: response.data.salario_base || 0,
        banco: response.data.banco || '',
        agencia: response.data.agencia || '',
        conta: response.data.conta || '',
        tipo_conta: response.data.tipo_conta || 'corrente',
        forma_pagamento: response.data.forma_pagamento || 'deposito',
        chave_pix: response.data.chave_pix || ''
      }
      
      // Debug: verificar se o salário está sendo carregado
      console.log('🔍 Salário carregado:', response.data.salario_base)
      console.log('🔍 Dados financeiros:', dadosFinanceiros.value)
      
      // Debug: verificar se o salário está sendo carregado
      console.log('🔍 Salário carregado:', response.data.salario_base)
      console.log('🔍 Dados financeiros preenchidos:', dadosFinanceiros.value)
      
      // Verificar campos já editados uma vez
      camposEditadosUmaVez.value = {
        sexo: !!response.data.sexo,
        dataNascimento: !!response.data.data_nascimento,
        rg: !!response.data.rg,
        cpf: !!response.data.cpf
      }
    }
  } catch (error: any) {
    console.error('Erro ao carregar dados:', error)
    mostrarMensagem('Erro!', 'Não foi possível carregar seus dados', 'error')
  } finally {
    carregando.value = false
  }
}

// Função para salvar dados pessoais
const salvarDadosPessoais = async () => {
  if (!user.value?.id) {
    mostrarMensagem('Erro!', 'Usuário não autenticado', 'error')
    return
  }

  salvando.value = true
  try {
    const dadosParaEnviar: any = {
      userId: user.value.id,
      telefone: dadosPessoais.value.telefone,
      email_pessoal: dadosPessoais.value.email_pessoal,
      pis_pasep: dadosPessoais.value.pis_pasep
    }

    // Campos que podem ser editados apenas uma vez (ou pelo admin)
    if (!camposEditadosUmaVez.value.dataNascimento || isAdmin.value) {
      dadosParaEnviar.data_nascimento = dadosPessoais.value.dataNascimento
    }
    
    if (!camposEditadosUmaVez.value.sexo || isAdmin.value) {
      dadosParaEnviar.sexo = dadosPessoais.value.sexo
    }
    
    if (!camposEditadosUmaVez.value.rg || isAdmin.value) {
      dadosParaEnviar.rg = dadosPessoais.value.rg
    }

    // Se for admin, pode alterar nome e CPF
    if (isAdmin.value) {
      dadosParaEnviar.nome_completo = dadosPessoais.value.nome
      dadosParaEnviar.cpf = dadosPessoais.value.cpf
    } else if (!camposEditadosUmaVez.value.cpf) {
      // Funcionário pode editar CPF apenas uma vez
      dadosParaEnviar.cpf = dadosPessoais.value.cpf
    }

    const response: any = await $fetch('/api/funcionarios/meus-dados', {
      method: 'PATCH',
      body: dadosParaEnviar
    })
    
    if (response.success) {
      // Atualizar estado local com os dados retornados pela API
      if (response.data) {
        dadosPessoais.value.telefone = response.data.telefone || dadosPessoais.value.telefone
        dadosPessoais.value.email_pessoal = response.data.email_pessoal || dadosPessoais.value.email_pessoal
        dadosPessoais.value.dataNascimento = response.data.data_nascimento || dadosPessoais.value.dataNascimento
        
        // Se for admin e o nome foi atualizado
        if (isAdmin.value && response.data.nome_completo) {
          dadosPessoais.value.nome = response.data.nome_completo
          // Atualizar também o user no composable para refletir no cabeçalho
          updateUser({ nome: response.data.nome_completo })
        }

        // Se for admin e o CPF foi atualizado
        if (isAdmin.value && response.data.cpf) {
          dadosPessoais.value.cpf = response.data.cpf
        }
        
        // Atualizar também os dados originais
        if (dadosOriginais.value) {
          dadosOriginais.value.telefone = response.data.telefone || dadosOriginais.value.telefone
          dadosOriginais.value.email_pessoal = response.data.email_pessoal || dadosOriginais.value.email_pessoal
          dadosOriginais.value.data_nascimento = response.data.data_nascimento || dadosOriginais.value.data_nascimento
          
          // Se for admin e o nome foi atualizado
          if (isAdmin.value && response.data.nome_completo) {
            dadosOriginais.value.nome_completo = response.data.nome_completo
          }

          // Se for admin e o CPF foi atualizado
          if (isAdmin.value && response.data.cpf) {
            dadosOriginais.value.cpf = response.data.cpf
          }
        }
      }
      
      mostrarMensagem('Sucesso!', 'Dados pessoais atualizados com sucesso!', 'success')
      editandoDadosPessoais.value = false
      // Não recarregar tudo, apenas atualizar o estado local
    }
  } catch (error: any) {
    console.error('Erro ao salvar dados pessoais:', error)
    mostrarMensagem('Erro!', error.data?.message || 'Não foi possível salvar os dados', 'error')
  } finally {
    salvando.value = false
  }
}

// Função para salvar dados profissionais (apenas admin)
const salvarDadosProfissionais = async () => {
  if (!user.value?.id) {
    mostrarMensagem('Erro!', 'Usuário não autenticado', 'error')
    return
  }

  if (!isAdmin.value) {
    mostrarMensagem('Erro!', 'Apenas administradores podem editar dados profissionais', 'error')
    return
  }

  salvando.value = true
  try {
    const response: any = await $fetch('/api/funcionarios/meus-dados', {
      method: 'PATCH',
      body: {
        userId: user.value.id,
        cargo_id: dadosProfissionais.value.cargo,
        departamento_id: dadosProfissionais.value.departamento,
        data_admissao: dadosProfissionais.value.dataAdmissao,
        tipo_contrato: dadosProfissionais.value.tipoContrato,
        empresa_id: dadosProfissionais.value.empresa
      }
    })
    
    if (response.success) {
      mostrarMensagem('Sucesso!', 'Dados profissionais atualizados com sucesso!', 'success')
      editandoDadosProfissionais.value = false
      await carregarDados() // Recarregar dados
    }
  } catch (error: any) {
    console.error('Erro ao salvar dados profissionais:', error)
    mostrarMensagem('Erro!', error.data?.message || 'Não foi possível salvar os dados', 'error')
  } finally {
    salvando.value = false
  }
}

// Função para salvar dados financeiros
const salvarDadosFinanceiros = async () => {
  if (!user.value?.id) {
    mostrarMensagem('Erro!', 'Usuário não autenticado', 'error')
    return
  }

  salvando.value = true
  try {
    const response: any = await $fetch('/api/funcionarios/meus-dados', {
      method: 'PATCH',
      body: {
        userId: user.value.id,
        banco: dadosFinanceiros.value.banco,
        agencia: dadosFinanceiros.value.agencia,
        conta: dadosFinanceiros.value.conta,
        tipo_conta: dadosFinanceiros.value.tipo_conta,
        forma_pagamento: dadosFinanceiros.value.forma_pagamento,
        chave_pix: dadosFinanceiros.value.chave_pix
      }
    })
    
    if (response.success) {
      mostrarMensagem('Sucesso!', 'Dados financeiros atualizados com sucesso!', 'success')
      editandoPagamento.value = false
      await carregarDados() // Recarregar dados
    }
  } catch (error: any) {
    console.error('Erro ao salvar dados financeiros:', error)
    mostrarMensagem('Erro!', error.data?.message || 'Não foi possível salvar os dados', 'error')
  } finally {
    salvando.value = false
  }
}

// Função auxiliar para mostrar mensagens
const mostrarMensagem = (title: string, message: string, variant: 'success' | 'error') => {
  notificacao.value = { title, message, variant }
  mostrarNotificacao.value = true
  
  setTimeout(() => {
    mostrarNotificacao.value = false
  }, 5000)
}

// Função para salvar avatar
const salvarAvatar = async (avatarId: string) => {
  if (!user.value?.id) {
    mostrarMensagem('Erro!', 'Usuário não autenticado', 'error')
    return
  }

  try {
    const response: any = await $fetch('/api/funcionarios/meus-dados', {
      method: 'PATCH',
      body: {
        userId: user.value.id,
        avatar: avatarId
      }
    })
    
    if (response.success) {
      // Atualizar dados locais
      if (dadosOriginais.value) {
        dadosOriginais.value.avatar = avatarId
      }
      
      mostrarMensagem('Sucesso!', 'Avatar atualizado com sucesso!', 'success')
      mostrarSeletorAvatar.value = false
    }
  } catch (error: any) {
    console.error('Erro ao salvar avatar:', error)
    mostrarMensagem('Erro!', error.data?.message || 'Não foi possível salvar o avatar', 'error')
  }
}
</script>
