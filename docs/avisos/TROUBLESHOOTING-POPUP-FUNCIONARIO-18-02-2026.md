# Troubleshooting: Popup de Avisos Recentes para Funcionário - 18/02/2026

## Problema Relatado

O popup de avisos recentes não aparece para funcionários quando fazem login, mas aparece para admin.

## Como o Sistema Funciona

### Fluxo Completo

1. **Login** (`app/pages/login.vue`)
   - Usuário faz login com sucesso
   - Sistema define flag: `sessionStorage.setItem('acabou_de_logar', 'true')`
   - Redireciona para `/dashboard`

2. **Dashboard** (`app/pages/dashboard.vue`)
   - Função `verificarPopups()` é chamada no `onMounted()`
   - Verifica se existe flag `acabou_de_logar`
   - Se SIM, continua; se NÃO, não mostra popup

3. **Para Funcionários** (não admin)
   - Verifica se já visualizou avisos: `sessionStorage.getItem('avisos_visualizados')`
   - Se JÁ VISUALIZOU, não mostra popup
   - Se NÃO VISUALIZOU:
     - Busca avisos dos últimos 7 dias
     - Se houver avisos, mostra popup
     - Se não houver avisos, não mostra nada

4. **Para Admin**
   - Sempre mostra popup de "Criar Aviso" ao fazer login

## Possíveis Causas do Problema

### 1. Flag `avisos_visualizados` já existe no sessionStorage

**Como verificar:**
1. Abrir DevTools (F12)
2. Ir em Application > Session Storage
3. Procurar chave `avisos_visualizados`

**Solução:**
```javascript
// No console do navegador
sessionStorage.removeItem('avisos_visualizados')
// Depois fazer logout e login novamente
```

### 2. Não há avisos recentes (últimos 7 dias)

**Como verificar:**
1. Verificar se há avisos criados nos últimos 7 dias
2. Ir em `/admin/avisos` e criar um aviso novo

**Solução:**
- Criar pelo menos 1 aviso como admin
- Fazer logout do funcionário
- Fazer login novamente

### 3. Flag `acabou_de_logar` não está sendo definida

**Como verificar:**
1. Abrir DevTools antes de fazer login
2. Ir em Application > Session Storage
3. Fazer login
4. Verificar se aparece `acabou_de_logar: true`

**Solução:**
- Se não aparecer, verificar se o código em `app/pages/login.vue` está correto
- Linha deve ser: `sessionStorage.setItem('acabou_de_logar', 'true')`

### 4. Componente não está sendo renderizado

**Como verificar:**
1. Abrir DevTools > Elements
2. Procurar por `<AvisosPopupAvisosRecentes`
3. Verificar se o componente está no DOM

**Solução:**
- Verificar se `v-if="!isAdmin"` está correto
- Verificar se `mostrarPopupFuncionario` está sendo setado para `true`

## Como Testar Corretamente

### Teste Completo - Passo a Passo

1. **Limpar sessionStorage**
   ```javascript
   sessionStorage.clear()
   ```

2. **Criar um aviso como admin**
   - Login como admin
   - Ir em `/admin/avisos`
   - Criar um novo aviso
   - Fazer logout

3. **Testar como funcionário**
   - Fazer login como funcionário
   - Aguardar 1 segundo
   - Popup deve aparecer automaticamente

4. **Verificar no console**
   ```javascript
   // Deve aparecer logs como:
   // "Verificando popups..."
   // "Avisos recentes encontrados: X"
   ```

## Código de Debug

Adicione este código temporariamente em `app/pages/dashboard.vue` na função `verificarPopups()`:

```javascript
const verificarPopups = async () => {
  console.log('🔍 [DEBUG] Verificando popups...')
  
  const acabouDeLogar = sessionStorage.getItem('acabou_de_logar')
  console.log('🔍 [DEBUG] acabou_de_logar:', acabouDeLogar)
  
  if (!acabouDeLogar) {
    console.log('🔍 [DEBUG] Não acabou de logar, saindo...')
    return
  }
  
  sessionStorage.removeItem('acabou_de_logar')
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('🔍 [DEBUG] isAdmin:', isAdmin.value)
  
  if (isAdmin.value) {
    console.log('🔍 [DEBUG] Mostrando popup admin')
    mostrarPopupAdmin.value = true
  } else {
    const jaVisualizou = sessionStorage.getItem('avisos_visualizados')
    console.log('🔍 [DEBUG] jaVisualizou:', jaVisualizou)
    
    if (!jaVisualizou) {
      try {
        const avisos = await buscarAvisos()
        console.log('🔍 [DEBUG] Total de avisos:', avisos.length)
        
        const seteDiasAtras = new Date()
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)
        
        avisosRecentes.value = avisos.filter((aviso: any) => {
          const dataAviso = new Date(aviso.created_at)
          return dataAviso >= seteDiasAtras
        })
        
        console.log('🔍 [DEBUG] Avisos recentes:', avisosRecentes.value.length)
        
        if (avisosRecentes.value.length > 0) {
          console.log('🔍 [DEBUG] Mostrando popup funcionário')
          mostrarPopupFuncionario.value = true
        } else {
          console.log('🔍 [DEBUG] Nenhum aviso recente')
        }
      } catch (error) {
        console.error('🔍 [DEBUG] Erro ao buscar avisos:', error)
      }
    } else {
      console.log('🔍 [DEBUG] Já visualizou avisos nesta sessão')
    }
  }
}
```

## Checklist de Verificação

- [ ] Flag `acabou_de_logar` é definida no login
- [ ] Flag `acabou_de_logar` é removida após verificação
- [ ] Existe pelo menos 1 aviso criado nos últimos 7 dias
- [ ] SessionStorage não tem `avisos_visualizados` antes do teste
- [ ] Componente `PopupAvisosRecentes` está no DOM
- [ ] Prop `mostrar` está sendo passada corretamente
- [ ] Prop `avisos-recentes` tem dados
- [ ] Console não mostra erros

## Solução Rápida

Se nada funcionar, execute no console:

```javascript
// Limpar tudo
sessionStorage.clear()
localStorage.clear()

// Forçar reload
location.reload()
```

Depois faça login novamente.

---

**Data:** 18/02/2026  
**Status:** Documentação de troubleshooting  
**Próximos Passos:** Testar com usuário funcionário real
