# Correções Aplicadas - Holerites Email e Filtros

## Data: 03/02/2026

## Problemas Corrigidos

### 1. Holerites desaparecem do filtro após envio de email
**Problema**: Após enviar um holerite por email, ele desaparecia da lista de filtros porque a função `enviarHolerite` recarregava a lista e o status 'enviado' não estava incluído nos filtros.

**Solução Implementada**:
- **Frontend** (`app/pages/admin/holerites.vue`):
  - Modificada função `carregarHolerites` para incluir parâmetro `incluir_todos_status`
  - Quando não há filtro de status específico, todos os status são incluídos
  
- **Backend** (`server/api/holerites/index.get.ts`):
  - Adicionado suporte ao parâmetro `incluir_todos_status`
  - Modificada lógica de filtro: se `incluir_todos_status` for true, não aplica filtro de status
  - Logs atualizados para incluir o novo parâmetro

### 2. Email mostra mês de referência incorreto
**Problema**: Email mostrava Janeiro quando deveria mostrar Fevereiro, pois usava `periodoInicio` em vez da lógica correta baseada na data atual.

**Solução Implementada**:
- **Backend** (`server/api/holerites/[id]/enviar-email.post.ts`):
  - Melhorada função `calcularMesReferenciaCorreto` para usar a mesma lógica do `dateUtils.ts`
  - Para adiantamentos: usa data atual para determinar se é do mês atual ou anterior
  - Para folha mensal: sempre usa o mês vigente (atual)
  - Considera corretamente a lógica de 5º dia útil do sistema

## Arquivos Modificados
1. `app/pages/admin/holerites.vue` - Função `carregarHolerites`
2. `server/api/holerites/index.get.ts` - Lógica de filtros
3. `server/api/holerites/[id]/enviar-email.post.ts` - Cálculo do mês de referência

## Comportamento Esperado Após Correções
1. **Filtros**: Holerites enviados permanecem visíveis na lista quando não há filtro de status específico
2. **Email**: Mês de referência correto baseado na data atual e tipo de holerite (adiantamento/mensal)

## Validação Necessária
- Testar envio de email com holerite de Fevereiro
- Verificar se holerite permanece na lista após envio
- Confirmar mês correto no email recebido

## Compatibilidade
- Mantém compatibilidade com filtros existentes
- Não afeta outros fluxos do sistema
- Usa lógica consistente com `dateUtils.ts`