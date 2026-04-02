# Instruções para Testar Data de Referência

## ⚠️ IMPORTANTE: Reiniciar o Servidor

As alterações no código só funcionarão após reiniciar o servidor de desenvolvimento!

```bash
# Parar o servidor (Ctrl+C)
# Depois iniciar novamente:
npm run dev
```

## 📋 Passo a Passo para Testar

### 1. Reiniciar o Servidor
- Pare o servidor atual (Ctrl+C no terminal)
- Inicie novamente: `npm run dev`
- Aguarde o servidor iniciar completamente

### 2. Limpar Cache do Navegador
- Abra o DevTools (F12)
- Clique com botão direito no ícone de recarregar
- Selecione "Limpar cache e recarregar forçadamente"

### 3. Testar Upload com Data Antiga

#### Na Área Admin:
1. Acesse a lista de funcionários
2. Clique em "Anexar" no card de um funcionário
3. Selecione o tipo de documento
4. **IMPORTANTE:** Altere a data de referência para uma data antiga (ex: 01/01/2024)
5. Adicione descrição (opcional)
6. Selecione um arquivo
7. Clique em "Enviar"

#### Verificar no Banco:
```bash
node scripts/ver-ultimo-documento.js
```

Isso mostrará:
- Nome do arquivo
- Data de criação (hoje)
- Data de referência (a que você selecionou)
- Se são diferentes ou iguais

### 4. Verificar na Interface

#### Na Área Admin (Documentos):
- A data deve aparecer como "02/04/2026, 14:XX" (data de criação)
- Mas internamente está salva a data de referência

#### Na Área do Funcionário:
- Deve mostrar "Ref: 01/01/2024" (ou a data que você selecionou)

## 🐛 Se Ainda Não Funcionar

### Verificar Console do Navegador
1. Abra DevTools (F12)
2. Vá para a aba "Network"
3. Faça o upload de um documento
4. Clique na requisição `/api/admin/documentos/upload` ou `/api/funcionarios/documentos/upload`
5. Vá para a aba "Payload" ou "Request"
6. Verifique se `data_referencia` está sendo enviada

### Verificar Response
1. Na mesma requisição, vá para a aba "Response"
2. Verifique se o documento retornado tem `data_referencia`

### Executar Script de Diagnóstico
```bash
node scripts/ver-ultimo-documento.js
```

Isso mostrará exatamente o que está no banco de dados.

## 📝 O Que Deve Acontecer

### Comportamento Correto:
1. Você seleciona data: **01/01/2024**
2. Faz upload hoje: **02/04/2026**
3. No banco fica salvo:
   - `criado_em`: 2026-04-02 14:XX:XX
   - `data_referencia`: 2024-01-01
4. Na interface mostra: **"Ref: 01/01/2024"**

### Se Estiver Errado:
- Mostra: "Ref: 02/04/2026" (data de hoje)
- Significa que `data_referencia` não está sendo enviada ou salva

## 🔧 Troubleshooting

### Problema: Data sempre aparece como hoje
**Solução:**
1. Reinicie o servidor
2. Limpe o cache do navegador
3. Verifique o console do navegador (Network tab)
4. Execute `node scripts/ver-ultimo-documento.js`

### Problema: Campo de data não aparece no modal
**Solução:**
1. Verifique se está usando o componente correto
2. Reinicie o servidor
3. Force reload (Ctrl+Shift+R)

### Problema: Erro ao salvar
**Solução:**
1. Verifique se a migration foi executada no Supabase
2. Execute: `node scripts/verificar-coluna-data-referencia.js`
3. Se a coluna não existir, execute a migration no SQL Editor do Supabase

## ✅ Checklist

- [ ] Servidor reiniciado
- [ ] Cache do navegador limpo
- [ ] Campo de data aparece no modal
- [ ] Data pode ser alterada
- [ ] Upload realizado com sucesso
- [ ] Script de verificação executado
- [ ] Data de referência diferente da data de criação
- [ ] Interface mostra "Ref: DD/MM/AAAA" com a data correta

---

**Se seguir todos esses passos e ainda não funcionar, execute:**
```bash
node scripts/ver-ultimo-documento.js
```

E me envie o resultado para eu poder ajudar melhor!
