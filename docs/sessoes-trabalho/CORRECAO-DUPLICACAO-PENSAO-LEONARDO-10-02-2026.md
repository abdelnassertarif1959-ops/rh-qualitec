# Correção da Duplicação de Pensão Alimentícia - Leonardo - 10/02/2026

## Problema Reportado

O holerite do Leonardo estava mostrando a pensão alimentícia **DUAS VEZES**:
- Código 915: PENSÃO ALIMENTÍCIA - R$ 948,63
- Código 960: PENSÃO ALIMENTÍCIA - R$ 948,63

Isso causava:
- Duplicação visual no holerite
- Confusão para o funcionário
- Aparência de erro no cálculo

## Diagnóstico

### Verificação no Banco de Dados

✅ **Banco de dados está correto**:
- Apenas **1 registro** de pensão alimentícia na tabela `holerite_itens_personalizados`
- ID: 6
- Descrição: PENSÃO ALIMENTÍCIA
- Valor: R$ 948,63
- Vigência: recorrente (desde 10/02/2026)

### Verificação no Código

❌ **Bug encontrado no `holeriteHTML.ts`**:

O código estava adicionando a pensão alimentícia DUAS VEZES no HTML:

```typescript
// Primeira vez - Código 915 (linha 267)
if (pensaoAlimenticia > 0) {
  linhasTabela += `
    <tr>
      <td>915</td>
      <td>PENSÃO ALIMENTÍCIA</td>
      ...
    </tr>`
}

// Segunda vez - Código 960 (linha 324) ❌ DUPLICADO!
if (pensaoAlimenticia > 0) {
  linhasTabela += `
    <tr>
      <td>960</td>
      <td>PENSÃO ALIMENTÍCIA</td>
      ...
    </tr>`
}
```

## Causa Raiz

Durante o desenvolvimento, a pensão alimentícia foi adicionada duas vezes no template HTML:
1. **Código 915**: Adicionado inicialmente
2. **Código 960**: Adicionado posteriormente (provavelmente por engano)

Ambos os blocos verificavam `if (pensaoAlimenticia > 0)` e adicionavam a mesma linha.

## Solução Implementada

### Correção no Código

Removido o bloco duplicado (código 960) do arquivo `server/utils/holeriteHTML.ts`:

```typescript
// ❌ REMOVIDO - Bloco duplicado
if (pensaoAlimenticia > 0) {
  linhasTabela += `
    <tr>
      <td>960</td>
      <td>PENSÃO ALIMENTÍCIA</td>
      <td class="text-center"></td>
      <td></td>
      <td class="text-right">${pensaoAlimenticia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>`
}
```

### Resultado Esperado

Após a correção, o holerite do Leonardo deve mostrar:

```
Código  Descrição              Referência  Vencimentos  Descontos
------  --------------------   ----------  -----------  ---------
8781    DIAS NORMAIS           30.00       3.466,67
998     I.N.S.S.               9.23                     304,58
910     ADIANTAMENTO SALARIAL                           1.386,67
915     PENSÃO ALIMENTÍCIA                              948,63    ✅ APENAS UMA VEZ
```

## Impacto

### Antes da Correção
- Total de Descontos: R$ 2.639,88 (incluindo pensão duplicada)
- Salário Líquido: R$ 826,79

### Depois da Correção
- Total de Descontos: R$ 2.639,88 (sem mudança, pois o cálculo estava correto)
- Salário Líquido: R$ 826,79 (sem mudança)
- **Visualização**: Apenas uma linha de pensão alimentícia

**Nota**: Os valores totais não mudam porque o cálculo no banco estava correto. A duplicação era apenas visual no HTML.

## Arquivos Modificados

1. `server/utils/holeriteHTML.ts`
   - Removido bloco duplicado da pensão alimentícia (código 960)
   - Mantido apenas o código 915

2. `scripts/verificar-duplicacao-pensao-leonardo-agora.js`
   - Script de diagnóstico criado para verificar o problema

## Como Testar

### 1. Após o Deploy

1. Acesse o sistema como admin
2. Vá para "Holerites" > "Gerenciar Holerites"
3. Localize o holerite do Leonardo (Janeiro/2026)
4. Clique em "Visualizar"
5. Verifique que a pensão alimentícia aparece **apenas uma vez**

### 2. Gerar Novo Holerite

1. Gere um novo holerite para o Leonardo
2. Verifique que a pensão aparece apenas uma vez
3. Confirme que o valor está correto (R$ 948,63)

### 3. Verificar Email

1. Envie o holerite por email
2. Abra o email recebido
3. Verifique que a pensão aparece apenas uma vez no PDF/HTML

## Prevenção de Regressão

Para evitar que esse problema aconteça novamente:

1. ✅ Código revisado e duplicação removida
2. ✅ Script de diagnóstico criado para verificar duplicações
3. 📝 Documentação atualizada sobre a estrutura do HTML
4. 📝 Adicionar teste automatizado (futuro)

## Observações

- O problema afetava apenas a **visualização** do holerite
- Os **cálculos** estavam corretos no banco de dados
- O **total de descontos** estava correto
- Apenas a **linha duplicada** no HTML causava confusão

## Status

- ✅ Bug identificado
- ✅ Correção implementada
- ✅ Script de diagnóstico criado
- ✅ Documentação atualizada
- ⏳ Aguardando deploy no Vercel
- ⏳ Testes em produção pendentes

## Próximos Passos

1. Fazer commit e push das mudanças
2. Aguardar deploy automático no Vercel
3. Testar em produção
4. Verificar holerite do Leonardo
5. Confirmar que a duplicação foi corrigida
