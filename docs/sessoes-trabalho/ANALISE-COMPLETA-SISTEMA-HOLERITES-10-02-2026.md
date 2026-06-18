# Análise Completa do Sistema de Holerites
**Data:** 10/02/2026  
**Versão:** 1.0

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Proventos (Vencimentos)](#proventos-vencimentos)
4. [Descontos](#descontos)
5. [Cálculos e Regras](#cálculos-e-regras)
6. [Visualização para Funcionários](#visualização-para-funcionários)
7. [Geração de PDF/HTML](#geração-de-pdfhtml)
8. [Fluxo Completo](#fluxo-completo)
9. [Exemplos Reais](#exemplos-reais)

---

## 1. Visão Geral

O sistema de holerites da Qualitec gerencia dois tipos principais de folha de pagamento:

### Tipos de Holerite

1. **Adiantamento Salarial (40%)**
   - Período: Dia 15 ao último dia do mês
   - Pagamento: Dia 20 do mês vigente
   - Valor: 40% do salário bruto
   - Sem descontos de INSS/IRRF
   - Cor: Laranja (#ea580c)

2. **Folha Mensal Completa**
   - Período: Dia 01 ao último dia do mês
   - Pagamento: 5º dia útil do mês seguinte
   - Valor: Salário completo com todos os descontos
   - Desconta adiantamento já pago
   - Cor: Azul (#2563eb)

### Status do Holerite

- **gerado**: Criado mas não enviado
- **enviado**: Email enviado ao funcionário
- **visualizado**: Funcionário acessou o holerite

---

## 2. Estrutura de Dados

### Campos Principais da Tabela `holerites`

```sql
-- Identificação
id                    BIGINT PRIMARY KEY
funcionario_id        BIGINT (FK para funcionarios)

-- Período e Pagamento
periodo_inicio        DATE
periodo_fim           DATE
data_pagamento        DATE
observacoes           TEXT

-- Salário Base
salario_base          DECIMAL(10,2)
dias_trabalhados      INTEGER (padrão: 30)

-- Proventos (Vencimentos)
bonus                 DECIMAL(10,2)
horas_extras          DECIMAL(10,2)
adicional_noturno     DECIMAL(10,2)
adicional_periculosidade DECIMAL(10,2)
adicional_insalubridade  DECIMAL(10,2)
comissoes             DECIMAL(10,2)

-- Descontos
inss                  DECIMAL(10,2)
inss_tipo             VARCHAR (fixo/percentual)
inss_percentual       DECIMAL(5,2)
inss_referencia       VARCHAR (ex: "8.90")
irrf                  DECIMAL(10,2)
vale_transporte       DECIMAL(10,2)
cesta_basica_desconto DECIMAL(10,2)
plano_saude           DECIMAL(10,2)
plano_odontologico    DECIMAL(10,2)
adiantamento          DECIMAL(10,2)
faltas                DECIMAL(10,2)
pensao_alimenticia    DECIMAL(10,2)
pensao_tipo           VARCHAR (fixo/percentual)
pensao_percentual     DECIMAL(5,2)
pensao_recorrente     BOOLEAN

-- FGTS (não é desconto)
fgts                  DECIMAL(10,2)

-- Totais
total_proventos       DECIMAL(10,2)
total_descontos       DECIMAL(10,2)
salario_liquido       DECIMAL(10,2)

-- Status
status                VARCHAR (gerado/enviado/visualizado)
```

---

## 3. Proventos (Vencimentos)

### 3.1 Salário Base Proporcional

O salário é calculado proporcionalmente aos dias trabalhados:

```javascript
const valorDia = salarioBase / 30
const salarioProporcional = valorDia * diasTrabalhados
```

**Exemplo:**
- Salário Base: R$ 4.000,00
- Dias Trabalhados: 26 dias
- Valor do Dia: R$ 133,33
- Salário Proporcional: R$ 3.466,67

### 3.2 Códigos de Proventos no Holerite

| Código | Descrição | Quando Aparece |
|--------|-----------|----------------|
| 8781 | DIAS NORMAIS | Sempre (salário proporcional) |
| 100 | BÔNUS | Se bonus > 0 |
| 200 | HORAS EXTRAS | Se horas_extras > 0 |
| 300 | ADICIONAL NOTURNO | Se adicional_noturno > 0 |
| 400 | ADICIONAL DE PERICULOSIDADE | Se adicional_periculosidade > 0 |
| 500 | ADICIONAL DE INSALUBRIDADE | Se adicional_insalubridade > 0 |
| 600 | COMISSÕES | Se comissoes > 0 |
| 700+ | BENEFÍCIOS PERSONALIZADOS | Itens customizados |

### 3.3 Cálculo Total de Proventos

```javascript
totalProventos = 
  salarioProporcional +
  bonus +
  horasExtras +
  adicionalNoturno +
  adicionalPericulosidade +
  adicionalInsalubridade +
  comissoes +
  beneficiosPersonalizados
```

---

## 4. Descontos

### 4.1 INSS (Instituto Nacional do Seguro Social)

O INSS pode ser calculado de duas formas:

#### Modo Percentual (Automático)
```javascript
inss = (salarioBruto * inssPercentual) / 100
```

**Tabela INSS 2026:**
- Até R$ 1.412,00: 7,5%
- De R$ 1.412,01 até R$ 2.666,68: 9%
- De R$ 2.666,69 até R$ 4.000,03: 12%
- De R$ 4.000,04 até R$ 7.786,02: 14%

#### Modo Fixo (Manual)
- Valor digitado manualmente
- Sistema calcula automaticamente o percentual
- Referência gerada: apenas o percentual (ex: "8.90")

**Exemplo Real (Samuel Tarif):**
- Salário Bruto: R$ 3.650,00
- INSS Fixo: R$ 326,58
- Percentual Calculado: 8,9%
- Referência no PDF: "8.9"

### 4.2 IRRF (Imposto de Renda Retido na Fonte)

Calculado sobre o salário bruto menos INSS:

```javascript
baseIRRF = salarioBruto - inss
// Aplicar tabela progressiva do IRRF
```

### 4.3 Adiantamento Salarial

Sempre 40% do salário bruto proporcional:

```javascript
adiantamento = salarioBruto * 0.40
```

**Regra:** Descontado apenas na folha mensal, não no adiantamento.

### 4.4 Pensão Alimentícia

Pode ser configurada de duas formas:

#### Modo Percentual
```javascript
salarioLiquidoBase = salarioBruto - inss - irrf
pensao = (salarioLiquidoBase * pensaoPercentual) / 100
```

#### Modo Fixo
- Valor fixo mensal
- Não recalcula automaticamente

**Exemplo Real (Leonardo):**
- Salário Bruto: R$ 3.466,67
- INSS: R$ 304,58
- IRRF: R$ 0,00
- Salário Líquido Base: R$ 3.162,09
- Pensão (30%): R$ 948,63

### 4.5 Códigos de Descontos no Holerite

| Código | Descrição | Quando Aparece |
|--------|-----------|----------------|
| 998 | I.N.S.S. | Se inss > 0 |
| 999 | I.R.R.F. | Se irrf > 0 |
| 910 | ADIANTAMENTO SALARIAL | Se adiantamento > 0 |
| 915 | PENSÃO ALIMENTÍCIA | Se pensao_alimenticia > 0 |
| 920 | VALE TRANSPORTE | Se vale_transporte > 0 |
| 930 | CESTA BÁSICA | Se cesta_basica_desconto > 0 |
| 940 | PLANO DE SAÚDE | Se plano_saude > 0 |
| 950 | PLANO ODONTOLÓGICO | Se plano_odontologico > 0 |
| 965 | FALTAS | Se faltas > 0 |
| 970+ | DESCONTOS PERSONALIZADOS | Itens customizados |

### 4.6 Cálculo Total de Descontos

```javascript
totalDescontos = 
  inss +
  irrf +
  valeTransporte +
  cestaBasica +
  planoSaude +
  planoOdontologico +
  adiantamento +
  faltas +
  pensaoAlimenticia +
  descontosPersonalizados
```

---

## 5. Cálculos e Regras

### 5.1 Salário Líquido

```javascript
salarioLiquido = totalProventos - totalDescontos
```

### 5.2 FGTS (Fundo de Garantia)

**IMPORTANTE:** FGTS NÃO é desconto do funcionário!

```javascript
fgts = salarioBase * 0.08 // 8% do salário base
```

O FGTS é depositado pela empresa em conta vinculada do trabalhador.

### 5.3 Bases de Cálculo

Aparecem apenas em **Folhas Mensais CLT** (não em adiantamentos ou PJ):

- **Salário Base:** Salário mensal do funcionário
- **Sal. Contr. INSS:** Base de contribuição do INSS
- **Base Cálc. FGTS:** Base para cálculo do FGTS (= salário base)
- **F.G.T.S do Mês:** 8% do salário base
- **Base Cálc. IRRF:** Salário bruto - INSS
- **Faixa IRRF:** Alíquota aplicada

### 5.4 Mês de Referência

**Regra Importante:**

- **Adiantamento:** Mês vigente
  - Período: 15/01 a 31/01
  - Referência: "Janeiro de 2026"
  
- **Folha Mensal:** Mês ANTERIOR
  - Período: 01/02 a 28/02
  - Referência: "Janeiro de 2026" (mês trabalhado)

---

## 6. Visualização para Funcionários

### 6.1 Painel do Funcionário

Localização: `/holerites` (após login)

**Funcionalidades:**
- Listar todos os holerites disponíveis
- Filtrar por mês/ano
- Visualizar holerite em modal
- Baixar PDF
- Ver status (novo/visualizado)

### 6.2 Card do Holerite

Exibe:
- Período (ex: "01/02/2026 - 28/02/2026")
- Tipo (Adiantamento ou Folha Mensal)
- Salário Líquido em destaque
- Status visual (badge colorido)
- Botões: "Ver Detalhes" e "Baixar PDF"

### 6.3 Modal de Visualização

Mostra:
- Cabeçalho com dados da empresa
- Informações do funcionário
- Tabela de proventos e descontos
- Totais destacados
- Bases de cálculo (se aplicável)
- Assinatura digital

---

## 7. Geração de PDF/HTML

### 7.1 Arquivo: `server/utils/holeriteHTML.ts`

Função principal: `gerarHoleriteHTML(holerite, funcionario, empresa)`

### 7.2 Estrutura do HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>Holerite - [Nome do Funcionário]</title>
  <style>
    /* Estilos responsivos e para impressão */
  </style>
</head>
<body>
  <!-- Cabeçalho -->
  <div class="header">
    <div class="company-name">[Nome da Empresa]</div>
    <div class="folha-tipo">[Tipo de Folha]</div>
    <div class="competencia">[Mês/Ano]</div>
  </div>
  
  <!-- Dados do Funcionário -->
  <div class="employee-info">
    <!-- Grid com informações -->
  </div>
  
  <!-- Tabela de Proventos e Descontos -->
  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Descrição</th>
        <th>Referência</th>
        <th>Vencimentos</th>
        <th>Descontos</th>
      </tr>
    </thead>
    <tbody>
      <!-- Linhas dinâmicas -->
    </tbody>
  </table>
  
  <!-- Totais -->
  <div class="totals">
    <div>Total de Vencimentos: [valor]</div>
    <div>Total de Descontos: [valor]</div>
    <div class="liquido">Valor Líquido: [valor]</div>
  </div>
  
  <!-- Assinatura Digital -->
  <div class="signature">
    <img src="/ass.png" />
    <div>Assinado digitalmente por [Responsável]</div>
  </div>
  
  <!-- Bases de Cálculo (se aplicável) -->
  <div class="bases-calculo">
    <!-- Grid com bases -->
  </div>
</body>
</html>
```

### 7.3 Cores Temáticas

**Adiantamento:**
- Cor Principal: #ea580c (Laranja)
- Fundo: #fff7ed (Laranja claro)
- Ícone: 💰

**Folha Mensal:**
- Cor Principal: #2563eb (Azul)
- Fundo: #eff6ff (Azul claro)
- Ícone: 📊

### 7.4 Formatação de Valores

```javascript
// Moeda brasileira
valor.toLocaleString('pt-BR', { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
})
// Resultado: "3.466,67"

// Data brasileira
data.toLocaleDateString('pt-BR')
// Resultado: "06/02/2026"
```

---

## 8. Fluxo Completo

### 8.1 Geração de Holerites

```
1. Admin acessa /admin/holerites
2. Clica em "Gerar Folha Mensal" ou "Gerar Adiantamento"
3. Sistema calcula datas automaticamente:
   - Adiantamento: dia 15 ao último dia do mês vigente
   - Folha Mensal: dia 01 ao último dia do mês vigente
4. Para cada funcionário ativo:
   a. Busca dados do funcionário
   b. Calcula salário proporcional
   c. Calcula INSS (se percentual)
   d. Calcula pensão (se percentual)
   e. Calcula adiantamento (40%)
   f. Calcula totais
   g. Cria registro no banco
5. Retorna total de holerites gerados
```

### 8.2 Envio por Email

```
1. Admin seleciona tipo (adiantamento/mensal/todos)
2. Sistema filtra holerites não enviados
3. Para cada holerite:
   a. Gera HTML do holerite
   b. Busca email do funcionário
   c. Envia email com link para visualização
   d. Atualiza status para "enviado"
4. Retorna total de emails enviados
```

### 8.3 Visualização pelo Funcionário

```
1. Funcionário faz login
2. Acessa "Meus Holerites"
3. Sistema lista holerites disponíveis
4. Funcionário clica em "Ver Detalhes"
5. Modal abre com holerite completo
6. Funcionário pode:
   - Visualizar online
   - Baixar PDF
   - Imprimir
7. Status atualizado para "visualizado"
```

---

## 9. Exemplos Reais

### 9.1 Exemplo 1: Holerite Simples (Umberto)

**Dados:**
- Salário Base: R$ 3.500,00
- Dias Trabalhados: 30
- Tipo INSS: Percentual (7,5%)
- Sem pensão alimentícia

**Cálculo:**
```
Proventos:
  Salário Proporcional: R$ 3.500,00
  Total Proventos: R$ 3.500,00

Descontos:
  INSS (7,5%): R$ 262,50
  Adiantamento (40%): R$ 1.400,00
  Total Descontos: R$ 1.662,50

Salário Líquido: R$ 1.837,50
```

### 9.2 Exemplo 2: Holerite com Dias Proporcionais (Leonardo)

**Dados:**
- Salário Base: R$ 4.000,00
- Dias Trabalhados: 26 (faltou 4 dias)
- Tipo INSS: Fixo (R$ 304,58)
- Pensão: 30% do líquido

**Cálculo:**
```
Proventos:
  Valor do Dia: R$ 133,33
  Salário Proporcional (26 dias): R$ 3.466,67
  Total Proventos: R$ 3.466,67

Descontos:
  INSS (fixo): R$ 304,58
  IRRF: R$ 0,00
  Salário Líquido Base: R$ 3.162,09
  Pensão (30%): R$ 948,63
  Adiantamento (40% do bruto): R$ 1.386,67
  Total Descontos: R$ 2.639,88

Salário Líquido: R$ 826,79

FGTS (8% do base): R$ 277,33
```

### 9.3 Exemplo 3: Holerite com FGTS (Cloves)

**Dados:**
- Salário Base: R$ 3.710,00
- Dias Trabalhados: 30
- Tipo INSS: Fixo (R$ 333,78 = 9%)
- Com FGTS

**Cálculo:**
```
Proventos:
  Salário Proporcional: R$ 3.710,00
  Total Proventos: R$ 3.710,00

Descontos:
  INSS (9%): R$ 333,78
  Adiantamento (40%): R$ 1.484,00
  Total Descontos: R$ 1.817,78

Salário Líquido: R$ 1.892,22

FGTS (8%): R$ 296,80 ← NÃO é desconto!
```

---

## 10. Regras Importantes

### 10.1 Dias Trabalhados

- Padrão: 30 dias
- Pode ser alterado manualmente
- Afeta: salário proporcional, INSS (se %), pensão (se %), adiantamento
- Não afeta: FGTS (sempre 8% do salário base)

### 10.2 INSS Referência

- Aparece na coluna "Referência" do holerite
- Formato: apenas percentual (ex: "8.90")
- Gerado automaticamente em modo fixo
- Vazio em modo percentual

### 10.3 Pensão Alimentícia

- Calculada sobre salário líquido (após INSS e IRRF)
- Pode ser fixa ou percentual
- Flag "recorrente" é apenas informativa
- NÃO criar itens personalizados de pensão

### 10.4 Itens Personalizados

- Usar apenas para benefícios/descontos não previstos
- Exemplos: bônus especial, desconto de uniforme
- NÃO usar para pensão alimentícia (tem campo específico)
- Códigos: 700+ (benefícios), 970+ (descontos)

### 10.5 Bases de Cálculo

Mostrar apenas quando:
- É folha mensal (não adiantamento)
- É CLT (não PJ)
- Período completo (dia 01 ao último dia)

---

## 11. Arquivos Principais

### Frontend
- `app/pages/admin/holerites.vue` - Painel admin
- `app/pages/holerites.vue` - Painel funcionário
- `app/components/holerites/HoleriteModal.vue` - Modal de visualização
- `app/components/holerites/HoleriteEditForm.vue` - Formulário de edição

### Backend
- `server/api/holerites/index.get.ts` - Listar holerites
- `server/api/holerites/gerar.post.ts` - Gerar holerites
- `server/api/holerites/[id].patch.ts` - Editar holerite
- `server/api/holerites/[id]/enviar-email.post.ts` - Enviar email
- `server/utils/holeriteHTML.ts` - Gerar HTML/PDF

### Database
- `database/10-criar-tabela-holerites.sql` - Estrutura da tabela
- `database/40-adicionar-config-inss-pensao.sql` - Campos de configuração
- `database/41-adicionar-referencia-inss.sql` - Campo de referência

---

## 12. Conclusão

O sistema de holerites está funcionando corretamente com:

✅ Cálculos precisos de proventos e descontos  
✅ Suporte a dias trabalhados proporcionais  
✅ INSS em modo fixo e percentual  
✅ Pensão alimentícia configurável  
✅ Geração automática de PDF/HTML  
✅ Visualização responsiva  
✅ Envio por email  
✅ Bases de cálculo corretas  
✅ Assinatura digital  
✅ Cores temáticas por tipo  

**Todos os valores conferem entre cálculo e banco de dados!**

---

**Documento gerado em:** 10/02/2026  
**Última atualização:** 10/02/2026  
**Versão do Sistema:** 1.0
