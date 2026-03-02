# Correção: Modal de Avisos Sumiu do Dashboard
**Data:** 12/02/2026

## Problema
A caixa de avisos sumiu do dashboard dos funcionários após adicionar logs de debug.

## Causa
O componente `CaixaAvisos.vue` estava usando o nome incorreto do modal:
- ❌ Estava: `<AvisosModal />`
- ✅ Correto: `<AvisosAvisosModal />`

## Correção Aplicada

### Arquivo: `app/components/avisos/CaixaAvisos.vue`

```vue
<!-- ANTES -->
<AvisosModal 
  v-if="modalAberto"
  :avisos="avisos"
  :aviso-selecionado="avisoSelecionado"
  @fechar="modalAberto = false"
  @aviso-selecionado="avisoSelecionado = $event"
/>

<!-- DEPOIS -->
<AvisosAvisosModal 
  v-if="modalAberto"
  :avisos="avisos"
  :aviso-selecionado="avisoSelecionado"
  @fechar="modalAberto = false"
  @aviso-selecionado="avisoSelecionado = $event"
/>
```

## Explicação

No Nuxt 3, quando você tem componentes dentro de pastas, o nome do componente é formado pela concatenação do nome da pasta + nome do arquivo.

Estrutura:
```
app/components/
  └── avisos/
      ├── CaixaAvisos.vue      → AvisosCaixaAvisos
      ├── AvisosModal.vue      → AvisosAvisosModal
      ├── AvisoDetalhes.vue    → AvisosAvisoDetalhes
      └── AvisoCard.vue        → AvisosAvisoCard
```

## Verificação

Após a correção, o componente deve aparecer normalmente no dashboard dos funcionários.

### Como testar:
1. Fazer login como funcionário
2. Ir para o dashboard
3. Verificar se a caixa "Avisos e Comunicados" aparece
4. Clicar em um aviso
5. Verificar se o modal abre com os detalhes

## Status
✅ Corrigido

## Arquivos Modificados
- `app/components/avisos/CaixaAvisos.vue`
