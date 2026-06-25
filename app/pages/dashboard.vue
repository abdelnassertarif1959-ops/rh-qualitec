<template>
  <div>
    <!-- Popup Criar Aviso (Admin) -->
    <AvisosPopupCriarAvisoAdmin 
      v-if="isAdmin"
      :mostrar="mostrarPopupAdmin"
      @fechar="mostrarPopupAdmin = false"
    />

    <!-- Popup Avisos Recentes (Funcionário) -->
    <AvisosPopupAvisosRecentes 
      v-if="!isAdmin"
      :mostrar="mostrarPopupFuncionario"
      :avisos-recentes="avisosRecentes"
      @fechar="mostrarPopupFuncionario = false"
    />

    <!-- Cabeçalho da Página -->
    <div class="mb-8">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">
          {{ obterSaudacao() }} {{ user?.nome?.split(' ')[0] }}!
        </h1>
        
        <!-- Ícone de Aniversariante na mesma linha da saudação -->
        <UiAniversariantesTooltip 
          v-if="temAniversarianteMes"
          :aniversariantes="aniversariantes"
        >
          <div 
            class="relative p-2 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer"
            :title="`${totalAniversariantes} aniversariante(s) este mês`"
          >
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/>
            </svg>
            <span 
              v-if="totalAniversariantes > 0"
              class="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
            >
              {{ totalAniversariantes > 9 ? '9+' : totalAniversariantes }}
            </span>
          </div>
        </UiAniversariantesTooltip>
      </div>
      
      <p class="text-lg text-gray-500 mt-2">
        Bem-vindo ao Sistema de RH. Aqui você encontra tudo sobre sua vida profissional.
      </p>
    </div>

    <!-- Cards de Atalho -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard 
        to="/meus-dados"
        title="Meus Dados"
        description="Veja e atualize suas informações pessoais"
        color="blue"
        icon-path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />

      <DashboardCard 
        v-if="!isAdmin"
        to="/holerites"
        title="Meus Holerites"
        description="Acesse seus contracheques e baixe em PDF"
        color="green"
        icon-path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />

      <!-- Card Férias (Mobile-First & Customizado) -->
      <NuxtLink
        v-if="!isAdmin"
        to="/ferias"
        class="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group"
      >
        <div class="flex items-start gap-4">
          <!-- Ícone Premium de Férias com gradiente quente (sol/praia/ferias) -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 bg-gradient-to-br from-amber-400 to-emerald-500 shadow-sm text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
              Minhas Férias
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              Consulte e agende seus períodos de férias
            </p>

            <!-- Loading de Férias -->
            <div v-if="carregandoFeriasCard" class="h-10 flex items-center">
              <div class="animate-pulse flex space-x-2 items-center">
                <div class="h-2 w-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div class="h-2 w-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                <div class="h-2 w-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>

            <!-- Dados Reais quando carregado -->
            <div v-else class="space-y-2 mt-2">
              <!-- Caso 1: Próximas férias agendadas -->
              <div v-if="proximaFerias" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                <span>📅 Próxima: {{ formatarDataSimples(proximaFerias.data_inicio) }}</span>
              </div>

              <!-- Caso 2: Progresso de Carência se menos de 1 ano -->
              <div v-if="!temUmAnoDeServico && dadosCompletos?.data_admissao" class="pt-1">
                <div class="flex justify-between text-[11px] text-gray-500 mb-1">
                  <span>Carência de 1 ano</span>
                  <span class="font-bold text-amber-600">{{ tempoServicoProgresso }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full" :style="{ width: `${tempoServicoProgresso}%` }"></div>
                </div>
                <p class="text-[10px] text-gray-400 mt-1 font-medium">
                  Liberado em: {{ dataLiberacaoFeriasFormatada }}
                </p>
              </div>

              <!-- Caso 3: Liberado para agendar -->
              <div v-else-if="temUmAnoDeServico" class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-semibold">
                <span class="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Férias liberadas para agendar!</span>
              </div>
            </div>
          </div>

          <!-- Ícone de seta -->
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </NuxtLink>

      <DashboardCard
        v-if="!isAdmin"
        to="/arquivos"
        title="Arquivos"
        description="Anexe atestados, documentos, etc"
        color="orange"
        icon-path="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
      />

      <!-- Card Documentos (admin) — mesmo estilo dos outros cards do grid -->
      <NuxtLink
        v-if="isAdmin"
        to="/admin/documentos"
        class="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-200 group relative"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 bg-gradient-to-br from-orange-500 to-orange-600 relative">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span
              v-if="totalDocumentosRecentes > 0"
              class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
            >
              {{ totalDocumentosRecentes > 9 ? '9+' : totalDocumentosRecentes }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
              Documentos
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              <template v-if="totalDocumentosRecentes > 0">
                <span class="text-orange-600 font-medium">{{ totalDocumentosRecentes }} novo(s)</span> nas últimas 48h
              </template>
              <template v-else>Arquivos enviados pelos funcionários</template>
            </p>
          </div>
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </NuxtLink>

      <div 
        class="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-200 group"
      >
        <div class="flex items-start gap-4">
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 bg-gradient-to-br from-purple-500 to-purple-600"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ empresaUsuario ? (empresaUsuario.nome_fantasia || empresaUsuario.nome) : 'Minha Empresa' }}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ empresaUsuario ? `CNPJ: ${empresaUsuario.cnpj || 'Não informado'}` : 'Aguardando cadastro' }}
            </p>
            
            <UiBadge 
              :variant="empresaUsuario ? 'success' : 'warning'" 
              class="mt-3 flex items-center gap-1.5"
            >
              <svg v-if="empresaUsuario" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ empresaUsuario ? 'Vinculado' : 'Pendente' }}
            </UiBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Caixa de Avisos (para funcionários) -->
    <AvisosCaixaAvisos v-if="!isAdmin" class="mb-8" />

    <!-- Popups -->
    <AvisosPopupCriarAvisoAdmin 
      v-if="isAdmin"
      :mostrar="mostrarPopupAdmin"
      @fechar="mostrarPopupAdmin = false"
      @criado="mostrarPopupAdmin = false"
    />

    <AvisosPopupAvisosRecentes 
      v-if="!isAdmin"
      :mostrar="mostrarPopupFuncionario"
      :avisos-recentes="avisosRecentes"
      @fechar="fecharPopupFuncionario"
    />

    <!-- Informações do Funcionário -->
    <UiCard class="mb-8">
      <template #header>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-semibold text-gray-900">Suas Informações</span>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Nome Completo</p>
            <p class="text-lg font-semibold text-gray-800">{{ dadosCompletos?.nome_completo || user?.nome }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Cargo</p>
            <p class="text-lg font-semibold text-gray-800">{{ obterNomeCargo(dadosCompletos?.cargo_id) }}</p>
          </div>
          <div v-if="empresaUsuario">
            <p class="text-sm text-gray-500 mb-1">Empresa</p>
            <p class="text-lg font-semibold text-gray-800">{{ empresaUsuario.nome_fantasia || empresaUsuario.nome }}</p>
            <p class="text-sm text-gray-500">{{ empresaUsuario.nome }}</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Departamento</p>
            <p class="text-lg font-semibold text-gray-800">{{ obterNomeDepartamento(dadosCompletos?.departamento_id) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Email</p>
            <p class="text-lg font-semibold text-gray-800">{{ dadosCompletos?.email || user?.email }}</p>
          </div>
          <div v-if="empresaUsuario?.cnpj">
            <p class="text-sm text-gray-500 mb-1">CNPJ da Empresa</p>
            <p class="text-lg font-semibold text-gray-800">{{ empresaUsuario.cnpj }}</p>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Cards Admin -->
    <template v-if="isAdmin">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        Área do Administrador
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard 
          to="/admin/funcionarios"
          :value="loading ? '...' : (stats.totalFuncionarios || 0).toString()"
          label="Funcionários"
          color="blue"
          icon-path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
        <DashboardStatCard 
          to="/admin/departamentos"
          :value="loading ? '...' : (stats.totalDepartamentos || 0).toString()"
          label="Departamentos"
          color="purple"
          icon-path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
        <DashboardStatCard 
          to="/admin/holerites"
          :value="loading ? '...' : formatarMoeda(stats.folhaMensal || 0)"
          label="Folha Mensal"
          color="green"
          icon-path="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <svg class="w-10 h-10 mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/>
          </svg>
          <p class="text-3xl font-bold">{{ loading ? '...' : (stats.totalAniversariantes || 0) }}</p>
          <p class="text-white/80">Aniversariantes</p>
        </div>
      </div>

      <!-- Enviar Email Individual -->
      <div class="mb-8">
        <AdminEnviarEmailCard />
      </div>

      <!-- Painel de Notificações e Aniversariantes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Painel de Notificações -->
        <AdminNotificacoesPainel />
        
        <!-- Aniversariantes -->
        <UiCard>
          <template #header>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/>
              </svg>
              <span class="font-semibold text-gray-900">Aniversariantes do Mês</span>
            </div>
          </template>
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Carregando...</p>
          </div>
          
          <div v-else-if="aniversariantes.length === 0" class="text-center py-8 text-gray-500">
            Nenhum aniversariante este mês
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="aniversariante in aniversariantes" 
              :key="aniversariante.id"
              class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <!-- Avatar do funcionário -->
              <UiAvatar 
                :name="aniversariante.nome_completo" 
                :avatar-type="aniversariante.avatar"
                size="md"
                color="orange"
              />
              
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">{{ aniversariante.nome_completo }}</h4>
                <p class="text-sm text-gray-600">{{ aniversariante.cargo }} - {{ aniversariante.departamento }}</p>
                <p class="text-xs text-gray-500">Aniversário dia {{ aniversariante.dia }}</p>
              </div>
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/>
              </svg>
            </div>
          </div>
        </UiCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import AdminEnviarEmailCard from '~/components/admin/AdminEnviarEmailCard.vue'

definePageMeta({ middleware: 'auth' })

const { user, isAdmin } = useAuth()
const { 
  aniversariantes,
  fetchAniversariantes, 
  temAniversarianteMes, 
  totalAniversariantes 
} = useAniversariantes()
const { buscarAvisos } = useAvisos()

// Estados
const stats = ref({
  totalFuncionarios: 0,
  totalDepartamentos: 0,
  folhaMensal: 0,
  totalAniversariantes: 0
})

const loading = ref(true)
const dadosCompletos = ref<any>(null)
const empresaUsuario = ref<any>(null)
const totalDocumentosRecentes = ref(0)

// Gestão de férias no dashboard (mobile-first)
const totalFeriasAgendadas = ref(0)
const proximaFerias = ref<any>(null)
const carregandoFeriasCard = ref(false)

const tempoServicoProgresso = computed(() => {
  if (!dadosCompletos.value?.data_admissao) return 0
  try {
    const admissao = new Date(dadosCompletos.value.data_admissao + 'T00:00:00')
    const hoje = new Date()
    const umAnoAposAdmissao = new Date(admissao)
    umAnoAposAdmissao.setFullYear(umAnoAposAdmissao.getFullYear() + 1)
    
    if (hoje >= umAnoAposAdmissao) return 100
    
    const totalMs = umAnoAposAdmissao.getTime() - admissao.getTime()
    const decorridoMs = hoje.getTime() - admissao.getTime()
    if (decorridoMs <= 0) return 0
    
    const pct = Math.floor((decorridoMs / totalMs) * 100)
    return Math.min(100, Math.max(0, pct))
  } catch (e) {
    console.error('Erro ao calcular progresso de tempo de serviço:', e)
    return 0
  }
})

const dataLiberacaoFeriasFormatada = computed(() => {
  if (!dadosCompletos.value?.data_admissao) return ''
  try {
    const admissao = new Date(dadosCompletos.value.data_admissao + 'T00:00:00')
    const umAnoAposAdmissao = new Date(admissao)
    umAnoAposAdmissao.setFullYear(umAnoAposAdmissao.getFullYear() + 1)
    return umAnoAposAdmissao.toLocaleDateString('pt-BR')
  } catch (e) {
    console.error('Erro ao formatar data de liberação de férias:', e)
    return ''
  }
})

const temUmAnoDeServico = computed(() => {
  return tempoServicoProgresso.value >= 100
})

const formatarDataSimples = (data: string) => {
  if (!data) return ''
  const date = new Date(data + 'T00:00:00')
  return date.toLocaleDateString('pt-BR')
}

// Estados dos popups
const mostrarPopupAdmin = ref(false)
const mostrarPopupFuncionario = ref(false)
const avisosRecentes = ref<any[]>([])

// Mapas para conversão de IDs para nomes
const cargosMap = ref<Record<string, string>>({})
const departamentosMap = ref<Record<string, string>>({})

// Função para obter saudação baseada no horário local
const obterSaudacao = () => {
  const agora = new Date()
  const hora = agora.getHours()
  
  if (hora >= 0 && hora < 12) {
    return 'Bom dia'
  } else if (hora >= 12 && hora <= 18) {
    return 'Boa tarde'
  } else {
    return 'Boa noite'
  }
}

// Funções para obter nomes
const obterNomeCargo = (id: string | number) => {
  const idStr = id?.toString()
  return cargosMap.value[idStr] || idStr || 'Não informado'
}

const obterNomeDepartamento = (id: string | number) => {
  const idStr = id?.toString()
  return departamentosMap.value[idStr] || idStr || 'Não informado'
}

// Carregar mapas de conversão
const carregarMapas = async () => {
  try {
    // Carregar cargos
    const cargosRes: any = await $fetch('/api/cargos')
    if (cargosRes.success && cargosRes.data) {
      cargosRes.data.forEach((c: any) => {
        cargosMap.value[c.id.toString()] = c.nome
      })
    }

    // Carregar departamentos
    const deptosRes: any = await $fetch('/api/departamentos')
    if (deptosRes.success && deptosRes.data) {
      deptosRes.data.forEach((d: any) => {
        departamentosMap.value[d.id.toString()] = d.nome
      })
    }
  } catch (error) {
    console.error('Erro ao carregar mapas:', error)
  }
}

// Buscar dados do dashboard
const carregarDados = async () => {
  try {
    loading.value = true
    
    // Carregar mapas de conversão primeiro
    await carregarMapas()
    
    // Carregar aniversariantes (para todos os usuários)
    try {
      await fetchAniversariantes()
    } catch (error) {
      console.error('Erro ao carregar aniversariantes:', error)
    }
    
    // Buscar dados completos do usuário (incluindo empresa)
    if (user.value?.id) {
      try {
        const dadosResponse: any = await $fetch(`/api/funcionarios/meus-dados?userId=${user.value.id}`)
        if (dadosResponse.success) {
          dadosCompletos.value = dadosResponse.data
          empresaUsuario.value = dadosResponse.data.empresas
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
      }

      // Buscar dados de férias do funcionário se não for admin
      if (!isAdmin.value) {
        try {
          carregandoFeriasCard.value = true
          const feriasRes: any = await $fetch(`/api/ferias?funcionario_id=${user.value.id}`)
          if (feriasRes.data) {
            const ativas = feriasRes.data.filter((f: any) => f.status !== 'cancelado')
            totalFeriasAgendadas.value = ativas.length
            
            const hojeStr = new Date().toISOString().split('T')[0]
            const futuras = ativas
              .filter((f: any) => f.data_inicio >= hojeStr)
              .sort((a: any, b: any) => a.data_inicio.localeCompare(b.data_inicio))
            if (futuras.length > 0) {
              proximaFerias.value = futuras[0]
            }
          }
        } catch (err) {
          console.error('Erro ao buscar férias no dashboard:', err)
        } finally {
          carregandoFeriasCard.value = false
        }
      }
    }
    
    // Buscar estatísticas apenas para admin
    if (isAdmin.value) {
      try {
        const statsData = await $fetch('/api/dashboard/stats')
        stats.value = {
          totalFuncionarios: Number(statsData?.totalFuncionarios) || 0,
          totalDepartamentos: Number(statsData?.totalDepartamentos) || 0,
          folhaMensal: Number(statsData?.folhaMensal) || 0,
          totalAniversariantes: Number(statsData?.totalAniversariantes) || 0
        }
      } catch (error) {
        console.error('Erro ao carregar dados do admin:', error)
        stats.value = { totalFuncionarios: 0, totalDepartamentos: 0, folhaMensal: 0, totalAniversariantes: 0 }
      }

      // Buscar documentos recentes
      try {
        const docsRes = await $fetch<{ total: number }>('/api/admin/documentos/recentes')
        totalDocumentosRecentes.value = docsRes.total || 0
      } catch {
        totalDocumentosRecentes.value = 0
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  } finally {
    loading.value = false
  }
}

// Formatar moeda
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Carregar dados ao montar
onMounted(() => {
  carregarDados()
  verificarPopups()
})

// Verificar se deve mostrar popups
const verificarPopups = async () => {
  console.log('🔔 [DASHBOARD] Verificando popups...')
  
  // Verificar se acabou de fazer login
  const acabouDeLogar = sessionStorage.getItem('acabou_de_logar')
  console.log('🔔 [DASHBOARD] Flag acabou_de_logar:', acabouDeLogar)
  console.log('🔔 [DASHBOARD] É admin?', isAdmin.value)
  
  if (!acabouDeLogar) {
    console.log('🔔 [DASHBOARD] Não acabou de logar, não mostrando popups')
    return // Não mostrar popups se não acabou de logar
  }
  
  // Remover flag de login
  sessionStorage.removeItem('acabou_de_logar')
  console.log('🔔 [DASHBOARD] Flag removida')
  
  // Aguardar um pouco para garantir que o dashboard carregou
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (isAdmin.value) {
    // Admin: sempre mostrar popup de criar aviso ao fazer login
    console.log('🔔 [DASHBOARD] Admin - mostrando popup de criar aviso')
    mostrarPopupAdmin.value = true
  } else {
    // Funcionário: verificar se já visualizou avisos nesta sessão
    const jaVisualizou = sessionStorage.getItem('avisos_visualizados')
    console.log('🔔 [DASHBOARD] Funcionário - já visualizou?', jaVisualizou)
    
    if (!jaVisualizou) {
      // Buscar avisos recentes (últimos 7 dias)
      try {
        console.log('🔔 [DASHBOARD] Buscando avisos recentes...')
        const avisos = await buscarAvisos()
        console.log('🔔 [DASHBOARD] Total de avisos:', avisos.length)
        
        const seteDiasAtras = new Date()
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)
        console.log('🔔 [DASHBOARD] Filtrando avisos desde:', seteDiasAtras)
        
        avisosRecentes.value = avisos.filter((aviso: any) => {
          const dataAviso = new Date(aviso.created_at)
          return dataAviso >= seteDiasAtras
        })
        
        console.log('🔔 [DASHBOARD] Avisos recentes (últimos 7 dias):', avisosRecentes.value.length)
        
        // Mostrar popup apenas se houver avisos recentes
        if (avisosRecentes.value.length > 0) {
          console.log('🔔 [DASHBOARD] Mostrando popup de avisos recentes')
          mostrarPopupFuncionario.value = true
        } else {
          console.log('🔔 [DASHBOARD] Nenhum aviso recente para mostrar')
        }
      } catch (error) {
        console.error('🔔 [DASHBOARD] Erro ao buscar avisos recentes:', error)
      }
    } else {
      console.log('🔔 [DASHBOARD] Funcionário já visualizou avisos nesta sessão')
    }
  }
}

// Fechar popup do funcionário e marcar como visualizado
const fecharPopupFuncionario = () => {
  mostrarPopupFuncionario.value = false
  sessionStorage.setItem('avisos_visualizados', 'true')
}
</script>
