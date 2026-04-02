<template>
  <div>
    <UiPageHeader title="Código de Ética" description="Gerencie o código de ética por empresa e acompanhe as confirmações" />

    <div v-if="carregando" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- Card por empresa -->
      <UiCard v-for="empresa in empresas" :key="empresa.id">
        <template #header>
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ empresa.nome_fantasia || empresa.nome }}</p>
                <p class="text-xs text-gray-500">
                  {{ codigoPorEmpresa(empresa.id) ? `Versão ${codigoPorEmpresa(empresa.id)?.versao}` : 'Sem código cadastrado' }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <a
                v-if="codigoPorEmpresa(empresa.id)"
                :href="`/api/codigo-etica/${codigoPorEmpresa(empresa.id)?.id}/pdf`"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                PDF
              </a>
              <UiButton size="sm" @click="abrirEditor(empresa)">
                {{ codigoPorEmpresa(empresa.id) ? 'Editar' : 'Criar' }}
              </UiButton>
            </div>
          </div>
        </template>

        <!-- Estatísticas de confirmação -->
        <div v-if="codigoPorEmpresa(empresa.id)" class="space-y-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="p-3 bg-green-50 rounded-xl text-center">
              <p class="text-2xl font-bold text-green-700">{{ confirmadosPorEmpresa(empresa.id) }}</p>
              <p class="text-xs text-green-600 mt-0.5">Confirmaram</p>
            </div>
            <div class="p-3 bg-red-50 rounded-xl text-center">
              <p class="text-2xl font-bold text-red-700">{{ naoConfirmadosPorEmpresa(empresa.id) }}</p>
              <p class="text-xs text-red-600 mt-0.5">Não confirmaram</p>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl text-center col-span-2 sm:col-span-1">
              <p class="text-2xl font-bold text-blue-700">{{ totalFuncionariosPorEmpresa(empresa.id) }}</p>
              <p class="text-xs text-blue-600 mt-0.5">Total ativos</p>
            </div>
          </div>

          <!-- Lista de quem confirmou -->
          <div v-if="confirmacoesPorEmpresa(empresa.id).length > 0">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Confirmações</p>
            <div class="space-y-1.5 max-h-48 overflow-y-auto">
              <div
                v-for="conf in confirmacoesPorEmpresa(empresa.id)"
                :key="conf.id"
                class="flex items-center justify-between p-2 bg-green-50 rounded-lg text-sm"
              >
                <span class="font-medium text-gray-800">{{ conf.funcionario?.nome_completo }}</span>
                <span class="text-xs text-gray-500">{{ formatarData(conf.confirmado_em) }}</span>
              </div>
            </div>
          </div>

          <!-- Lista de quem NÃO confirmou -->
          <div v-if="naoConfirmadosListaPorEmpresa(empresa.id).length > 0">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pendentes</p>
            <div class="space-y-1.5 max-h-48 overflow-y-auto">
              <div
                v-for="func in naoConfirmadosListaPorEmpresa(empresa.id)"
                :key="func.id"
                class="flex items-center justify-between p-2 bg-red-50 rounded-lg text-sm"
              >
                <span class="font-medium text-gray-800">{{ func.nome_completo }}</span>
                <span class="text-xs text-red-500 font-medium">Pendente</span>
              </div>
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Modal Editor -->
    <UiModal v-model="modalEditor" title="Editar Código de Ética" max-width="max-w-2xl">
      <div class="space-y-4">
        <!-- Logo da empresa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Logo da empresa
            <span class="text-xs text-gray-400">(aparece no canto superior esquerdo do PDF)</span>
          </label>
          <div class="flex items-center gap-3">
            <div v-if="form.logo_base64" class="w-24 h-12 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
              <img :src="form.logo_base64" alt="Logo" class="max-w-full max-h-full object-contain" />
            </div>
            <div v-else class="w-24 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              Sem logo
            </div>
            <div class="flex-1">
              <input type="file" accept="image/*" class="hidden" ref="inputLogo" @change="onLogoChange" />
              <UiButton size="sm" variant="secondary" @click="inputLogo?.click()">
                {{ form.logo_base64 ? 'Trocar logo' : 'Adicionar logo' }}
              </UiButton>
              <button v-if="form.logo_base64" type="button" class="ml-2 text-xs text-red-500 hover:text-red-700" @click="form.logo_base64 = ''">
                Remover
              </button>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-1">PNG ou JPG recomendado. Máx 2MB.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            v-model="form.titulo"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
          <textarea
            v-model="form.conteudo"
            rows="20"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono"
            placeholder="Digite o conteúdo do código de ética..."
          />
          <p class="text-xs text-gray-500 mt-1">Use "1. Título" para seções e "• item" para listas</p>
        </div>
        <div class="flex gap-3 justify-end pt-1">
          <UiButton variant="secondary" @click="modalEditor = false">Cancelar</UiButton>
          <UiButton :disabled="salvando" @click="salvar">
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ middleware: ['auth', 'admin'] })

const { isAdmin } = useAuth()

interface Empresa { id: number; nome: string; nome_fantasia: string | null }
interface Confirmacao { id: number; funcionario_id: number; confirmado_em: string; funcionario: { id: number; nome_completo: string; status: string } | null }
interface CodigoEtica { id: number; empresa_id: number; titulo: string; conteudo: string; versao: number; confirmacoes: Confirmacao[] }

const carregando = ref(true)
const empresas = ref<Empresa[]>([])
const codigos = ref<CodigoEtica[]>([])
const funcionariosPorEmpresa = ref<Record<number, any[]>>({})
const modalEditor = ref(false)
const salvando = ref(false)
const empresaAtual = ref<Empresa | null>(null)
const form = ref({ titulo: 'Código de Ética e Conduta', conteudo: '', logo_base64: '' })
const inputLogo = ref<HTMLInputElement | null>(null)

const onLogoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { alert('Imagem muito grande. Máx 2MB.'); return }
  const reader = new FileReader()
  reader.onload = (ev) => { form.value.logo_base64 = ev.target?.result as string }
  reader.readAsDataURL(file)
}

const codigoPorEmpresa = (empresaId: number) => codigos.value.find(c => c.empresa_id === empresaId) || null
const confirmacoesPorEmpresa = (empresaId: number) => codigoPorEmpresa(empresaId)?.confirmacoes || []
const confirmadosPorEmpresa = (empresaId: number) => confirmacoesPorEmpresa(empresaId).length
const totalFuncionariosPorEmpresa = (empresaId: number) => funcionariosPorEmpresa.value[empresaId]?.length || 0
const naoConfirmadosPorEmpresa = (empresaId: number) => Math.max(0, totalFuncionariosPorEmpresa(empresaId) - confirmadosPorEmpresa(empresaId))

const naoConfirmadosListaPorEmpresa = (empresaId: number) => {
  const confirmados = new Set(confirmacoesPorEmpresa(empresaId).map(c => c.funcionario_id))
  return (funcionariosPorEmpresa.value[empresaId] || []).filter((f: any) => !confirmados.has(f.id))
}

const carregar = async () => {
  carregando.value = true
  try {
    const [codRes, empRes] = await Promise.all([
      $fetch<{ data: CodigoEtica[] }>('/api/admin/codigo-etica'),
      $fetch<{ data: Empresa[] }>('/api/empresas')
    ])
    codigos.value = codRes.data || []
    empresas.value = empRes.data || []

    // Buscar funcionários ativos por empresa
    for (const emp of empresas.value) {
      const res = await $fetch<{ data: any[] }>(`/api/funcionarios?empresa=${emp.id}`)
      funcionariosPorEmpresa.value[emp.id] = (res.data || []).filter((f: any) => f.status === 'ativo')
    }
  } catch (e) {
    console.error(e)
  } finally {
    carregando.value = false
  }
}

const abrirEditor = (empresa: Empresa) => {
  empresaAtual.value = empresa
  const codigo = codigoPorEmpresa(empresa.id)
  form.value = {
    titulo: codigo?.titulo || 'Código de Ética e Conduta',
    conteudo: codigo?.conteudo || CODIGO_PADRAO,
    logo_base64: (codigo as any)?.logo_base64 || ''
  }
  modalEditor.value = true
}

const salvar = async () => {
  if (!empresaAtual.value) return
  salvando.value = true
  try {
    const codigo = codigoPorEmpresa(empresaAtual.value.id)
    const payload = { titulo: form.value.titulo, conteudo: form.value.conteudo, logo_base64: form.value.logo_base64 || null }
    if (codigo) {
      await $fetch(`/api/admin/codigo-etica/${codigo.id}`, { method: 'PATCH', body: payload })
    } else {
      await $fetch('/api/admin/codigo-etica', { method: 'POST', body: { empresa_id: empresaAtual.value.id, ...payload } })
    }
    modalEditor.value = false
    await carregar()
  } catch (e) {
    console.error(e)
  } finally {
    salvando.value = false
  }
}

const formatarData = (data: string) =>
  new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const CODIGO_PADRAO = `📄 CÓDIGO DE ÉTICA E CONDUTA
QUALITEC | SPEED | QUALI

1. Objetivo
Este Código de Ética estabelece as regras de conduta que devem ser seguidas por todos os colaboradores das empresas QUALITEC, SPEED e QUALI, garantindo um ambiente de trabalho respeitoso, profissional e responsável.

2. Princípios Gerais
Todos os colaboradores devem agir com:
• Respeito
• Honestidade
• Responsabilidade
• Profissionalismo

3. Pontualidade e Compromisso
• Cumprir rigorosamente horários de trabalho e compromissos agendados
• Evitar atrasos, faltas e saídas antecipadas sem justificativa
• Avisar com antecedência em casos de imprevistos
• Representantes devem respeitar horários combinados com clientes

4. Confidencialidade
• É proibido compartilhar informações internas da empresa
• Dados de clientes, valores, propostas e negociações são estritamente confidenciais
• Não divulgar informações para terceiros, concorrentes ou fora do ambiente de trabalho
• Essa regra continua válida mesmo após o desligamento da empresa

5. Conduta Profissional
• Tratar colegas, clientes e fornecedores com respeito
• Evitar conflitos, discussões e atitudes inadequadas
• Manter postura profissional dentro e fora da empresa
• Não praticar discriminação ou assédio de qualquer tipo

6. Uso de Recursos da Empresa
• Utilizar equipamentos, ferramentas e materiais apenas para fins de trabalho
• Zelar pelo bom uso e conservação dos equipamentos
• Evitar uso excessivo de celular para assuntos pessoais durante o expediente

7. Atendimento ao Cliente
• Atender com educação, clareza e profissionalismo
• Não prometer prazos ou condições que não possam ser cumpridas
• Representar a empresa com responsabilidade, principalmente em visitas externas

8. Conflito de Interesses
• Não utilizar a empresa para benefício próprio
• Não realizar atividades concorrentes ou que prejudiquem a empresa
• Evitar situações que comprometam a imparcialidade no trabalho

9. Segurança e Responsabilidade
• Seguir normas de segurança no ambiente de trabalho
• Utilizar corretamente equipamentos técnicos
• Comunicar qualquer risco ou problema identificado

10. Disposições Gerais
• O não cumprimento deste Código poderá resultar em medidas disciplinares
• Todos os colaboradores devem conhecer e seguir estas regras`

onMounted(carregar)
</script>
