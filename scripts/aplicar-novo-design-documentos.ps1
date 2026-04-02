# Script para aplicar o novo design da área de documentos do funcionário
$base = "c:\Users\Vendas2\Downloads\rhhhh-main\app\components\funcionarios"

# ============================================================
# 1. DocumentoFiltros.vue
# ============================================================
$filtros = @'
<template>
  <div class="flex flex-wrap items-center gap-2">
    <select
      :value="ano"
      class="h-9 px-3 text-xs font-semibold bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-qualitec-500 cursor-pointer"
      @change="$emit('update:ano', Number(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
    </select>

    <select
      :value="mes"
      class="h-9 px-3 text-xs font-semibold bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-qualitec-500 cursor-pointer"
      @change="$emit('update:mes', Number(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="(nome, idx) in meses" :key="idx" :value="idx + 1">{{ nome }}</option>
    </select>

    <select
      :value="tipoFiltro"
      class="h-9 px-3 text-xs font-semibold bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-qualitec-500 cursor-pointer"
      @change="$emit('update:tipoFiltro', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Todos os tipos</option>
      <option v-for="t in tipos" :key="t.id" :value="String(t.id)">{{ t.nome }}</option>
    </select>

    <span class="ml-auto text-xs text-gray-400 font-medium">{{ total }} arquivo(s)</span>
  </div>
</template>

<script setup lang="ts">
interface Tipo { id: number; nome: string }
defineProps<{ ano: number; mes: number; tipoFiltro: string; tipos: Tipo[]; total: number }>()
defineEmits<{ 'update:ano': [v: number]; 'update:mes': [v: number]; 'update:tipoFiltro': [v: string] }>()
const anoAtual = new Date().getFullYear()
const anos = Array.from({ length: 4 }, (_, i) => anoAtual - i)
const meses = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
</script>
'@

Set-Content "$base\DocumentoFiltros.vue" $filtros -Encoding UTF8
Write-Host "DocumentoFiltros.vue criado"
