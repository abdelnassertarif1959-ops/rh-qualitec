# Correção: Formato da Referência do INSS

**Data:** 10/02/2026  
**Problema:** Referência do INSS mostrava valor completo "8.9% s/ R$ 3.650,00"  
**Solução:** Agora mostra apenas o percentual "8.9"  
**Status:** ✅ CORRIGIDO

## 🔍 Problema

### Antes
- **No modal:** Usuário digitava "8.9% s/ R$ 3.650,00"
- **No HTML/PDF:** Aparecia "8.9% s/ R$ 3.650,00" (texto completo)
- **Problema:** Muito texto na coluna de referência

### Depois
- **No modal:** Usuário digita apenas "8.9" ou clica em "Gerar referência automática"
- **No HTML/PDF:** Aparece apenas "8.9" (só o percentual)
- **Solução:** Coluna de referência mais limpa e profissional

## ✅ Correções Aplicadas

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
    // Usar apenas o percentual configurado
    const percentualConfig = Number(inssConfig.value.percentual) || 0
    
    if (percentualConfig > 0) {
      // Gerar apenas o percentual formatado (ex: "12.00" ou "8.90")
      form.value.inss_referencia = percentualConfig.toFixed(2)
    }
  }
}
```

### 2. Placeholder Atualizado
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

### 3. Script de Migração
**Arquivo:** `scripts/atualizar-formato-referencia-inss.js`

Atualiza automaticamente todos os holerites existentes:
- Extrai apenas o percentual da referência antiga
- Remove o texto "s/ R$ X.XXX,XX"
- Atualiza no banco de dados

**Resultado:**
```
✅ Atualizados: 9 holerites
   "8.9% s/ R$ 3.650,00" → "8.9"
   "7.50 s/ R$ 3.180,00" → "7.50"
   "7.50 s/ R$ 3.000,00" → "7.50"
   ...
```

## 🎯 Comportamento Agora

### No Modal de Edição
1. Selecione INSS como "Valor Fixo"
2. Digite o valor do INSS (ex: R$ 326,58)
3. Digite o percentual (ex: 8.9%)
4. Clique em "✨ Gerar referência automática"
5. Campo "Referência do INSS" é preenchido com: **"8.90"**

### No HTML/PDF Gerado
```
Código | Descrição | Referência | Vencimentos | Descontos
-------|-----------|------------|-------------|----------
998    | I.N.S.S.  | 8.90       |             | 326,58
```

Antes aparecia: `8.9% s/ R$ 3.650,00`  
Agora aparece: `8.90`

## 📋 Como Usar

### Para Novos Holerites
1. Edite o holerite
2. Configure INSS como "Valor Fixo"
3. Clique em "✨ Gerar referência automática"
4. O campo será preenchido apenas com o percentual

### Para Holerites Existentes
Já foram atualizados automaticamente pelo script! ✅

Se quiser atualizar novamente:
```bash
node scripts/atualizar-formato-referencia-inss.js
```

## 🎨 Formato Aceito

O campo `inss_referencia` agora aceita:

### Recomendado (gerado automaticamente)
- `"12.00"` - Percentual com 2 casas decimais
- `"8.90"` - Percentual com 2 casas decimais
- `"7.50"` - Percentual com 2 casas decimais

### Também aceito (digitação manual)
- `"12"` - Percentual sem casas decimais
- `"8.9"` - Percentual com 1 casa decimal
- `"12.00%"` - Com símbolo de porcentagem
- Qualquer texto personalizado

## ✨ Vantagens

1. **Mais limpo:** Coluna de referência não fica poluída
2. **Mais profissional:** Formato padrão de holerites
3. **Mais simples:** Usuário não precisa digitar o valor do salário
4. **Automático:** Botão gera o formato correto automaticamente

## 🔄 Compatibilidade

- ✅ Holerites antigos foram migrados automaticamente
- ✅ Novos holerites usam o formato novo
- ✅ Código HTML continua funcionando normalmente
- ✅ Não quebra nenhuma funcionalidade existente

## 📝 Observações

### Se quiser voltar ao formato antigo
Basta editar o holerite e digitar manualmente:
```
8.9% s/ R$ 3.650,00
```

O sistema aceita qualquer texto no campo `inss_referencia`.

### Se quiser um formato diferente
Exemplos de formatos personalizados aceitos:
- `"12% sobre R$ 4.100,00"`
- `"Alíquota: 8.9%"`
- `"12.00 (base: R$ 4.100,00)"`
- Qualquer texto que você quiser!

O botão "Gerar referência automática" sempre gera no formato simples: `"12.00"`
