# Guia de Execução - Auditoria de Segurança

Este guia explica como executar os testes de segurança e implementar as correções recomendadas.

---

## 📋 Pré-requisitos

- Node.js instalado
- Acesso ao código-fonte do projeto
- Variáveis de ambiente configuradas (para testes completos)

---

## 🔍 Passo 1: Análise de Middlewares

### Executar Análise Estática

Este script analisa o código-fonte e identifica vulnerabilidades sem fazer requisições HTTP.

```bash
node scripts/testar-middlewares-seguranca.js
```

### O que o script faz:
- ✅ Analisa 63 arquivos de API
- ✅ Identifica middlewares de segurança aplicados
- ✅ Detecta rotas sem proteção
- ✅ Identifica vulnerabilidades CSRF
- ✅ Verifica sanitização de dados
- ✅ Gera relatório JSON detalhado

### Saída Esperada:
```
╔═══════════════════════════════════════════════════════╗
║     ANÁLISE DE MIDDLEWARES DE SEGURANÇA DAS APIs     ║
╚═══════════════════════════════════════════════════════╝

📁 Analisando 63 arquivos de API...

📊 Total de APIs analisadas: 63
   ✅ Protegidas: 58 (92.1%)
   ❌ Desprotegidas: 5 (7.9%)

🎯 Taxa de Segurança: 92.1%
```

### Arquivos Gerados:
- `relatorio-analise-middlewares-seguranca.json` - Relatório completo em JSON

---

## 🔧 Passo 2: Implementar Proteção CSRF

### Executar Script de Correção Automática

Este script adiciona automaticamente a proteção CSRF em todas as rotas mutáveis.

```bash
node scripts/adicionar-protecao-csrf-automatico.js
```

### O que o script faz:
- ✅ Identifica rotas POST, PATCH, PUT, DELETE
- ✅ Adiciona import do middleware CSRF
- ✅ Adiciona chamada ao middleware no handler
- ✅ Exclui rotas públicas e de cron
- ✅ Gera relatório de modificações

### Saída Esperada:
```
╔═══════════════════════════════════════════════════════╗
║     ADICIONAR PROTEÇÃO CSRF AUTOMATICAMENTE          ║
╚═══════════════════════════════════════════════════════╝

✅ server/api/funcionarios/index.post.ts - Proteção CSRF adicionada
✅ server/api/empresas/index.post.ts - Proteção CSRF adicionada
⏭️  server/api/auth/login.post.ts - Excluído (rota pública)

📊 Estatísticas:
   Total de rotas mutáveis: 30
   ✅ Modificados: 26
   ⏭️  Já protegidos: 0
   ⏭️  Excluídos: 4
```

### ⚠️ IMPORTANTE:
Após executar este script:
1. Revise os arquivos modificados
2. Teste as APIs modificadas
3. Certifique-se de que o frontend está enviando o token CSRF

---

## 🧪 Passo 3: Testar Proteção CSRF no Frontend

### Verificar Plugin CSRF

O plugin já está configurado em `plugins/csrf.client.ts`:

```typescript
export default defineNuxtPlugin(async () => {
  const csrfToken = useCookie('csrf-token')
  
  // Obter token CSRF do servidor
  const { data } = await useFetch('/api/csrf-token')
  if (data.value?.token) {
    csrfToken.value = data.value.token
  }
  
  // Adicionar token em todas as requisições
  $fetch.create({
    onRequest({ options }) {
      if (csrfToken.value) {
        options.headers = {
          ...options.headers,
          'x-csrf-token': csrfToken.value
        }
      }
    }
  })
})
```

### Testar Manualmente

1. Abra o DevTools do navegador
2. Vá para a aba "Application" > "Cookies"
3. Verifique se existe o cookie `csrf-token`
4. Faça uma requisição POST/PATCH/DELETE
5. Verifique se o header `x-csrf-token` está sendo enviado

---

## 🔐 Passo 4: Auditoria Completa (Opcional)

### Executar Testes de Penetração

Este script requer variáveis de ambiente configuradas e faz requisições HTTP reais.

```bash
# Configurar variáveis de ambiente
export SUPABASE_URL="sua-url"
export SUPABASE_SERVICE_ROLE_KEY="sua-chave"
export BASE_URL="http://localhost:3000"

# Executar auditoria
node scripts/auditoria-seguranca-apis-completa.js
```

### O que o script faz:
- ✅ Cria usuários de teste
- ✅ Testa rotas públicas
- ✅ Testa proteção de autenticação
- ✅ Testa proteção CSRF
- ✅ Testa controle de acesso (admin vs funcionário)
- ✅ Testa proteção de ownership
- ✅ Testa proteção de cron jobs
- ✅ Testa sanitização de dados
- ✅ Testa injeção SQL e XSS
- ✅ Limpa usuários de teste

### Saída Esperada:
```
╔═══════════════════════════════════════════════════════╗
║     AUDITORIA COMPLETA DE SEGURANÇA DAS APIs         ║
╚═══════════════════════════════════════════════════════╝

TESTE 1: Rotas Públicas
✅ GET /api/health - Acessível sem autenticação
✅ GET /api/csrf-token - Acessível sem autenticação

TESTE 2: Proteção de Autenticação
✅ GET /api/funcionarios - Protegida (401)
✅ GET /api/empresas - Protegida (401)

📊 Estatísticas:
   Total de testes: 50
   ✅ Aprovados: 48
   ❌ Falhados: 2
   Taxa de sucesso: 96.0%
```

### Arquivos Gerados:
- `relatorio-auditoria-seguranca-completa.json` - Relatório completo

---

## 📊 Passo 5: Analisar Relatórios

### Relatórios Disponíveis

1. **AUDITORIA-SEGURANCA-APIS-12-02-2026.md**
   - Análise técnica completa
   - Recomendações detalhadas
   - Exemplos de código

2. **RESUMO-AUDITORIA-SEGURANCA-FINAL-12-02-2026.md**
   - Resumo executivo
   - Pontuação geral
   - Checklist de implementação

3. **relatorio-analise-middlewares-seguranca.json**
   - Dados estruturados
   - Lista de todas as APIs
   - Detalhes de vulnerabilidades

### Visualizar Relatório JSON

```bash
# Windows
type relatorio-analise-middlewares-seguranca.json

# Linux/Mac
cat relatorio-analise-middlewares-seguranca.json
```

### Filtrar Vulnerabilidades Críticas

```bash
# Usando jq (se instalado)
cat relatorio-analise-middlewares-seguranca.json | jq '.vulnerabilidades.detalhes[] | select(.severidade == "CRÍTICA")'
```

---

## ✅ Passo 6: Validar Correções

### Checklist de Validação

Após implementar as correções, valide:

#### 1. Proteção CSRF
- [ ] Token CSRF é gerado no servidor
- [ ] Token CSRF é armazenado em cookie
- [ ] Token CSRF é enviado no header `x-csrf-token`
- [ ] Requisições sem token são bloqueadas (403)
- [ ] Requisições com token inválido são bloqueadas (403)
- [ ] Requisições com token válido são aceitas (200)

#### 2. Autenticação
- [ ] Rotas protegidas exigem autenticação
- [ ] Rotas públicas são acessíveis sem autenticação
- [ ] Sessão expira após 24 horas
- [ ] Logout limpa a sessão

#### 3. Autorização
- [ ] Funcionários não acessam rotas de admin
- [ ] Funcionários só acessam seus próprios dados
- [ ] Admins acessam todos os dados
- [ ] Cron jobs exigem token secreto

#### 4. Sanitização
- [ ] Senhas não são retornadas em respostas
- [ ] Dados bancários são protegidos
- [ ] Dados sensíveis são removidos

---

## 🐛 Troubleshooting

### Erro: "Token CSRF ausente"

**Causa:** Frontend não está enviando o token CSRF

**Solução:**
1. Verifique se o plugin CSRF está carregado
2. Verifique se o cookie `csrf-token` existe
3. Verifique se o header `x-csrf-token` está sendo enviado

### Erro: "Token CSRF inválido"

**Causa:** Token do cookie não corresponde ao token do header

**Solução:**
1. Limpe os cookies do navegador
2. Recarregue a página
3. Obtenha novo token de `/api/csrf-token`

### Erro: "Não autenticado"

**Causa:** Sessão expirou ou cookie não foi enviado

**Solução:**
1. Faça login novamente
2. Verifique se o cookie `session` existe
3. Verifique se o cookie está sendo enviado nas requisições

### Erro: "Acesso negado"

**Causa:** Usuário não tem permissão para acessar a rota

**Solução:**
1. Verifique o tipo de acesso do usuário (admin/funcionário)
2. Verifique se a rota exige privilégios de admin
3. Verifique se está tentando acessar dados de outro usuário

---

## 📈 Monitoramento Contínuo

### Executar Análise Regularmente

Recomenda-se executar a análise de segurança:
- **Semanalmente:** Durante desenvolvimento ativo
- **Mensalmente:** Em produção estável
- **Sempre:** Antes de deploy em produção
- **Sempre:** Após adicionar novas APIs

### Comando Rápido

```bash
# Análise rápida
node scripts/testar-middlewares-seguranca.js

# Análise completa (requer env vars)
node scripts/auditoria-seguranca-apis-completa.js
```

---

## 📚 Recursos Adicionais

### Documentação
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Nuxt Security](https://nuxt.com/docs/guide/going-further/security)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

### Scripts Disponíveis
- `scripts/testar-middlewares-seguranca.js` - Análise estática
- `scripts/adicionar-protecao-csrf-automatico.js` - Correção automática
- `scripts/auditoria-seguranca-apis-completa.js` - Testes de penetração

### Documentos Gerados
- `AUDITORIA-SEGURANCA-APIS-12-02-2026.md` - Análise completa
- `RESUMO-AUDITORIA-SEGURANCA-FINAL-12-02-2026.md` - Resumo executivo
- `GUIA-EXECUCAO-AUDITORIA-SEGURANCA.md` - Este guia

---

## 🎯 Próximos Passos

1. ✅ Executar análise de middlewares
2. ✅ Revisar relatórios gerados
3. 🔧 Implementar proteção CSRF (script automático)
4. 🧪 Testar APIs modificadas
5. ✅ Validar correções
6. 📝 Documentar mudanças
7. 🚀 Deploy em produção
8. 📊 Monitorar logs de segurança

---

**Última Atualização:** 12 de Fevereiro de 2026  
**Versão:** 1.0.0
