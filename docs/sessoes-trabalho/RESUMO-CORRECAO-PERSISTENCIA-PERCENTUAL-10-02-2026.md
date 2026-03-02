# Resumo: Persistência de Percentual INSS e Pensão

**Data:** 10/02/2026  
**Status:** ✅ Pronto para Aplicar

## 🎯 Problema

Ao mudar o percentual do INSS (ex: 8,79%) ou Pensão (ex: 35%) no modal de edição, após salvar e reabrir, o valor voltava para o padrão (7,5% e 30%).

## ⚡ Solução

Adicionadas 5 colunas no banco para salvar as configurações:
- `inss_tipo`, `inss_percentual`
- `pensao_tipo`, `pensao_percentual`, `pensao_recorrente`

## 📝 Mudanças

### 1. Banco de Dados
```sql
-- Arquivo: database/40-adicionar-config-inss-pensao-holerites.sql
ALTER TABLE holerites ADD COLUMN inss_tipo VARCHAR(20) DEFAULT 'percentual';
ALTER TABLE holerites ADD COLUMN inss_percentual DECIMAL(5,2) DEFAULT 7.5;
ALTER TABLE holerites ADD COLUMN pensao_tipo VARCHAR(20) DEFAULT 'percentual';
ALTER TABLE holerites ADD COLUMN pensao_percentual DECIMAL(5,2) DEFAULT 30.0;
ALTER TABLE holerites ADD COLUMN pensao_recorrente BOOLEAN DEFAULT false;
```

### 2. API
```typescript
// server/api/holerites/[id].patch.ts
// Salvar configurações
if (body.inss_tipo !== undefined) dadosParaAtualizar.inss_tipo = body.inss_tipo
if (body.inss_percentual !== undefined) dadosParaAtualizar.inss_percentual = parseNumericValue(body.inss_percentual)
if (body.pensao_tipo !== undefined) dadosParaAtualizar.pensao_tipo = body.pensao_tipo
if (body.pensao_percentual !== undefined) dadosParaAtualizar.pensao_percentual = parseNumericValue(body.pensao_percentual)
if (body.pensao_recorrente !== undefined) dadosParaAtualizar.pensao_recorrente = body.pensao_recorrente
```

### 3. Frontend
```typescript
// app/components/holerites/HoleriteEditForm.vue
// Carregar do banco
const inssConfig = ref({
  tipo: props.holerite.inss_tipo || 'percentual',
  percentual: props.holerite.inss_percentual || 7.5
})

// Salvar no banco
const dadosSanitizados = {
  // ...
  inss_tipo: inssConfig.value.tipo,
  inss_percentual: sanitizarValorNumerico(inssConfig.value.percentual),
  pensao_tipo: pensaoConfig.value.tipo,
  pensao_percentual: sanitizarValorNumerico(pensaoConfig.value.percentual),
  pensao_recorrente: pensaoConfig.value.recorrente
}
```

## 🚀 Como Aplicar

### 1. Executar SQL
```bash
# No Supabase SQL Editor
database/40-adicionar-config-inss-pensao-holerites.sql
```

### 2. Verificar
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name LIKE '%inss%' OR column_name LIKE '%pensao%';
```

### 3. Testar
1. Editar holerite
2. Mudar percentual INSS para 8,79%
3. Salvar e reabrir
4. ✅ Deve manter 8,79%

## ✅ Resultado

### Antes:
- ❌ Percentual sempre voltava para 7,5% / 30%
- ❌ Configurações não eram salvas

### Depois:
- ✅ Percentual é mantido ao reabrir
- ✅ Tipo (fixo/percentual) é salvo
- ✅ Recorrência da pensão é salva
- ✅ Cada holerite tem suas configurações

## 📁 Arquivos

- `database/40-adicionar-config-inss-pensao-holerites.sql` (NOVO)
- `database/EXECUTAR-CONFIG-INSS-PENSAO.md` (NOVO)
- `server/api/holerites/[id].patch.ts` (MODIFICADO)
- `app/components/holerites/HoleriteEditForm.vue` (JÁ ESTAVA CORRETO)
- `CORRECAO-PERSISTENCIA-PERCENTUAL-INSS-PENSAO-10-02-2026.md` (DOCUMENTAÇÃO)

## 🎉 Benefícios

- ✅ Flexibilidade total por holerite
- ✅ Histórico de configurações
- ✅ Suporta casos especiais (ex: Leonardo 8,79%)
- ✅ Não precisa recalcular manualmente

---

**Próximo passo:** Executar o SQL no Supabase
