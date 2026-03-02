# Como Usar: Pensão Alimentícia com Percentual

**Data:** 10 de Fevereiro de 2026  
**Funcionalidade:** Cálculo automático de pensão alimentícia por percentual

---

## ✅ Funcionalidade Implementada!

O sistema Qualitec já possui a funcionalidade de calcular pensão alimentícia por percentual do salário líquido!

---

## 📍 Onde Encontrar

**Caminho:** Admin → Holerites → Editar Holerite → Aba "Descontos"

Na seção de descontos, você encontrará um card especial para **Pensão Alimentícia** com as seguintes opções:

---

## 🎯 Como Usar

### 1. Tipo de Cálculo

Você pode escolher entre:

**💵 Valor Fixo:**
- Digite o valor em reais
- Exemplo: R$ 962,00
- O mesmo valor será descontado todo mês

**📊 Percentual do Líquido:**
- Digite o percentual (ex: 30)
- O sistema calcula automaticamente sobre o salário líquido
- Fórmula: `Pensão = (Salário Bruto - INSS - IRRF) × Percentual%`

### 2. Recorrência

**📅 Apenas este mês:**
- O desconto será aplicado somente neste holerite
- Não afeta os próximos meses
- Ideal para descontos únicos ou ajustes pontuais

**🔄 Recorrente (todos os meses):**
- O desconto será aplicado automaticamente nos próximos holerites
- Ideal para pensão alimentícia permanente
- Será salvo como "Item Personalizado" do funcionário

---

## 🧮 Exemplo Prático

### Caso: Pensão de 30% do Líquido

**Dados do Funcionário:**
- Salário Bruto: R$ 3.466,67
- INSS: R$ 304,58
- IRRF: R$ 0,00

**Cálculo Automático:**
```
1. Salário Líquido Base:
   R$ 3.466,67 - R$ 304,58 - R$ 0,00 = R$ 3.162,09

2. Pensão (30%):
   R$ 3.162,09 × 30% = R$ 948,63

3. Salário Líquido Final:
   R$ 3.162,09 - R$ 948,63 = R$ 2.213,46
```

O sistema mostra esse cálculo detalhado em tempo real!

---

## 📊 Visualização no Sistema

Quando você seleciona "Percentual do Líquido", o sistema exibe:

```
┌─────────────────────────────────────────┐
│ Salário Bruto:          R$ 3.466,67     │
│ (-) INSS:               R$   304,58     │
│ (-) IRRF:               R$     0,00     │
│ ─────────────────────────────────────── │
│ Salário Líquido (base): R$ 3.162,09     │
│ ═════════════════════════════════════   │
│ Pensão (30%):           R$   948,63     │
└─────────────────────────────────────────┘
```

---

## ⚙️ Configuração Passo a Passo

### Para Pensão Percentual Recorrente:

1. **Edite o holerite** do funcionário
2. Vá para a aba **"Descontos"**
3. Na seção **"Pensão Alimentícia"**:
   - Tipo de Cálculo: **📊 Percentual do Líquido**
   - Percentual: **30** (ou o valor da decisão judicial)
   - Recorrência: **🔄 Recorrente (todos os meses)**
4. Clique em **"Salvar Alterações"**

O sistema irá:
- Calcular automaticamente o valor da pensão
- Aplicar nos próximos holerites
- Recalcular se houver mudança no salário

### Para Pensão Fixa:

1. **Edite o holerite** do funcionário
2. Vá para a aba **"Descontos"**
3. Na seção **"Pensão Alimentícia"**:
   - Tipo de Cálculo: **💵 Valor Fixo**
   - Valor: **962.00** (digite o valor)
   - Recorrência: **🔄 Recorrente** ou **📅 Apenas este mês**
4. Clique em **"Salvar Alterações"**

---

## 💡 Dicas Importantes

### Quando Usar Percentual:
- Decisão judicial determina percentual (ex: 30% do líquido)
- Salário varia mensalmente (horas extras, comissões)
- Quer cálculo automático

### Quando Usar Valor Fixo:
- Decisão judicial determina valor fixo (ex: R$ 500,00)
- Salário é estável
- Quer controle manual

### Recorrência:
- **Recorrente:** Para pensão permanente (recomendado)
- **Apenas este mês:** Para ajustes pontuais ou descontos únicos

---

## ⚠️ Observações Legais

1. **Limite de 50%:** O sistema não valida automaticamente o limite legal de 50% dos ganhos líquidos. Verifique manualmente.

2. **IRRF:** A pensão alimentícia judicial é dedutível do IRRF. O sistema considera isso no cálculo.

3. **Decisão Judicial:** Sempre siga rigorosamente o texto da decisão judicial quanto a:
   - Percentual ou valor
   - Base de cálculo
   - Verbas incluídas/excluídas

4. **13º e Férias:** Se a decisão determinar incidência sobre 13º e férias, você precisará ajustar manualmente nesses meses.

---

## 🔄 Atualização Automática

Quando configurado como **Recorrente**, o sistema:

✅ Aplica automaticamente nos próximos holerites  
✅ Recalcula se houver mudança no salário  
✅ Mantém o percentual configurado  
✅ Salva como "Item Personalizado" do funcionário  

---

## 📝 Exemplo de Uso Completo

### Cenário: Leonardo - Pensão de 30% do Líquido

**Passo 1:** Editar holerite de Leonardo

**Passo 2:** Configurar pensão:
- Tipo: Percentual do Líquido
- Percentual: 30%
- Recorrência: Recorrente

**Passo 3:** Sistema calcula automaticamente:
- Salário Líquido Base: R$ 3.162,09
- Pensão (30%): R$ 948,63

**Passo 4:** Salvar

**Resultado:**
- Holerite atual: Pensão de R$ 948,63
- Próximos meses: Pensão recalculada automaticamente
- Se salário mudar para R$ 4.000,00:
  - Novo líquido base: R$ 3.600,00 (exemplo)
  - Nova pensão: R$ 1.080,00 (30%)

---

## ❓ Dúvidas Frequentes

**P: O percentual é sobre o bruto ou líquido?**  
R: Sobre o **líquido** (após INSS e IRRF).

**P: Posso mudar de percentual para fixo depois?**  
R: Sim, basta editar o holerite e mudar o tipo de cálculo.

**P: O que acontece se eu mudar o salário?**  
R: Se for percentual, o sistema recalcula automaticamente. Se for fixo, mantém o mesmo valor.

**P: Como remover a pensão?**  
R: Edite o holerite e zere o valor ou percentual.

**P: A pensão aparece no email do funcionário?**  
R: Sim, aparece como "PENSÃO ALIMENTÍCIA" na seção de descontos.

---

## 🎉 Pronto!

A funcionalidade está completa e pronta para uso. Qualquer dúvida, consulte este guia ou entre em contato com o suporte.

**Última atualização:** 10/02/2026
