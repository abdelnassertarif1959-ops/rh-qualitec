# Troubleshooting - Popup de Avisos Recentes para Funcionário

## Problema

O popup de avisos recentes não aparece para funcionários quando fazem login, mas aparece para admin.

## Como Funciona

### Fluxo Esperado

1. **Login** (`app/pages/login.vue`)
   - Usuário faz login com sucesso
   - Sistema seta flag: `sessionStorage.setItem('acabou_de_logar', 'true')`
   - Redireciona para `/dashboard`

2. **Dashboard** (`app/pages/dashboard.vue`)
   - Verifica flag `acabou_de_logar`
   - Se não existir, não mostra popups
   - Se existir:
     - **Admin**: Mostra popup de criar aviso
     - **Funcionário**: 
       - Verifica se já visualizou (`avisos_visualizados` no sessionStorage)
       - Busca avisos dos últimos 7 dias
       - Se houver avisos, mostra popup

3. **Popup Fechado**
   - Marca como visualizado: `sessionStorage.setItem('avisos_visualizados', 'true')`
   - Não mostra novamente nesta sessão

## Checklist de Verificação

### 1. Verificar se há avisos recentes

```sql
-- No Supabase SQL Editor
SELECT * FROM avisos 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

Se não houver avisos nos últimos 7 dias, o popup não aparecerá.

### 2. Verificar logs no console

Após fazer login como funcionário, abra o console do navegador (F12) e procure por:

```
🔔 [DASHBOARD] Verificando popups...
🔔 [DASHBOARD] Flag acabou_de_logar: true
🔔 [DASHBOARD] É admin? false
🔔 [DASHBOARD] Flag removida
🔔 [DASHBOARD] Funcionário - já visualizou? null
🔔 [DASHBOARD] Buscando avisos recentes...
🔔 [DASHBOARD] Total de avisos: X
🔔 [DASHBOARD] Filtrando avisos desde: [data]
🔔 [DASHBOARD] Avisos recentes (últimos 7 dias): X
🔔 [DASHBOARD] Mostrando popup de avisos recentes
```

### 3. Verificar sessionStorage

No console do navegador:

```javascript
// Verificar flags
sessionStorage.getItem('acabou_de_logar')
sessionStorage.getItem('avisos_visualizados')

// Limpar flags para testar novamente
sessionStorage.removeItem('acabou_de_logar')
sessionStorage.removeItem('avisos_visualizados')
```

### 4. Verificar permissões RLS

O funcionário precisa ter permissão para ler avisos:

```sql
-- Verificar política RLS
SELECT * FROM pg_policies 
WHERE tablename = 'avisos';
```

### 5. Testar manualmente

1. Abra o console do navegador (F12)
2. Execute:
```javascript
sessionStorage.setItem('acabou_de_logar', 'true')
sessionStorage.removeItem('avisos_visualizados')
```
3. Recarregue a página
4. O popup deve aparecer (se houver avisos recentes)

## Soluções Comuns

### Problema: Popup não aparece mesmo com avisos

**Causa**: Flag `avisos_visualizados` já está setada

**Solução**:
```javascript
// No console do navegador
sessionStorage.removeItem('avisos_visualizados')
// Recarregar página
```

### Problema: Popup aparece mas está vazio

**Causa**: Avisos têm mais de 7 dias

**Solução**: Criar um aviso novo ou ajustar o período de filtro

### Problema: Erro ao buscar avisos

**Causa**: Problema com permissões RLS ou API

**Solução**: Verificar logs do servidor e políticas RLS

## Código Relevante

### Login (app/pages/login.vue)
```typescript
// Linha ~452
sessionStorage.setItem('acabou_de_logar', 'true')
await navigateTo('/dashboard')
```

### Dashboard (app/pages/dashboard.vue)
```typescript
// Função verificarPopups()
const acabouDeLogar = sessionStorage.getItem('acabou_de_logar')
if (!acabouDeLogar) return

// Para funcionário
const avisos = await buscarAvisos()
const seteDiasAtras = new Date()
seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)

avisosRecentes.value = avisos.filter((aviso: any) => {
  const dataAviso = new Date(aviso.created_at)
  return dataAviso >= seteDiasAtras
})

if (avisosRecentes.value.length > 0) {
  mostrarPopupFuncionario.value = true
}
```

### Popup (app/components/avisos/PopupAvisosRecentes.vue)
```typescript
const fechar = () => {
  sessionStorage.setItem('avisos_visualizados', 'true')
  emit('fechar')
}
```

## Teste Completo

1. Criar um aviso novo (como admin)
2. Fazer logout
3. Limpar sessionStorage:
   ```javascript
   sessionStorage.clear()
   ```
4. Fazer login como funcionário
5. Verificar logs no console
6. Popup deve aparecer com o aviso criado

## Arquivos Envolvidos

- `app/pages/login.vue` - Seta flag de login
- `app/pages/dashboard.vue` - Lógica de exibição
- `app/components/avisos/PopupAvisosRecentes.vue` - Componente do popup
- `app/composables/useAvisos.ts` - Busca avisos

---

**Data:** 18/02/2026  
**Status:** ✅ Implementado com logs de debug
