# Guia de Teste: Download de PDF no Painel Admin

**Data:** 10/02/2026  
**Objetivo:** Validar correção do botão "Baixar PDF" no painel admin

## 🎯 Cenário de Teste

Testar se o botão "Baixar PDF" no modal de visualização do painel admin está funcionando corretamente.

## 📋 Passo a Passo

### 1. Acessar Painel Admin
```
URL: http://localhost:3000/admin/holerites
```

### 2. Visualizar um Holerite
- Localize qualquer holerite na lista
- Clique no botão **"👁️ Ver"**
- O modal de visualização deve abrir

### 3. Testar Download de PDF
- No modal, localize os botões de download no rodapé
- Clique em **"📄 Baixar PDF"**

### 4. Verificar Resultado Esperado
✅ **Sucesso:**
- Uma nova aba do navegador deve abrir
- O holerite deve aparecer formatado para impressão
- Você pode usar Ctrl+P para salvar como PDF

❌ **Falha:**
- Nada acontece ao clicar
- Erro no console do navegador
- Aba abre mas não carrega conteúdo

### 5. Testar Download de HTML (Comparação)
- Clique em **"📄 Baixar HTML"**
- Um arquivo HTML deve ser baixado automaticamente
- Ambos os botões devem funcionar

## 🔍 Verificações Adicionais

### Console do Navegador (F12)
Não deve haver erros relacionados a:
- `baixarPDF is not defined`
- `Cannot read property 'id' of undefined`
- Erros 404 ou 500 na API

### Logs do Terminal
Deve aparecer:
```
📄 Gerando holerite HTML para ID: {id}
```

## 🐛 Troubleshooting

### Problema: Botão não faz nada
**Solução:** Verifique se o servidor está rodando e reinicie

### Problema: Erro 404 na API
**Solução:** Verifique se o holerite existe no banco de dados

### Problema: Aba abre mas não carrega
**Solução:** Verifique logs do servidor para erros na API

## ✅ Critérios de Sucesso

- [ ] Botão "Baixar PDF" está visível no modal
- [ ] Clicar no botão abre nova aba
- [ ] Nova aba carrega o holerite formatado
- [ ] É possível imprimir/salvar como PDF (Ctrl+P)
- [ ] Não há erros no console
- [ ] Botão "Baixar HTML" continua funcionando

## 📝 Resultado do Teste

**Data do Teste:** ___/___/______  
**Testado por:** _________________  
**Status:** ⬜ Passou ⬜ Falhou  
**Observações:**
_________________________________
_________________________________
_________________________________
