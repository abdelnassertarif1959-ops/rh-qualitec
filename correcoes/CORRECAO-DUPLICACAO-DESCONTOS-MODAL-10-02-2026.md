# Correção: Duplicação de Descontos no Modal do Holerite

**Data:** 10/02/2026  
**Problema:** Salário líquido negativo no modal do holerite do Leonardo  
**Causa:** Descontos personalizados sendo somados duas vezes

## 🔍 Problema Identificado

### Sintomas
- Modal exibindo salário líquido de **-R$ 148,58**
- Banco de dados com valor correto de **R$ 813,42**
- Total de descontos no modal: **R$ 3.615,25**
- Total de descontos no banco: **R$ 2.653,25**
- Diferença: **R$ 962,00** (valor da pensão alimentícia)

### Causa Raiz
O modal estava **somando os itens personalizados duas vezes**:

1. **Primeira vez:** Valor já incluído no campo `total_descontos` do banco
2. **Segunda vez:** Buscando da tabela `holerite_itens_personalizados` e somando novamente

```javascript
// ❌ CÓDIGO ERRADO (antes)
const totalDescontosComItens = computed(() => {
  const descontosBase = props.holerite.total_descontos || 0
  const descontosItens = descontosPersonalizados.value.reduce((sum, item) => {
    return sum + (Number(item.valor) || 0)
  }, 0)
  
  return descontosBase + descontosItens  // ❌ Somando duas vezes!
})
```

## ✅ Solução Implementada

### 1. Correção do Cálculo de Descontos

O `total_descontos` que vem do banco **JÁ INCLUI** todos os descontos, incluindo itens personalizados. Não devemos somar novamente.

```javascript
// ✅ CÓDIGO CORRETO (depois)
const totalDescontosComItens = computed(() => {
  const descontosBase = props.holerite.total_descontos || 0
  
  console.log(`💰 Total de Descontos (do banco): R$ ${descontosBase.toFixed(2)}`)
  console.log(`   ⚠️  Itens personalizados JÁ ESTÃO incluídos neste valor`)
  
  return descontosBase  // ✅ Usando apenas o valor do banco
})
```

### 2. Exibição dos Itens Personalizados

Os itens personalizados continuam sendo exibidos no modal para **detalhamento**, mas não são somados novamente ao total.

```vue
<!-- Itens Personalizados (apenas para detalhamento) -->
<div v-if="descontosPersonalizados.length > 0">
  <div 
    v-for="desconto in descontosPersonalizados" 
    :key="desconto.id"
    class="flex justify-between py-2 border-b border-gray-100"
  >
    <span class="text-gray-600">{{ desconto.descricao }}</span>
    <span class="font-semibold text-red-600">- {{ formatarMoeda(desconto.valor) }}</span>
  </div>
</div>
```

## 📊 Resultado

### Antes da Correção
```
Total Proventos:  R$ 3.466,67
Total Descontos:  R$ 3.615,25  ❌ (errado)
Salário Líquido: -R$   148,58  ❌ (negativo!)
```

### Depois da Correção
```
Total Proventos:  R$ 3.466,67
Total Descontos:  R$ 2.653,25  ✅ (correto)
Salário Líquido:  R$   813,42  ✅ (positivo!)
```

## 🎯 Arquivos Alterados

1. **app/components/holerites/HoleriteModal.vue**
   - Corrigido cálculo de `totalDescontosComItens`
   - Adicionados logs explicativos
   - Mantida exibição dos itens personalizados para detalhamento

## 📝 Observações Importantes

### Como Funciona o Sistema

1. **Geração do Holerite** (`server/api/holerites/gerar.post.ts`)
   - Busca itens personalizados da tabela `holerite_itens_personalizados`
   - Calcula todos os descontos (INSS, IRRF, pensão, itens personalizados, etc.)
   - Salva o `total_descontos` **já com tudo incluído**

2. **Exibição no Modal** (`app/components/holerites/HoleriteModal.vue`)
   - Busca os itens personalizados apenas para **exibir o detalhamento**
   - Usa o `total_descontos` do banco **sem somar novamente**
   - Calcula o salário líquido: `proventos - total_descontos`

### Itens Personalizados vs Campo Específico

- **Pensão Alimentícia:** Pode estar em `holerite.pensao_alimenticia` OU em item personalizado
- **Sistema atual:** Leonardo tem pensão como item personalizado (R$ 962,00)
- **Importante:** Não duplicar! Se está em item personalizado, o campo `pensao_alimenticia` deve estar zerado

## ✅ Validação

Execute o script de verificação:

```bash
node scripts/verificar-duplicacao-pensao-leonardo.js
```

Deve mostrar:
- ✅ Pensão está apenas nos itens personalizados
- ✅ Campo pensao_alimenticia está zerado
- ✅ Salário líquido correto: R$ 813,42

## 🚀 Deploy

Esta correção afeta apenas o frontend (componente Vue). Não requer:
- ❌ Alterações no banco de dados
- ❌ Alterações nas APIs
- ❌ Regeneração de holerites

Basta fazer o deploy do código atualizado.
