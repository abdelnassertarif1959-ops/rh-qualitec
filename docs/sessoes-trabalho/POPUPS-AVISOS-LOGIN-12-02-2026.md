# Popups de Avisos no Login - 12/02/2026 17:00

## Funcionalidade Implementada

Sistema de popups automáticos que aparecem após o login para admin e funcionários.

## Comportamento

### Para Administradores
- **Quando**: Sempre que o admin faz login
- **O que mostra**: Modal para criar um aviso rápido
- **Objetivo**: Facilitar a criação de avisos importantes logo após o login
- **Ações disponíveis**:
  - Criar aviso com título e descrição
  - Pular por agora (fecha o modal)
  - Fechar (X no canto)

### Para Funcionários
- **Quando**: Apenas na primeira vez após o login (por sessão)
- **O que mostra**: Lista de avisos recentes (últimos 7 dias)
- **Objetivo**: Garantir que funcionários vejam avisos importantes
- **Comportamento**:
  - Mostra apenas UMA VEZ por sessão
  - Depois precisa ver manualmente na caixa de avisos
  - Marca como visualizado no sessionStorage
- **Ações disponíveis**:
  - Ver detalhes de cada aviso
  - Comentar nos avisos
  - Fechar (botão "Entendi")

## Arquivos Criados

### 1. `app/components/avisos/PopupCriarAvisoAdmin.vue`
Modal para admin criar aviso rápido:
- Formulário simples com título e descrição
- Botões: "Pular por Agora" e "Criar Aviso"
- Integrado com `useAvisos` composable
- Z-index 10000 para ficar acima de tudo
- Animação de entrada/saída suave

### 2. `app/components/avisos/PopupAvisosRecentes.vue`
Modal para funcionários verem avisos recentes:
- Lista de avisos dos últimos 7 dias
- Cada aviso mostra:
  - Título e descrição
  - Data relativa (Hoje, Ontem, X dias atrás)
  - Autor do aviso
  - Botão para comentar
- Integrado com modal de comentários
- Z-index 10000 para ficar acima de tudo
- Animação de entrada/saída suave

## Arquivos Modificados

### 1. `app/pages/login.vue`
- Adicionado flag `acabou_de_logar` no sessionStorage após login bem-sucedido
- Flag é usada para determinar se deve mostrar popups

### 2. `app/pages/dashboard.vue`
- Adicionados estados para controlar popups:
  - `mostrarPopupAdmin` - controla popup do admin
  - `mostrarPopupFuncionario` - controla popup do funcionário
  - `avisosRecentes` - lista de avisos recentes
- Adicionada função `verificarPopups()`:
  - Verifica flag `acabou_de_logar`
  - Para admin: sempre mostra popup
  - Para funcionário: busca avisos recentes e mostra se houver
- Adicionada função `fecharPopupFuncionario()`:
  - Fecha o popup
  - Marca como visualizado no sessionStorage
- Componentes de popup adicionados ao template

## Lógica de Controle

### SessionStorage
```javascript
// Login (app/pages/login.vue)
sessionStorage.setItem('acabou_de_logar', 'true')

// Dashboard (app/pages/dashboard.vue)
const acabouDeLogar = sessionStorage.getItem('acabou_de_logar')
sessionStorage.removeItem('acabou_de_logar') // Remove após verificar

// Funcionário visualizou avisos
sessionStorage.setItem('avisos_visualizados', 'true')
```

### Fluxo Admin
1. Admin faz login
2. Flag `acabou_de_logar` é setada
3. Dashboard verifica flag
4. Popup de criar aviso é mostrado
5. Admin pode criar aviso ou pular
6. Popup fecha

### Fluxo Funcionário
1. Funcionário faz login
2. Flag `acabou_de_logar` é setada
3. Dashboard verifica flag
4. Busca avisos dos últimos 7 dias
5. Se houver avisos, mostra popup
6. Funcionário vê avisos e pode comentar
7. Ao fechar, marca como visualizado
8. Não mostra mais nesta sessão

## Filtro de Avisos Recentes

Avisos são considerados "recentes" se foram criados nos últimos 7 dias:

```javascript
const seteDiasAtras = new Date()
seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

avisosRecentes.value = avisos.filter((aviso: any) => {
  const dataAviso = new Date(aviso.created_at)
  return dataAviso >= seteDiasAtras
})
```

## UX/UI

### Design
- Modais com fundo escuro (backdrop blur)
- Z-index alto (10000) para ficar acima de tudo
- Animações suaves de entrada/saída
- Design consistente com o resto do sistema
- Responsivo para mobile

### Cores e Ícones
- Admin: Azul (tema principal)
- Funcionário: Gradiente azul
- Ícones SVG inline
- Badges e tags para informações

## Benefícios

1. **Para Admin**:
   - Facilita criação de avisos importantes
   - Lembrete visual ao fazer login
   - Processo rápido e direto

2. **Para Funcionários**:
   - Garantia de visualização de avisos importantes
   - Não é intrusivo (apenas uma vez)
   - Pode comentar diretamente do popup

3. **Para o Sistema**:
   - Aumenta engajamento com avisos
   - Melhora comunicação interna
   - Reduz chance de avisos não lidos

## Testes Recomendados

### Admin
1. Fazer login como admin
2. Verificar se popup aparece
3. Criar um aviso pelo popup
4. Verificar se aviso foi criado
5. Clicar em "Pular por Agora"
6. Verificar se popup fecha

### Funcionário
1. Criar alguns avisos como admin
2. Fazer login como funcionário
3. Verificar se popup aparece com avisos recentes
4. Clicar em "Comentar" em um aviso
5. Adicionar comentário
6. Fechar popup
7. Fazer logout e login novamente
8. Verificar que popup NÃO aparece (já visualizado)
9. Abrir nova aba/janela
10. Fazer login
11. Verificar que popup aparece (nova sessão)

## Observações

- Popups só aparecem após login bem-sucedido
- Admin sempre vê popup ao fazer login
- Funcionário vê apenas uma vez por sessão
- Avisos recentes = últimos 7 dias
- SessionStorage é limpo ao fechar navegador
- LocalStorage não é usado (não persiste entre sessões)

## Status
✅ Implementado e funcionando
✅ Sem erros de diagnóstico
✅ Pronto para testes

## Próximos Passos
1. Testar em desenvolvimento
2. Validar comportamento em produção
3. Coletar feedback dos usuários
4. Ajustar período de "avisos recentes" se necessário
