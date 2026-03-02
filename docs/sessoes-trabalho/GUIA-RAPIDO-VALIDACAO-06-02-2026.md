# 🚀 GUIA RÁPIDO DE VALIDAÇÃO - 06/02/2026

## ✅ STATUS ATUAL

### Servidor
- ✅ **Rodando na porta 3001**
- ✅ Todas as alterações de código aplicadas
- ⚠️ **ATENÇÃO**: Reinicie o servidor para garantir que todas as mudanças sejam carregadas

### Banco de Dados
- ⏳ **Migration pendente**: `database/36-adicionar-coluna-fgts.sql`
- ⚠️ Execute a migration antes de testar o campo FGTS

---

## 📋 CHECKLIST DE VALIDAÇÃO

### 1️⃣ EXECUTAR MIGRATION DO FGTS (OBRIGATÓRIO)

```sql
-- Acessar: https://rqryspxfvfzfghrfqtbm.supabase.co
-- SQL Editor → Nova Query
-- Copiar e executar: database/36-adicionar-coluna-fgts.sql
```

**Conteúdo da Migration:**
```sql
-- Adicionar coluna fgts na tabela holerites
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS fgts NUMERIC(10,2) DEFAULT NULL;

-- Comentário da coluna
COMMENT ON COLUMN holerites.fgts IS 'Valor do FGTS (editável pelo admin)';
```

---

### 2️⃣ REINICIAR O SERVIDOR (RECOMENDADO)

```bash
# Parar o servidor atual
Ctrl + C

# Iniciar novamente
npm run dev
```

**Por que reiniciar?**
- Garante que todas as alterações de código sejam carregadas
- Evita problemas de cache
- Recarrega as rotas da API

---

### 3️⃣ TESTAR CAMPO FGTS EDITÁVEL

#### Passo a Passo:
1. Acesse: `http://localhost:3001/admin/holerites`
2. Clique em **"✏️ Editar"** em qualquer holerite
3. Vá para a aba **"Descontos"**
4. Localize o campo **"FGTS (8%)"**
5. Altere o valor (ex: de R$ 292,00 para R$ 100,00)
6. Clique em **"Salvar"**
7. Clique em **"👁️ Ver"** no mesmo holerite
8. Verifique se o valor do FGTS está correto no HTML

#### Resultado Esperado:
- ✅ Campo FGTS aparece na aba "Descontos"
- ✅ Valor pode ser editado
- ✅ Valor editado é salvo no banco
- ✅ HTML/PDF mostra o valor editado (não recalcula)

---

### 4️⃣ TESTAR MÊS DE REFERÊNCIA

#### Cenário 1: Folha Mensal de Fevereiro
1. Acesse: `http://localhost:3001/admin/holerites`
2. Gere uma **Folha Mensal** (ou visualize uma existente)
3. Clique em **"👁️ Ver"** ou **"📧 Enviar"**
4. Verifique o mês exibido no HTML

**Resultado Esperado:**
- ✅ Mostra **"Janeiro/2026"** (mês anterior)
- ✅ Período: 01/01/2026 a 31/01/2026

#### Cenário 2: Adiantamento de Fevereiro
1. Gere um **Adiantamento** (ou visualize um existente)
2. Clique em **"👁️ Ver"**
3. Verifique o mês exibido no HTML

**Resultado Esperado:**
- ✅ Mostra **"Fevereiro/2026"** (mês vigente)
- ✅ Período: 15/02/2026 a 28/02/2026

---

### 5️⃣ TESTAR PERÍODO NO EMAIL

#### Passo a Passo:
1. Acesse: `http://localhost:3001/admin/holerites`
2. Selecione um holerite **Mensal de Fevereiro**
3. Clique em **"📧 Enviar"**
4. Verifique o email recebido pelo funcionário

**Resultado Esperado:**
- ✅ Email mostra: **"01/01/2026 a 31/01/2026"** (mês anterior)
- ✅ Não mostra: "01/02/2026 a 28/02/2026"

#### Para Adiantamento:
- ✅ Email mostra: **"15/02/2026 a 28/02/2026"** (mês vigente)

---

### 6️⃣ TESTAR REENVIO DE EMAIL

#### Passo a Passo:
1. Acesse: `http://localhost:3001/admin/holerites`
2. Selecione um holerite com status **"Enviado"**
3. Clique em **"📧 Enviar"** novamente
4. Verifique se o email é enviado sem erros

**Resultado Esperado:**
- ✅ Botão **"📧 Enviar"** está sempre habilitado
- ✅ Email pode ser reenviado múltiplas vezes
- ✅ Não há mensagem de erro ou bloqueio

---

## 🐛 TROUBLESHOOTING

### Problema: Campo FGTS não aparece no formulário
**Solução:**
1. Verifique se a migration foi executada no Supabase
2. Reinicie o servidor
3. Limpe o cache do navegador (Ctrl + Shift + R)

### Problema: Mês de referência ainda está errado
**Solução:**
1. Verifique se o servidor foi reiniciado
2. Confirme que o arquivo `server/utils/holeriteHTML.ts` foi salvo
3. Teste com um holerite recém-gerado (não um antigo)

### Problema: Email não está sendo enviado
**Solução:**
1. Verifique as variáveis de ambiente no `.env`
2. Confirme que o Resend está configurado
3. Verifique os logs do servidor no terminal

### Problema: Valor do FGTS não muda no HTML
**Solução:**
1. Confirme que salvou a edição no formulário
2. Verifique se o valor foi salvo no banco (Supabase Table Editor)
3. Gere um novo HTML (não use um HTML antigo em cache)

---

## 📊 LOGS ÚTEIS

### Ver logs do servidor:
```bash
# No terminal onde o servidor está rodando
# Procure por mensagens como:
# "📄 Gerando HTML do Holerite:"
# "📧 Enviando email para:"
# "🧮 Recalculando totais do holerite:"
```

### Verificar dados no banco:
```sql
-- Supabase SQL Editor
SELECT id, funcionario_id, fgts, periodo_inicio, periodo_fim, status
FROM holerites
ORDER BY created_at DESC
LIMIT 10;
```

---

## ✅ CHECKLIST FINAL

Marque conforme for testando:

- [ ] Migration do FGTS executada no Supabase
- [ ] Servidor reiniciado
- [ ] Campo FGTS aparece no formulário de edição
- [ ] Valor do FGTS pode ser editado e salvo
- [ ] HTML/PDF mostra valor editado do FGTS
- [ ] Folha Mensal mostra mês anterior (ex: Janeiro/2026)
- [ ] Adiantamento mostra mês vigente (ex: Fevereiro/2026)
- [ ] Email de Folha Mensal mostra período do mês anterior
- [ ] Email de Adiantamento mostra período do mês vigente
- [ ] Botão "Enviar" está sempre habilitado
- [ ] Email pode ser reenviado múltiplas vezes

---

## 📞 SUPORTE

Se encontrar algum problema:
1. Verifique os logs do servidor no terminal
2. Verifique os dados no Supabase Table Editor
3. Consulte os arquivos de documentação:
   - `RESUMO-IMPLEMENTACOES-06-02-2026.md`
   - `correcoes/CORRECAO-CAMPO-FGTS-EDITAVEL-06-02-2026.md`
   - `correcoes/CORRECAO-MES-REFERENCIA-HOLERITES-06-02-2026.md`
   - `correcoes/CORRECAO-PERIODO-EMAIL-HOLERITE-06-02-2026.md`

---

**Data**: 06/02/2026  
**Versão**: 1.0  
**Status**: ✅ PRONTO PARA VALIDAÇÃO
