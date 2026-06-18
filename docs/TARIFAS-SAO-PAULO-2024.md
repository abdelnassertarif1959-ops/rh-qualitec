# 🚍 Tarifas de Transporte Público - São Paulo 2024

## 📊 Valores Atualizados

### Tarifas Básicas

| Transporte | Valor | Código |
|------------|-------|--------|
| 🚌 Ônibus Municipal (SPTrans) | **R$ 5,30** | `onibus` |
| 🚇 Metrô/Trem (CPTM) | **R$ 5,40** | `metro` |
| 🔄 Sistema Integrado | **Variável** | `integracao` |

---

## 🔄 Sistema de Integração

### Como Funciona

O Bilhete Único permite integração entre diferentes modais:

- ✅ **Até 3 ônibus** em um período de 3 horas
- ✅ **1 metrô ou trem** nas primeiras 2 horas
- ✅ Pagamento com Bilhete Único ou crédito eletrônico

### Exemplos de Trajetos

#### Exemplo 1: Casa → Trabalho (Integração Simples)
```
1. Casa → Ônibus (R$ 5,30)
2. Estação → Metrô (R$ 5,40)
Total: R$ 10,70 por trajeto
Mensal (22 dias): R$ 235,40
```

#### Exemplo 2: Casa → Trabalho (Múltiplas Baldeações)
```
1. Casa → Ônibus 1 (R$ 5,30)
2. Baldeação → Ônibus 2 (integrado)
3. Estação → Metrô (R$ 5,40)
Total: R$ 10,70 por trajeto
Mensal (22 dias): R$ 235,40
```

#### Exemplo 3: Trajeto Complexo
```
1. Casa → Ônibus 1 (R$ 5,30)
2. Baldeação → Ônibus 2 (integrado)
3. Baldeação → Ônibus 3 (integrado)
4. Estação → Metrô (R$ 5,40)
Total: R$ 10,70 por trajeto
Mensal (22 dias): R$ 235,40
```

---

## 💰 Cálculos para Vale Transporte

### Cenário 1: Apenas Ônibus (Ida e Volta)
```
Passagens/dia: 2 (1 ida + 1 volta)
Valor: R$ 5,30
Dias úteis: 22
Total mensal: 2 × R$ 5,30 × 22 = R$ 233,20
```

### Cenário 2: Apenas Metrô (Ida e Volta)
```
Passagens/dia: 2 (1 ida + 1 volta)
Valor: R$ 5,40
Dias úteis: 22
Total mensal: 2 × R$ 5,40 × 22 = R$ 237,60
```

### Cenário 3: Integração (Ônibus + Metrô - Ida e Volta)
```
Ônibus/dia: 2 (1 ida + 1 volta)
Metrô/dia: 2 (1 ida + 1 volta)
Dias úteis: 22

Cálculo:
- Ônibus: 2 × R$ 5,30 × 22 = R$ 233,20
- Metrô: 2 × R$ 5,40 × 22 = R$ 237,60
Total mensal: R$ 470,80
```

### Cenário 4: Integração com Baldeações (3 Ônibus + 1 Metrô)
```
Ônibus/dia: 6 (3 ida + 3 volta)
Metrô/dia: 2 (1 ida + 1 volta)
Dias úteis: 22

Cálculo:
- Ônibus: 6 × R$ 5,30 × 22 = R$ 699,60
- Metrô: 2 × R$ 5,40 × 22 = R$ 237,60
Total mensal: R$ 937,20
```

---

## 📉 Desconto Legal

### Regra CLT

- **Máximo:** 6% do salário base
- **Opcional:** Funcionário pode recusar o desconto

### Exemplos de Desconto

| Salário Base | Desconto (6%) | Vale Transporte | Valor Líquido |
|--------------|---------------|-----------------|---------------|
| R$ 1.500,00 | R$ 90,00 | R$ 233,20 | R$ 143,20 |
| R$ 2.000,00 | R$ 120,00 | R$ 233,20 | R$ 113,20 |
| R$ 3.000,00 | R$ 180,00 | R$ 470,80 | R$ 290,80 |
| R$ 5.000,00 | R$ 300,00 | R$ 937,20 | R$ 637,20 |

---

## 🎯 Configuração no Sistema

### Tipo: Apenas Ônibus
```json
{
  "tipo_transporte": "onibus",
  "passagens_onibus_dia": 2,
  "valor_passagem_onibus": 5.30,
  "dias_uteis": 22
}
```

### Tipo: Apenas Metrô
```json
{
  "tipo_transporte": "metro",
  "passagens_metro_dia": 2,
  "valor_passagem_metro": 5.40,
  "dias_uteis": 22
}
```

### Tipo: Integração
```json
{
  "tipo_transporte": "integracao",
  "passagens_onibus_dia": 2,
  "valor_passagem_onibus": 5.30,
  "passagens_metro_dia": 2,
  "valor_passagem_metro": 5.40,
  "dias_uteis": 22
}
```

---

## 📅 Histórico de Valores

| Data | Ônibus | Metrô/Trem |
|------|--------|------------|
| 2024 | R$ 5,30 | R$ 5,40 |
| 2023 | R$ 4,40 | R$ 5,00 |
| 2022 | R$ 4,40 | R$ 4,40 |

---

## ✅ Checklist de Configuração

Ao configurar o Vale Transporte de um funcionário:

- [ ] Perguntar qual(is) transporte(s) ele usa
- [ ] Verificar se há baldeações
- [ ] Contar quantas passagens por dia (ida + volta)
- [ ] Usar valores atualizados (R$ 5,30 ônibus / R$ 5,40 metrô)
- [ ] Considerar 22 dias úteis por mês
- [ ] Aplicar desconto de 6% do salário base
- [ ] Verificar se o valor líquido é positivo

---

**Última atualização:** Janeiro 2024  
**Fonte:** SPTrans e CPTM
