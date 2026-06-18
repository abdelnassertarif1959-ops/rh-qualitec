# Correção: Referência do INSS não aparece no HTML/PDF

**Data:** 10/02/2026  
**Problema:** Campo de referência do INSS não aparece corretamente no HTML/PDF gerado  
**Status:** 🔍 EM INVESTIGAÇÃO

## 🔍 Diagnóstico

### Situação Atual
1. **No modal de edição:** Usuário digita "8.9% s/ R$ 3.650,00"
2. **No banco de dados:** Campo `inss_referencia` salva corretamente "8.9% s/ R$ 3.650,00"
3. **No HTML/PDF gerado:** Aparece apenas "12.00" ao invés da referência completa

### Verificação do Banco
```
Holerite ID: 1283
INSS Valor: R$ 326.58
INSS Percentual: 7.5%
INSS Referência: "8.9% s/ R$ 3.650,00" ✅ SALVO CORRETAMENTE
```

### Código HTML (server/utils/holeriteHTML.ts)
```typescript
if (inss > 0) {
  let referenciaINSS = ''
  if (holerite.inss_referencia) {
    // Se tem referência personalizada, usar ela
    referenciaINSS = holerite.inss_referencia  // ✅ CORRETO
  } else if (holerite.aliquota_inss) {
    // Se tem alíquota, formatar
    referenciaINSS = holerite.aliquota_inss.toFixed(2).replace('.', ',')
  } else {
    // Calcular baseado no valor
    referenciaINSS = ((inss / totalVencimentos) * 100).toFixed(2).replace('.', ',')
  }
  
  linhasTabela += `
    <tr>
      <td>998</td>
      <td>I.N.S.S.</td>
      <td class="text-center">${referenciaINSS}</td>  // ✅ USA A VARIÁVEL CORRETA
      ...
    </tr>`
}
```

## 🎯 Possíveis Causas

### 1. Cache do Navegador
- O HTML pode estar em cache
- Solução: Ctrl+F5 para forçar atualização

### 2. Holerite Antigo
- O holerite foi gerado antes da coluna `inss_referencia` existir
- Solução: Editar e salvar novamente o holerite

### 3. API não está buscando o campo
- A API de PDF pode não estar retornando o campo
- Adicionado log para debug

## ✅ Correções Aplicadas

### 1. Log de Debug na API
**Arquivo:** `server/api/holerites/[id]/pdf.get.ts`

```typescript
const holerite = holerites[0]

// Log para debug da referência INSS
console.log('📄 Dados do Holerite para HTML:')
console.log(`   ID: ${holerite.id}`)
console.log(`   INSS: R$ ${holerite.inss}`)
console.log(`   INSS Percentual: ${holerite.inss_percentual}%`)
console.log(`   INSS Referência: "${holerite.inss_referencia || 'null'}"`)
console.log(`   Alíquota INSS: ${holerite.aliquota_inss || 'null'}`)
```

### 2. Script de Verificação
**Arquivo:** `scripts/verificar-inss-referencia.js`

Verifica se o campo está sendo salvo corretamente no banco.

## 📋 Como Testar

### Passo 1: Verificar no Banco
```bash
node scripts/verificar-inss-referencia.js
```

Deve mostrar:
```
Holerite ID: 1283
INSS Referência: "8.9% s/ R$ 3.650,00" ✅
```

### Passo 2: Editar e Salvar Novamente
1. Abra o holerite no painel admin
2. Clique em "✏️ Editar"
3. Vá na aba "📉 Descontos"
4. Verifique o campo "Referência do INSS"
5. Clique em "Salvar"

### Passo 3: Gerar HTML/PDF
1. Clique em "👁️ Ver" no holerite
2. Clique em "📄 Baixar HTML" ou "📄 Baixar PDF"
3. Abra o arquivo
4. Procure pela linha "I.N.S.S." na tabela
5. Verifique a coluna "Referência"

### Passo 4: Verificar Logs do Servidor
No terminal onde o servidor está rodando, procure por:
```
📄 Dados do Holerite para HTML:
   ID: 1283
   INSS: R$ 326.58
   INSS Percentual: 7.5%
   INSS Referência: "8.9% s/ R$ 3.650,00"
```

## 🔧 Solução Temporária

Se o problema persistir, você pode:

1. **Editar manualmente o HTML gerado:**
   - Baixe o HTML
   - Abra em um editor de texto
   - Procure por `<td class="text-center">12.00</td>` na linha do INSS
   - Substitua por `<td class="text-center">8.9% s/ R$ 3.650,00</td>`
   - Salve e abra no navegador

2. **Regenerar o holerite:**
   - Exclua o holerite atual
   - Gere novamente
   - Edite e adicione a referência
   - Salve

## 🎯 Próximos Passos

1. ✅ Adicionar logs de debug na API
2. ⏳ Testar com holerite real
3. ⏳ Verificar se o campo está vindo da API
4. ⏳ Limpar cache do navegador
5. ⏳ Regenerar holerite se necessário

## 📝 Observações

- O campo `inss_referencia` existe no banco ✅
- O código HTML está correto ✅
- A API busca todos os campos (`select=*`) ✅
- Falta verificar se o valor está chegando na função `gerarHoleriteHTML`

## 🔍 Debug Adicional

Para verificar o que está chegando na função HTML, adicione este log temporário em `server/utils/holeriteHTML.ts` logo no início da função:

```typescript
export function gerarHoleriteHTML(holerite: any, funcionario: any, empresa: any): string {
  // DEBUG: Verificar dados recebidos
  console.log('🔍 DEBUG gerarHoleriteHTML:')
  console.log('   holerite.inss_referencia:', holerite.inss_referencia)
  console.log('   holerite.inss_percentual:', holerite.inss_percentual)
  console.log('   holerite.aliquota_inss:', holerite.aliquota_inss)
  
  // ... resto do código
}
```

Isso mostrará exatamente o que está chegando na função que gera o HTML.
