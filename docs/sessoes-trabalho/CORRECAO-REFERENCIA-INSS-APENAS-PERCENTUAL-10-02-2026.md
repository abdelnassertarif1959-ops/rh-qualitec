# Correção: Referência do INSS - Apenas Percentual

**Data:** 10/02/2026  
**Mudança:** Referência do INSS agora mostra apenas o percentual, sem o valor do salário  
**Status:** ✅ CONCLUÍDO

## 🎯 Objetivo

Simplificar a referência do INSS no HTML/PDF para mostrar apenas o percentual (ex: "8,90" ou "12,00") ao invés do formato completo (ex: "8.9% s/ R$ 3.650,00").

## 📋 Antes e Depois

### Antes
```
Modal: "8.9% s/ R$ 3.650,00"
HTML:  "8.9% s/ R$ 3.650,00"
```

### Depois
```
Modal: "8.90"
HTML:  "8,90"
```

## ✅ Mudanças Implementadas

### 1. Função de Geração Automática
**Arquivo:** `app/components/holerites/HoleriteEditForm.vue`

```typescript
// ANTES
const gerarReferenciaAutomatica = () => {
  if (inssConfig.value.tipo === 'fixo') {
    const salarioBase = Number(form.value.salario_base) || 0
    const percentualConfig = Number(inssConfig.value.percentual) || 0
    
    if (salarioBase > 0 && percentualConfig > 0) {
      const salarioFormatado = salarioBase.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
      
      form.value.inss_referencia = `${percentualConfig.toFixed(2)} s/ R$ ${salarioFormatado}`
    }
  }
}

// DEPOIS
const gerarReferenciaAutomatica = () => {
  if (inssConfig.value.tipo === 'fixo') {
    const percentualConfig = Number(inssConfig.value.percentual) || 0
    
    if (percentualConfig > 0) {
      // Gerar apenas o percentual formatado (ex: "12.00" ou "8.90")
      form.value.inss_referencia = percentualConfig.toFixed(2)
    }
  }
}
```

### 2. Placeholder do Campo
**Arquivo:** `app/components/holerites/HoleriteEditForm.vue`

```vue
<!-- ANTES -->
<UiInput 
  v-model="form.inss_referencia"
  placeholder="Ex: 7,5% s/ R$ 4.100,00"
/>

<!-- DEPOIS -->
<UiInput 
  v-model="form.inss_referencia"
  placeholder="Ex: 12.00"
/>
```

### 3. Script de Atualização em Massa
**Arquivo:** `scripts/atualizar-referencia-inss-apenas-percentual.js`

Script criado para atualizar holerites existentes que ainda têm o formato antigo.

## 🎯 Comportamento Atual

### No Modal de Edição
1. Usuário configura INSS como "Valor Fixo"
2. Define o percentual (ex: 8.9%)
3. Clica em "✨ Gerar referência automática"
4. Campo é preenchido com: "8.90"

### No HTML/PDF Gerado
```html
<tr>
  <td>998</td>
  <td>I.N.S.S.</td>
  <td class="text-center">8,90</td>  ← Apenas percentual
  <td></td>
  <td class="text-right">326,58</td>
</tr>
```

## 📊 Verificação dos Dados

### Holerites Atuais
```
Holerite ID: 1283 - Referência: "8.9" ✅
Holerite ID: 1281 - Referência: "7.50" ✅
Holerite ID: 1280 - Referência: "7.50" ✅
Holerite ID: 1279 - Referência: "7.50" ✅
Holerite ID: 1278 - Referência: "7.50" ✅
```

Todos os holerites já estão com o formato correto!

## 📋 Como Usar

### Para Novos Holerites
1. Edite o holerite
2. Configure INSS como "Valor Fixo"
3. Defina o percentual (ex: 12%)
4. Clique em "✨ Gerar referência automática"
5. O campo será preenchido com "12.00"
6. Salve o holerite

### Para Holerites Existentes
Se algum holerite ainda tiver o formato antigo:

```bash
node scripts/atualizar-referencia-inss-apenas-percentual.js
```

Este script:
- Busca holerites com formato antigo ("X.X% s/ R$ X.XXX,XX")
- Extrai apenas o percentual
- Atualiza no banco de dados

## ✨ Vantagens

1. **Mais limpo:** Apenas o percentual, sem informações redundantes
2. **Mais simples:** Fácil de ler e entender
3. **Consistente:** Mesmo formato em todos os holerites
4. **Flexível:** Usuário ainda pode digitar manualmente se quiser

## 🔧 Personalização

O usuário ainda pode digitar manualmente qualquer texto no campo de referência:
- "8,90" (formato padrão)
- "8.9%" (com símbolo de porcentagem)
- "Alíquota: 8,9%" (texto personalizado)
- "12% sobre salário base" (descrição completa)

O sistema aceita qualquer texto e exibe exatamente como digitado.

## 📝 Notas Técnicas

### Formato do Número
- Gerado com 2 casas decimais: `toFixed(2)`
- Exemplo: 8.9 → "8.90"
- Exemplo: 12 → "12.00"

### Conversão para HTML
O HTML usa vírgula como separador decimal (padrão brasileiro):
- Banco: "8.90"
- HTML: "8,90"

### Compatibilidade
- Holerites antigos: continuam funcionando
- Holerites novos: usam novo formato
- Não quebra nenhum holerite existente

## 🎯 Resultado Final

Agora a coluna "Referência" do INSS no HTML/PDF mostra apenas o percentual de forma limpa e objetiva, facilitando a leitura do holerite.

**Exemplo:**
```
Descrição    | Referência | Descontos
I.N.S.S.     | 8,90       | 326,58
```

Muito mais limpo que:
```
Descrição    | Referência              | Descontos
I.N.S.S.     | 8.9% s/ R$ 3.650,00    | 326,58
```
