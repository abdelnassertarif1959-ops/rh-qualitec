# Correção: Persistência de Percentual INSS e Pensão no Modal

**Data:** 10/02/2026  
**Status:** ✅ Corrigido

## 🐛 Problema

Ao editar um holerite e mudar o percentual do INSS (ex: de 7,5% para 8,79%) ou da Pensão Alimentícia, após salvar e reabrir o modal, o percentual voltava para o valor padrão (7,5% para INSS, 30% para Pensão).

### Causa Raiz

O sistema estava salvando apenas o **valor calculado** (ex: R$ 260,00 de INSS), mas não estava salvando:
- Qual **tipo de cálculo** foi usado (fixo ou percentual)
- Qual **percentual** foi aplicado (ex: 8,79%)
- Se a pensão é **recorrente** ou não

Ao reabrir o modal, o componente sempre inicializava com os valores padrão.

## ✅ Solução Implementada

### 1. Banco de Dados - Novas Colunas

Adicionadas 5 novas colunas na tabela `holerites`:

```sql
-- Configurações do INSS
inss_tipo VARCHAR(20) DEFAULT 'percentual'
inss_percentual DECIMAL(5,2) DEFAULT 7.5

-- Configurações da Pensão Alimentícia
pensao_tipo VARCHAR(20) DEFAULT 'percentual'
pensao_percentual DECIMAL(5,2) DEFAULT 30.0
pensao_recorrente BOOLEAN DEFAULT false
```

### 2. API - Salvar e Carregar Configurações

Atualizada a API `server/api/holerites/[id].patch.ts` para:
- **Salvar** as configurações quando o holerite é editado
- **Retornar** as configurações quando o holerite é carregado

```typescript
// Salvar configurações
if (body.inss_tipo !== undefined) dadosParaAtualizar.inss_tipo = body.inss_tipo
if (body.inss_percentual !== undefined) dadosParaAtualizar.inss_percentual = parseNumericValue(body.inss_percentual)
if (body.pensao_tipo !== undefined) dadosParaAtualizar.pensao_tipo = body.pensao_tipo
if (body.pensao_percentual !== undefined) dadosParaAtualizar.pensao_percentual = parseNumericValue(body.pensao_percentual)
if (body.pensao_recorrente !== undefined) dadosParaAtualizar.pensao_recorrente = body.pensao_recorrente
```

### 3. Frontend - Persistir Configurações

Atualizado o componente `HoleriteEditForm.vue` para:

**a) Carregar configurações do banco ao abrir o modal:**

```typescript
const inssConfig = ref({
  tipo: props.holerite.inss_tipo || 'percentual',
  percentual: props.holerite.inss_percentual || 7.5
})

const pensaoConfig = ref({
  tipo: props.holerite.pensao_tipo || 'percentual',
  percentual: props.holerite.pensao_percentual || 30,
  recorrente: props.holerite.pensao_recorrente || false
})
```

**b) Salvar configurações ao clicar em "Salvar":**

```typescript
const dadosSanitizados = {
  // ... outros campos ...
  inss_tipo: inssConfig.value.tipo,
  inss_percentual: sanitizarValorNumerico(inssConfig.value.percentual),
  pensao_tipo: pensaoConfig.value.tipo,
  pensao_percentual: sanitizarValorNumerico(pensaoConfig.value.percentual),
  pensao_recorrente: pensaoConfig.value.recorrente
}
```

**c) Atualizar configurações quando o holerite mudar (watch):**

```typescript
watch(() => props.holerite, (novoHolerite) => {
  // Atualizar configurações de INSS e Pensão
  inssConfig.value = {
    tipo: novoHolerite.inss_tipo || 'percentual',
    percentual: novoHolerite.inss_percentual || 7.5
  }
  
  pensaoConfig.value = {
    tipo: novoHolerite.pensao_tipo || 'percentual',
    percentual: novoHolerite.pensao_percentual || 30,
    recorrente: novoHolerite.pensao_recorrente || false
  }
})
```

## 📁 Arquivos Modificados

1. **Banco de Dados:**
   - `database/40-adicionar-config-inss-pensao-holerites.sql` (NOVO)

2. **Backend:**
   - `server/api/holerites/[id].patch.ts`

3. **Frontend:**
   - `app/components/holerites/HoleriteEditForm.vue`

## 🚀 Como Aplicar a Correção

### Passo 1: Executar SQL no Supabase

1. Abra o Supabase SQL Editor
2. Execute o arquivo: `database/40-adicionar-config-inss-pensao-holerites.sql`
3. Verifique se as colunas foram criadas:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name IN ('inss_tipo', 'inss_percentual', 'pensao_tipo', 'pensao_percentual', 'pensao_recorrente');
```

### Passo 2: Testar no Sistema

1. Abra um holerite existente no modal de edição
2. Mude o percentual do INSS (ex: de 7,5% para 8,79%)
3. Clique em "Salvar Alterações"
4. Feche o modal
5. Reabra o mesmo holerite
6. ✅ O percentual deve estar em 8,79% (não volta para 7,5%)

### Passo 3: Testar Pensão Alimentícia

1. Abra um holerite com pensão alimentícia
2. Mude o percentual (ex: de 30% para 35%)
3. Marque como "Recorrente"
4. Salve e reabra
5. ✅ Deve manter 35% e "Recorrente" marcado

## 🎯 Resultado

### Antes da Correção:
- ❌ Percentual sempre voltava para 7,5% (INSS) ou 30% (Pensão)
- ❌ Tipo de cálculo não era salvo
- ❌ Recorrência da pensão não era salva

### Depois da Correção:
- ✅ Percentual é salvo e mantido ao reabrir
- ✅ Tipo de cálculo (fixo/percentual) é persistido
- ✅ Recorrência da pensão é salva
- ✅ Cada holerite pode ter configurações diferentes
- ✅ Histórico de configurações é mantido

## 📊 Dados Salvos por Holerite

Cada holerite agora salva:

**INSS:**
- `inss` (valor calculado em R$)
- `inss_tipo` ('fixo' ou 'percentual')
- `inss_percentual` (ex: 8.79)

**Pensão Alimentícia:**
- `pensao_alimenticia` (valor calculado em R$)
- `pensao_tipo` ('fixo' ou 'percentual')
- `pensao_percentual` (ex: 35.0)
- `pensao_recorrente` (true/false)

## 🔍 Verificar Dados no Banco

```sql
SELECT 
  id,
  funcionario_id,
  -- INSS
  inss,
  inss_tipo,
  inss_percentual,
  -- Pensão
  pensao_alimenticia,
  pensao_tipo,
  pensao_percentual,
  pensao_recorrente
FROM holerites
WHERE id = 1226; -- Substitua pelo ID do holerite testado
```

## 📝 Observações Importantes

1. **Holerites Antigos:** Holerites criados antes desta correção terão valores padrão (7,5% INSS, 30% Pensão)
2. **Edição Manual:** Ao editar um holerite antigo, as configurações serão salvas a partir da primeira edição
3. **Independência:** Cada holerite tem suas próprias configurações (não afeta outros holerites)
4. **Recálculo:** Ao mudar dias trabalhados ou salário base, o sistema recalcula automaticamente se estiver em modo percentual

## 🎉 Benefícios

- ✅ Flexibilidade total por holerite
- ✅ Histórico de configurações mantido
- ✅ Não precisa recalcular manualmente
- ✅ Configurações persistem entre sessões
- ✅ Suporta casos especiais (ex: Leonardo com 8,79% de INSS)
