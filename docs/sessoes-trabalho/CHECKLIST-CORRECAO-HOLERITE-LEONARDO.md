# ✅ Checklist: Correção do Holerite do Leonardo

## 📋 ANTES DE COMEÇAR

- [ ] Fazer backup do banco de dados (opcional, mas recomendado)
- [ ] Anotar valores atuais para comparação
- [ ] Ter acesso ao painel admin do sistema

---

## 🔍 ETAPA 1: VERIFICAÇÃO (5 minutos)

### 1.1 Executar Script de Verificação
```bash
node scripts/verificar-registros-pensao-leonardo.js
```

**O que verificar**:
- [ ] Quantos registros de pensão existem?
- [ ] Quantos estão ativos?
- [ ] Quais são os valores?

### 1.2 Anotar Informações
```
Registro 1:
  ID: _____
  Valor: R$ _____
  Status: [ ] Ativo  [ ] Inativo

Registro 2:
  ID: _____
  Valor: R$ _____
  Status: [ ] Ativo  [ ] Inativo
```

### 1.3 Decidir Qual Valor Manter
- [ ] Consultar RH/Financeiro sobre valor correto
- [ ] Anotar qual registro deve ficar ativo: ID _____

---

## 🔧 ETAPA 2: CORREÇÃO DE REGISTROS (3 minutos)

### 2.1 Se Houver Múltiplos Registros Ativos

**Opção A: Via Supabase (Recomendado)**
1. [ ] Acessar Supabase → Table Editor
2. [ ] Abrir tabela `holerite_itens_personalizados`
3. [ ] Localizar registro antigo (ID: _____)
4. [ ] Editar campo `data_fim` para `2026-01-31`
5. [ ] Salvar alteração

**Opção B: Via SQL**
```sql
UPDATE holerite_itens_personalizados
SET data_fim = '2026-01-31'
WHERE id = _____; -- ID do registro antigo
```

### 2.2 Verificar Correção
```sql
SELECT id, valor, data_inicio, data_fim
FROM holerite_itens_personalizados
WHERE funcionario_id = 156
  AND tipo = 'desconto'
  AND descricao ILIKE '%pensao%'
  AND data_fim IS NULL;
```

**Resultado esperado**: Apenas 1 registro ativo
- [ ] ✅ Apenas 1 registro retornado
- [ ] ✅ Valor correto: R$ _____

---

## 🔄 ETAPA 3: REGERAR HOLERITE (3 minutos)

### 3.1 Excluir Holerite Atual
1. [ ] Acessar: Admin → Holerites
2. [ ] Localizar: Leonardo Ramos da Silva
3. [ ] Clicar: Botão "🗑️ Excluir"
4. [ ] Confirmar exclusão

### 3.2 Gerar Novo Holerite
1. [ ] Clicar: "📄 Gerar Folha Mensal"
2. [ ] ✅ Marcar: "🔄 Recriar holerites existentes"
3. [ ] Clicar: "✓ Confirmar Geração"
4. [ ] Aguardar mensagem de sucesso

### 3.3 Aguardar Processamento
- [ ] Mensagem de sucesso exibida
- [ ] Holerite aparece na listagem

---

## ✅ ETAPA 4: VALIDAÇÃO (5 minutos)

### 4.1 Verificar Listagem
1. [ ] Localizar holerite do Leonardo na listagem
2. [ ] Anotar salário líquido: R$ _____
3. [ ] Verificar se está correto (aproximadamente R$ 813,42)

### 4.2 Verificar Modal
1. [ ] Clicar em "👁️ Ver" no holerite
2. [ ] Verificar seção "Descontos"
3. [ ] Confirmar que pensão aparece: R$ _____
4. [ ] Verificar salário líquido: R$ _____
5. [ ] Valores devem ser iguais à listagem

### 4.3 Verificar HTML
1. [ ] Clicar em "📄 Baixar HTML"
2. [ ] Abrir arquivo HTML
3. [ ] Verificar seção "Descontos"
4. [ ] Confirmar que pensão aparece: R$ _____
5. [ ] Verificar salário líquido: R$ _____
6. [ ] Valores devem ser iguais à listagem e modal

### 4.4 Comparação Final
```
┌─────────────────┬──────────────┬────────┐
│ Local           │ Valor        │ Status │
├─────────────────┼──────────────┼────────┤
│ Listagem        │ R$ ______    │ [ ] ✅ │
│ Modal           │ R$ ______    │ [ ] ✅ │
│ HTML            │ R$ ______    │ [ ] ✅ │
└─────────────────┴──────────────┴────────┘
```

**Todos os valores devem ser IGUAIS!**

---

## 🎯 ETAPA 5: TESTE COMPLETO (5 minutos)

### 5.1 Testar Edição
1. [ ] Clicar em "✏️ Editar" no holerite
2. [ ] Verificar que campo "Pensão Alimentícia" aparece
3. [ ] Verificar que valor está correto
4. [ ] Cancelar (não salvar)

### 5.2 Testar Envio de Email (Opcional)
1. [ ] Clicar em "📧 Enviar"
2. [ ] Confirmar envio
3. [ ] Verificar email recebido
4. [ ] Abrir holerite anexo
5. [ ] Confirmar valores corretos

### 5.3 Testar Download PDF (Opcional)
1. [ ] Clicar em "📄 Baixar PDF"
2. [ ] Abrir arquivo PDF
3. [ ] Verificar valores
4. [ ] Confirmar que pensão aparece

---

## 📊 RESULTADO ESPERADO

### Valores Corretos (Exemplo)
```
Salário Base:        R$ 1.775,42
INSS:                R$ 0,00 (PJ)
IRRF:                R$ 0,00 (PJ)
Pensão Alimentícia:  R$ 962,00
─────────────────────────────────
Total Descontos:     R$ 962,00
Salário Líquido:     R$ 813,42 ✅
```

### Checklist Final
- [ ] ✅ Listagem mostra valor correto
- [ ] ✅ Modal mostra valor correto
- [ ] ✅ HTML mostra valor correto
- [ ] ✅ PDF mostra valor correto (se testado)
- [ ] ✅ Email mostra valor correto (se testado)
- [ ] ✅ Todos os valores são IGUAIS
- [ ] ✅ Pensão aparece em todos os lugares

---

## 🚨 TROUBLESHOOTING

### Problema: Valores ainda diferentes
**Solução**:
1. Verificar se apenas 1 registro está ativo na tabela
2. Excluir e regerar holerite novamente
3. Limpar cache do navegador (Ctrl + Shift + R)

### Problema: Pensão não aparece
**Solução**:
1. Verificar se registro tem `data_fim` NULL
2. Verificar se `vigencia_tipo` é "recorrente"
3. Verificar se `data_inicio` é anterior ao período do holerite

### Problema: Erro ao gerar holerite
**Solução**:
1. Verificar logs do servidor
2. Verificar se funcionário está ativo
3. Verificar se não há outros holerites para o mesmo período

---

## 📞 SUPORTE

Se algo não funcionar:

1. **Verificar logs**:
   ```bash
   # Terminal do servidor
   npm run dev
   ```

2. **Executar script de diagnóstico**:
   ```bash
   node scripts/verificar-registros-pensao-leonardo.js
   ```

3. **Consultar documentação**:
   - `SITUACAO-COMPLETA-HOLERITE-LEONARDO-06-02-2026.md`
   - `GUIA-REGERAR-HOLERITE-LEONARDO.md`
   - `EXPLICACAO-DIFERENCA-VALORES-LEONARDO.md`

---

## ✅ CONCLUSÃO

- [ ] Todas as etapas concluídas
- [ ] Todos os valores corretos
- [ ] Sistema funcionando 100%
- [ ] Documentação atualizada

**Tempo total**: 15-20 minutos  
**Dificuldade**: Fácil  
**Resultado**: Sistema 100% funcional! 🎉

---

**Data**: 06/02/2026  
**Versão**: 1.0  
**Status**: ✅ PRONTO PARA USO
