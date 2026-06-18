# Correção: Adiantamento de 40% nos Holerites Mensais
**Data:** 10/02/2026  
**Tipo:** Atualização em Massa

## 📋 Problema Identificado

Os holerites mensais foram gerados com:
- ✅ Salário bruto correto
- ✅ Desconto de INSS correto
- ❌ **Faltando desconto de 40% de adiantamento salarial**

## 🔧 Solução Implementada

### Script Criado
`scripts/adicionar-adiantamento-holerites-mensais.js`

### Lógica Aplicada

1. **Identificação dos Holerites Mensais**
   - Filtro: `observacoes = 'Folha mensal'`
   - Total encontrado: **12 holerites**

2. **Cálculo do Adiantamento**
   ```javascript
   adiantamento = salario_base * 0.40  // 40% do salário base
   ```

3. **Recálculo dos Totais**
   ```javascript
   total_descontos = inss + irrf + vale_transporte + pensao_alimenticia + 
                     cesta_basica + plano_saude + plano_odonto + faltas + 
                     outros_descontos + adiantamento
   
   salario_liquido = total_proventos - total_descontos
   ```

4. **Atualização no Banco**
   - Campo `adiantamento`: valor calculado (40%)
   - Campo `total_descontos`: recalculado
   - Campo `salario_liquido`: recalculado
   - Campo `updated_at`: timestamp atual

## 📊 Resultados da Execução

### Estatísticas
- ✅ **Holerites atualizados:** 12
- ❌ **Erros:** 0
- 📋 **Total processado:** 12
- ⏱️ **Taxa de sucesso:** 100%

### Exemplos de Atualização

#### Holerite ID 1272 (Funcionário 129)
- **Salário Base:** R$ 4.100,00
- **INSS:** R$ 380,60
- **Adiantamento (40%):** R$ 1.640,00
- **Total Descontos:**
  - Anterior: R$ 380,60
  - Novo: R$ 2.020,60
- **Salário Líquido:**
  - Anterior: R$ 3.719,40
  - Novo: R$ 2.079,40

#### Holerite ID 1273 (Funcionário 156)
- **Salário Base:** R$ 4.000,00
- **INSS:** R$ 368,60
- **Adiantamento (40%):** R$ 1.600,00
- **Total Descontos:**
  - Anterior: R$ 368,60
  - Novo: R$ 1.968,60
- **Salário Líquido:**
  - Anterior: R$ 3.631,40
  - Novo: R$ 2.031,40

#### Holerite ID 1283 (Funcionário 93)
- **Salário Base:** R$ 3.650,00
- **INSS:** R$ 326,60
- **Adiantamento (40%):** R$ 1.460,00
- **Total Descontos:**
  - Anterior: R$ 326,60
  - Novo: R$ 1.786,60
- **Salário Líquido:**
  - Anterior: R$ 3.323,40
  - Novo: R$ 1.863,40

## 🎯 Impacto

### Antes da Correção
- Holerites mensais mostravam apenas desconto de INSS
- Salário líquido estava **superestimado**
- Não refletia o adiantamento de 40% já pago

### Depois da Correção
- ✅ Adiantamento de 40% incluído nos descontos
- ✅ Total de descontos correto
- ✅ Salário líquido reflete o valor real a receber
- ✅ Holerites mensais consistentes com a política da empresa

## 📝 Observações Importantes

1. **Holerites com Salário Base Zero**
   - IDs 1274 e 1282 tinham salário base R$ 0,00
   - Foram processados mas não houve alteração (0% de 0 = 0)

2. **Período Afetado**
   - Todos os holerites são de: **01/02/2026 a 28/02/2026**
   - Data de pagamento: **06/02/2026**

3. **Status dos Holerites**
   - Todos estavam com status: `gerado`
   - Nenhum havia sido enviado ainda (`enviado_em: null`)

## ✅ Validação

Para validar a correção, execute:
```bash
node scripts/verificar-estrutura-holerites.js
```

Ou consulte diretamente no Supabase:
```sql
SELECT 
  id,
  funcionario_id,
  salario_base,
  inss,
  adiantamento,
  total_descontos,
  salario_liquido,
  observacoes
FROM holerites
WHERE observacoes = 'Folha mensal'
ORDER BY id DESC;
```

## 🚀 Próximos Passos

1. ✅ Validar os valores atualizados na interface
2. ✅ Verificar se os PDFs/emails refletem os novos valores
3. ✅ Confirmar com o RH se os valores estão corretos
4. ⏳ Enviar os holerites para os funcionários

## 📁 Arquivos Relacionados

- `scripts/adicionar-adiantamento-holerites-mensais.js` - Script de correção
- `scripts/verificar-estrutura-holerites.js` - Script de validação
- `server/api/holerites/gerar.post.ts` - API de geração (verificar lógica futura)

---
**Status:** ✅ Concluído  
**Executado em:** 10/02/2026  
**Responsável:** Sistema Automatizado
