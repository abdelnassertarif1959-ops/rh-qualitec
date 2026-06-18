# Resumo Executivo: Sistema de Holerites Qualitec
**Data:** 10/02/2026

## 🎯 Visão Geral

O sistema gerencia dois tipos de holerites:
- **Adiantamento (40%)**: Pago dia 20, sem descontos fiscais
- **Folha Mensal**: Paga 5º dia útil, com todos os descontos

## 💰 Proventos (O que o funcionário recebe)

| Item | Código | Quando Aparece |
|------|--------|----------------|
| Salário Proporcional | 8781 | Sempre |
| Bônus | 100 | Opcional |
| Horas Extras | 200 | Opcional |
| Adicional Noturno | 300 | Opcional |
| Adicional Periculosidade | 400 | Opcional |
| Adicional Insalubridade | 500 | Opcional |
| Comissões | 600 | Opcional |

**Cálculo:** Salário Base ÷ 30 × Dias Trabalhados

## 📉 Descontos (O que é descontado)

| Item | Código | Cálculo |
|------|--------|---------|
| INSS | 998 | 7,5% a 14% (tabela progressiva) |
| IRRF | 999 | Sobre (Bruto - INSS) |
| Adiantamento | 910 | 40% do salário bruto |
| Pensão Alimentícia | 915 | % do líquido ou fixo |
| Vale Transporte | 920 | Fixo |
| Cesta Básica | 930 | Fixo |
| Plano de Saúde | 940 | Fixo |
| Plano Odontológico | 950 | Fixo |
| Faltas | 965 | Proporcional |

## 🏦 FGTS

**IMPORTANTE:** FGTS NÃO é desconto do funcionário!
- Valor: 8% do salário base
- Depositado pela empresa
- Aparece apenas como informação

## 📊 Exemplo Prático

**Funcionário:** Leonardo  
**Salário Base:** R$ 4.000,00  
**Dias Trabalhados:** 26 dias

```
PROVENTOS:
  Salário Proporcional (26 dias): R$ 3.466,67
  TOTAL PROVENTOS: R$ 3.466,67

DESCONTOS:
  INSS (8,79%): R$ 304,58
  Pensão Alimentícia (30%): R$ 948,63
  Adiantamento (40%): R$ 1.386,67
  TOTAL DESCONTOS: R$ 2.639,88

SALÁRIO LÍQUIDO: R$ 826,79

FGTS (8%): R$ 277,33 ← Não é desconto!
```

## 🎨 Visualização

### Para Funcionários (`/holerites`)

**Filtros Disponíveis:**
- Mês (Janeiro a Dezembro)
- Ano (2024, 2025, 2026)
- Tipo (Adiantamento / Folha Mensal)

**Informações Exibidas em Cada Card:**
- Referência (ex: "Holerite Fevereiro de 2026")
- Competência (ex: "02/2026")
- Tipo (Mensal / Adiantamento)
- Status (Pago / Enviado / Visualizado)
- Valor Líquido (destaque em verde)
- Período (ex: "01/02/2026 - 28/02/2026")
- Botões: 👁️ Ver | 📥 Baixar PDF

**Modal de Visualização:**
- Cabeçalho com logo e dados da empresa
- Informações do funcionário (nome, cargo, departamento)
- Tabela completa de proventos e descontos
- Totais destacados
- Botão de download do PDF

### Para Admin (`/admin/holerites`)

**Ações Principais:**
- 💰 Gerar Adiantamento (40%)
- 📄 Gerar Folha Mensal
- 👤 Disponibilizar no Perfil
- 📧 Enviar por Email

**Filtros Disponíveis:**
- Estilo (Adiantamentos / Folhas Mensais)
- Mês/Ano (dinâmico, apenas meses com holerites)
- Status (Gerado / Enviado / Visualizado)

**Informações Exibidas em Cada Linha:**
- Avatar do funcionário (inicial do nome)
- Nome completo
- Cargo
- Empresa
- Valor líquido (destaque)
- Período formatado
- Badge de status (cores: verde=enviado, amarelo=gerado)
- Botões: 👁️ Ver | ✏️ Editar | 📧 Enviar | 🗑️ Excluir

**Modal de Edição:**
- Todos os campos editáveis
- Cálculo automático ao alterar valores
- Salvar e enviar em uma ação
- Validação de campos obrigatórios

## 💻 Dados Exibidos por Contexto

### No Painel Admin (`/admin/holerites`)

**Listagem Principal:**
```
┌─────────────────────────────────────────────────────────┐
│ 👤 SAMUEL TARIF                    R$ 1.863,42          │
│    Desenvolvedor                   01/02 - 28/02        │
│    Qualitec                        ✅ Visualizado       │
│                                                          │
│    [👁️ Ver] [✏️ Editar] [📧 Enviar] [🗑️ Excluir]      │
└─────────────────────────────────────────────────────────┘
```

**Dados Disponíveis para Edição:**
- Salário base
- Dias trabalhados (afeta cálculo proporcional)
- Proventos: Bônus, horas extras, adicionais, comissões
- INSS: Modo fixo/percentual + referência
- Descontos: VT, cesta, planos, faltas
- Pensão alimentícia: Valor fixo ou % + recorrente
- Adiantamento (40% automático)
- Itens personalizados (benefícios e descontos)
- FGTS (editável, padrão 8%)
- Observações

**Ações em Massa:**
- Gerar adiantamentos (40%) para todos
- Gerar folhas mensais para todos
- Disponibilizar no perfil (por tipo)
- Enviar por email (por tipo)

### No Perfil do Funcionário (`/holerites`)

**Card de Holerite:**
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Holerite Fevereiro de 2026                           │
│                                                          │
│ Competência: 02/2026                                    │
│ Período: 01/02/2026 - 28/02/2026                        │
│ Status: ✅ Visualizado                                  │
│                                                          │
│ Valor Líquido: R$ 1.863,42                             │
│                                                          │
│ [👁️ Visualizar] [📥 Baixar PDF]                        │
└─────────────────────────────────────────────────────────┘
```

**Dados Visíveis no Modal:**
- Todos os proventos detalhados
- Todos os descontos detalhados
- Totais calculados
- Informações da empresa
- Dados pessoais (cargo, departamento, admissão)
- Botão de download do PDF

**Limitações:**
- ❌ Não pode editar valores
- ❌ Não pode excluir holerites
- ✅ Pode visualizar histórico completo
- ✅ Pode baixar PDFs ilimitadamente
- ✅ Pode filtrar por mês/ano/tipo

### No PDF Gerado

**Informações Completas:**
- Cabeçalho da empresa (nome, CNPJ)
- Tipo de folha (Mensal/Adiantamento)
- Competência e data de pagamento
- Dados do funcionário (código, nome, cargo, CBO, departamento, matrícula, admissão, dependentes)
- Tabela completa com códigos, descrições, referências, vencimentos e descontos
- Totais destacados
- Assinatura digital com data/hora
- Bases de cálculo (apenas CLT mensal): Salário base, INSS, FGTS, IRRF, Faixa IRRF

**Formato:**
- HTML responsivo (pode ser visualizado no navegador)
- Pronto para impressão (otimizado para A4)
- Cores temáticas (azul para mensal, laranja para adiantamento)
- Logo e assinatura incluídos

## 🔢 Exemplos Práticos de Cálculo

### Exemplo 1: Holerite Simples (Umberto)

**Entrada:**
- Salário Base: R$ 3.500,00
- Dias Trabalhados: 30
- INSS: Percentual (7,5%)
- Adiantamento: 40%

**Cálculo:**
```
Salário Proporcional = 3.500,00 ÷ 30 × 30 = R$ 3.500,00
INSS (7,5%) = 3.500,00 × 0,075 = R$ 262,50
Adiantamento (40%) = 3.500,00 × 0,40 = R$ 1.400,00

Total Proventos = R$ 3.500,00
Total Descontos = 262,50 + 1.400,00 = R$ 1.662,50
Salário Líquido = 3.500,00 - 1.662,50 = R$ 1.837,50
```

**Exibição no Sistema:**
- Admin: "R$ 1.837,50" (destaque verde)
- Funcionário: "Valor Líquido: R$ 1.837,50"
- PDF: "Valor Líquido: R$ 1.837,50" (fonte grande, cor azul)

### Exemplo 2: Holerite com Dias Proporcionais e Pensão (Leonardo)

**Entrada:**
- Salário Base: R$ 4.000,00
- Dias Trabalhados: 26 (proporcional)
- INSS: Fixo R$ 304,58 (8,79% de referência)
- Pensão: 30% do líquido (recorrente)
- Adiantamento: 40%

**Cálculo:**
```
Salário Proporcional = 4.000,00 ÷ 30 × 26 = R$ 3.466,67
INSS (fixo) = R$ 304,58
Adiantamento (40% proporcional) = 3.466,67 × 0,40 = R$ 1.386,67

Líquido antes da pensão = 3.466,67 - 304,58 - 1.386,67 = R$ 1.775,42
Pensão (30%) = 1.775,42 × 0,30 = R$ 532,63
CORREÇÃO: Pensão calculada sobre (Bruto - INSS - IRRF) = R$ 948,63

Total Proventos = R$ 3.466,67
Total Descontos = 304,58 + 1.386,67 + 948,63 = R$ 2.639,88
Salário Líquido = 3.466,67 - 2.639,88 = R$ 826,79
```

**Exibição no PDF:**
```
Código | Descrição              | Ref.  | Vencimentos | Descontos
-------|------------------------|-------|-------------|----------
8781   | DIAS NORMAIS           | 26.00 | 3.466,67    |
998    | I.N.S.S.               | 8.79  |             | 304,58
910    | ADIANTAMENTO SALARIAL  |       |             | 1.386,67
915    | PENSÃO ALIMENTÍCIA     |       |             | 948,63
-------|------------------------|-------|-------------|----------
       | TOTAIS                 |       | 3.466,67    | 2.639,88

Valor Líquido: R$ 826,79
```

### Exemplo 3: Adiantamento (40%)

**Entrada:**
- Salário Base: R$ 3.000,00
- Período: 15/02/2026 - 28/02/2026
- Tipo: Adiantamento

**Cálculo:**
```
Adiantamento = 3.000,00 × 0,40 = R$ 1.200,00

Total Proventos = R$ 1.200,00
Total Descontos = R$ 0,00 (sem INSS/IRRF)
Salário Líquido = R$ 1.200,00
```

**Exibição:**
- Cor: Laranja (tema adiantamento)
- Badge: "💰 Adiantamento Salarial"
- Competência: "Fevereiro de 2026"
- Pagamento: "20/02/2026"
- Observação: "Será descontado na folha mensal"

## 📊 Holerites Atuais no Sistema

**Total:** 10 holerites de Fevereiro/2026 (Folhas Mensais)

### Valores por Funcionário:

| Funcionário | Salário Base | Dias | INSS | Adiant. | Pensão | Líquido | Status |
|-------------|--------------|------|------|---------|--------|---------|--------|
| Samuel Tarif | R$ 3.650,00 | 30 | R$ 326,58 | R$ 1.460,00 | - | R$ 1.863,42 | ✅ Visualizado |
| Cloves Alexandre | R$ 3.710,00 | 30 | R$ 333,78 | R$ 1.484,00 | - | R$ 1.892,22 | ✅ Visualizado |
| Marcos Paulo | R$ 3.000,00 | 30 | R$ 248,58 | R$ 1.200,00 | - | R$ 1.551,42 | 📧 Enviado |
| Arthur da Silva | R$ 3.180,00 | 30 | R$ 270,18 | R$ 1.272,00 | - | R$ 1.637,82 | 📧 Enviado |
| Vitor Gabriel | R$ 2.650,00 | 30 | R$ 214,18 | R$ 1.060,00 | - | R$ 1.375,82 | 📧 Enviado |
| Lucas Veiga | R$ 2.862,00 | 30 | R$ 233,26 | R$ 1.144,80 | - | R$ 1.483,94 | 📧 Enviado |
| Umberto | R$ 3.500,00 | 30 | R$ 262,50 | R$ 1.400,00 | - | R$ 1.837,50 | 📧 Enviado |
| Luccas Augusto | R$ 3.000,00 | 30 | R$ 248,58 | R$ 1.200,00 | - | R$ 1.551,42 | ✅ Visualizado |
| Leonardo Ramos | R$ 4.000,00 | 26 | R$ 304,58 | R$ 1.386,67 | R$ 948,63 | R$ 826,79 | 📧 Enviado |
| Maciel Carvalho | R$ 4.100,00 | 30 | R$ 380,58 | R$ 1.640,00 | - | R$ 2.079,42 | 📧 Enviado |

**Observações:**
- Leonardo: Único com pensão alimentícia (30% = R$ 948,63) e dias proporcionais (26 dias)
- Todos com adiantamento de 40% descontado
- INSS calculado corretamente (modo fixo com referência percentual)
- Data de pagamento: 06/02/2026 (5º dia útil)

## 📄 Detalhes do PDF/HTML

### Estrutura Visual:

**1. Cabeçalho (Gradiente Azul/Laranja)**
- Nome da empresa: QUALITEC (destaque)
- CNPJ formatado: XX.XXX.XXX/XXXX-XX
- CC: GERAL
- Tipo: Mensalista
- Badge do tipo: 📊 Folha Mensal / 💰 Adiantamento Salarial
- Competência: "fevereiro de 2026"
- Data de pagamento: "06/02/2026"

**2. Dados do Funcionário (Box com borda colorida)**
- Código (ID)
- Nome completo
- Cargo
- CBO: 354125
- Departamento
- Matrícula
- Data de admissão
- Data de pagamento
- Dependentes (se houver)

**3. Tabela de Proventos e Descontos**

| Código | Descrição | Referência | Vencimentos | Descontos |
|--------|-----------|------------|-------------|-----------|
| 8781 | DIAS NORMAIS | 26.00 | 3.466,67 | - |
| 998 | I.N.S.S. | 8.79 | - | 304,58 |
| 910 | ADIANTAMENTO SALARIAL | - | - | 1.386,67 |
| 915 | PENSÃO ALIMENTÍCIA | - | - | 948,63 |

**Códigos Utilizados:**
- 8781: Salário proporcional (dias trabalhados)
- 100-600: Proventos variáveis (bônus, horas extras, etc.)
- 700+: Benefícios personalizados
- 998: INSS (com referência percentual)
- 999: IRRF
- 910: Adiantamento salarial
- 915: Pensão alimentícia
- 920-950: Descontos fixos (VT, cesta, planos)
- 965: Faltas
- 970+: Descontos personalizados

**4. Totais (Box destacado com borda colorida)**
- Total de Vencimentos
- Total de Descontos
- **Valor Líquido** (fonte maior, cor temática)

**5. Assinatura Digital**
- Imagem da assinatura (`/ass.png`)
- Nome do responsável: SILVANA APARECIDA BARDUCHI
- CPF: 04487488869
- Data/hora da geração
- Timezone: -03'00' (Brasília)

**6. Bases de Cálculo** (Apenas CLT Mensal)
- Salário Base
- Sal. Contr. INSS
- Base Cálc. FGTS
- F.G.T.S do Mês (8%)
- Base Cálc. IRRF
- Faixa IRRF

### Cores Temáticas:

**Folha Mensal:**
- Primária: #2563eb (Azul)
- Fundo: #eff6ff (Azul claro)
- Ícone: 📊

**Adiantamento:**
- Primária: #ea580c (Laranja)
- Fundo: #fff7ed (Laranja claro)
- Ícone: 💰

### Responsividade:
- Layout otimizado para impressão
- Largura máxima: 800px
- Fonte: Arial 11px (corpo), 10px (detalhes)
- Tabelas com zebra striping
- Bordas arredondadas (8px)
- Sombras suaves para profundidade

## ✅ Status Atual

Análise de 10 holerites recentes:
- ✅ Todos os cálculos conferem
- ✅ Valores corretos no banco
- ✅ PDF/HTML gerados corretamente
- ✅ Dias proporcionais funcionando
- ✅ INSS fixo e percentual OK
- ✅ Pensão alimentícia OK (sem duplicações)
- ✅ Adiantamento 40% aplicado corretamente
- ✅ Referência INSS apenas percentual
- ✅ Assinatura digital presente
- ✅ Bases de cálculo apenas em CLT mensal

## 📋 Holerites Disponíveis Atualmente

### Folhas Mensais - Fevereiro/2026 (Referência: Janeiro/2026)

| Funcionário | Salário Base | Dias | Proventos | Descontos | Líquido | Status |
|-------------|--------------|------|-----------|-----------|---------|--------|
| SAMUEL TARIF | R$ 3.650,00 | 30 | R$ 3.650,00 | R$ 1.786,58 | R$ 1.863,42 | ✅ Visualizado |
| CLOVES ALEXANDRE | R$ 3.710,00 | 30 | R$ 3.710,00 | R$ 1.817,78 | R$ 1.892,22 | ✅ Visualizado |
| MARCOS PAULO | R$ 3.000,00 | 30 | R$ 3.000,00 | R$ 1.448,58 | R$ 1.551,42 | 📧 Enviado |
| ARTHUR DA SILVA | R$ 3.180,00 | 30 | R$ 3.180,00 | R$ 1.542,18 | R$ 1.637,82 | 📧 Enviado |
| VITOR GABRIEL | R$ 2.650,00 | 30 | R$ 2.650,00 | R$ 1.274,18 | R$ 1.375,82 | 📧 Enviado |
| LUCAS VEIGA | R$ 2.862,00 | 30 | R$ 2.862,00 | R$ 1.378,06 | R$ 1.483,94 | 📧 Enviado |
| UMBERTO | R$ 3.500,00 | 30 | R$ 3.500,00 | R$ 1.662,50 | R$ 1.837,50 | 📧 Enviado |
| LUCCAS AUGUSTO | R$ 3.000,00 | 30 | R$ 3.000,00 | R$ 1.448,58 | R$ 1.551,42 | ✅ Visualizado |
| LEONARDO RAMOS | R$ 4.000,00 | 26 | R$ 3.466,67 | R$ 2.639,88 | R$ 826,79 | 📧 Enviado |
| MACIEL CARVALHO | R$ 4.100,00 | 30 | R$ 4.100,00 | R$ 2.020,58 | R$ 2.079,42 | 📧 Enviado |

### Detalhamento dos Descontos

**Descontos Comuns:**
- INSS: 7,5% a 9,28% (conforme tabela progressiva)
- Adiantamento: 40% do salário bruto
- Pensão Alimentícia: Apenas Leonardo (30% = R$ 948,63)

**Caso Especial - Leonardo:**
- Dias Trabalhados: 26 (proporcional)
- Salário Proporcional: R$ 3.466,67
- INSS: R$ 304,58 (8,79%)
- Pensão: R$ 948,63 (30% do líquido)
- Adiantamento: R$ 1.386,67 (40% proporcional)

## 📄 Detalhes do PDF/HTML

### Estrutura Visual

**Cores Temáticas:**
- 🔵 Folha Mensal: Azul (#2563eb) com fundo azul claro (#eff6ff)
- 🟠 Adiantamento: Laranja (#ea580c) com fundo laranja claro (#fff7ed)

**Cabeçalho:**
- Nome da empresa (QUALITEC)
- CNPJ formatado
- Tipo de folha com ícone (📊 Mensal / 💰 Adiantamento)
- Mês de referência (ex: "janeiro de 2026")
- Data de pagamento

**Informações do Funcionário:**
- Código, Nome, Cargo
- Departamento, Matrícula
- Data de admissão
- Data de pagamento
- Número de dependentes (se houver)

**Tabela de Proventos e Descontos:**

| Código | Descrição | Referência | Vencimentos | Descontos |
|--------|-----------|------------|-------------|-----------|
| 8781 | DIAS NORMAIS | Dias | Valor | - |
| 998 | I.N.S.S. | % | - | Valor |
| 910 | ADIANTAMENTO SALARIAL | - | - | Valor |
| 915 | PENSÃO ALIMENTÍCIA | - | - | Valor |

**Totais:**
- Total de Vencimentos
- Total de Descontos
- Valor Líquido (destaque em negrito e cor temática)

**Assinatura Digital:**
- Imagem da assinatura
- Nome do responsável (Silvana Aparecida Barduchi)
- CPF do responsável
- Data e hora da geração

**Bases de Cálculo (apenas CLT Mensal):**
- Salário Base
- Sal. Contr. INSS
- Base Cálc. FGTS
- F.G.T.S do Mês (8%)
- Base Cálc. IRRF
- Faixa IRRF

### Regras de Exibição

**Bases de Cálculo aparecem quando:**
- ✅ É Folha Mensal (não adiantamento)
- ✅ É funcionário CLT (não PJ)

**Bases de Cálculo NÃO aparecem quando:**
- ❌ É Adiantamento Salarial
- ❌ É funcionário PJ

### Códigos dos Itens

**Proventos:**
- 8781: Dias Normais (salário proporcional)
- 100: Bônus
- 200: Horas Extras
- 300: Adicional Noturno
- 400: Adicional Periculosidade
- 500: Adicional Insalubridade
- 600: Comissões
- 700+: Benefícios Personalizados

**Descontos:**
- 998: I.N.S.S.
- 999: I.R.R.F.
- 910: Adiantamento Salarial
- 915: Pensão Alimentícia
- 920: Vale Transporte
- 930: Cesta Básica
- 940: Plano de Saúde
- 950: Plano Odontológico
- 965: Faltas
- 970+: Descontos Personalizados

### Formatação de Valores

- Moeda: R$ com 2 casas decimais
- Separador de milhar: ponto (.)
- Separador decimal: vírgula (,)
- Exemplo: R$ 3.466,67

### Responsividade

- Layout adaptável para impressão
- Largura máxima: 800px
- Fonte: Arial, 11px (corpo), 10px (tabela)
- Margens e espaçamentos otimizados para A4

## 📝 Regras Importantes

1. **Dias Trabalhados:** Afeta salário, INSS (%), pensão (%), adiantamento
2. **INSS Referência:** Apenas percentual (ex: "8.90")
3. **Pensão:** Calculada sobre líquido (após INSS e IRRF)
4. **Itens Personalizados:** Apenas para benefícios/descontos não previstos
5. **Bases de Cálculo:** Apenas em folhas mensais CLT

## 🚀 Fluxo Completo

```
1. Admin gera holerites → Sistema calcula automaticamente
2. Admin envia por email → Funcionário recebe link
3. Funcionário acessa → Visualiza e baixa PDF
4. Status atualizado → Controle de visualização
```

## 🏗️ Arquitetura de Dados

### Fluxo de Geração:

```
[Admin] → Clica "Gerar Folha Mensal"
    ↓
[API /api/holerites/gerar] → POST
    ↓
[Busca funcionários ativos] → SELECT * FROM funcionarios WHERE ativo = true
    ↓
[Para cada funcionário]:
    • Calcula salário proporcional (dias trabalhados)
    • Calcula INSS (tabela progressiva ou fixo)
    • Calcula IRRF (se aplicável)
    • Aplica descontos (VT, cesta, planos)
    • Calcula pensão (se configurada)
    • Desconta adiantamento (se houver)
    • Calcula FGTS (8%)
    ↓
[INSERT INTO holerites] → Salva no banco
    ↓
[Retorna] → { total_gerados: 10, erros: 0 }
    ↓
[Admin] → Vê notificação de sucesso
```

### Fluxo de Visualização (Funcionário):

```
[Funcionário] → Acessa /holerites
    ↓
[API /api/holerites/meus-holerites] → GET
    ↓
[SELECT * FROM holerites WHERE funcionario_id = ?]
    ↓
[Retorna array de holerites]
    ↓
[Frontend] → Renderiza cards com filtros
    ↓
[Funcionário] → Clica "Visualizar"
    ↓
[Modal] → Exibe dados completos
    ↓
[Funcionário] → Clica "Baixar PDF"
    ↓
[API /api/holerites/:id/pdf] → GET
    ↓
[gerarHoleriteHTML()] → Gera HTML formatado
    ↓
[Retorna HTML] → Abre em nova aba
    ↓
[Navegador] → Exibe PDF pronto para impressão
```

### Fluxo de Edição (Admin):

```
[Admin] → Clica "Editar" em um holerite
    ↓
[Modal] → Carrega dados atuais
    ↓
[Admin] → Altera valores (ex: INSS de percentual para fixo)
    ↓
[Frontend] → Recalcula automaticamente
    • Atualiza total de descontos
    • Atualiza salário líquido
    • Atualiza referência INSS
    ↓
[Admin] → Clica "Salvar"
    ↓
[API /api/holerites/:id] → PATCH
    ↓
[UPDATE holerites SET ...] → Atualiza banco
    ↓
[Retorna] → Holerite atualizado
    ↓
[Frontend] → Fecha modal e recarrega lista
```

### Estrutura de Dados no Banco:

```sql
holerites (
  id SERIAL PRIMARY KEY,
  funcionario_id INTEGER REFERENCES funcionarios(id),
  periodo_inicio DATE,
  periodo_fim DATE,
  salario_base DECIMAL(10,2),
  dias_trabalhados INTEGER DEFAULT 30,
  
  -- Proventos
  bonus DECIMAL(10,2) DEFAULT 0,
  horas_extras DECIMAL(10,2) DEFAULT 0,
  adicional_noturno DECIMAL(10,2) DEFAULT 0,
  adicional_periculosidade DECIMAL(10,2) DEFAULT 0,
  adicional_insalubridade DECIMAL(10,2) DEFAULT 0,
  comissoes DECIMAL(10,2) DEFAULT 0,
  
  -- Descontos
  inss DECIMAL(10,2) DEFAULT 0,
  inss_percentual BOOLEAN DEFAULT true,
  inss_referencia VARCHAR(10), -- "8.79"
  aliquota_inss DECIMAL(5,2),
  irrf DECIMAL(10,2) DEFAULT 0,
  vale_transporte DECIMAL(10,2) DEFAULT 0,
  cesta_basica_desconto DECIMAL(10,2) DEFAULT 0,
  plano_saude DECIMAL(10,2) DEFAULT 0,
  plano_odontologico DECIMAL(10,2) DEFAULT 0,
  adiantamento DECIMAL(10,2) DEFAULT 0,
  faltas DECIMAL(10,2) DEFAULT 0,
  pensao_alimenticia DECIMAL(10,2) DEFAULT 0,
  
  -- Totais
  total_proventos DECIMAL(10,2),
  total_descontos DECIMAL(10,2),
  salario_liquido DECIMAL(10,2),
  
  -- Outros
  fgts DECIMAL(10,2),
  data_pagamento DATE,
  status VARCHAR(20) DEFAULT 'gerado',
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

---

**Sistema funcionando perfeitamente! ✅**

Para documentação completa, consulte: `ANALISE-COMPLETA-SISTEMA-HOLERITES-10-02-2026.md`
