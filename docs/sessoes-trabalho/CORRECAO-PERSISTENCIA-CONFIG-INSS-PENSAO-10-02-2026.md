# Correção: Persistência de Configurações de INSS e Pensão

**Data:** 10/02/2026  
**Status:** ✅ Corrigido

## 🐛 Problema

Ao editar o percentual do INSS ou Pensão Alimentícia no modal de edição de holerite, os valores eram salvos corretamente, mas ao reabrir o modal, o percentual voltava para o valor padrão (7,5% para INSS, 30% para Pensão).

### Exemplo do Problema

1. Usuário abre modal de edição
2. Muda INSS de 7,5% para 8,79%
3. Salva
4. Reabre o modal
5. ❌ INSS volta para 7,5%

### Causa Raiz

O sistema estava salvando apenas o **valor calculado** do INSS/Pensão, mas não estava salvando:
- O **tipo de cálculo** (fixo ou percentual)
- O **percentual usado** no cálculo
- Se a pensão é **recorrente** ou não

Ao reabrir o modal, o componente sempre inicializava com os valores padrão.

## ✅ Solução Implementada

### 1. Novas Colunas no Banco de Dados

Criado script SQL `database/40-adicionar-config-inss-pensao.sql` que adiciona 5 novas colunas à tabela `holerites`:

```sql
-- Configurações do INSS
inss_tipo VARCHAR(20) DEFAULT 'percentual'  -- 'fixo' ou 'percentual'
inss_percentual DECIMAL(5,2) DEFAULT 7.5   -- percentual usado

-- Configurações da Pensão
pensao_tipo VARCHAR(20) DEFAULT 'percentual'  -- 'fixo' ou 'percentual'
pensao_percentual DECIMAL(5,2) DEFAULT 30    -- percentual usado
pensao_recorrente BOOLEAN DEFAULT false      -- se é recorrente
```

### 2. Componente Atualizado

**Arquivo:** `app/components/holerites/HoleriteEditForm.vue`

#### Carregamento das Configurações

```typescript
// Carregar configurações do banco ao inicializar
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

#### Salvamento das Configurações

```typescript
const dadosSanitizados = {
  // ... outros campos ...
  
  // Salvar configurações de INSS
  inss_tipo: inssConfig.value.tipo,
  inss_percentual: sanitizarValorNumerico(inssConfig.value.percentual),
  
  // Salvar configurações de Pensão
  pensao_tipo: pensaoConfig.value.tipo,
  pensao_percentual: sanitizarValorNumerico(pensaoConfig.value.percentual),
  pensao_recorrente: pensaoConfig.value.recorrente
}
```

#### Watch para Recarregar Configurações

```typescript
watch(() => props.holerite, (novoHolerite) => {
  // Atualizar configurações quando holerite mudar
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

### 3. API Atualizada

**Arquivo:** `server/api/holerites/[id].patch.ts`

A API já estava preparada para receber os novos campos:

```typescript
// Configurações de INSS
if (body.inss_tipo !== undefined) dadosParaAtualizar.inss_tipo = body.inss_tipo
if (body.inss_percentual !== undefined) dadosParaAtualizar.inss_percentual = parseNumericValue(body.inss_percentual)

// Configurações de Pensão Alimentícia
if (body.pensao_tipo !== undefined) dadosParaAtualizar.pensao_tipo = body.pensao_tipo
if (body.pensao_percentual !== undefined) dadosParaAtualizar.pensao_percentual = parseNumericValue(body.pensao_percentual)
if (body.pensao_recorrente !== undefined) dadosParaAtualizar.pensao_recorrente = body.pensao_recorrente
```

## 📋 Passos para Aplicar

### 1. Executar Script SQL

No Supabase SQL Editor, execute:

```sql
-- Arquivo: database/40-adicionar-config-inss-pensao.sql
```

Este script adiciona as 5 novas colunas à tabela `holerites`.

### 2. Testar o Sistema

1. Abra o modal de edição de qualquer holerite
2. Mude o percentual do INSS (ex: de 7,5% para 8,79%)
3. Salve
4. Feche o modal
5. Reabra o modal
6. ✅ O percentual deve estar em 8,79%

## 🎯 Resultado

### Antes
- ❌ Percentual voltava para padrão ao reabrir
- ❌ Tipo de cálculo não era salvo
- ❌ Configuração de recorrência perdida

### Depois
- ✅ Percentual persiste entre aberturas
- ✅ Tipo de cálculo (fixo/percentual) salvo
- ✅ Configuração de recorrência mantida
- ✅ Cada holerite tem suas próprias configurações

## 📊 Campos Salvos

### INSS
- `inss` (valor calculado) - já existia
- `inss_tipo` (fixo/percentual) - **NOVO**
- `inss_percentual` (ex: 7.5, 8.79) - **NOVO**

### Pensão Alimentícia
- `pensao_alimenticia` (valor calculado) - já existia
- `pensao_tipo` (fixo/percentual) - **NOVO**
- `pensao_percentual` (ex: 30, 33.33) - **NOVO**
- `pensao_recorrente` (true/false) - **NOVO**

## 🔄 Fluxo Completo

1. **Abrir Modal:**
   - Componente carrega configurações do banco
   - Exibe percentual correto nos campos

2. **Editar:**
   - Usuário altera percentual
   - Cálculo automático atualiza valor

3. **Salvar:**
   - Salva valor calculado
   - Salva tipo de cálculo
   - Salva percentual usado
   - Salva se é recorrente

4. **Reabrir:**
   - Carrega configurações salvas
   - Exibe percentual correto
   - ✅ Persistência garantida

## 📝 Observações

- Cada holerite tem suas próprias configurações independentes
- Valores padrão: INSS 7,5%, Pensão 30%
- Configurações são opcionais (podem ser NULL)
- Compatível com holerites antigos (usa valores padrão se NULL)

## 🧪 Casos de Teste

1. ✅ Alterar INSS de 7,5% para 8,79% - persiste
2. ✅ Alterar Pensão de 30% para 33,33% - persiste
3. ✅ Mudar de percentual para fixo - persiste
4. ✅ Marcar pensão como recorrente - persiste
5. ✅ Holerites antigos (sem config) - usa padrão
6. ✅ Múltiplos holerites - configs independentes

---

**Arquivos Modificados:**
- `database/40-adicionar-config-inss-pensao.sql` (NOVO)
- `app/components/holerites/HoleriteEditForm.vue`
- `server/api/holerites/[id].patch.ts` (já estava preparado)
