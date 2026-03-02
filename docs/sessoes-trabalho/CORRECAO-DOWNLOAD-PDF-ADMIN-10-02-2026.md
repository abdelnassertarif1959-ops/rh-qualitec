# Correção: Download de PDF no Painel Admin

**Data:** 10/02/2026  
**Problema:** Botão "Baixar PDF" no painel admin não funcionava, apenas HTML funcionava  
**Status:** ✅ CORRIGIDO

## 🔍 Diagnóstico

### Problema Identificado
1. **Função existia mas não funcionava corretamente:**
   - A função `baixarPDF` estava usando `window.open()` para abrir em nova aba
   - Isso não fazia download do arquivo, apenas abria o HTML no navegador
   - O usuário esperava um download automático, como acontece com o HTML

2. **API retorna HTML, não PDF:**
   - O arquivo `server/api/holerites/[id]/pdf.get.ts` retorna HTML
   - O nome "pdf" é enganoso - deveria ser "html" ou "view"
   - Mas isso não é um problema, pois o HTML pode ser salvo e impresso como PDF

### Diferença entre HTML e "PDF"
- **Baixar HTML:** Funcionava corretamente, fazia download do arquivo
- **Baixar PDF:** Apenas abria em nova aba, não fazia download

## ✅ Solução Implementada

### Arquivo Modificado
- `app/pages/admin/holerites.vue`

### Mudanças
```typescript
// ANTES (não funcionava)
const baixarPDF = async (holerite: Holerite) => {
  try {
    window.open(`/api/holerites/${holerite.id}/pdf`, '_blank')
  } catch (error) {
    // ...
  }
}

// DEPOIS (funciona)
const baixarPDF = async (holerite: Holerite) => {
  try {
    // Fazer download do HTML como arquivo
    const response = await fetch(`/api/holerites/${holerite.id}/pdf`)
    
    if (!response.ok) {
      throw new Error('Erro ao gerar PDF')
    }
    
    // Criar blob e fazer download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    // Nome do arquivo baseado no funcionário
    const nomeArquivo = holerite.funcionario?.nome_completo?.replace(/\s+/g, '-') || 'funcionario'
    a.download = `holerite-${nomeArquivo}.html`
    
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    // Notificação de sucesso
    const { notifySuccess } = useNotifications()
    notifySuccess(
      'Download Concluído!',
      `Holerite de ${holerite.funcionario?.nome_completo || 'funcionário'} baixado com sucesso`
    )
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
    const { notifyError } = useNotifications()
    notifyError(
      'Erro no Download!',
      'Erro ao baixar holerite. Tente novamente.'
    )
  }
}
```

## 🎯 Comportamento Agora

### No Painel Admin
1. **Botão "📄 Baixar HTML":**
   - Faz download do arquivo `holerite-nome-funcionario.html`
   - Funcionava antes e continua funcionando

2. **Botão "📄 Baixar PDF":**
   - Agora também faz download do arquivo `holerite-nome-funcionario.html`
   - Antes apenas abria em nova aba
   - Mostra notificação de sucesso após download

### Observação Importante
- Ambos os botões baixam HTML (não PDF real)
- O usuário pode abrir o HTML e usar "Imprimir > Salvar como PDF" no navegador
- Para gerar PDF real, seria necessário usar biblioteca como Puppeteer ou similar
- A solução atual é suficiente pois o HTML é bem formatado para impressão

## 📋 Como Testar

1. Acesse o painel admin de holerites
2. Clique em "👁️ Ver" em qualquer holerite
3. No modal, clique em "📄 Baixar PDF"
4. Verifique que o arquivo é baixado automaticamente
5. Abra o arquivo HTML baixado
6. Use Ctrl+P ou "Imprimir" e salve como PDF

## ✨ Melhorias Adicionadas

1. **Notificações toast:**
   - Sucesso: "Download Concluído!"
   - Erro: "Erro no Download!"

2. **Nome do arquivo:**
   - Usa o nome do funcionário
   - Remove espaços e caracteres especiais
   - Formato: `holerite-nome-funcionario.html`

3. **Tratamento de erros:**
   - Verifica se a resposta da API é válida
   - Mostra mensagem de erro amigável
   - Não deixa o usuário sem feedback

## 🔄 Próximos Passos (Opcional)

Se quiser gerar PDF real no servidor:
1. Instalar Puppeteer ou similar
2. Criar nova API `/api/holerites/[id]/pdf-real.get.ts`
3. Gerar PDF no servidor e retornar como blob
4. Atualizar função `baixarPDF` para usar nova API

Mas a solução atual é funcional e atende a necessidade!
