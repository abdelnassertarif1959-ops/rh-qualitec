# Correções Aplicadas - Holerites Email e Filtros

## Data: 03/02/2026

## Problemas Corrigidos:

### 1. Mês de Referência Incorreto no Email
**Arquivo:** `server/api/holerites/[id]/enviar-email.post.ts`
**Problema:** Email mostrava janeiro como mês de referência quando deveria mostrar fevereiro (mês trabalhado)
**Causa:** Código usava `periodoInicio` para calcular `mesAno`
**Solução:** 
- Modificada lógica para usar `periodo_fim` como `dataReferencia`
- Para holerites mensais: usa `periodo_fim` (mostra o mês trabalhado)
- Para quinzenas: também usa `periodo_fim` (consistência)

### 2. Holerites Desaparecendo Após Envio
**Arquivo:** `app/pages/admin/holerites.vue`
**Problema:** Após enviar email, holerites desapareciam da lista filtrada
**Causa:** Função `enviarHolerite` recarregava toda a lista após envio, mas se filtros estavam ativos (ex: status="gerado"), o holerite enviado (status="enviado") não aparecia mais
**Solução:**
- Removido `await carregarHolerites()` das funções de envio
- Implementada atualização local do status usando `findIndex`
- Aplicado tanto para envio individual quanto em lote

## Funções Modificadas:
1. `enviarHolerite()` - envio individual
2. `enviarHoleritesPorTipo()` - envio em lote

## Benefícios:
- Emails agora mostram o mês correto (fevereiro para holerites mensais)
- Holerites permanecem visíveis após envio, mesmo com filtros ativos
- Melhor experiência do usuário na administração
- Performance melhorada (sem recarregamento desnecessário)