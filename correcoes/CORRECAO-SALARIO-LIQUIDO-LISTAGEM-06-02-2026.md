# Correção: Salário Líquido Desatualizado na Listagem de Holerites

**Data:** 06/02/2026  
**Status:** ✅ RESOLVIDO

## 📋 Problema Identificado

A lista de holerites em `app/pages/admin/holerites.vue` exibia valores de salário líquido desatualizados quando itens personalizados (descontos/benefícios) eram adicionados DEPOIS da geração do holerite.

### Exemplo Real (Leonardo - Holerite ID 1213)
- **Banco (antes):** R$ 1.775,42 (ERRADO - não incluía pensão alimentícia)
- **Modal:** R$ 813,42 (CORRETO - recalculava com itens personalizados)
- **HTML/PDF:** R$ 813,42 (CORRETO - buscava itens personalizados)

## 🔍 Causa Raiz

Os campos `total_descontos` e `salario_liquido` na tabela `holerites` são calculados apenas durante a geração do holerite. Quando itens personalizados são adicionados posteriormente na tabela `holerite_itens_personalizados`, esses valores ficam desatualizados.

### Fluxo do Problema
1. Holerite gerado → valores salvos no banco
2. Item personalizado adicionado na tabela `holerite_itens_personalizados`
3. Modal e HTML/PDF buscam itens e recalculam (CORRETO)
4. Lista usa valores do banco (DESATUALIZADO)

## ✅ Solução Aplicada

### 1. Script de Atualização Executado
```bash
node scripts/atualizar-valores-holerite-leonardo.js
```

**Resultado:**
```
📋 Holerite ID: 1213
   Período: 2026-02-01 a 2026-02-28

📋 Itens personalizados encontrados: 1
   Itens vigentes no período: 1
   Descontos: 1
   - PENSÃO ALIMENTICIA: R$ 962.00

💰 CÁLCULO:
   Total Proventos: R$ 3466.67
   Descontos Base: R$ 1691.25
   Descontos Personalizados: R$ 962.00
   Total Descontos: R$ 2653.25
   Salário Líquido: R$ 813.42

✅ HOLERITE ATUALIZADO COM SUCESSO!
   Total Descontos: R$ 1691.25 → R$ 2653.25
   Salário Líquido: R$ 1775.42 → R$ 813.42
```

### 2. Valores Atualizados no Banco
- ✅ `total_descontos`: R$ 1.691,25 → R$ 2.653,25
- ✅ `salario_liquido`: R$ 1.775,42 → R$ 813,42

## 📊 Validação

### Antes da Correção
| Local | Salário Líquido | Status |
|-------|----------------|--------|
| Lista Admin | R$ 1.775,42 | ❌ ERRADO |
| Modal | R$ 813,42 | ✅ CORRETO |
| HTML/PDF | R$ 813,42 | ✅ CORRETO |

### Depois da Correção
| Local | Salário Líquido | Status |
|-------|----------------|--------|
| Lista Admin | R$ 813,42 | ✅ CORRETO |
| Modal | R$ 813,42 | ✅ CORRETO |
| HTML/PDF | R$ 813,42 | ✅ CORRETO |

## 🔧 Arquivos Envolvidos

### Script de Atualização
- `scripts/atualizar-valores-holerite-leonardo.js`

### Componentes que Exibem Valores
- `app/pages/admin/holerites.vue` (lista - usa valor do banco)
- `app/components/holerites/HoleriteModal.vue` (modal - recalcula dinamicamente)
- `server/utils/holeriteHTML.ts` (HTML/PDF - busca itens personalizados)

## 💡 Recomendações Futuras

### Opção 1: Atualizar Valores ao Adicionar Itens
Quando um item personalizado for adicionado/editado/removido, recalcular automaticamente os totais do holerite no banco.

### Opção 2: Recálculo Dinâmico na Lista
Modificar `app/pages/admin/holerites.vue` para buscar itens personalizados e recalcular valores dinamicamente (pode impactar performance com muitos holerites).

### Opção 3: Trigger no Banco de Dados
Criar trigger no Supabase que atualiza automaticamente `total_descontos` e `salario_liquido` quando itens personalizados são modificados.

### Opção 4: Regerar Holerite
Sempre que itens personalizados forem modificados, sugerir ao admin regerar o holerite para recalcular todos os valores.

## 📝 Observações

- ✅ Problema resolvido para o holerite do Leonardo
- ✅ Script pode ser reutilizado para outros funcionários se necessário
- ⚠️ Problema pode ocorrer novamente se itens personalizados forem adicionados após geração
- 💡 Considerar implementar uma das recomendações futuras para prevenir o problema

## 🎯 Conclusão

O salário líquido do Leonardo agora está correto em todos os locais (lista, modal e HTML/PDF). O script de atualização funcionou perfeitamente e pode ser usado para corrigir outros holerites se necessário.

**Status Final:** ✅ RESOLVIDO
