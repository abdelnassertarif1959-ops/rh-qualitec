# ☢️ PLANO FALLBACK NUCLEAR

## 🎯 **QUANDO USAR**

Use este plano SE E SOMENTE SE:
- ✅ Você fez Clear Build Cache no Vercel
- ✅ Fez Redeploy manual
- ✅ Aguardou 5+ minutos
- ✅ Ainda recebe HTTP 500 com ERR_MODULE_NOT_FOUND

## 🔧 **OPÇÃO 1: Preset Node Server**

### **Configuração:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'node-server',  // Mais compatível com chunks
    vercel: {
      functions: {
        maxDuration: 30
      }
    }
  },
  
  experimental: {
    externalVue: false
  }
})
```

### **Prós:**
- ✅ Mais estável
- ✅ Melhor compatibilidade com chunks
- ✅ Menos otimizações = menos problemas

### **Contras:**
- ❌ Menos otimizado para Vercel
- ❌ Pode ter performance inferior
- ❌ Não usa features específicas do Vercel

## 🔧 **OPÇÃO 2: Desabilitar Chunking Completamente**

### **Configuração:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    minify: false,  // Desabilita minificação
    sourceMap: false,  // Desabilita source maps
    rollupConfig: {
      output: {
        format: 'esm',
        entryFileNames: 'index.mjs',
        chunkFileNames: 'index.mjs',  // Força tudo no mesmo arquivo
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
})
```

### **Prós:**
- ✅ Força bundle único de forma agressiva
- ✅ Elimina qualquer possibilidade de chunks

### **Contras:**
- ❌ Arquivo muito grande
- ❌ Pode causar timeout no Vercel
- ❌ Performance ruim

## 🔧 **OPÇÃO 3: Hybrid Rendering (SPA Mode)**

### **Configuração:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,  // Desabilita SSR completamente
  
  nitro: {
    preset: 'vercel'
  },
  
  app: {
    buildAssetsDir: '/_nuxt/',
    cdnURL: ''
  }
})
```

### **Prós:**
- ✅ Elimina problema SSR completamente
- ✅ Mais simples de debugar
- ✅ Funciona 100% no cliente

### **Contras:**
- ❌ Perde SEO
- ❌ Perde performance inicial
- ❌ Não é SSR (objetivo original)

## 🔧 **OPÇÃO 4: Vercel Config Customizado**

### **Criar arquivo `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": {
        "includeFiles": [
          ".output/**",
          ".vercel/output/**"
        ]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/.output/server/index.mjs"
    }
  ],
  "functions": {
    "**/*.mjs": {
      "maxDuration": 30,
      "memory": 1024,
      "runtime": "nodejs20.x"
    }
  }
}
```

### **Prós:**
- ✅ Controle total sobre deployment
- ✅ Pode forçar inclusão de arquivos
- ✅ Bypass do builder padrão

### **Contras:**
- ❌ Mais complexo
- ❌ Pode quebrar outras coisas
- ❌ Precisa manutenção manual

## 📋 **ORDEM DE TESTE**

1. **Primeiro**: Opção 1 (Node Server) - Mais simples
2. **Segundo**: Opção 2 (Desabilitar Chunking) - Mais agressivo
3. **Terceiro**: Opção 4 (Vercel Config) - Mais controle
4. **Último Recurso**: Opção 3 (SPA Mode) - Elimina SSR

## 🎯 **COMO TESTAR CADA OPÇÃO**

Para cada opção:
1. Aplicar configuração
2. Commit: `git commit -m "FALLBACK: [nome da opção]"`
3. Push: `git push origin main`
4. **Clear Build Cache no Vercel**
5. Aguardar deploy (5 min)
6. Testar: `https://rhqualitec.vercel.app/api/health`

## 📊 **CRITÉRIO DE SUCESSO**

✅ **Sucesso**: GET /api/health retorna 200 OK  
✅ **Sucesso**: GET / carrega a página  
✅ **Sucesso**: Sem ERR_MODULE_NOT_FOUND nos logs

---
**Repositório:** git@github.com:samueltarif/rhhhh.git  
**Status:** Aguardando teste da configuração mínima  
**Próximo Passo:** Se falhar, aplicar Opção 1