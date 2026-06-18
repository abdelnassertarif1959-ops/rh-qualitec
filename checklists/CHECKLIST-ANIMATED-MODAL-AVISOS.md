# Checklist - Validação AnimatedModal em Avisos

**Data**: 18/02/2026  
**Objetivo**: Validar aplicação do AnimatedModal nos 3 popups de avisos

## ✅ Checklist de Validação

### 1. Modal Criar Aviso (admin/avisos.vue)

- [ ] Modal abre ao clicar em "Novo Aviso"
- [ ] Animação 3D suave na abertura (rotateX + scale)
- [ ] Blur no backdrop visível
- [ ] Botão X fecha o modal
- [ ] ESC fecha o modal
- [ ] Clicar fora fecha o modal
- [ ] Emoji picker abre ao clicar no 😊
- [ ] Todas as categorias de emoji funcionam
- [ ] Emoji é inserido na posição do cursor
- [ ] Contador de caracteres funciona (200 max)
- [ ] Validação de campos obrigatórios funciona
- [ ] Botão "Criar Aviso" cria o aviso
- [ ] Modal fecha após criar aviso
- [ ] Formulário é limpo após criar
- [ ] Scroll é bloqueado quando modal aberto

### 2. Popup Criar Aviso Rápido (PopupCriarAvisoAdmin.vue)

- [ ] Popup abre na primeira vez que admin acessa
- [ ] Animação 3D suave na abertura
- [ ] Blur no backdrop visível
- [ ] Botão X fecha o popup
- [ ] ESC fecha o popup
- [ ] Clicar fora NÃO fecha (close-on-outside=false)
- [ ] Checkbox "não mostrar novamente" funciona
- [ ] Botão "Pular por Agora" fecha o popup
- [ ] Preferência é salva no localStorage
- [ ] Botão "Criar Aviso" cria o aviso
- [ ] Popup fecha após criar aviso
- [ ] Validação de campos funciona

### 3. Popup Avisos Recentes (PopupAvisosRecentes.vue)

- [ ] Popup abre quando há avisos novos
- [ ] Animação 3D suave na abertura
- [ ] Blur no backdrop visível
- [ ] Botão X fecha o popup
- [ ] ESC fecha o popup
- [ ] Clicar fora fecha o popup
- [ ] Lista de avisos é exibida corretamente
- [ ] Data formatada aparece corretamente
- [ ] Botão "Ver comentários" abre modal de comentários
- [ ] Botão "Entendi" fecha o popup
- [ ] Marcação no sessionStorage funciona
- [ ] Popup não aparece novamente na mesma sessão

## 🎨 Validação Visual

### Animações
- [ ] Entrada: opacity 0→1, scale 0.5→1, rotateX 80→0
- [ ] Saída: opacity 1→0, scale 1→0.8, rotateX 0→10
- [ ] Backdrop blur: 0px→10px na entrada
- [ ] Transições suaves (spring animation)
- [ ] Sem "pulos" ou glitches visuais

### Layout
- [ ] Modal centralizado na tela
- [ ] Largura máxima respeitada (2xl ou 3xl)
- [ ] Altura máxima respeitada (85vh)
- [ ] Scroll interno funciona quando conteúdo é grande
- [ ] Responsivo em mobile
- [ ] Footer fixo na parte inferior

### Acessibilidade
- [ ] role="dialog" presente
- [ ] aria-modal="true" presente
- [ ] Foco vai para o modal ao abrir
- [ ] Foco retorna ao elemento anterior ao fechar
- [ ] Tab navega pelos elementos do modal
- [ ] ESC fecha o modal

## 🐛 Testes de Edge Cases

- [ ] Abrir e fechar modal rapidamente (múltiplas vezes)
- [ ] Abrir modal, inserir texto, fechar sem salvar
- [ ] Criar aviso com título muito longo (200 chars)
- [ ] Criar aviso com descrição muito longa
- [ ] Tentar criar aviso com campos vazios
- [ ] Abrir emoji picker e fechar sem selecionar
- [ ] Inserir múltiplos emojis seguidos
- [ ] Testar em diferentes resoluções
- [ ] Testar em mobile
- [ ] Testar com scroll da página

## 📱 Testes Mobile

- [ ] Modal ocupa largura correta (calc(100vw-32px))
- [ ] Altura máxima respeitada (85vh)
- [ ] Scroll interno funciona
- [ ] Botões são clicáveis (tamanho adequado)
- [ ] Emoji picker funciona em touch
- [ ] Teclado virtual não quebra layout
- [ ] Animações suaves em mobile

## 🎯 Resultado Esperado

Todos os 3 modais devem:
- Abrir com animação 3D suave
- Ter blur no backdrop
- Fechar com ESC, X ou clique fora (exceto PopupCriarAvisoAdmin)
- Manter 100% da funcionalidade original
- Ser acessíveis
- Ser responsivos
- Ter performance fluida

## 📝 Comandos para Testar

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar como admin
# URL: http://localhost:3000/admin/avisos

# Acessar como funcionário
# URL: http://localhost:3000/dashboard
```

## ✅ Status

- [ ] Todos os testes passaram
- [ ] Documentação criada
- [ ] Pronto para produção

---

**Observações**: Anotar qualquer comportamento inesperado ou sugestão de melhoria.
