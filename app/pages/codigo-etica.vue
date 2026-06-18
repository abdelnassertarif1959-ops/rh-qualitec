<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <!-- Loading -->
    <div v-if="carregando" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Sem código cadastrado -->
    <UiCard v-else-if="!codigo" class="text-center py-12">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p class="text-gray-500">Nenhum Código de Ética disponível no momento.</p>
    </UiCard>

    <template v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ codigo.titulo }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">Versão {{ codigo.versao }}</p>
        </div>
        <a
          :href="`/api/codigo-etica/${codigo.id}/pdf`"
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Baixar PDF
        </a>
      </div>

      <!-- Badge confirmado -->
      <div v-if="confirmado" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm font-medium">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Você já confirmou a leitura deste Código de Ética.
      </div>

      <!-- Conteúdo -->
      <UiCard class="mb-6">
        <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed">
          <div v-for="(bloco, i) in blocos" :key="i">
            <!-- Título numerado -->
            <h3 v-if="bloco.tipo === 'titulo'" class="text-base font-bold text-blue-900 mt-5 mb-2">
              {{ bloco.texto }}
            </h3>
            <!-- Item de lista -->
            <p v-else-if="bloco.tipo === 'item'" class="flex gap-2 mb-1 ml-3">
              <span class="text-blue-500 flex-shrink-0">•</span>
              <span>{{ bloco.texto }}</span>
            </p>
            <!-- Linha vazia -->
            <div v-else-if="bloco.tipo === 'vazio'" class="h-2"></div>
            <!-- Texto normal -->
            <p v-else class="mb-2">{{ bloco.texto }}</p>
          </div>
        </div>
      </UiCard>

      <!-- Botão confirmar -->
      <div v-if="!confirmado" class="sticky bottom-4">
        <UiCard class="border-2 border-blue-200 bg-blue-50">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="flex-1">
              <p class="text-sm font-semibold text-blue-900">Confirmar leitura</p>
              <p class="text-xs text-blue-700 mt-0.5">Ao confirmar, você declara que leu e compreendeu este Código de Ética.</p>
            </div>
            <UiButton :disabled="confirmando" @click="confirmar" class="w-full sm:w-auto">
              <svg v-if="!confirmando" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ confirmando ? 'Confirmando...' : 'Li e Concordo' }}
            </UiButton>
          </div>
        </UiCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface CodigoEtica {
  id: number
  titulo: string
  conteudo: string
  versao: number
  empresa_id: number
}

const codigo = ref<CodigoEtica | null>(null)
const confirmado = ref(false)
const carregando = ref(true)
const confirmando = ref(false)

const blocos = computed(() => {
  if (!codigo.value?.conteudo) return []
  return codigo.value.conteudo.split('\n').map(linha => {
    const t = linha.trim()
    if (!t) return { tipo: 'vazio', texto: '' }
    if (/^\d+\./.test(t)) return { tipo: 'titulo', texto: t }
    if (t.startsWith('•') || t.startsWith('-')) return { tipo: 'item', texto: t.replace(/^[•\-]\s*/, '') }
    return { tipo: 'texto', texto: t }
  })
})

const carregar = async () => {
  carregando.value = true
  try {
    const res = await $fetch<{ success: boolean; data: CodigoEtica | null; confirmado: boolean }>('/api/codigo-etica')
    codigo.value = res.data
    confirmado.value = res.confirmado
  } catch (e) {
    console.error(e)
  } finally {
    carregando.value = false
  }
}

const confirmar = async () => {
  if (!codigo.value) return
  confirmando.value = true
  try {
    await $fetch('/api/codigo-etica/confirmar', {
      method: 'POST',
      body: { codigo_etica_id: codigo.value.id }
    })
    confirmado.value = true
  } catch (e) {
    console.error(e)
  } finally {
    confirmando.value = false
  }
}

onMounted(carregar)
</script>
