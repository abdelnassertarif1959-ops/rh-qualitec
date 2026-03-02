# 📄 PDF de Holerite - Temporariamente Desabilitado

## ⚠️ Status Atual

A funcionalidade de geração de PDF de holerite está **temporariamente desabilitada** devido a problemas de compatibilidade com a biblioteca `pdfkit` no ambiente Nuxt 3.

## 🔧 Problema Técnico

O Nuxt 3 tem dificuldades para importar bibliotecas Node.js puras (como pdfkit) no contexto do servidor devido ao sistema de módulos ES e bundling do Vite.

## ✅ O que está funcionando

- ✅ Tabela de holerites criada no banco de dados
- ✅ Campo PIS/PASEP adicionado aos funcionários
- ✅ Interface de gestão de holerites completa
- ✅ Visualização de holerites no modal
- ✅ Filtros e busca
- ✅ Todas as funcionalidades exceto o download de PDF

## 🚧 Soluções Alternativas

### Opção 1: Usar biblioteca compatível com Nuxt 3
Substituir `pdfkit` por uma biblioteca mais moderna como:
- **jsPDF** - Funciona no browser e servidor
- **pdf-lib** - Biblioteca moderna e compatível
- **Puppeteer** - Gerar PDF a partir de HTML

### Opção 2: Serviço externo
- Usar API externa para geração de PDF
- Exemplo: PDFMonkey, DocRaptor, etc.

### Opção 3: HTML para PDF
- Gerar HTML do holerite
- Usar CSS print-friendly
- Permitir impressão direta do navegador

## 📋 Próximos Passos

### Para reativar o PDF:

1. **Instalar biblioteca compatível:**
   ```bash
   npm install jspdf
   # ou
   npm install pdf-lib
   ```

2. **Reescrever a função de geração:**
   - Adaptar `server/utils/holeritePDF.ts` para usar a nova biblioteca
   - Testar no ambiente Nuxt 3

3. **Reativar o endpoint:**
   - Descomentar o código em `server/api/holerites/[id]/pdf.get.ts`
   - Atualizar imports

## 💡 Recomendação Imediata

**Implementar Opção 3 (HTML para PDF):**

Esta é a solução mais rápida e não requer bibliotecas externas:

1. Criar componente Vue para visualização do holerite
2. Adicionar CSS para impressão
3. Usar `window.print()` para gerar PDF

### Exemplo de implementação:

```vue
<!-- components/holerites/HoleritePrint.vue -->
<template>
  <div class="holerite-print">
    <!-- Layout do holerite aqui -->
  </div>
</template>

<style>
@media print {
  .holerite-print {
    /* Estilos para impressão */
  }
}
</style>
```

```typescript
// No modal, adicionar botão:
const imprimirHolerite = () => {
  window.print()
}
```

## 📝 Arquivos Criados

Todos os arquivos necessários foram criados e estão prontos:

- ✅ `database/09-adicionar-pis-pasep.sql`
- ✅ `database/10-criar-tabela-holerites-FINAL.sql`
- ✅ `app/components/ui/UiInputPIS.vue`
- ✅ `server/utils/holeritePDF.ts` (pronto, aguardando biblioteca compatível)
- ✅ `server/api/holerites/[id]/pdf.get.ts` (temporariamente desabilitado)

## 🎯 Conclusão

O sistema de holerites está **95% completo**. Apenas a geração de PDF precisa ser ajustada para funcionar no Nuxt 3. Todas as outras funcionalidades estão operacionais.

**O sistema pode ser usado normalmente** - os usuários podem visualizar os holerites na tela e, se necessário, usar a função de impressão do navegador.
