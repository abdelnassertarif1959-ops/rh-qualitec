# Plano de Correção de Segurança de APIs

**Data:** 12 de Fevereiro de 2026  
**Objetivo:** Executar testes de segurança de APIs e corrigir vulnerabilidades encontradas  
**Status:** 🔄 Em Andamento

---

## 🎯 OBJETIVO

Realizar testes completos de segurança nas APIs do sistema RH Qualitec, focando em:
- Autenticação e autorização
- IDOR (Insecure Direct Object Reference)
- Escalação de privilégios
- Manipulação de IDs
- CSRF protection
- Rate limiting
- Exposição de dados sensíveis

---

## 📋 PRÉ-REQUISITOS

### 1. Servidor em Execução
```bash
npm run dev
```
Servidor deve estar rodando em `http://localhost:3000`

### 2. Usuários de Teste no Banco

#### Admin
```sql
-- Verificar se existe admin
SELECT id, nome_completo, email_login, tipo_acesso 
FROM funcionarios 
WHERE email_login = 'admin@qualitec.com' 
AND status = 'ativo';

-- Se não existir, criar (senha: admin123)
-- Usar o hash bcrypt gerado pela função hashPassword()
```

#### Funcionário
```sql
-- Verificar se existe funcionário
SELECT id, nome_completo, email_login, tipo_acesso 
FROM funcionarios 
WHERE email_login = 'funcionario@qualitec.com' 
AND status = 'ativo';

-- Se não existir, criar (senha: func123)
```

### 3. Variáveis de Ambiente
```env
JWT_SECRET=XdJ46YZ37jokzVuCDmiyU37jtCuvQvaM9Yrrtd2wW190VQVqkxu/a96YC0inABiIjgSJd4wNxRG94OdYbl7c2A==
JWT_EXPIRATION=3600
CRON_SECRET=qualitec-cron-contador-diario-2026-secure-token-xyz789
```

---

## 🧪 TESTES A EXECUTAR

### Categoria 1: Autenticação (3 testes)

#### 1.1. Login com Credenciais Válidas - Admin
**Esperado:** Status 200, cookie de sessão, dados do usuário  
**Comando:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qualitec.com","senha":"admin123"}' \
  -v
```

#### 1.2. Login com Credenciais Válidas - Funcionário
**Esperado:** Status 200, cookie de sessão, dados do usuário  
**Comando:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"funcionario@qualitec.com","senha":"func123"}' \
  -v
```

#### 1.3. Login com Credenciais Inválidas
**Esperado:** Status 401, mensagem de erro  
**Comando:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalido@test.com","senha":"senha_errada"}' \
  -v
```

---

### Categoria 2: Acesso Sem Autenticação (7 testes)

Todos devem retornar **Status 401**

#### 2.1. Listar Funcionários
```bash
curl -X GET http://localhost:3000/api/funcionarios -v
```

#### 2.2. Criar Funcionário
```bash
curl -X POST http://localhost:3000/api/funcionarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste"}' \
  -v
```

#### 2.3. Listar Empresas
```bash
curl -X GET http://localhost:3000/api/empresas -v
```

#### 2.4. Criar Empresa
```bash
curl -X POST http://localhost:3000/api/empresas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste"}' \
  -v
```

#### 2.5. Listar Holerites
```bash
curl -X GET http://localhost:3000/api/holerites -v
```

#### 2.6. Listar Notificações
```bash
curl -X GET http://localhost:3000/api/notificacoes -v
```

#### 2.7. Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/dashboard/stats -v
```

---

### Categoria 3: Escalação de Privilégios (4 testes)

Funcionário tentando acessar recursos de admin - todos devem retornar **Status 403**

#### 3.1. Criar Funcionário (Admin Only)
```bash
# Primeiro fazer login como funcionário e pegar o cookie
curl -X POST http://localhost:3000/api/funcionarios \
  -H "Content-Type: application/json" \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -d '{"nome":"Teste"}' \
  -v
```

#### 3.2. Criar Empresa (Admin Only)
```bash
curl -X POST http://localhost:3000/api/empresas \
  -H "Content-Type: application/json" \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -d '{"nome":"Teste"}' \
  -v
```

#### 3.3. Deletar Funcionário (Admin Only)
```bash
curl -X DELETE http://localhost:3000/api/funcionarios/1 \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 3.4. Gerar Holerite (Admin Only)
```bash
curl -X POST http://localhost:3000/api/holerites/gerar \
  -H "Content-Type: application/json" \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -d '{}' \
  -v
```

---

### Categoria 4: IDOR - Insecure Direct Object Reference (6 testes)

#### 4.1. Funcionário Tentando Ver Dados de Outro Funcionário
**Esperado:** Status 403  
```bash
# Assumindo funcionário tem ID 2, tentar acessar ID 3
curl -X GET http://localhost:3000/api/funcionarios/3 \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 4.2. Funcionário Tentando Editar Dados de Outro Funcionário
**Esperado:** Status 403  
```bash
curl -X PATCH http://localhost:3000/api/funcionarios/3 \
  -H "Content-Type: application/json" \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -d '{"nome":"Hacked"}' \
  -v
```

#### 4.3. Funcionário Tentando Ver Holerites de Outro Funcionário
**Esperado:** Status 403  
```bash
curl -X GET "http://localhost:3000/api/holerites?funcionario_id=3" \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 4.4. Funcionário Acessando Próprios Dados
**Esperado:** Status 200  
```bash
# Assumindo funcionário tem ID 2
curl -X GET http://localhost:3000/api/funcionarios/2 \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 4.5. Admin Acessando Dados de Funcionário
**Esperado:** Status 200  
```bash
curl -X GET http://localhost:3000/api/funcionarios/2 \
  -H "Cookie: session=COOKIE_DO_ADMIN" \
  -v
```

#### 4.6. Admin Acessando Dados de Qualquer Funcionário
**Esperado:** Status 200  
```bash
curl -X GET http://localhost:3000/api/funcionarios/3 \
  -H "Cookie: session=COOKIE_DO_ADMIN" \
  -v
```

---

### Categoria 5: Manipulação de IDs (5 testes)

Todos devem retornar **Status 400, 403 ou 404**

#### 5.1. ID Negativo
```bash
curl -X GET http://localhost:3000/api/funcionarios/-1 \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 5.2. ID Muito Alto
```bash
curl -X GET http://localhost:3000/api/funcionarios/999999 \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 5.3. ID Zero
```bash
curl -X GET http://localhost:3000/api/funcionarios/0 \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 5.4. SQL Injection no ID
```bash
curl -X GET "http://localhost:3000/api/funcionarios/1' OR '1'='1" \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

#### 5.5. ID Não Numérico
```bash
curl -X GET http://localhost:3000/api/funcionarios/abc \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -v
```

---

### Categoria 6: CSRF Protection (1 teste)

#### 6.1. Requisição POST Sem Token CSRF
**Esperado:** Status 403  
```bash
curl -X POST http://localhost:3000/api/funcionarios \
  -H "Content-Type: application/json" \
  -H "Cookie: session=COOKIE_DO_FUNCIONARIO" \
  -d '{"nome":"Teste CSRF"}' \
  -v
```

---

### Categoria 7: Rate Limiting (1 teste)

#### 7.1. Múltiplas Tentativas de Login
**Esperado:** Bloqueio após 5 tentativas (Status 429)  
```bash
# Executar 6 vezes
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","senha":"wrong"}' \
    -v
  echo "Tentativa $i"
done
```

---

### Categoria 8: Exposição de Dados Sensíveis (1 teste)

#### 8.1. Verificar se API Retorna Senhas
**Esperado:** Sem campos `senha` ou `senha_hash`  
```bash
curl -X GET http://localhost:3000/api/funcionarios \
  -H "Cookie: session=COOKIE_DO_ADMIN" \
  -v | grep -E "(senha|senha_hash)"
```

---

## 🤖 EXECUÇÃO AUTOMATIZADA

### Script de Testes
**Arquivo:** `scripts/testar-seguranca-apis.js`

**Execução:**
```bash
# Certifique-se de que o servidor está rodando
npm run dev

# Em outro terminal, execute os testes
node scripts/testar-seguranca-apis.js
```

**Saída Esperada:**
```
🔒 TESTES DE SEGURANÇA DE APIs - AUTENTICAÇÃO E AUTORIZAÇÃO
================================================================================

📋 1. TESTES DE AUTENTICAÇÃO
  ✅ Login admin com credenciais válidas
  ✅ Login funcionário com credenciais válidas
  ✅ Login com credenciais inválidas deve falhar

📋 2. TESTES DE ACESSO SEM AUTENTICAÇÃO (deve retornar 401)
  ✅ Listar funcionários sem autenticação
  ✅ Criar funcionário sem autenticação
  ...

📊 RELATÓRIO FINAL DE TESTES DE SEGURANÇA
Total de Testes: 28
✅ Passou: 28 (100%)
❌ Falhou: 0 (0%)
⚠️  Pulados: 0 (0%)

✅ SUCESSO: Todos os testes de segurança passaram!
```

---

## 📊 MÉTRICAS DE SUCESSO

### Critérios de Aprovação

| Categoria | Testes | Aprovação |
|-----------|--------|-----------|
| Autenticação | 3 | 100% |
| Sem Autenticação | 7 | 100% |
| Escalação de Privilégios | 4 | 100% |
| IDOR | 6 | 100% |
| Manipulação de IDs | 5 | 100% |
| CSRF | 1 | 100% |
| Rate Limiting | 1 | 100% |
| Exposição de Dados | 1 | 100% |

**Total:** 28 testes, 100% de aprovação

---

## 🔧 CORREÇÕES NECESSÁRIAS

### Se Testes Falharem

#### Falha em Autenticação
1. Verificar se usuários de teste existem no banco
2. Verificar se senhas estão corretas
3. Verificar logs do servidor

#### Falha em Autorização
1. Verificar middlewares (`requireAuth`, `requireAdmin`, `requireOwnershipOrAdmin`)
2. Verificar se middlewares estão sendo chamados nas APIs
3. Verificar logs de autorização

#### Falha em IDOR
1. Verificar `requireOwnershipOrAdmin` nas APIs de funcionários
2. Verificar comparação de IDs (user.id vs targetUserId)
3. Adicionar logs de acesso

#### Falha em CSRF
1. Verificar se `csrfMiddleware` está implementado
2. Verificar se plugin CSRF está carregando
3. Verificar se token está sendo enviado no header

#### Falha em Rate Limiting
1. Verificar implementação de rate limiting no login
2. Ajustar limites se necessário
3. Considerar usar Redis para rate limiting distribuído

#### Falha em Exposição de Dados
1. Verificar `sanitizeUserData()` em todas as APIs
2. Adicionar sanitização onde estiver faltando
3. Verificar se senhas estão sendo removidas

---

## 📝 DOCUMENTAÇÃO DE RESULTADOS

### Relatório JSON
**Arquivo:** `relatorio-testes-seguranca-apis.json`

**Estrutura:**
```json
{
  "total": 28,
  "passed": 28,
  "failed": 0,
  "skipped": 0,
  "tests": [
    {
      "category": "Autenticação",
      "testName": "Login admin com credenciais válidas",
      "expected": "Status 200 e cookie de sessão",
      "actual": "Sucesso",
      "passed": true,
      "details": ""
    }
  ]
}
```

### Relatório Markdown
**Arquivo:** `docs/RELATORIO-TESTES-SEGURANCA-APIS-12-02-2026.md`

Será gerado automaticamente após execução dos testes.

---

## ✅ CHECKLIST DE EXECUÇÃO

- [ ] Servidor rodando em `http://localhost:3000`
- [ ] Usuários de teste criados no banco
- [ ] Variáveis de ambiente configuradas
- [ ] Script de testes executado
- [ ] Relatório JSON gerado
- [ ] Relatório Markdown gerado
- [ ] Vulnerabilidades documentadas (se houver)
- [ ] Correções implementadas (se necessário)
- [ ] Testes re-executados após correções
- [ ] Documentação atualizada

---

## 🎯 PRÓXIMOS PASSOS

### Após Testes Bem-Sucedidos

1. **Documentar Resultados**
   - Criar relatório detalhado
   - Atualizar documentação de segurança
   - Compartilhar com equipe

2. **Deploy em Produção**
   - Verificar variáveis de ambiente no Vercel
   - Fazer deploy
   - Executar testes em produção

3. **Monitoramento Contínuo**
   - Configurar alertas de segurança
   - Implementar logs de auditoria
   - Agendar próxima auditoria (3 meses)

### Após Testes com Falhas

1. **Analisar Falhas**
   - Identificar causa raiz
   - Documentar vulnerabilidades
   - Priorizar correções

2. **Implementar Correções**
   - Corrigir vulnerabilidades críticas primeiro
   - Testar correções localmente
   - Re-executar testes

3. **Validar Correções**
   - Executar testes novamente
   - Verificar se todas as falhas foram corrigidas
   - Documentar mudanças

---

## 📞 SUPORTE

### Documentação Relacionada
- `docs/AUDITORIA-SEGURANCA-COMPLETA-12-02-2026.md`
- `docs/ANALISE-APIS-AUTH-12-02-2026.md`
- `docs/PLANO-ACAO-SEGURANCA-12-02-2026.md`

### Scripts Relacionados
- `scripts/testar-seguranca-apis.js`
- `scripts/auditoria-seguranca-completa.js`
- `scripts/verificar-vulnerabilidades-seguranca.js`

---

**Responsável:** Kiro AI  
**Data:** 12 de Fevereiro de 2026  
**Versão:** 1.0.0
