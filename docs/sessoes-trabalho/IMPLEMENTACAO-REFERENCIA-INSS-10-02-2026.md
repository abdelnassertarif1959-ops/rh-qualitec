# Implementação: Referência do INSS no Holerite
**Data:** 10/02/2026  
**Tipo:** Nova Funcionalidade

## 📋 Objetivo

Adicionar campo de referência do INSS que aparece no PDF/HTML do holerite quando o INSS estiver em modo fixo (valor manual).

## 🎯 Funcionalidade

Quando o INSS é configurado como **valor fixo** (não percentual), o sistema permite:
1. Digitar manualmente uma referência (ex: "7,5% s/ R$ 4.100,00")
2. Gerar automaticamente a referência baseada no cálculo

Esta referência aparecerá na coluna "Referência" do holerite PDF/HTML.

## 🗄️ Alterações no Banco de Dados

### Script SQL
`database/41-adicionar-referencia-inss.sql`

```sql
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS inss_referencia VARCHAR(255) DEFAULT NULL;
```

### Executar no Supabase
1. Acesse o Supabase SQL Editor
2. Execute o arquivo `database/41-adicionar-referencia-inss.sql`
3. Verifique se a coluna foi criada

## 🎨 Alterações no Frontend

### 1. Componente HoleriteEditForm.vue

#### Campo Adicionado ao Formulário
```typescript
const form = ref({
  // ... outros campos
  inss: props.holerite.inss || 0,
  inss_referencia: props.holerite.inss_referencia || '',
  // ... outros campos
})
```

#### Nova Seção na Interface (Modo Fixo)
Quando `inssConfig.tipo === 'fixo'`, aparece:
- Campo de texto para digitar a referência manualmente
- Botão "✨ Gerar referência automática"
- Hint explicativo

#### Funções Implementadas

**gerarReferenciaAutomatica()**
```typescript
const gerarReferenciaAutomatica = () => {
  if (inssConfig.value.tipo === 'fixo') {
    const salarioBruto = calcularTotalProventos()
    const valorINSS = Number(form.value.inss) || 0
    
    if (salarioBruto > 0 && valorINSS > 0) {
      const percentualCalculado = (valorINSS / salarioBruto) * 100
      const salarioFormatado = salarioBruto.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
      
      form.value.inss_referencia = `${percentualCalculado.toFixed(1)}% s/ R$ ${salarioFormatado}`
    }
  }
}
```

**atualizarReferenciaINSS()**
- Chamada automaticamente quando o valor do INSS muda (modo fixo)
- Atualiza a referência em tempo real

### 2. Componente UiInput.vue

Adicionada propriedade `uppercase` com valor padrão `true`:
- Campos normais: texto em maiúsculas
- Campos de senha e email: mantém caixa original
- Campo de referência INSS: pode desabilitar maiúsculas com `:uppercase="false"`

## 🔧 Alterações no Backend

### API: server/api/holerites/[id].patch.ts

```typescript
if (body.inss_referencia !== undefined) {
  dadosParaAtualizar.inss_referencia = body.inss_referencia || null
}
```

## 📊 Fluxo de Uso

### Cenário 1: Modo Percentual (Padrão)
1. Usuário seleciona "📊 Percentual do Salário Bruto"
2. Digita o percentual (ex: 7.5%)
3. Sistema calcula automaticamente o valor do INSS
4. Campo `inss_referencia` fica vazio (não é usado)

### Cenário 2: Modo Fixo (Manual)
1. Usuário seleciona "💵 Valor Fixo"
2. Digita o valor do INSS (ex: R$ 380,60)
3. Aparece campo de referência com duas opções:
   - **Opção A:** Clicar em "✨ Gerar referência automática"
     - Sistema calcula: `(380,60 / 4.100,00) * 100 = 9,3%`
     - Gera: "9,3% s/ R$ 4.100,00"
   - **Opção B:** Digitar manualmente
     - Ex: "7,5% s/ R$ 4.100,00"
     - Ex: "Alíquota progressiva 2026"
4. Referência é salva no banco
5. Aparece no PDF/HTML do holerite

## 🎨 Exemplo Visual

### Interface do Modal de Edição

```
┌─────────────────────────────────────────────────────────┐
│ 🏛️ INSS (Instituto Nacional do Seguro Social)          │
│                                    💵 MODO FIXO (Manual) │
├─────────────────────────────────────────────────────────┤
│ Tipo de Cálculo:        │ Valor (R$):                   │
│ [💵 Valor Fixo ▼]       │ [380,60]                      │
├─────────────────────────────────────────────────────────┤
│ 📝 Referência do INSS (aparecerá no PDF/HTML)          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 7,5% s/ R$ 4.100,00                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ Este texto aparecerá na coluna 'Referência' do holerite│
│ ✨ Gerar referência automática                          │
└─────────────────────────────────────────────────────────┘
```

### Holerite PDF/HTML

```
DESCONTOS
─────────────────────────────────────────────────────────
Descrição              Referência           Valor
─────────────────────────────────────────────────────────
INSS                   7,5% s/ R$ 4.100,00  R$ 380,60
IRRF                   -                    R$ 0,00
Vale Transporte        -                    R$ 0,00
Adiantamento Salarial  40% do salário       R$ 1.640,00
─────────────────────────────────────────────────────────
```

## ✅ Validação

### Teste 1: Gerar Referência Automática
1. Abrir modal de edição de holerite
2. Ir para aba "Descontos"
3. Selecionar INSS como "Valor Fixo"
4. Digitar valor: R$ 380,60
5. Clicar em "✨ Gerar referência automática"
6. Verificar se aparece: "9,3% s/ R$ 4.100,00" (ou similar)
7. Salvar
8. Verificar no PDF/HTML se a referência aparece

### Teste 2: Referência Manual
1. Abrir modal de edição de holerite
2. Ir para aba "Descontos"
3. Selecionar INSS como "Valor Fixo"
4. Digitar valor: R$ 380,60
5. No campo de referência, digitar: "Alíquota progressiva 2026"
6. Salvar
7. Verificar no PDF/HTML se aparece "Alíquota progressiva 2026"

### Teste 3: Modo Percentual (sem referência)
1. Abrir modal de edição de holerite
2. Ir para aba "Descontos"
3. Selecionar INSS como "Percentual"
4. Digitar: 7.5%
5. Verificar que campo de referência não aparece
6. Salvar
7. Verificar no PDF/HTML que coluna referência fica vazia

## 📝 Observações Importantes

1. **Campo Opcional**: A referência é opcional, mesmo em modo fixo
2. **Formato Livre**: Usuário pode digitar qualquer texto
3. **Sugestão Automática**: Sistema sugere formato padrão "X% s/ R$ Y"
4. **Atualização Automática**: Ao mudar valor do INSS, referência é recalculada
5. **Modo Percentual**: Referência é sempre vazia (não é usada)

## 🚀 Próximos Passos

1. ✅ Executar script SQL no Supabase
2. ✅ Testar interface do modal
3. ⏳ Atualizar templates PDF/HTML para mostrar a referência
4. ⏳ Testar geração de PDF com referência
5. ⏳ Validar em produção

## 📁 Arquivos Modificados

- `database/41-adicionar-referencia-inss.sql` - Script SQL
- `app/components/holerites/HoleriteEditForm.vue` - Interface
- `app/components/ui/UiInput.vue` - Componente de input
- `server/api/holerites/[id].patch.ts` - API de atualização
- `IMPLEMENTACAO-REFERENCIA-INSS-10-02-2026.md` - Esta documentação

---

**Status:** ✅ Implementado (aguardando atualização dos templates PDF/HTML)  
**Responsável:** Sistema  
**Data:** 10/02/2026
