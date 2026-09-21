<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-600">Gere uma parcela por funcionário. Os holerites existentes não serão substituídos.</p>
    <label class="block">Funcionário CLT
      <select v-model="form.funcionario_id" class="w-full border rounded p-2"><option value="">Selecione</option><option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome_completo }}</option></select>
    </label>
    <div class="grid grid-cols-2 gap-3">
      <label>Ano<input v-model.number="form.ano" type="number" min="2026" max="2026" class="w-full border rounded p-2" /></label>
      <label>Parcela<select v-model.number="form.parcela" class="w-full border rounded p-2"><option :value="1">1ª — adiantamento</option><option :value="2">2ª — quitação</option></select></label>
      <label>Data de pagamento<input v-model="form.data_pagamento" type="date" class="w-full border rounded p-2" /></label>
      <label>Avos (opcional)<input v-model="form.avos" type="number" min="1" max="12" placeholder="Sugeridos pela admissão" class="w-full border rounded p-2" /></label>
    </div>
    <label class="block">Remuneração de referência, incluindo médias (opcional)<input v-model="form.remuneracao" type="number" min="0" step="0.01" placeholder="Usar salário do cadastro" class="w-full border rounded p-2" /></label>
    <label class="block">Pensão manual desta parcela (opcional)<input v-model="form.pensao_manual" type="number" min="0" step="0.01" placeholder="Automática conforme cadastro; zero na 1ª parcela" class="w-full border rounded p-2" /></label>
    <label class="block">Justificativa dos ajustes<textarea v-model="form.justificativa" class="w-full border rounded p-2" placeholder="Obrigatória se alterar avos, remuneração ou pensão" /></label>
    <p v-if="erro" role="alert" class="text-red-700">{{ erro }}</p>
    <UiButton :disabled="ocupado || !form.funcionario_id" @click="prever">Conferir cálculo</UiButton>
    <div v-if="previa" class="bg-gray-50 border rounded p-4 space-y-3">
      <p class="font-semibold">{{ previa.funcionario }} — {{ previa.calculo.avos }}/12 avos</p>
      <dl class="grid grid-cols-2 gap-2"><template v-for="[label, key] in linhas" :key="key"><dt>{{ label }}</dt><dd class="text-right">{{ dinheiro(previa.calculo[key]) }}</dd></template></dl>
      <p v-for="aviso in previa.avisos" :key="aviso" class="text-sm text-amber-800">{{ aviso }}</p>
      <label class="flex gap-2"><input v-model="conferencia" type="checkbox" />Conferi os avos, a remuneração, a data e a pensão.</label>
      <UiButton :disabled="ocupado || !conferencia" @click="gerar">Gerar holerite de 13º</UiButton>
    </div>
    <p v-if="sucesso" role="status" class="text-green-700">{{ sucesso }}</p>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits<{ gerado: [] }>()
const form = reactive({ funcionario_id: '', ano: 2026, parcela: 1, data_pagamento: '2026-11-30', avos: '', remuneracao: '', pensao_manual: '', justificativa: '' })
const funcionarios = ref<any[]>([])
const previa = ref<any>(null)
const conferencia = ref(false)
const ocupado = ref(false)
const erro = ref('')
const sucesso = ref('')
const linhas = [['Direito total do 13º', 'totalDireito'], ['Proventos desta parcela', 'proventos'], ['Primeira parcela descontada', 'adiantamento'], ['INSS', 'inss'], ['IRRF', 'irrf'], ['Pensão', 'pensao'], ['Total de descontos', 'descontos'], ['Líquido desta parcela', 'liquido']]
const dinheiro = (v: number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
watch(form, () => { previa.value = null; conferencia.value = false; sucesso.value = '' }, { deep: true })
watch(() => form.parcela, p => { form.data_pagamento = p === 1 ? '2026-11-30' : '2026-12-18' })
onMounted(async () => {
  try { const data: any = await $fetch('/api/funcionarios'); funcionarios.value = data.filter((f: any) => f.tipo_contrato === 'CLT') }
  catch { erro.value = 'Não foi possível carregar os funcionários.' }
})
async function prever() {
  ocupado.value = true; erro.value = ''; previa.value = null; conferencia.value = false
  try { previa.value = await $fetch('/api/holerites/decimo-terceiro', { method: 'POST', body: { ...form } }) }
  catch (e: any) { erro.value = e.data?.message || 'Erro ao calcular o 13º' }
  finally { ocupado.value = false }
}
async function gerar() {
  ocupado.value = true; erro.value = ''
  try {
    await $fetch('/api/holerites/decimo-terceiro', { method: 'POST', body: { ...form, confirmar: true, conferencia: conferencia.value, assinatura: previa.value.assinatura } })
    previa.value = null; sucesso.value = 'Holerite gerado. Use Disponibilizar no Perfil quando desejar liberá-lo.'; emit('gerado')
  } catch (e: any) { erro.value = e.data?.message || 'Erro ao gerar o 13º' }
  finally { ocupado.value = false }
}
</script>
