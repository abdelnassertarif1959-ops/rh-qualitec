# Correção do Download de PDF do Holerite

**Data:** 12/02/2026  
**Status:** ✅ Concluído

## Problema Identificado

O sistema estava tentando baixar o holerite como arquivo PDF, mas o conteúdo era HTML. Isso causava dois problemas:

1. **Adobe Acrobat não conseguia abrir** - Arquivo com extensão `.pdf` mas conteúdo HTML
2. **Erro "Falha ao carregar documento PDF"** - O navegador tentava interpretar HTML como PDF

## Causa Raiz

A função `baixarPDF` estava:
- Fazendo fetch da API que retorna HTML
- Criando um blob do HTML
- Forçando download com extensão `.pdf`
- Resultado: arquivo corrompido que não abre

## Solução Implementada

### 1. API Mantida Simples (`server/api/holerites/[id]/pdf.get.ts`)

```typescript
// Retornar HTML para visualização no navegador (sem forçar download)
setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
return html
```

**Por quê?**
- HTML é renderizado diretamente no navegador
- Não precisa de conversão para PDF
- Usuário pode imprimir como PDF quando quiser

### 2. Função `baixarPDF` Simplificada (`app/pages/admin/holerites.vue`)

**Antes (ERRADO):**
```typescript
// Tentava baixar HTML como PDF
const response = await fetch(`/api/holerites/${holerite.id}/pdf`)
const blob = await response.blob()
a.download = `holerite-${nomeArquivo}-${periodo}.pdf` // ❌ Extensão errada
```

**Depois (CORRETO):**
```typescript
const baixarPDF = async (holerite: Holerite) => {
  try {
    loading.value = true
    
    // Abrir holerite em nova aba para visualização
    window.open(`/api/holerites/${holerite.id}/pdf`, '_blank')
    
    // Notificação de sucesso
    const { notifySuccess } = useNotifications()
    notifySuccess(
      'Holerite Aberto!',
      `Holerite de ${holerite.funcionario?.nome_completo || 'funcionário'} aberto em nova aba. Use Ctrl+P para imprimir como PDF.`
    )
  } catch (error) {
    console.error('Erro ao abrir holerite:', error)
    const { notifyError } = useNotifications()
    notifyError(
      'Erro ao Abrir!',
      'Erro ao abrir holerite. Tente novamente.'
    )
  } finally {
    loading.value = false
  }
}
```

### 3. Botão Atualizado (`app/components/holerites/HoleriteModal.vue`)

**Removido:**
- ❌ Botão "Baixar HTML"
- ❌ Função `baixarHTML()`

**Mantido:**
- ✅ Botão "Visualizar/Imprimir"
- ✅ Abre em nova aba
- ✅ Usuário imprime como PDF (Ctrl+P)

## Como Funciona Agora

### Fluxo Correto

1. **Usuário clica em "Visualizar/Imprimir"**
2. **Sistema abre nova aba** com o holerite HTML formatado
3. **Holerite é exibido** com layout responsivo e profissional
4. **Usuário pode:**
   - Visualizar o holerite
   - Imprimir (Ctrl+P ou Cmd+P)
   - Salvar como PDF na janela de impressão
   - Compartilhar a URL

### Vantagens

✅ **Funciona perfeitamente** - HTML é renderizado corretamente  
✅ **Sem erros** - Não tenta abrir HTML como PDF  
✅ **Responsivo** - Layout se adapta a qualquer tela  
✅ **Profissional** - CSS otimizado para impressão  
✅ **Flexível** - Usuário decide se quer PDF ou apenas visualizar  
✅ **Rápido** - Não precisa gerar PDF no servidor  

## Arquivos Modificados

1. ✅ `server/api/holerites/[id]/pdf.get.ts` - Remove header de download forçado
2. ✅ `app/pages/admin/holerites.vue` - Simplifica função para abrir em nova aba
3. ✅ `app/components/holerites/HoleriteModal.vue` - Remove botão HTML, renomeia botão

## Teste de Validação

Para testar se está funcionando:

1. Acesse `/admin/holerites`
2. Clique em "Ver" em qualquer holerite
3. Clique em "Visualizar/Imprimir"
4. **Resultado esperado:** Nova aba abre com holerite formatado
5. Pressione Ctrl+P para testar impressão
6. **Resultado esperado:** Janela de impressão abre com opção "Salvar como PDF"

## Observações Importantes

- ✅ O HTML já está otimizado para impressão com `@media print`
- ✅ Layout responsivo funciona em mobile, tablet e desktop
- ✅ Assinatura digital incluída no HTML
- ✅ Todas as informações (vencimentos, descontos, bases) estão presentes
- ✅ Não há mais tentativa de baixar HTML como PDF

## Próximos Passos (Se Necessário)

Se no futuro for necessário gerar PDF real no servidor:

1. Instalar `puppeteer` ou `playwright`
2. Criar endpoint `/api/holerites/[id]/pdf-real`
3. Gerar PDF a partir do HTML usando headless browser
4. Retornar com `Content-Type: application/pdf`

**Por enquanto, a solução atual atende perfeitamente às necessidades.**
