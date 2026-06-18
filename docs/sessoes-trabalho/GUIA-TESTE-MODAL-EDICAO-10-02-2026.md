# Guia de Teste: Modal de Edição de Holerite

**Data:** 10/02/2026  
**Objetivo:** Validar que as alterações no modal agora persistem corretamente

## 🧪 Teste 1: Salvar com Campos Vazios

### Passos:
1. Abrir http://localhost:3000/admin/holerites
2. Clicar em "✏️ Editar" em qualquer holerite
3. **Limpar** alguns campos numéricos (deixar vazios):
   - Bônus
   - Horas Extras
   - Adicional Noturno
4. Clicar em "💾 Salvar Alterações"

### Resultado Esperado:
- ✅ Modal fecha sem erro
- ✅ Mensagem de sucesso aparece
- ✅ Não aparece erro 500 no console
- ✅ Campos vazios são salvos como 0

### Resultado Anterior (com bug):
- ❌ Erro 500: "invalid input syntax for type numeric"
- ❌ Modal não fecha
- ❌ Alterações não são salvas

---

## 🧪 Teste 2: Editar e Reabrir

### Passos:
1. Editar um holerite
2. Alterar o **Salário Base** para 5000
3. Alterar **Dias Trabalhados** para 25
4. Clicar em "💾 Salvar Alterações"
5. **Reabrir** o mesmo holerite para edição

### Resultado Esperado:
- ✅ Salário Base mostra 5000
- ✅ Dias Trabalhados mostra 25
- ✅ Valores persistiram corretamente
- ✅ Salário Proporcional recalculado: 5000 ÷ 30 × 25 = 4166,67

### Resultado Anterior (com bug):
- ❌ Valores voltavam aos originais
- ❌ Alterações não persistiam

---

## 🧪 Teste 3: Recálculo Automático

### Passos:
1. Editar um holerite
2. Ir para aba "Descontos"
3. Configurar **INSS** como "Percentual" com 8%
4. Configurar **Pensão Alimentícia** como "Percentual" com 30%
5. Voltar para aba "Dados Básicos"
6. Alterar **Dias Trabalhados** de 30 para 20
7. Observar os valores recalcularem automaticamente
8. Clicar em "💾 Salvar Alterações"
9. Reabrir o holerite

### Resultado Esperado:
- ✅ INSS recalculado para 8% do novo salário proporcional
- ✅ Pensão recalculada para 30% do novo líquido
- ✅ Adiantamento recalculado para 40% do novo salário
- ✅ Valores persistem após reabrir

---

## 🧪 Teste 4: Campos de Texto

### Passos:
1. Editar um holerite
2. Adicionar texto no campo **Observações**: "Teste de persistência"
3. Alterar **Data de Pagamento**
4. Clicar em "💾 Salvar Alterações"
5. Reabrir o holerite

### Resultado Esperado:
- ✅ Observações aparecem corretamente
- ✅ Data de pagamento está correta
- ✅ Campos de texto persistem

---

## 🧪 Teste 5: Múltiplas Edições

### Passos:
1. Editar um holerite
2. Alterar vários campos
3. Salvar
4. Editar novamente
5. Alterar outros campos
6. Salvar
7. Editar pela terceira vez

### Resultado Esperado:
- ✅ Todas as alterações anteriores estão visíveis
- ✅ Nenhum valor foi perdido
- ✅ Histórico de alterações mantido

---

## 🔍 Como Verificar no Console

### Console do Navegador (F12):
```javascript
// Deve aparecer ao salvar:
✅ Holerite atualizado com sucesso

// NÃO deve aparecer:
❌ ERROR Erro ao atualizar holerite
❌ invalid input syntax for type numeric
```

### Terminal do Servidor:
```bash
# Deve aparecer ao salvar:
🧮 Recalculando totais do holerite: { ... }

# NÃO deve aparecer:
❌ ERROR Erro ao atualizar holerite: { code: '22P02' }
```

---

## 📊 Checklist de Validação

Marque cada item após testar:

- [ ] Campos vazios salvam sem erro
- [ ] Alterações persistem ao reabrir
- [ ] Recálculo automático funciona
- [ ] Campos de texto salvam corretamente
- [ ] Múltiplas edições funcionam
- [ ] Não há erro 500 no console
- [ ] Mensagem de sucesso aparece
- [ ] Modal fecha após salvar

---

## 🚨 Se Encontrar Problemas

### Problema: Ainda aparece erro 500
**Solução:**
1. Verificar se o servidor está rodando: `npm run dev`
2. Verificar se as variáveis de ambiente estão corretas (.env)
3. Limpar cache do navegador (Ctrl+Shift+Delete)
4. Reiniciar o servidor

### Problema: Alterações não persistem
**Solução:**
1. Verificar logs do terminal
2. Executar script de teste: `node scripts/testar-correcao-campos-vazios.js`
3. Verificar conexão com Supabase

### Problema: Valores não recalculam
**Solução:**
1. Verificar se está em modo "Percentual" (não "Fixo")
2. Verificar console do navegador para erros JavaScript
3. Recarregar a página (F5)

---

## ✅ Teste Passou?

Se todos os testes passaram:
- 🎉 **Correção funcionando perfeitamente!**
- 📝 Marcar como concluído no checklist
- 🚀 Pronto para deploy em produção

Se algum teste falhou:
- 📋 Anotar qual teste falhou
- 🔍 Verificar logs do console e terminal
- 💬 Reportar o problema com detalhes
