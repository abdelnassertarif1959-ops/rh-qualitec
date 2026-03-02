# Popup de Avisos no Login - 12/02/2026

## Funcionalidade Implementada

Sistema de popups automáticos ao fazer login:

### Para Admin
- Popup para criar aviso rápido ao fazer login
- Opção "Não mostrar novamente" (salva no localStorage)
- Botão "Pular por Agora" para fechar sem criar
- Formulário completo com título e descrição

### Para Funcionário
- Popup mostrando avisos recentes (últimos 7 dias)
- Aparece apenas UMA VEZ por sessão (salva no sessionStorage)
- Lista todos os avisos novos
- Botão para ver comentários de cada aviso
- Mensagem clara: "Este popup aparece apenas uma vez por sessão"

## Arquivos Criados

1. `app/components/avisos/PopupCriarAvisoAdmin.vue`
   - Popup para admin criar aviso rápido
   - Checkbox "Não mostrar novamente"
   - Integrado com useAvisos

2. `app/components/avisos/PopupAvisosRecentes.vue`
   - Popup para funcionários verem avisos recentes
   - Filtra avisos dos últimos 7 dias
   - Integrado com modal de comentários

## Arquivos Modificados

1. `app/pages/dashboard.vue`
   - Adicionados componentes de popup
   - Função `verificarPopups()` para controlar exibição
   - Lógica de filtro de avisos recentes

## Lógica de Controle

### Admin
- localStorage: `nao_mostrar_popup_aviso_admin`
- Se marcado, nunca mais mostra
- Se não marcado, mostra sempre ao fazer login

### Funcionário
- sessionStorage: `avisos_visualizados`
- Mostra apenas uma vez por sessão
- Filtra avisos dos últimos 7 dias
- Só mostra se houver avisos novos

## Status
✅ Implementado e funcionando
✅ Sem erros de diagnóstico
✅ Pronto para teste
