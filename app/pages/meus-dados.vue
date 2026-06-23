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

    <!-- Minhas Férias (para funcionários) -->
    <UiCard v-if="!isAdmin" class="mb-6">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="font-semibold text-gray-900">Minhas Férias</span>
          </div>
          <UiButton 
            size="sm" 
            variant="primary" 
            @click="abrirFeriasModal"
            class="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Solicitar Férias
          </UiButton>
        </div>
      </template>

      <!-- Loading Férias -->
      <div v-if="carregandoFerias" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>

      <!-- Lista de Férias -->
      <div v-else-if="minhasFerias.length > 0" class="space-y-4">
        <div 
          v-for="ferias in minhasFerias" 
          :key="ferias.id"
          class="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-sm transition-all"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
            <div>
              <p class="font-semibold text-gray-800 text-sm">
                📅 {{ formatarData(ferias.data_inicio) }} a {{ formatarData(ferias.data_fim) }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">
                Duração: {{ ferias.dias_corridos }} dias corridos
              </p>
            </div>
            <div>
              <span 
                :class="statusBadgeClass(ferias.status)" 
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {{ statusLabel(ferias.status) }}
              </span>
            </div>
          </div>

          <!-- Valores e Pagamento (Apenas se APROVADO/PROGRAMADO/EM GOZO/CONCLUIDO) -->
          <div v-if="ferias.status !== 'pendente'" class="mt-3">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div>
                <p class="text-gray-400 font-medium">Remuneração</p>
                <p class="font-semibold text-gray-800">{{ formatarMoeda(ferias.valor_remuneracao) }}</p>
              </div>
              <div>
                <p class="text-gray-400 font-medium">1/3 Constitucional</p>
                <p class="font-semibold text-gray-800">{{ formatarMoeda(ferias.valor_um_terco) }}</p>
              </div>
              <div v-if="ferias.abono_pecuniario">
                <p class="text-amber-600 font-medium">Abono Pecuniário</p>
                <p class="font-semibold text-amber-700">{{ formatarMoeda(ferias.valor_abono_pecuniario) }}</p>
              </div>
              <div>
                <p class="text-gray-400 font-medium">Descontos</p>
                <p class="font-semibold text-red-600">- {{ formatarMoeda((ferias.inss || 0) + (ferias.irrf || 0) + (ferias.pensao_alimenticia || 0)) }}</p>
              </div>
              <div class="bg-emerald-50 rounded-lg py-1 px-2 col-span-2 sm:col-span-1">
                <p class="text-emerald-600 font-medium">Líquido a Receber</p>
                <p class="font-bold text-emerald-700">{{ formatarMoeda(ferias.valor_liquido) }}</p>
              </div>
            </div>

            <div class="mt-3 pt-2 border-t border-gray-200/60 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span v-if="ferias.pensao_alimenticia > 0" class="text-red-600">
                💸 Pensão Alimentícia: <strong>{{ formatarMoeda(ferias.pensao_alimenticia) }}</strong>
              </span>
              <span v-if="ferias.data_pagamento">
                💳 Pagamento previsto: <strong>{{ formatarData(ferias.data_pagamento) }}</strong>
              </span>
              <span v-if="ferias.holerite_id">
                📄 <a :href="`/api/holerites/${ferias.holerite_id}/pdf`" target="_blank" class="text-blue-600 hover:underline">Ver Recibo de Férias</a>
              </span>
            </div>
          </div>

          <!-- Mensagem de pendente -->
          <div v-else class="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700 flex items-start gap-2">
            <svg class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-semibold">Solicitação pendente de aprovação</p>
              <p class="mt-0.5 text-amber-600">Os valores financeiros e a data de pagamento serão disponibilizados assim que o RH aprovar este período.</p>
            </div>
          </div>
          
          <div v-if="ferias.observacoes" class="mt-2 text-xs text-gray-500 italic">
            Obs: {{ ferias.observacoes }}
          </div>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-else class="text-center py-8 text-gray-500 text-sm">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="font-medium">Nenhum período de férias agendado ou solicitado.</p>
        <p class="text-xs text-gray-400 mt-1">Deseja programar suas férias? Clique em "Solicitar Férias" acima.</p>
      </div>
    </UiCard>

    <!-- Meus Documentos (apenas funcionários) -->
    <MeusDocumentos v-if="!isAdmin" />

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

    <!-- Modal de Solicitação de Férias (Funcionário) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFeriasModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="fecharFeriasModal"></div>
          
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900">Solicitar Férias</h3>
              </div>
              <button @click="fecharFeriasModal" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
              <UiAlert variant="info" class="text-xs">
                As datas solicitadas serão enviadas para análise e aprovação do RH.
              </UiAlert>

              <!-- Período Aquisitivo -->
              <div class="bg-gray-50 rounded-xl p-3 text-xs border border-gray-200">
                <p class="font-semibold text-gray-500 uppercase tracking-wider mb-2">Período Aquisitivo Estimado</p>
                <div class="grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <label class="block font-medium text-gray-600 mb-0.5">Início</label>
                    <input 
                      type="date" 
                      v-model="feriasForm.periodo_aquisitivo_inicio" 
                      class="w-full rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block font-medium text-gray-600 mb-0.5">Fim</label>
                    <input 
                      type="date" 
                      v-model="feriasForm.periodo_aquisitivo_fim" 
                      class="w-full rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Datas de Gozo -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Data de Início *</label>
                  <input 
                    type="date" 
                    v-model="feriasForm.data_inicio" 
                    class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Data de Fim *</label>
                  <input 
                    type="date" 
                    v-model="feriasForm.data_fim" 
                    class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <!-- Abono Pecuniário -->
              <div class="bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                <div class="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="abono_pecuniario_emp" 
                    v-model="feriasForm.abono_pecuniario"
                    class="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <label for="abono_pecuniario_emp" class="text-xs font-semibold text-amber-800 cursor-pointer">
                      Abono Pecuniário (Venda de Férias)
                    </label>
                    <p class="text-[11px] text-amber-600 mt-0.5">Deseja converter até 10 dias de suas férias em abono?</p>
                  </div>
                </div>
                <div v-if="feriasForm.abono_pecuniario" class="mt-2 pl-6">
                  <label class="block text-[11px] font-semibold text-amber-800 mb-0.5">Dias de abono (máx. 10)</label>
                  <input 
                    type="number" 
                    v-model.number="feriasForm.dias_abono"
                    min="1" 
                    max="10"
                    class="w-20 rounded-lg border border-amber-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <!-- Observações -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Observações</label>
                <textarea 
                  v-model="feriasForm.observacoes" 
                  rows="2"
                  placeholder="Justificativa ou comentários adicionais..."
                  class="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Footer -->
            <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
              <button 
                @click="fecharFeriasModal"
                class="px-4 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button 
                @click="solicitarFerias"
                :disabled="salvandoFerias || !feriasFormValido"
                class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <div v-if="salvandoFerias" class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                {{ salvandoFerias ? 'Enviar Solicitação' : 'Enviar Solicitação' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import MeusDocumentos from '~/components/funcionarios/MeusDocumentos.vue'

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
  if (!isAdmin.value) {
    await carregarMinhasFerias()
  }
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

// ─── Gestão de Férias (Funcionário) ──────────────────────────────────────────
const minhasFerias = ref<any[]>([])
const carregandoFerias = ref(false)
const showFeriasModal = ref(false)
const salvandoFerias = ref(false)

const feriasForm = reactive({
  periodo_aquisitivo_inicio: '',
  periodo_aquisitivo_fim: '',
  data_inicio: '',
  data_fim: '',
  abono_pecuniario: false,
  dias_abono: 10,
  observacoes: ''
})

watch(
  [() => feriasForm.data_inicio, () => feriasForm.abono_pecuniario, () => feriasForm.dias_abono],
  ([dataInicio, abono, diasAbono]) => {
    if (!dataInicio) return
    try {
      const data = new Date(dataInicio + 'T00:00:00')
      if (isNaN(data.getTime())) return
      const diasVenda = abono ? (Number(diasAbono) || 0) : 0
      const diasGozo = 30 - diasVenda
      data.setDate(data.getDate() + diasGozo - 1)
      feriasForm.data_fim = data.toISOString().split('T')[0]
    } catch (e) {
      console.error('Erro ao calcular data de fim das férias:', e)
    }
  }
)

const feriasFormValido = computed(() => {
  return feriasForm.data_inicio && feriasForm.data_fim &&
         feriasForm.periodo_aquisitivo_inicio && feriasForm.periodo_aquisitivo_fim
})

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pendente: '⏳ Aguardando Aprovação',
    programado: '📅 Programada',
    em_gozo: '🌴 Em Gozo',
    concluido: '✅ Concluída',
    cancelado: '❌ Cancelada',
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

const carregarMinhasFerias = async () => {
  if (!user.value?.id) return
  carregandoFerias.value = true
  try {
    const res: any = await $fetch(`/api/ferias?funcionario_id=${user.value.id}`)
    minhasFerias.value = res.data || []
  } catch (err) {
    console.error('Erro ao carregar férias:', err)
  } finally {
    carregandoFerias.value = false
  }
}

const abrirFeriasModal = () => {
  Object.assign(feriasForm, {
    periodo_aquisitivo_inicio: '',
    periodo_aquisitivo_fim: '',
    data_inicio: '',
    data_fim: '',
    abono_pecuniario: false,
    dias_abono: 10,
    observacoes: ''
  })

  // Sugerir período aquisitivo baseado na data de admissão e férias existentes
  if (dadosOriginais.value?.data_admissao) {
    try {
      const admissao = new Date(dadosOriginais.value.data_admissao + 'T00:00:00')
      const feriasDoFunc = minhasFerias.value || []
      const periodoNum = feriasDoFunc.length + 1
      const inicioPeriodo = new Date(admissao)
      inicioPeriodo.setFullYear(inicioPeriodo.getFullYear() + periodoNum - 1)
      const fimPeriodo = new Date(inicioPeriodo)
      fimPeriodo.setFullYear(fimPeriodo.getFullYear() + 1)
      fimPeriodo.setDate(fimPeriodo.getDate() - 1)

      feriasForm.periodo_aquisitivo_inicio = inicioPeriodo.toISOString().split('T')[0]
      feriasForm.periodo_aquisitivo_fim = fimPeriodo.toISOString().split('T')[0]
    } catch (e) {
      console.error('Erro ao calcular período aquisitivo sugerido:', e)
    }
  }

  showFeriasModal.value = true
}

const fecharFeriasModal = () => {
  showFeriasModal.value = false
}

const solicitarFerias = async () => {
  if (!feriasFormValido.value || !user.value?.id) return
  salvandoFerias.value = true
  try {
    const payload = {
      ...feriasForm,
      funcionario_id: user.value.id,
      status: 'pendente'
    }
    await $fetch('/api/ferias', {
      method: 'POST',
      body: payload
    })
    mostrarMensagem('Sucesso!', 'Solicitação de férias enviada ao RH!', 'success')
    fecharFeriasModal()
    await carregarMinhasFerias()
  } catch (error: any) {
    console.error('Erro ao solicitar férias:', error)
    mostrarMensagem('Erro!', error.data?.message || 'Erro ao enviar solicitação', 'error')
  } finally {
    salvandoFerias.value = false
  }
}
</script>
