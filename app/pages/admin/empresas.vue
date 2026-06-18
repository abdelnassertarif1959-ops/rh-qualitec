<template>
  <div>
    <UiPageHeader title="Empresas" description="Gerencie todas as empresas do sistema">
      <div class="flex gap-3">
        <UiButton variant="ghost" @click="modalTabelasAberto = true">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          Ver Tabelas INSS/IRRF
        </UiButton>
        <UiButton size="lg" @click="abrirModal()">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nova Empresa
        </UiButton>
      </div>
    </UiPageHeader>

    <!-- Lista de Empresas -->
    <div class="space-y-4">
      <UiCard v-for="empresa in empresas" :key="empresa.id" padding="p-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <img v-if="empresa.logo_url" :src="empresa.logo_url" :alt="empresa.nome || 'Logo'" class="w-full h-full object-cover rounded-xl" />
              <span v-else class="text-primary-700 font-bold text-2xl">{{ empresa.nome ? empresa.nome.charAt(0) : '?' }}</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ empresa.nome || 'Nome não informado' }}</h3>
              <p v-if="empresa.nome_fantasia" class="text-lg text-gray-600">{{ empresa.nome_fantasia }}</p>
              <p class="text-gray-500">CNPJ: {{ empresa.cnpj || 'Não informado' }}</p>
              <p v-if="empresa.inscricao_estadual" class="text-sm text-gray-400">IE: {{ empresa.inscricao_estadual }}</p>
              <p class="text-sm text-gray-400">{{ empresa.endereco_completo || formatarEnderecoCompleto(empresa) }}</p>
              <div class="flex gap-2 mt-2">
                <UiBadge variant="info">{{ empresa.funcionarios_count || 0 }} funcionários</UiBadge>
                <UiBadge v-if="empresa.situacao_cadastral" :variant="empresa.situacao_cadastral === 'ATIVA' ? 'success' : 'warning'">
                  {{ empresa.situacao_cadastral }}
                </UiBadge>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <UiButton variant="ghost" @click.stop="abrirModal(empresa)">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </UiButton>
            <UiButton variant="ghost" @click.stop="verFuncionarios(empresa)">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Funcionários
            </UiButton>
            <UiButton 
              variant="danger"
              @click.stop="deletar(empresa)"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Excluir
            </UiButton>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Modal de Cadastro/Edição -->
    <UiModal 
      v-model="modalAberto" 
      :title="empresaEditando ? 'Editar Empresa' : 'Nova Empresa'"
      max-width="max-w-4xl"
    >
      <form @submit.prevent="salvarEmpresaForm" class="space-y-6">
        <!-- Dados da Empresa -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <h3 class="text-lg font-bold text-gray-800">Dados da Empresa</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- CNPJ -->
            <div class="md:col-span-2">
              <UiInputCNPJ 
                v-model="form.cnpj" 
                label="CNPJ" 
                required 
                @dados-encontrados="preencherDadosEmpresa"
              />
            </div>
            
            <!-- Nome Empresarial e Nome Fantasia -->
            <UiInput v-model="form.nome" label="Nome Empresarial (Razão Social)" required />
            <UiInput v-model="form.nome_fantasia" label="Nome Fantasia" />
            
            <!-- Inscrição Estadual e Situação -->
            <UiInput v-model="form.inscricao_estadual" label="Inscrição Estadual" />
            <UiInput v-model="form.situacao_cadastral" label="Situação Cadastral" disabled />
            
            <!-- Endereço detalhado -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-2 mb-3 mt-4">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <h4 class="text-md font-semibold text-gray-700">Endereço</h4>
              </div>
            </div>
            
            <UiInput v-model="form.logradouro" label="Logradouro" placeholder="Rua, Avenida, etc." />
            <UiInput v-model="form.numero" label="Número" placeholder="123" />
            <UiInput v-model="form.complemento" label="Complemento" placeholder="Sala, Andar, etc." />
            <UiInput v-model="form.bairro" label="Bairro" />
            <UiInput v-model="form.municipio" label="Município" />
            <UiSelect v-model="form.uf" :options="ufOptions" label="UF" placeholder="Selecione..." />
            <UiInput v-model="form.cep" label="CEP" placeholder="00000-000" />
            
            <!-- Contatos -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-2 mb-3 mt-4">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <h4 class="text-md font-semibold text-gray-700">Contatos</h4>
              </div>
            </div>
            
            <UiInput v-model="form.telefone" label="Telefone" placeholder="(11) 3333-4444" />
            <UiInput v-model="form.email_holerites" type="email" label="Email para Holerites" placeholder="rh@empresa.com" />
            
            <!-- Logo -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-2 mb-3 mt-4">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <h4 class="text-md font-semibold text-gray-700">Logo da Empresa</h4>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                  <img v-if="form.logo_url" :src="form.logo_url" :alt="form.nome" class="w-full h-full object-cover rounded-xl" />
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <UiInput v-model="form.logo_url" label="URL da Logo" placeholder="https://exemplo.com/logo.png" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações de Holerites -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="text-lg font-bold text-gray-800">Configurações de Holerites</h3>
          </div>
          <div class="space-y-4">
            <UiCheckbox v-model="form.mostrar_logo" label="Mostrar logo nos holerites" />
            <UiCheckbox v-model="form.mostrar_endereco" label="Mostrar endereço nos holerites" />
            <UiCheckbox v-model="form.mostrar_cnpj" label="Mostrar CNPJ nos holerites" />
            <UiCheckbox v-model="form.mostrar_detalhes_inss" label="Mostrar detalhamento do cálculo de INSS" />
            <UiCheckbox v-model="form.mostrar_detalhes_irrf" label="Mostrar detalhamento do cálculo de IRRF" />
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UiButton variant="secondary" @click="modalAberto = false">Cancelar</UiButton>
          <UiButton type="submit">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            Salvar Empresa
          </UiButton>
        </div>
      </form>
    </UiModal>

    <!-- Modal de Tabelas INSS/IRRF -->
    <UiModal 
      v-model="modalTabelasAberto" 
      max-width="max-w-4xl"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <span class="text-xl font-bold">Tabelas de INSS e IRRF (2026)</span>
        </div>
      </template>
      <div class="space-y-6">
        <UiAlert variant="info">
          As tabelas de INSS e IRRF são atualizadas anualmente pelo governo. 
          O sistema permite atualização fácil sem necessidade de alteração no código.
        </UiAlert>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Tabela INSS -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">INSS - Tabela Progressiva</h3>
            <div class="border rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold text-gray-600">Faixa Salarial</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-600">Alíquota</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr v-for="faixa in tabelaINSS" :key="faixa.id">
                    <td class="px-4 py-3">{{ faixa.faixa }}</td>
                    <td class="px-4 py-3 text-right font-semibold">{{ faixa.aliquota }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tabela IRRF -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">IRRF - Tabela Progressiva</h3>
            <div class="border rounded-xl overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold text-gray-600">Base de Cálculo</th>
                    <th class="px-4 py-3 text-right font-semibold text-gray-600">Alíquota</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr v-for="faixa in tabelaIRRF" :key="faixa.id">
                    <td class="px-4 py-3">{{ faixa.faixa }}</td>
                    <td class="px-4 py-3 text-right font-semibold">{{ faixa.aliquota }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="flex justify-between pt-4 border-t">
          <UiBadge variant="success" class="flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Tabelas Atualizadas para 2026
          </UiBadge>
          <UiButton variant="ghost" @click="modalTabelasAberto = false">Fechar</UiButton>
        </div>
      </div>
    </UiModal>

    <!-- Notificação -->
    <UiNotification 
      :show="mostrarNotificacao"
      :title="notificacao.title"
      :message="notificacao.message"
      :variant="notificacao.variant"
      @close="mostrarNotificacao = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useEmpresas } from '~/composables/useEmpresas'

definePageMeta({ middleware: ['auth', 'admin'] })

const { empresas, loading, carregarEmpresas, salvarEmpresa, deletarEmpresa } = useEmpresas()

const modalAberto = ref(false)
const modalTabelasAberto = ref(false)
const empresaEditando = ref<any>(null)
const mostrarNotificacao = ref(false)
const notificacao = ref({
  title: '',
  message: '',
  variant: 'success' as 'success' | 'error' | 'warning' | 'info'
})

const form = ref({
  // Dados principais
  nome: '',
  nome_fantasia: '',
  cnpj: '',
  inscricao_estadual: '',
  
  // Endereço detalhado
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  municipio: '',
  uf: '',
  cep: '',
  
  // Contatos
  telefone: '',
  email_holerites: '',
  
  // Informações cadastrais
  situacao_cadastral: '',
  atividade_principal: '',
  natureza_juridica: '',
  porte: '',
  capital_social: '',
  data_abertura: '',
  
  // Sistema
  logo_url: '',
  mostrar_logo: true,
  mostrar_endereco: true,
  mostrar_cnpj: true,
  mostrar_detalhes_inss: false,
  mostrar_detalhes_irrf: false
})

// Tabelas INSS e IRRF
const tabelaINSS = [
  { id: 1, faixa: 'Até R$ 1.518,00', aliquota: 7.5 },
  { id: 2, faixa: 'R$ 1.518,01 a R$ 2.793,88', aliquota: 9 },
  { id: 3, faixa: 'R$ 2.793,89 a R$ 4.190,83', aliquota: 12 },
  { id: 4, faixa: 'R$ 4.190,84 a R$ 8.157,41', aliquota: 14 },
]

const tabelaIRRF = [
  { id: 1, faixa: 'Até R$ 2.428,80', aliquota: 'Isento' },
  { id: 2, faixa: 'R$ 2.428,81 a R$ 3.051,00', aliquota: '7,5%' },
  { id: 3, faixa: 'R$ 3.051,01 a R$ 4.052,00', aliquota: '15%' },
  { id: 4, faixa: 'R$ 4.052,01 a R$ 5.050,00', aliquota: '22,5%' },
  { id: 5, faixa: 'Acima de R$ 5.050,00', aliquota: '27,5%' },
  { id: 6, faixa: 'Lei 15.270/2025', aliquota: 'Redução até R$ 7.350' },
]

// Carregar empresas ao montar o componente
onMounted(() => {
  carregarEmpresas()
})

// Opções de UF
const ufOptions = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

const abrirModal = (empresa?: any) => {
  try {
    if (empresa) {
      empresaEditando.value = empresa
      Object.assign(form.value, empresa)
    } else {
      empresaEditando.value = null
      form.value = {
        // Dados principais
        nome: '', nome_fantasia: '', cnpj: '', inscricao_estadual: '',
        // Endereço
        logradouro: '', numero: '', complemento: '', bairro: '', municipio: '', uf: '', cep: '',
        // Contatos
        telefone: '', email_holerites: '',
        // Informações cadastrais
        situacao_cadastral: '', atividade_principal: '', natureza_juridica: '', porte: '', capital_social: '', data_abertura: '',
        // Sistema
        logo_url: '', mostrar_logo: true, mostrar_endereco: true, mostrar_cnpj: true, mostrar_detalhes_inss: false, mostrar_detalhes_irrf: false
      }
    }
    modalAberto.value = true
  } catch (error) {
    console.error('Erro ao abrir modal:', error)
    notificacao.value = {
      title: 'Erro!',
      message: 'Erro ao abrir formulário de empresa',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  }
}

const salvarEmpresaForm = async () => {
  const dadosEmpresa = empresaEditando.value ? { ...form.value, id: empresaEditando.value.id } : form.value
  const resultado = await salvarEmpresa(dadosEmpresa)
  
  notificacao.value = {
    title: resultado.success ? 'Sucesso!' : 'Erro!',
    message: resultado.message,
    variant: resultado.success ? 'success' : 'error'
  }
  mostrarNotificacao.value = true
  
  if (resultado.success) {
    modalAberto.value = false
  }
}

const deletar = async (empresa: any) => {
  if (!confirm(`Tem certeza que deseja excluir a empresa "${empresa.nome}"? Esta ação não pode ser desfeita.`)) {
    return
  }

  const resultado = await deletarEmpresa(empresa.id)
  
  notificacao.value = {
    title: resultado.success ? 'Sucesso!' : 'Erro!',
    message: resultado.message,
    variant: resultado.success ? 'success' : 'error'
  }
  mostrarNotificacao.value = true
}

const verFuncionarios = (empresa: any) => {
  try {
    if (!empresa || !empresa.id) {
      console.error('Empresa inválida:', empresa)
      notificacao.value = {
        title: 'Erro!',
        message: 'Empresa inválida',
        variant: 'error'
      }
      mostrarNotificacao.value = true
      return
    }
    navigateTo(`/admin/funcionarios?empresa=${empresa.id}`)
  } catch (error) {
    console.error('Erro ao navegar para funcionários:', error)
    notificacao.value = {
      title: 'Erro!',
      message: 'Erro ao abrir lista de funcionários',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  }
}

const formatarEnderecoCompleto = (empresa: any) => {
  if (!empresa) return 'Endereço não informado'
  
  const partes = []
  
  if (empresa.logradouro) partes.push(empresa.logradouro)
  if (empresa.numero) partes.push(empresa.numero)
  if (empresa.complemento) partes.push(empresa.complemento)
  if (empresa.bairro) partes.push(empresa.bairro)
  if (empresa.municipio) partes.push(empresa.municipio)
  if (empresa.uf) partes.push(empresa.uf)
  if (empresa.cep) partes.push(`CEP: ${empresa.cep}`)
  
  return partes.length > 0 ? partes.join(', ') : (empresa.endereco || 'Endereço não informado')
}

const preencherDadosEmpresa = (dados: any) => {
  // Preencher automaticamente os campos com os dados da consulta
  
  // Dados principais
  if (dados.nome && !form.value.nome) {
    form.value.nome = dados.nome
  }
  
  if (dados.nome_fantasia && !form.value.nome_fantasia) {
    form.value.nome_fantasia = dados.nome_fantasia
  }
  
  if (dados.inscricao_estadual && !form.value.inscricao_estadual) {
    form.value.inscricao_estadual = dados.inscricao_estadual
  }
  
  // Endereço detalhado
  if (dados.logradouro && !form.value.logradouro) {
    form.value.logradouro = dados.logradouro
  }
  
  if (dados.numero && !form.value.numero) {
    form.value.numero = dados.numero
  }
  
  if (dados.complemento && !form.value.complemento) {
    form.value.complemento = dados.complemento
  }
  
  if (dados.bairro && !form.value.bairro) {
    form.value.bairro = dados.bairro
  }
  
  if (dados.municipio && !form.value.municipio) {
    form.value.municipio = dados.municipio
  }
  
  if (dados.uf && !form.value.uf) {
    form.value.uf = dados.uf
  }
  
  if (dados.cep && !form.value.cep) {
    form.value.cep = dados.cep
  }
  
  // Contatos
  if (dados.telefone && !form.value.telefone) {
    form.value.telefone = dados.telefone
  }
  
  if (dados.email && !form.value.email_holerites) {
    form.value.email_holerites = dados.email
  }
  
  // Informações cadastrais
  if (dados.situacao_cadastral) {
    form.value.situacao_cadastral = dados.situacao_cadastral
  }
  
  if (dados.atividade_principal && !form.value.atividade_principal) {
    form.value.atividade_principal = dados.atividade_principal
  }
  
  if (dados.natureza_juridica && !form.value.natureza_juridica) {
    form.value.natureza_juridica = dados.natureza_juridica
  }
  
  if (dados.porte && !form.value.porte) {
    form.value.porte = dados.porte
  }
  
  if (dados.capital_social && !form.value.capital_social) {
    form.value.capital_social = dados.capital_social
  }
  
  if (dados.data_abertura && !form.value.data_abertura) {
    form.value.data_abertura = dados.data_abertura
  }
  
  // Formatar CNPJ
  form.value.cnpj = dados.cnpj
  
  // Mostrar notificação de sucesso
  notificacao.value = {
    title: 'Dados encontrados!',
    message: `Empresa: ${dados.nome} - ${dados.situacao_cadastral}`,
    variant: 'success'
  }
  mostrarNotificacao.value = true
}
</script>