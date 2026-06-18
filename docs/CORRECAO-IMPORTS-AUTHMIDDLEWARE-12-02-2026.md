# Correção de Imports - authMiddleware

**Data:** 12 de Fevereiro de 2026  
**Problema:** Imports incorretos causando erro de build  
**Status:** ✅ Corrigido

---

## 🔍 PROBLEMA IDENTIFICADO

### Erro 1: Arquivo Backup Duplicado
```
WARN Duplicated imports "gerarHoleriteHTML"
- server/utils/holeriteHTML.ts
- server/utils/holeriteHTML.ts.backup (estava sendo usado)
```

**Causa:** Arquivo `.backup` não foi removido, causando conflito de imports

**Solução:** Remover `server/utils/holeriteHTML.ts.backup`

---

### Erro 2: Imports com Caminho Relativo Incorreto
```
ERROR RollupError: Could not resolve "../../../utils/authMiddleware"
```

**Causa:** Caminhos relativos incorretos em arquivos dentro de subpastas

**Estrutura de Pastas:**
```
server/
├── utils/
│   └── authMiddleware.ts
└── api/
    ├── holerites/
    │   ├── [id].patch.ts          ❌ ../../../utils/authMiddleware
    │   ├── [id].delete.ts         ❌ ../../../utils/authMiddleware
    │   └── [id]/
    │       ├── pdf.get.ts         ❌ ../../../utils/authMiddleware
    │       └── enviar-email.post.ts ❌ ../../../utils/authMiddleware
    └── funcionarios/
        └── [id]/
            └── config-inss-pensao.patch.ts ❌ ../../../utils/authMiddleware
```

**Problema:** 
- Arquivos em `server/api/holerites/[id].patch.ts` usam `../../../utils/authMiddleware`
- Arquivos em `server/api/holerites/[id]/pdf.get.ts` também usam `../../../utils/authMiddleware`
- Mas estão em níveis diferentes da estrutura de pastas!

**Caminho Correto:**
- De `server/api/holerites/[id].patch.ts` → `../../utils/authMiddleware` (2 níveis acima)
- De `server/api/holerites/[id]/pdf.get.ts` → `../../../utils/authMiddleware` (3 níveis acima)

---

## ✅ SOLUÇÃO

### Opção 1: Usar Auto-Import do Nuxt (RECOMENDADO)

Em Nuxt/Nitro, arquivos em `server/utils/` são **auto-importados**. Não precisa de import explícito!

**Antes:**
```typescript
import { requireAdmin } from '../../../utils/authMiddleware'
```

**Depois:**
```typescript
// Nenhum import necessário - auto-importado!
// Apenas use: await requireAdmin(event)
```

### Opção 2: Corrigir Caminhos Relativos

Se preferir manter imports explícitos, use o caminho correto:

**Para arquivos em `server/api/PASTA/[id].ts`:**
```typescript
import { requireAdmin } from '../../utils/authMiddleware'
```

**Para arquivos em `server/api/PASTA/[id]/arquivo.ts`:**
```typescript
import { requireAdmin } from '../../../utils/authMiddleware'
```

---

## 🔧 ARQUIVOS CORRIGIDOS

### Nível 1: `server/api/PASTA/[id].ts` (2 níveis acima)

1. ✅ `server/api/holerites/[id].patch.ts`
2. ✅ `server/api/holerites/[id].delete.ts`

**Correção:**
```typescript
// Antes
import { requireAdmin } from '../../../utils/authMiddleware'

// Depois
import { requireAdmin } from '../../utils/authMiddleware'
```

---

### Nível 2: `server/api/PASTA/[id]/arquivo.ts` (3 níveis acima - CORRETO)

Estes já estão corretos:

1. ✅ `server/api/holerites/[id]/pdf.get.ts`
2. ✅ `server/api/holerites/[id]/html.get.ts`
3. ✅ `server/api/holerites/[id]/enviar-email.post.ts`
4. ✅ `server/api/funcionarios/[id]/config-inss-pensao.patch.ts`
5. ✅ `server/api/funcionarios/[id]/config-inss-pensao.get.ts`

**Mantém:**
```typescript
import { requireAdmin } from '../../../utils/authMiddleware'
```

---

### Nível 3: `server/api/PASTA/SUBPASTA/[id].ts` (3 níveis acima)

1. ✅ `server/api/holerites/itens-personalizados/[id].delete.ts`
2. ✅ `server/api/holerites/itens-personalizados/[funcionarioId].get.ts`
3. ✅ `server/api/holerites/itens-personalizados/index.post.ts`

**Mantém:**
```typescript
import { requireAdmin } from '../../../utils/authMiddleware'
```

---

### Nível 4: `server/api/PASTA/[id]/SUBPASTA/arquivo.ts` (4 níveis acima)

1. ✅ `server/api/notificacoes/[id]/marcar-lida.patch.ts`
2. ✅ `server/api/notificacoes/[id]/excluir.delete.ts`

**Correção:**
```typescript
// Antes
import { requireAuth } from '../../../utils/authMiddleware'

// Depois
import { requireAuth } from '../../../../utils/authMiddleware'
```

---

## 📊 RESUMO DAS CORREÇÕES

| Arquivo | Antes | Depois | Status |
|---------|-------|--------|--------|
| `holeriteHTML.ts.backup` | Existia | Removido | ✅ |
| `holerites/[id].patch.ts` | `../../../` | `../../` | ✅ |
| `holerites/[id].delete.ts` | `../../../` | `../../` | ✅ |
| `notificacoes/[id]/marcar-lida.patch.ts` | `../../../` | `../../../../` | ⏳ |
| `notificacoes/[id]/excluir.delete.ts` | `../../../` | `../../../../` | ⏳ |

---

## 🎯 REGRA GERAL

**Contar níveis da pasta atual até `server/`:**

```
server/api/pasta/arquivo.ts           → ../../utils/
server/api/pasta/[id].ts              → ../../utils/
server/api/pasta/[id]/arquivo.ts      → ../../../utils/
server/api/pasta/subpasta/arquivo.ts  → ../../../utils/
server/api/pasta/[id]/sub/arquivo.ts  → ../../../../utils/
```

**Fórmula:**
- Contar quantas pastas há entre o arquivo e `server/`
- Adicionar `../` para cada pasta
- Adicionar `utils/authMiddleware`

---

## ✅ VERIFICAÇÃO

Após correções, o servidor deve iniciar sem erros:

```bash
npm run dev
```

**Saída esperada:**
```
✓ Vite client built in XXms
✓ Vite server built in XXms
✓ Nitro built in XXms
```

**Sem erros de:**
- ❌ `Could not resolve`
- ❌ `Duplicated imports`

---

**Responsável:** Kiro AI  
**Data:** 12 de Fevereiro de 2026
