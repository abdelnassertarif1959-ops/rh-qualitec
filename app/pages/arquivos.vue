<template>
  <div>
    <UiPageHeader title="Arquivos" description="Anexe atestados, documentos e outros arquivos" />
    <MeusDocumentos />
  </div>
</template>

<script setup lang="ts">
import MeusDocumentos from '~/components/funcionarios/MeusDocumentos.vue'

definePageMeta({ middleware: 'auth' })
</script>
