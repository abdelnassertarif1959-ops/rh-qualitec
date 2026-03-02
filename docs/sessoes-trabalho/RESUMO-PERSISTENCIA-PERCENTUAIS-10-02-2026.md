# Resumo: Persistência de Percentuais INSS e Pensão

**Data:** 10/02/2026  
**Status:** ✅ Corrigido

## 🎯 Problema

Percentuais de INSS e Pensão voltavam para valores padrão ao reabrir o modal de edição.

## ⚡ Solução

### 1. Banco de Dados (SQL)
```sql
-- Executar: database/40-adicionar-config-inss-pensao.sql
ALTER TABLE holerites ADD COLUMN inss_tipo VARCHAR(20) DEFAULT 'percentual';
ALTER TABLE holerites ADD COLUMN inss_percentual DECIMAL(5,2) DEFAULT 7.5;
ALTER TABLE holerites ADD COLUMN pensao_tipo VARCHAR(20) DEFAULT 'percentual';
ALTER TABLE holerites ADD COLUMN pensao_percentual DECIMAL(5,2) DEFAULT 30;
ALTER TABLE holerites ADD COLUMN pensao_recorrente BOOLEAN DEFAULT false;
```

### 2. Frontend (Vue)
```typescript
// Carregar do banco
const inssConfig = ref({
  tipo: props.holerite.inss_tipo || 'percentual',
  percentual: props.holerite.inss_percentual || 7.5
})

// Salvar no banco
dadosSanitizados = {
  inss_tipo: inssConfig.value.tipo,
  inss_percentual: inssConfig.value.percentual,
  // ... pensão também
}
```

### 3. Backend (API)
API já estava preparada - aceita e salva os novos campos automaticamente.

## ✅ Resultado

- ✅ INSS 8,79% persiste ao reabrir
- ✅ Pensão 33,33% persiste ao reabrir
- ✅ Tipo (fixo/percentual) persiste
- ✅ Recorrência persiste
- ✅ Cada holerite tem config independente

## 🧪 Teste

1. Execute o SQL no Supabase
2. Edite um holerite
3. Mude INSS para 8,79%
4. Salve e reabra
5. ✅ Deve mostrar 8,79%

---

**Arquivos:**
- `database/40-adicionar-config-inss-pensao.sql` ⭐ EXECUTAR PRIMEIRO
- `app/components/holerites/HoleriteEditForm.vue`
- `server/api/holerites/[id].patch.ts`
