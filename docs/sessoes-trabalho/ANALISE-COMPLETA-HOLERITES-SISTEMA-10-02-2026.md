# Análise Completa: Sistema de Holerites - Visualização e Estrutura
**Data:** 10/02/2026  
**Versão:** 1.0

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Proventos (Vencimentos)](#proventos-vencimentos)
4. [Descontos](#descontos)
5. [Visualização para Funcionários](#visualização-para-funcionários)
6. [Visualização PDF/HTML](#visualização-pdfhtml)
7. [Bases de Cálculo](#bases-de-cálculo)
8. [Regras de Negócio](#regras-de-negócio)
9. [Exemplos Reais](#exemplos-reais)

---

## 🎯 Visão Geral

O sistema de holerites da Qualitec gerencia folhas de pagamento para funcionários CLT e PJ, com suporte a:
- Folhas mensais completas
- Adiantamentos salariais (40%)
- Salários proporcionais (dias trabalhados)
- Descontos personalizados
- Pensão alimentícia
- Bases de cálculo (INSS, IRRF, FGTS)

### Tipos de Holerite

1. **Folha Mensal** (Azul 📊)
   - Período: 01 ao último dia do mês
   - Pagamento: 5º dia útil do mês seguinte
   - Mostra bases de cálculo completas
   - Inclui todos os descontos

2. **Adiantamento Salarial** (Laranja 💰)
   - Período: 15 ao último dia do mês
   - Pagamento: Dia 20 do mesmo mês
   - Valor: 40% do salário bruto
   - NÃO mostra bases de cálculo

3. **PJ (Pessoa Jurídica)**
   - Sem descontos de INSS/IRRF
   - NÃO mostra bases de cálculo
   - Apenas salário base e descontos opcionais

---

## 📊 Estrutura de Dados

### Tabela: `holerites`

```sql
-- Campos principais
id                          BIGINT
funcionario_id              BIGINT
periodo_inicio              DATE
periodo_fim                 DATE
data_pagamento              DATE
observacoes                 TEXT

-- Salário e dias
salario_base                DECIMAL(10,2)
dias_trabalhados            INTEGER (padrão: 30)

-- Proventos
bonus                       DECIMAL(10,2)
horas_extras                DECIMAL(10,2)
adicional_noturno           DECIMAL(10,2)
adicional_periculosidade    DECIMAL(10,2)
adicional_insalubridade     DECIMAL(10,2)
comissoes                   DECIMAL(10,2)

-- Descontos
inss                        DECIMAL(10,2)
inss_tipo                   TEXT ('fixo' ou 'percentual')
inss_percentual             DECIMAL(5,2)
inss_referencia             TEXT
irrf                        DECIMAL(10,2)
vale_transporte             DECIMAL(10,2)
cesta_basica_desconto       DECIMAL(10,2)
plano_saude                 DECIMAL(10,2)
plano_odontologico          DECIMAL(10,2)
adiantamento                DECIMAL(10,2)
faltas                      DECIMAL(10,2)
pensao_alimenticia          DECIMAL(10,2)
pensao_tipo                 TEXT ('fixo' ou 'percentual')
pensao_percentual           DECIMAL(5,2)

-- Totais
total_proventos             DECIMAL(10,2)
total_descontos             DECIMAL(10,2)
salario_liquido             DECIMAL(10,2)

-- Bases de cálculo
fgts                        DECIMAL(10,2)
base_inss                   DECIMAL(10,2)
faixa_irrf                  TEXT
```

---

## 💵 Proventos (Vencimentos)

### 1. Salário Base (Código 8781)

**Descrição:** DIAS NORMAIS  
**Cálculo:** (Salário Base ÷ 30) × Dias Trabalhados  
**Referência:** Número de dias trabalhados (ex: 30.00, 25.00)

**Exemplo:**
- Salário Base: R$ 3.650,00
- Dias Trabalhados: 30
- Valor Dia: R$ 121,67
- **Salário Proporcional: R$ 3.650,00**

**Exemplo com dias reduzidos:**
- Salário Base: R$ 3.650,00
- Dias Trabalhados: 25
- Valor Dia: R$ 121,67
- **Salário Proporcional: R$ 3.041,67**

### 2. Bônus (Código 100)
**Descrição:** BÔNUS  
**Cálculo:** Valor fixo definido pelo admin  
**Uso:** Bônus de produtividade, metas, etc.

### 3. Horas Extras (Código 200)
**Descrição:** HORAS EXTRAS  
**Cálculo:** Valor total das horas extras trabalhadas  
**Uso:** Horas extras 50%, 100%, etc.

### 4. Adicional Noturno (Código 300)
**Descrição:** ADICIONAL NOTURNO  
**Cálculo:** Valor fixo ou percentual sobre salário  
**Uso:** Trabalho noturno (22h às 5h)

### 5. Adicional de Periculosidade (Código 400)
**Descrição:** ADICIONAL DE PERICULOSIDADE  
**Cálculo:** Geralmente 30% do salário base  
**Uso:** Trabalho com risco à vida

### 6. Adicional de Insalubridade (Código 500)
**Descrição:** ADICIONAL DE INSALUBRIDADE  
**Cálculo:** 10%, 20% ou 40% do salário mínimo  
**Uso:** Trabalho em condições insalubres

### 7. Comissões (Código 600)
**Descrição:** COMISSÕES  
**Cálculo:** Valor fixo ou percentual sobre vendas  
**Uso:** Comissões de vendas, metas

### 8. Benefícios Personalizados (Códigos 700+)
**Descrição:** Variável (definida pelo admin)  
**Cálculo:** Valor fixo  
**Uso:** Benefícios não previstos (ex: ajuda de custo)

---

## 📉 Descontos

### 1. INSS - Instituto Nacional do Seguro Social (Código 998)
**Descrição:** I.N.S.S.  
**Referência:** Percentual da alíquota (ex: 8.90, 9.00, 12.00)

**Modos de Cálculo:**

#### Modo Percentual (Automático)
- Sistema calcula baseado no salário bruto
- Percentual configurável (ex: 7.5%, 9%, 12%)
- Recalcula automaticamente ao mudar dias trabalhados

**Exemplo:**
- Salário Bruto: R$ 3.650,00
- Percentual: 8.9%
- **INSS: R$ 324,85**

#### Modo Fixo (Manual)
- Valor fixo digitado pelo admin
- Sistema calcula percentual automaticamente
- Referência gerada automaticamente

**Exemplo:**
- Salário Bruto: R$ 3.650,00
- Valor Fixo: R$ 326,58
- Percentual Calculado: 8.95%
- **Referência: 8.95**

**Tabela Progressiva 2026:**
| Faixa Salarial | Alíquota |
|----------------|----------|
| Até R$ 1.412,00 | 7,5% |
| R$ 1.412,01 a R$ 2.666,68 | 9% |
| R$ 2.666,69 a R$ 4.000,03 | 12% |
| R$ 4.000,04 a R$ 7.786,02 | 14% |

### 2. IRRF - Imposto de Renda Retido na Fonte (Código 999)
**Descrição:** I.R.R.F.  
**Cálculo:** Baseado na tabela progressiva do IR  
**Base:** Salário Bruto - INSS - Dependentes

**Tabela Progressiva 2026:**
| Base de Cálculo | Alíquota | Dedução |
|-----------------|----------|---------|
| Até R$ 2.259,20 | Isento | - |
| R$ 2.259,21 a R$ 2.826,65 | 7,5% | R$ 169,44 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 381,44 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 662,77 |
| Acima de R$ 4.664,68 | 27,5% | R$ 896,00 |

### 3. Adiantamento Salarial (Código 910)
**Descrição:** ADIANTAMENTO SALARIAL  
**Cálculo:** 40% do salário bruto proporcional  
**Recálculo:** Automático ao mudar dias trabalhados

**Exemplo:**
- Salário Bruto: R$ 3.650,00
- **Adiantamento: R$ 1.460,00 (40%)**

### 4. Pensão Alimentícia (Código 915)
**Descrição:** PENSÃO ALIMENTÍCIA

**Modos de Cálculo:**

#### Modo Percentual
- Percentual sobre salário líquido (após INSS e IRRF)
- Recalcula automaticamente

**Exemplo:**
- Salário Bruto: R$ 4.450,40
- INSS: R$ 333,78
- IRRF: R$ 0,00
- Salário Líquido Base: R$ 4.116,62
- Percentual: 30%
- **Pensão: R$ 1.234,99**

#### Modo Fixo
- Valor fixo mensal
- Não recalcula automaticamente

**Exemplo:**
- **Pensão: R$ 948,63 (fixo)**

### 5. Vale Transporte (Código 920)
**Descrição:** VALE TRANSPORTE  
**Cálculo:** Geralmente 6% do salário base  
**Limite:** Máximo de 6% conforme lei

### 6. Cesta Básica (Código 930)
**Descrição:** CESTA BÁSICA  
**Cálculo:** Valor fixo ou percentual  
**Uso:** Desconto de cesta básica fornecida

### 7. Plano de Saúde (Código 940)
**Descrição:** PLANO DE SAÚDE  
**Cálculo:** Valor fixo mensal  
**Uso:** Coparticipação do funcionário

### 8. Plano Odontológico (Código 950)
**Descrição:** PLANO ODONTOLÓGICO  
**Cálculo:** Valor fixo mensal  
**Uso:** Coparticipação do funcionário

### 9. Faltas (Código 965)
**Descrição:** FALTAS  
**Cálculo:** (Salário Base ÷ 30) × Dias de Falta  
**Uso:** Desconto por faltas não justificadas

### 10. Descontos Personalizados (Códigos 970+)
**Descrição:** Variável (definida pelo admin)  
**Cálculo:** Valor fixo  
**Uso:** Descontos não previstos (ex: uniforme, danos)

---

## 👁️ Visualização para Funcionários

### Painel do Funcionário

**Localização:** `/holerites` (após login)

**Elementos Visuais:**

1. **Card do Holerite**
   - Mês/Ano de referência
   - Tipo (Folha Mensal ou Adiantamento)
   - Salário Líquido em destaque
   - Status (Disponível, Enviado)
   - Botões: Visualizar, Baixar PDF

2. **Filtros**
   - Por mês/ano
   - Por tipo (Mensal, Adiantamento)
   - Ordenação por data

3. **Detalhes do Holerite**
   - Período trabalhado
   - Data de pagamento
   - Total de proventos
   - Total de descontos
   - Salário líquido

**Cores e Temas:**
- Folha Mensal: Azul (#2563eb)
- Adiantamento: Laranja (#ea580c)
- Salário Líquido: Verde (positivo)

---

## 📄 Visualização PDF/HTML

### Estrutura do Documento

#### 1. Cabeçalho
```
┌─────────────────────────────────────────────────────────┐
│ QUALITEC SERVIÇOS LTDA                    📊 Folha Mensal│
│ CNPJ: 12.345.678/0001-90                  Janeiro de 2026│
│ CC: GERAL                                  Pag: 06/02/2026│
│ Mensalista                                                │
└─────────────────────────────────────────────────────────┘
```

#### 2. Informações do Funcionário
```
┌──────────┬────────────────────────┬─────────┬──────────────┐
│ Código   │ Nome do Funcionário    │ CBO     │ Departamento │
│ 93       │ SAMUEL TARIF           │ 354125  │ Administrativo│
│          │ Analista de Sistemas   │         │              │
├──────────┼────────────────────────┼─────────┼──────────────┤
│ Mat      │ Admissão               │ Pagamento│ Dependentes │
│ 93       │ 15/01/2024             │ 06/02/2026│ 0          │
└──────────┴────────────────────────┴─────────┴──────────────┘
```

#### 3. Tabela de Proventos e Descontos
```
┌────────┬──────────────────────────┬───────────┬─────────────┬─────────────┐
│ Código │ Descrição                │ Referência│ Vencimentos │ Descontos   │
├────────┼──────────────────────────┼───────────┼─────────────┼─────────────┤
│ 8781   │ DIAS NORMAIS             │ 30.00     │ 3.650,00    │             │
│ 998    │ I.N.S.S.                 │ 8.9       │             │ 326,58      │
│ 910    │ ADIANTAMENTO SALARIAL    │           │             │ 1.460,00    │
├────────┴──────────────────────────┴───────────┼─────────────┼─────────────┤
│                                    TOTAIS:     │ 3.650,00    │ 1.786,58    │
└────────────────────────────────────────────────┴─────────────┴─────────────┘
```

#### 4. Resumo Financeiro
```
┌─────────────────────────────────────────────────────────┐
│ Total de Vencimentos                        3.650,00    │
│ Total de Descontos                          1.786,58    │
│ ─────────────────────────────────────────────────────── │
│ VALOR LÍQUIDO                               1.863,42    │
└─────────────────────────────────────────────────────────┘
```

#### 5. Assinatura Digital
```
┌─────────────────────────────────────────────────────────┐
│ [Imagem da Assinatura]                                  │
│                                                          │
│ Assinado de forma digital por SILVANA APARECIDA BARDUCHI│
│ CPF: 044.874.888-69                                     │
│ Dados: 10/02/2026 14:30:00 -03'00'                     │
└─────────────────────────────────────────────────────────┘
```

#### 6. Bases de Cálculo (apenas CLT e Folha Mensal)
```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Salário Base │ Sal.Contr.   │ Base Cálc.   │ F.G.T.S      │ Base Cálc.   │ Faixa IRRF   │
│              │ INSS         │ FGTS         │ do Mês       │ IRRF         │              │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 3.650,00     │ 3.650,00     │ 3.650,00     │ 292,00       │ 3.323,42     │ 0,00         │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### Cores e Estilos

**Folha Mensal (Azul):**
- Cor Tema: #2563eb
- Cor Fundo: #eff6ff
- Ícone: 📊

**Adiantamento (Laranja):**
- Cor Tema: #ea580c
- Cor Fundo: #fff7ed
- Ícone: 💰

**Elementos:**
- Bordas arredondadas (8px)
- Sombras suaves
- Fonte: Arial, sans-serif
- Tamanho: 11px (corpo), 10px (tabela)

---

## 📊 Bases de Cálculo

### Quando Mostrar

✅ **Mostrar bases de cálculo:**
- Funcionário CLT
- Folha Mensal completa
- Período: 01 ao último dia do mês

❌ **NÃO mostrar bases de cálculo:**
- Funcionário PJ
- Adiantamento salarial
- Folha quinzenal

### Campos das Bases

1. **Salário Base**
   - Valor: Salário mensal do funcionário
   - Uso: Base para todos os cálculos

2. **Sal. Contr. INSS**
   - Valor: Base de contribuição do INSS
   - Geralmente igual ao salário base
   - Limite: Teto do INSS (R$ 7.786,02 em 2026)

3. **Base Cálc. FGTS**
   - Valor: Base para cálculo do FGTS
   - Geralmente igual ao salário base
   - Inclui: Salário + adicionais

4. **F.G.T.S do Mês**
   - Valor: 8% do salário base
   - Pago pela empresa (não desconta do funcionário)
   - Exemplo: R$ 3.650,00 × 8% = R$ 292,00

5. **Base Cálc. IRRF**
   - Valor: Salário Bruto - INSS - Dependentes
   - Usado para calcular o IRRF
   - Exemplo: R$ 3.650,00 - R$ 326,58 = R$ 3.323,42

6. **Faixa IRRF**
   - Valor: Alíquota aplicada
   - Exemplo: 0,00 (isento), 7,5%, 15%, 22,5%, 27,5%

---

## 📋 Regras de Negócio

### 1. Cálculo de Salário Proporcional

**Regra:** Salário sempre proporcional aos dias trabalhados

```javascript
valorDia = salarioBase / 30
salarioProporcional = valorDia × diasTrabalhados
```

**Exemplo:**
- Salário Base: R$ 3.000,00
- Dias Trabalhados: 25
- Valor Dia: R$ 100,00
- **Salário Proporcional: R$ 2.500,00**

### 2. Recálculo Automático

**Quando recalcula:**
- Ao mudar dias trabalhados
- Ao mudar salário base
- Apenas se estiver em modo percentual

**O que recalcula:**
- INSS (se percentual)
- Pensão Alimentícia (se percentual)
- Adiantamento (sempre 40%)

**O que NÃO recalcula:**
- INSS (se fixo)
- Pensão Alimentícia (se fixo)
- Outros descontos fixos

### 3. Mês de Referência

**Folha Mensal:**
- Período: 01/02/2026 a 28/02/2026
- Mês Trabalhado: Janeiro de 2026
- Mês Exibido: Janeiro de 2026
- Pagamento: 06/02/2026

**Adiantamento:**
- Período: 15/01/2026 a 31/01/2026
- Mês Vigente: Janeiro de 2026
- Mês Exibido: Janeiro de 2026
- Pagamento: 20/01/2026

### 4. Pensão Alimentícia

**Regra:** NÃO criar itens personalizados automaticamente

**Correto:**
- Usar campo `pensao_alimenticia` do holerite
- Configurar tipo (fixo ou percentual)
- Sistema calcula se percentual

**Incorreto:**
- ❌ Criar item personalizado de pensão
- ❌ Duplicar pensão em itens personalizados

### 5. INSS Referência

**Modo Fixo:**
- Mostrar apenas o percentual
- Formato: "8.90", "12.00"
- Gerado automaticamente

**Modo Percentual:**
- Referência vazia (não usa)
- Sistema calcula baseado no percentual configurado

---

## 💡 Exemplos Reais

### Exemplo 1: Funcionário CLT - Folha Mensal Completa

**Dados:**
- Nome: SAMUEL TARIF
- Salário Base: R$ 3.650,00
- Dias Trabalhados: 30
- Tipo Contrato: CLT

**Proventos:**
- 8781 | DIAS NORMAIS | 30.00 | R$ 3.650,00

**Descontos:**
- 998 | I.N.S.S. | 8.9 | R$ 326,58
- 910 | ADIANTAMENTO SALARIAL | R$ 1.460,00

**Resumo:**
- Total Proventos: R$ 3.650,00
- Total Descontos: R$ 1.786,58
- **Salário Líquido: R$ 1.863,42**

**Bases de Cálculo:**
- Salário Base: R$ 3.650,00
- Base INSS: R$ 3.650,00
- Base FGTS: R$ 3.650,00
- FGTS do Mês: R$ 292,00
- Base IRRF: R$ 3.323,42
- Faixa IRRF: 0,00 (isento)

### Exemplo 2: Funcionário com Pensão Alimentícia

**Dados:**
- Nome: LEONARDO RAMOS DA SILVA
- Salário Base: R$ 4.000,00
- Dias Trabalhados: 25 (proporcional)
- Pensão: 30% do líquido

**Cálculos:**
1. Salário Proporcional: R$ 4.000,00 ÷ 30 × 25 = R$ 3.333,33
2. INSS (9%): R$ 3.333,33 × 9% = R$ 300,00
3. IRRF: R$ 0,00 (isento)
4. Salário Líquido Base: R$ 3.333,33 - R$ 300,00 = R$ 3.033,33
5. Pensão (30%): R$ 3.033,33 × 30% = R$ 910,00
6. Adiantamento (40%): R$ 3.333,33 × 40% = R$ 1.333,33

**Proventos:**
- 8781 | DIAS NORMAIS | 25.00 | R$ 3.333,33

**Descontos:**
- 998 | I.N.S.S. | 9.00 | R$ 300,00
- 910 | ADIANTAMENTO SALARIAL | R$ 1.333,33
- 915 | PENSÃO ALIMENTÍCIA | R$ 910,00

**Resumo:**
- Total Proventos: R$ 3.333,33
- Total Descontos: R$ 2.543,33
- **Salário Líquido: R$ 790,00**

### Exemplo 3: Funcionário PJ

**Dados:**
- Nome: JOÃO SILVA
- Salário Base: R$ 5.000,00
- Dias Trabalhados: 30
- Tipo Contrato: PJ

**Proventos:**
- 8781 | DIAS NORMAIS | 30.00 | R$ 5.000,00

**Descontos:**
- Nenhum (PJ não tem descontos obrigatórios)

**Resumo:**
- Total Proventos: R$ 5.000,00
- Total Descontos: R$ 0,00
- **Salário Líquido: R$ 5.000,00**

**Bases de Cálculo:**
- NÃO MOSTRAR (PJ não tem bases de cálculo)

---

## ✅ Checklist de Validação

### Para Admin

- [ ] Salário proporcional calculado corretamente
- [ ] INSS calculado conforme configuração (fixo ou percentual)
- [ ] Pensão calculada conforme configuração (fixo ou percentual)
- [ ] Adiantamento sempre 40% do salário bruto
- [ ] Referência INSS mostrando apenas percentual
- [ ] Bases de cálculo apenas para CLT e Folha Mensal
- [ ] Mês de referência correto (mês anterior para folha mensal)
- [ ] Data de pagamento correta (5º dia útil ou dia 20)

### Para Funcionário

- [ ] Holerite visível no painel
- [ ] Valores corretos e legíveis
- [ ] PDF gerado corretamente
- [ ] Cores e layout adequados
- [ ] Assinatura digital presente
- [ ] Informações completas

---

## 📚 Documentos Relacionados

- `docs/COMO-GERAR-HOLERITES.md` - Como gerar holerites
- `docs/SISTEMA-DIAS-TRABALHADOS.md` - Sistema de dias trabalhados
- `docs/COMO-USAR-INSS-PERCENTUAL.md` - Como usar INSS percentual
- `docs/COMO-USAR-PENSAO-PERCENTUAL.md` - Como usar pensão percentual
- `docs/GUIA-PENSAO-ALIMENTICIA-QUALITEC.md` - Guia completo de pensão
- `server/utils/holeriteHTML.ts` - Código de geração HTML/PDF

---

**Documento criado em:** 10/02/2026  
**Última atualização:** 10/02/2026  
**Versão:** 1.0
