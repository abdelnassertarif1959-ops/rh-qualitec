# Guia Rápido: Adicionar Referência do INSS

## 🎯 O que foi implementado?

Campo de referência do INSS que aparece no PDF/HTML quando o INSS está em modo fixo.

## 📋 Passo a Passo

### 1️⃣ Executar Script SQL no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo de `database/41-adicionar-referencia-inss.sql`
5. Clique em **Run**
6. Verifique se apareceu: "Success. No rows returned"

### 2️⃣ Testar na Interface

1. Acesse o sistema
2. Vá em **Holerites** > Clique em um holerite
3. Clique em **✏️ Editar**
4. Vá para aba **Descontos**
5. Na seção **INSS**:
   - Selecione "💵 Valor Fixo"
   - Digite um valor (ex: 380,60)
   - Veja aparecer o campo de referência
   - Clique em "✨ Gerar referência automática"
   - Ou digite manualmente (ex: "7,5% s/ R$ 4.100,00")
6. Clique em **💾 Salvar Alterações**

### 3️⃣ Verificar no Holerite

1. Após salvar, visualize o holerite
2. A referência deve aparecer na coluna "Referência" ao lado do INSS

## 💡 Exemplos de Uso

### Exemplo 1: Referência Automática
- **Salário Bruto:** R$ 4.100,00
- **INSS Fixo:** R$ 380,60
- **Referência Gerada:** "9,3% s/ R$ 4.100,00"

### Exemplo 2: Referência Manual
- **INSS Fixo:** R$ 380,60
- **Referência Manual:** "Alíquota progressiva 2026"

### Exemplo 3: Modo Percentual (sem referência)
- **INSS Percentual:** 7,5%
- **Referência:** (vazio - não é usado)

## ✅ Checklist de Validação

- [ ] Script SQL executado com sucesso
- [ ] Campo de referência aparece no modal (modo fixo)
- [ ] Botão "Gerar automática" funciona
- [ ] Referência pode ser digitada manualmente
- [ ] Referência é salva no banco
- [ ] Referência aparece no PDF/HTML do holerite

## 🐛 Troubleshooting

### Erro: "column does not exist"
**Solução:** Execute o script SQL no Supabase

### Campo de referência não aparece
**Solução:** Certifique-se que INSS está em modo "Valor Fixo"

### Referência não aparece no PDF
**Solução:** Os templates PDF/HTML precisam ser atualizados (próximo passo)

---

**Tempo estimado:** 5 minutos  
**Dificuldade:** Fácil
