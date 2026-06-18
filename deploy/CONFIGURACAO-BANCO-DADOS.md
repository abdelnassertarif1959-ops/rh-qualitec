# 🗄️ COMO CONECTAR AO BANCO DE DADOS SUPABASE

Este guia te ajudará a configurar e conectar ao banco de dados Supabase para rodar o projeto localmente.

## 📋 PRÉ-REQUISITOS

- Node.js instalado (versão 18 ou superior)
- Conta no Supabase (gratuita)
- Git instalado

## 🚀 PASSO A PASSO

### 1. ACESSAR SEU PROJETO SUPABASE

**✅ SEU PROJETO JÁ EXISTE!**

- **URL**: https://rqryspxfvfzfghrfqtbm.supabase.co
- **Nome**: rh-qualitec
- **ID**: rqryspxfvfzfghrfqtbm

**Acesse**: https://supabase.com/dashboard/project/rqryspxfvfzfghrfqtbm

### 2. VERIFICAR AS CHAVES DO SUPABASE

**✅ SUAS CHAVES JÁ ESTÃO CONFIGURADAS!**

Suas chaves atuais (já no .env):
- **Project URL**: `https://rqryspxfvfzfghrfqtbm.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTY3NTksImV4cCI6MjA4MzU5Mjc1OX0.bptJ9j_zu151GLQO35kdvXOJzWaRL_7d0haRHKS3jDo`
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4`

Para verificar se estão corretas, acesse: **Settings > API** no dashboard do Supabase.

### 3. CONFIGURAR VARIÁVEIS DE AMBIENTE

**✅ SEU ARQUIVO `.env` JÁ ESTÁ CONFIGURADO!**

Suas variáveis atuais:
```env
# Supabase Configuration
NUXT_PUBLIC_SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTY3NTksImV4cCI6MjA4MzU5Mjc1OX0.bptJ9j_zu151GLQO35kdvXOJzWaRL_7d0haRHKS3jDo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4
SUPABASE_URL=https://rqryspxfvfzfghrfqtbm.supabase.co

# Outras configurações
NUXT_PUBLIC_BASE_URL=http://localhost:3000
ENVIRONMENT=Development
SUPABASE_PROJECT_ID=rqryspxfvfzfghrfqtbm
```

**🎯 Projeto Supabase**: `rh-qualitec` (ID: rqryspxfvfzfghrfqtbm)

### 4. CRIAR AS TABELAS NO BANCO

1. **Acesse o Supabase Dashboard**
2. **Vá em SQL Editor**
3. **Execute os scripts na ordem**:

#### 4.1. Script Base (OBRIGATÓRIO)
```sql
-- Copie e execute o conteúdo de: database/01-criar-tabelas-base.sql
```

#### 4.2. Sistema Completo (OBRIGATÓRIO)
```sql
-- Copie e execute o conteúdo de: database/02-sistema-completo.sql
```

#### 4.3. Relacionamentos (OBRIGATÓRIO)
```sql
-- Copie e execute o conteúdo de: database/03-relacionamentos-completos.sql
```

#### 4.4. Criar Admin (OBRIGATÓRIO)
```sql
-- Copie e execute o conteúdo de: database/05-criar-admin-silvana.sql
```

### 5. TESTAR A CONEXÃO

Execute este comando para testar se tudo está funcionando:

```bash
node testar-conexao-supabase.mjs
```

**Resultado esperado**:
```
🔍 TESTANDO CONEXÃO COM SUPABASE
================================
📍 URL: https://rqryspxfvfzfghrfqtbm.supabase.co
🔑 Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔐 Service Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

✅ Conexão básica: OK
✅ Tabelas encontradas: 15
✅ Usuário admin encontrado: admin@empresa.com
✅ Tabelas essenciais: 6/6
🎉 ESTRUTURA COMPLETA!
🎉 CONEXÃO COM SUPABASE: SUCESSO!
```

### 6. INSTALAR DEPENDÊNCIAS

```bash
npm install
```

### 7. RODAR O PROJETO

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔐 CREDENCIAIS DE TESTE

**✅ CREDENCIAIS CONFIRMADAS E FUNCIONANDO:**

**Administrador:**
- Email: `silvana@qualitec.ind.br`
- Senha: `Qualitec2025Silvana`

**Outros funcionários:**
- Verifique no painel admin ou crie novos através do sistema

## ❌ PROBLEMAS COMUNS

### Erro: "Invalid API key"
- ✅ Verifique se copiou as chaves corretas
- ✅ Confirme que não há espaços extras
- ✅ Certifique-se que o projeto está ativo

### Erro: "relation does not exist"
- ✅ Execute todos os scripts SQL na ordem
- ✅ Verifique se não houve erros na execução
- ✅ Confirme que está no projeto correto

### Erro: "Connection refused"
- ✅ Verifique a URL do projeto
- ✅ Confirme que o projeto está rodando
- ✅ Teste a conexão no dashboard do Supabase

### Erro: "RLS policy violation"
- ✅ Execute o script de relacionamentos
- ✅ Verifique se o RLS está configurado
- ✅ Confirme que o usuário admin foi criado

## 🔧 COMANDOS ÚTEIS

### Testar conexão específica:
```bash
node testar-supabase-simples.mjs
```

### Verificar estrutura das tabelas:
```bash
node verificar-estrutura-funcionarios.mjs
```

### Criar usuários de teste:
```bash
node criar-usuarios-funcionarios.mjs
```

## 📞 SUPORTE

Se ainda tiver problemas:

1. **Verifique os logs** no Supabase Dashboard > Logs
2. **Confirme as permissões** em Authentication > Policies
3. **Teste no SQL Editor** se as tabelas existem:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

## 🎯 PRÓXIMOS PASSOS

Após conectar com sucesso:

1. **Explore o sistema** com as credenciais de teste
2. **Leia a documentação** em `docs/`
3. **Customize** conforme sua necessidade
4. **Deploy** no Vercel quando estiver pronto

## ✅ RESULTADO FINAL

**🎉 CONEXÃO ESTABELECIDA COM SUCESSO!**

O projeto está rodando em: **http://localhost:3000**

### Status da Conexão:
- ✅ Supabase conectado: `https://rqryspxfvfzfghrfqtbm.supabase.co`
- ✅ Usuário admin: `silvana@qualitec.ind.br`
- ✅ Tabelas funcionando: empresas, funcionarios, holerites, etc.
- ✅ Login funcionando
- ✅ Sistema operacional

### Credenciais Confirmadas:
- **Email**: `silvana@qualitec.ind.br`
- **Senha**: `Qualitec2025Silvana` (conforme logs do sistema)

### Próximos Passos:
1. **Acesse**: http://localhost:3000
2. **Faça login** com as credenciais acima
3. **Explore o sistema** - todas as funcionalidades estão operacionais
4. **Customize** conforme necessário

---

**🚀 SEU SISTEMA RH ESTÁ PRONTO PARA USO!**