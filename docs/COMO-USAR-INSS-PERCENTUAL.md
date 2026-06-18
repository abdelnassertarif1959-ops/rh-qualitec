# Como Usar: INSS com Percentual Automático

**Data:** 10 de Fevereiro de 2026  
**Funcionalidade:** Cálculo automático de INSS por percentual do salário bruto

---

## ✅ Funcionalidade Implementada!

O sistema Qualitec agora possui cálculo automático de INSS por percentual do salário bruto!

---

## 📍 Onde Encontrar

**Caminho:** Admin → Holerites → Editar Holerite → Aba "Descontos"

Na seção de descontos, você encontrará um card especial para **🏛️ INSS** com as seguintes opções:

---

## 🎯 Como Usar

### 1. Tipo de Cálculo

Você pode escolher entre:

**💵 Valor Fixo:**
- Digite o valor em reais
- Exemplo: R$ 304,58
- Use quando já calculou manualmente

**📊 Percentual do Salário Bruto:**
- Digite o percentual (ex: 7.5)
- O sistema calcula automaticamente sobre o salário bruto
- Fórmula: `INSS = Salário Bruto × Percentual%`

---

## 📊 Tabela INSS 2026

| Faixa Salarial | Alíquota |
|----------------|----------|
| Até R$ 1.412,00 | 7,5% |
| R$ 1.412,01 a R$ 2.666,68 | 9% |
| R$ 2.666,69 a R$ 4.000,03 | 12% |
| R$ 4.000,04 a R$ 7.786,02 | 14% |

**Teto:** R$ 908,85

---

## 🧮 Exemplo Prático

### Caso 1: INSS com Percentual Simples

**Dados do Funcionário:**
- Salário Bruto: R$ 3.466,67
- Percentual INSS: 9% (segunda faixa)

**Cálculo Automático:**
```
INSS = R$ 3.466,67 × 9%
INSS = R$ 312,00
```

### Caso 2: INSS com Tabela Progressiva

Para cálculo correto com tabela progressiva, você deve:

1. Calcular manualmente usando a tabela progressiva
2. Usar a opção "Valor Fixo"
3. Ou usar percentual médio aproximado

**Exemplo de Cálculo Progressivo:**
```
Salário: R$ 3.466,67

Faixa 1: R$ 1.412,00 × 7,5% = R$ 105,90
Faixa 2: R$ 1.254,68 × 9% = R$ 112,92
Faixa 3: R$ 799,99 × 12% = R$ 96,00
Total INSS: R$ 314,82
```

---

## ⚙️ Configuração Passo a Passo

### Para INSS Percentual:

1. **Edite o holerite** do funcionário
2. Vá para a aba **"Descontos"**
3. Na seção **"INSS"**:
   - Tipo de Cálculo: **📊 Percentual do Salário Bruto**
   - Percentual: **7.5** (ou a alíquota correspondente)
4. O sistema calcula automaticamente
5. Clique em **"Salvar Alterações"**

### Para INSS Fixo:

1. **Edite o holerite** do funcionário
2. Vá para a aba **"Descontos"**
3. Na seção **"INSS"**:
   - Tipo de Cálculo: **💵 Valor Fixo**
   - Valor: **304.58** (digite o valor calculado)
4. Clique em **"Salvar Alterações"**

---

## 💡 Dicas Importantes

### Quando Usar Percentual:
- Salário fixo sem variações
- Funcionário em uma única faixa da tabela
- Quer cálculo rápido e automático
- Salário abaixo do teto

### Quando Usar Valor Fixo:
- Cálculo com tabela progressiva (recomendado)
- Salário próximo ou acima do teto
- Quer controle total sobre o valor
- Já tem o valor calculado

### Recorrência:
- INSS é **sempre recorrente** (aplicado todos os meses)
- Não há opção de "apenas este mês"
- Recalculado automaticamente se o salário mudar

---

## 📊 Visualização no Sistema

Quando você seleciona "Percentual do Salário Bruto", o sistema exibe:

```
┌─────────────────────────────────────────┐
│ Salário Bruto:          R$ 3.466,67     │
│ ─────────────────────────────────────── │
│ INSS (9%):              R$   312,00     │
└─────────────────────────────────────────┘
```

---

## ⚠️ Observações Importantes

1. **Tabela Progressiva:** O cálculo por percentual simples não considera a tabela progressiva. Para cálculo exato, use "Valor Fixo" com o valor calculado manualmente.

2. **Teto do INSS:** O sistema não aplica automaticamente o teto de R$ 908,85. Verifique manualmente.

3. **Salário Variável:** Se o funcionário tem horas extras ou comissões, o INSS será recalculado sobre o novo salário bruto.

4. **Base de Cálculo:** O INSS incide sobre:
   - Salário base
   - Horas extras
   - Adicionais (noturno, periculosidade, insalubridade)
   - Comissões
   - Bônus

5. **Não Incide Sobre:**
   - Vale transporte
   - Vale refeição/alimentação
   - Ajuda de custo
   - Benefícios não salariais

---

## 🔄 Atualização Automática

Quando configurado como **Percentual**, o sistema:

✅ Recalcula automaticamente se o salário mudar  
✅ Considera todos os proventos (horas extras, bônus, etc.)  
✅ Atualiza em tempo real ao editar valores  
✅ Aplica em todos os holerites futuros  

---

## 📝 Exemplo de Uso Completo

### Cenário: Funcionário com Salário Fixo

**Passo 1:** Editar holerite

**Passo 2:** Configurar INSS:
- Tipo: Percentual do Salário Bruto
- Percentual: 9%

**Passo 3:** Sistema calcula automaticamente:
- Salário Bruto: R$ 3.466,67
- INSS (9%): R$ 312,00

**Passo 4:** Salvar

**Resultado:**
- Holerite atual: INSS de R$ 312,00
- Próximos meses: INSS recalculado automaticamente
- Se salário mudar para R$ 4.000,00:
  - Novo INSS: R$ 360,00 (9%)

---

## ❓ Dúvidas Frequentes

**P: O percentual é sobre o bruto ou líquido?**  
R: Sobre o **bruto** (antes de qualquer desconto).

**P: O sistema aplica a tabela progressiva automaticamente?**  
R: Não. Use "Valor Fixo" para cálculo progressivo correto.

**P: Posso mudar de percentual para fixo depois?**  
R: Sim, basta editar o holerite e mudar o tipo de cálculo.

**P: O que acontece se eu adicionar horas extras?**  
R: Se for percentual, o sistema recalcula automaticamente sobre o novo bruto.

**P: Como aplicar o teto do INSS?**  
R: Use "Valor Fixo" e digite R$ 908,85 (teto 2026).

**P: O INSS aparece no email do funcionário?**  
R: Sim, aparece como "INSS" na seção de descontos.

---

## 🎯 Recomendação

Para **cálculo correto e legal**, recomendamos:

1. **Calcular manualmente** usando a tabela progressiva
2. **Usar "Valor Fixo"** com o valor calculado
3. **Verificar o teto** de R$ 908,85

Ou use ferramentas de cálculo de INSS online e insira o valor final.

---

## 🎉 Pronto!

A funcionalidade está completa e pronta para uso. Use com atenção às regras da tabela progressiva!

**Última atualização:** 10/02/2026
