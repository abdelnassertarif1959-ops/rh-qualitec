# 🚌 Sistema de Vale Transporte Detalhado

## 📋 Visão Geral

O sistema permite configurar o Vale Transporte de forma personalizada para cada funcionário, considerando:

- ✅ Diferentes tipos de transporte (ônibus, metrô, ou ambos)
- ✅ Quantidade de passagens por dia
- ✅ Valores diferentes para cada tipo de transporte
- ✅ Baldeações e integrações
- ✅ Dias úteis trabalhados
- ✅ Desconto automático (máximo 6% do salário)

---

## 🚍 Tarifas de São Paulo (2024)

### Valores Oficiais

| Transporte | Valor | Observação |
|------------|-------|------------|
| 🚌 Ônibus Municipal (SPTrans) | R$ 5,30 | Valor único por viagem com Bilhete Único |
| 🚇 Metrô/Trem (CPTM) | R$ 5,40 | Tarifa básica por viagem |
| 🔄 Integração | Variável | Até 3 ônibus em 3h + 1 metrô em 2h |

### Sistema de Integração

O sistema de integração de São Paulo permite:

- **Até 3 ônibus** em um período de 3 horas
- **1 metrô ou trem** nas primeiras 2 horas
- Pagamento com Bilhete Único ou crédito eletrônico

**Exemplo de trajeto integrado:**
1. Casa → Ônibus 1 (R$ 5,30)
2. Baldeação → Ônibus 2 (integrado)
3. Estação → Metrô (R$ 5,40)
4. **Total por dia (ida):** R$ 10,70

---

## 🎯 Como Funciona

### 1. Tipos de Transporte

#### 🚌 Apenas Ônibus (SPTrans)
- Funcionário usa somente ônibus municipal
- **Valor: R$ 5,30** por viagem (2024)
- Configure: quantidade de passagens/dia

**Exemplo:**
- 4 passagens/dia (2 ida + 2 volta)
- R$ 5,30 por passagem
- 22 dias úteis
- **Total: R$ 466,40/mês**

#### 🚇 Apenas Metrô/Trem (CPTM)
- Funcionário usa somente metrô ou trem
- **Valor: R$ 5,40** por viagem (2024)
- Configure: quantidade de passagens/dia

**Exemplo:**
- 2 passagens/dia (1 ida + 1 volta)
- R$ 5,40 por passagem
- 22 dias úteis
- **Total: R$ 237,60/mês**

#### 🔄 Integração (Ônibus + Metrô/Trem)
- Funcionário usa sistema integrado
- **Regras de integração:**
  - Até 3 ônibus em até 3 horas
  - 1 metrô/trem nas primeiras 2 horas
- Configure ambos separadamente

**Exemplo 1 - Integração Comum:**
- 2 ônibus + 1 metrô por dia
- Ônibus: R$ 5,30 | Metrô: R$ 5,40
- 22 dias úteis
- **Total: R$ 352,00/mês**

**Exemplo 2 - Múltiplas Baldeações:**
- 3 ônibus + 1 metrô por dia
- Ônibus: R$ 5,30 | Metrô: R$ 5,40
- 22 dias úteis
- **Total: R$ 468,60/mês**

---

## 💰 Cálculo do Valor

### Tarifas de São Paulo (2024)

- **Ônibus Municipal (SPTrans):** R$ 5,30
- **Metrô/Trem (CPTM):** R$ 5,40
- **Integração:** Permite combinar até 3 ônibus + 1 metrô/trem

### Fórmula

```
Valor Ônibus = (Passagens Ônibus/dia × R$ 5,30 × Dias Úteis)
Valor Metrô = (Passagens Metrô/dia × R$ 5,40 × Dias Úteis)
Valor Total = Valor Ônibus + Valor Metrô
```

### Desconto

Por lei, o funcionário pode ter descontado **até 6% do salário base**:

```
Desconto = Salário Base × 6%
Valor Líquido = Valor Total - Desconto
```

**Exemplo:**
- Salário Base: R$ 3.000,00
- Vale Transporte Total: R$ 466,40
- Desconto (6%): R$ 180,00
- **Valor Líquido: R$ 286,40**

---

## 🔧 Configuração por Funcionário

### Passo a Passo

1. **Acesse:** `/admin/funcionarios`
2. **Selecione** o funcionário
3. **Aba "Benefícios"**
4. **Ative** o Vale Transporte
5. **Configure:**

   - Tipo de transporte
   - Quantidade de passagens por dia
   - Valor das passagens
   - Dias úteis (padrão: 22)
   - Percentual de desconto (padrão: 6%)

6. **Salve** as alterações

---

## 📊 Exemplos Práticos

### Exemplo 1: Funcionário que pega 2 ônibus (ida e volta)

```json
{
  "vale_transporte": {
    "ativo": true,
    "tipo_transporte": "onibus",
    "passagens_onibus_dia": 2,
    "valor_passagem_onibus": 5.30,
    "passagens_metro_dia": 0,
    "valor_passagem_metro": 0,
    "dias_uteis": 22,
    "percentual_desconto": 6,
    "valor_total": 233.20
  }
}
```

**Cálculo:**
- 2 passagens × R$ 5,30 × 22 dias = **R$ 233,20**

---

### Exemplo 2: Funcionário com integração (2 ônibus + 1 metrô)

```json
{
  "vale_transporte": {
    "ativo": true,
    "tipo_transporte": "integracao",
    "passagens_onibus_dia": 2,
    "valor_passagem_onibus": 5.30,
    "passagens_metro_dia": 1,
    "valor_passagem_metro": 5.40,
    "dias_uteis": 22,
    "percentual_desconto": 6,
    "valor_total": 352.00
  }
}
```

**Cálculo:**
- Ônibus: 2 × R$ 5,30 × 22 = R$ 233,20
- Metrô: 1 × R$ 5,40 × 22 = R$ 118,80
- **Total: R$ 352,00**

---

### Exemplo 3: Funcionário com múltiplas baldeações (3 ônibus + 1 metrô)

```json
{
  "vale_transporte": {
    "ativo": true,
    "tipo_transporte": "integracao",
    "passagens_onibus_dia": 3,
    "valor_passagem_onibus": 5.30,
    "passagens_metro_dia": 1,
    "valor_passagem_metro": 5.40,
    "dias_uteis": 22,
    "percentual_desconto": 6,
    "valor_total": 468.60
  }
}
```

**Cálculo:**
- Ônibus: 3 × R$ 5,30 × 22 = R$ 349,80
- Metrô: 1 × R$ 5,40 × 22 = R$ 118,80
- **Total: R$ 468,60**

---

## 🗄️ Estrutura no Banco de Dados

### Campo JSONB na tabela `funcionarios`

```sql
beneficios: {
  "vale_transporte": {
    "ativo": boolean,
    "tipo_transporte": "onibus" | "metro" | "integracao",
    "passagens_onibus_dia": number,
    "valor_passagem_onibus": number (padrão: 5.30),
    "passagens_metro_dia": number,
    "valor_passagem_metro": number (padrão: 5.40),
    "dias_uteis": number (padrão: 22),
    "percentual_desconto": number (padrão: 6),
    "valor_total": number
  }
}
```

---

## 📈 Consultas Úteis

### Ver todos os funcionários com Vale Transporte

```sql
SELECT * FROM vw_vale_transporte_funcionarios 
WHERE vt_ativo = true;
```

### Total de Vale Transporte da empresa por mês

```sql
SELECT 
  SUM(valor_total) as total_vt,
  SUM(valor_desconto) as total_descontos,
  SUM(valor_liquido) as custo_empresa
FROM vw_vale_transporte_funcionarios 
WHERE vt_ativo = true;
```

### Funcionários por tipo de transporte

```sql
SELECT 
  tipo_transporte,
  COUNT(*) as quantidade,
  AVG(valor_total) as media_valor
FROM vw_vale_transporte_funcionarios 
WHERE vt_ativo = true
GROUP BY tipo_transporte;
```

**Resultado esperado:**
- `onibus`: Apenas ônibus (SPTrans)
- `metro`: Apenas metrô/trem (CPTM)
- `integracao`: Sistema integrado (ônibus + metrô)

---

## ⚖️ Regras Legais

### CLT - Consolidação das Leis do Trabalho

1. **Desconto Máximo:** 6% do salário base
2. **Obrigatoriedade:** Empresa deve fornecer se solicitado
3. **Não é salário:** Não integra remuneração para fins trabalhistas
4. **Dias úteis:** Considerar apenas dias efetivamente trabalhados

### Importante

- ✅ O desconto é opcional (funcionário pode recusar)
- ✅ Valor não pode ultrapassar 6% do salário
- ✅ Deve cobrir apenas trajeto casa-trabalho-casa
- ❌ Não pode ser pago em dinheiro (deve ser em vale/cartão)

---

## 🎨 Interface do Usuário

### Componente: `ValeTransporteConfig.vue`

Permite configurar de forma visual:

1. **Toggle** para ativar/desativar
2. **Seleção** do tipo de transporte (cards visuais)
3. **Inputs** para quantidade de passagens
4. **Inputs** para valores das passagens
5. **Input** para dias úteis
6. **Input** para percentual de desconto
7. **Resumo** automático do cálculo

### Cálculo em Tempo Real

O componente calcula automaticamente:
- ✅ Custo de ônibus
- ✅ Custo de metrô
- ✅ Valor total
- ✅ Desconto
- ✅ Valor líquido

---

## 🚀 Migração

### Executar SQL

```bash
# No Supabase SQL Editor
database/08-vale-transporte-detalhado.sql
```

### O que a migração faz:

1. ✅ Documenta estrutura do campo `beneficios`
2. ✅ Cria função `calcular_vale_transporte()`
3. ✅ Cria view `vw_vale_transporte_funcionarios`
4. ✅ Adiciona exemplo para admin Silvana

---

## 📝 Exemplo de Uso na API

### Salvar configuração

```typescript
const valeTransporte = {
  ativo: true,
  tipo_transporte: 'integracao',
  passagens_onibus_dia: 2,
  valor_passagem_onibus: 5.30,
  passagens_metro_dia: 1,
  valor_passagem_metro: 5.40,
  dias_uteis: 22,
  percentual_desconto: 6,
  valor_total: 352.00
}

await $fetch('/api/funcionarios/beneficios', {
  method: 'PATCH',
  body: {
    funcionario_id: 'xxx',
    vale_transporte: valeTransporte
  }
})
```

---

## ✅ Checklist de Implementação

- [x] Componente `ValeTransporteConfig.vue`
- [x] Migração SQL com funções e views
- [x] Documentação completa
- [ ] Integrar no `FuncionarioForm.vue`
- [ ] Atualizar `FuncionarioBeneficios.vue` para exibir detalhes
- [ ] Criar API endpoint para salvar configuração
- [ ] Adicionar validações (máximo 6% desconto)
- [ ] Testes com diferentes cenários

---

## 🎯 Próximos Passos

1. Integrar o componente no formulário de funcionários
2. Criar endpoint da API para salvar
3. Atualizar visualização de benefícios
4. Adicionar no cálculo de holerites
5. Criar relatório de custos de Vale Transporte

---

**Pronto!** Agora você tem um sistema completo e flexível para gerenciar o Vale Transporte de cada funcionário! 🚀
