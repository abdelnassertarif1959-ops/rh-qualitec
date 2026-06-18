# 📧 GUIA: Testar Email do Holerite do Leonardo

**Data:** 10/02/2026

## 🎯 OBJETIVO

Testar o HTML do email do holerite do Leonardo ANTES de enviar, para garantir que os valores estão corretos (salário proporcional aos dias trabalhados).

## 🚀 COMO TESTAR

### Opção 1: Script de Teste (Recomendado)

Execute o script que gera o HTML exatamente como será enviado no email:

```bash
node scripts/testar-email-holerite-leonardo.js
```

**O que o script faz:**
1. ✅ Busca o último holerite do Leonardo no banco
2. ✅ Mostra os dados e cálculos
3. ✅ Gera o HTML do email
4. ✅ Salva em arquivo `.html` para você visualizar
5. ✅ Verifica se os valores estão corretos

**Resultado:**
- Arquivo HTML salvo: `test-holerite-leonardo-[timestamp].html`
- Abra no navegador para ver exatamente como ficará o email

### Opção 2: Visualizar no Sistema (Mais Rápido)

1. **Acesse:** https://rhqualitec.vercel.app/admin/holerites
2. **Encontre** o holerite do Leonardo
3. **Clique** no botão "👁️ Ver"
4. **Verifique:**
   - Dias Normais: Deve mostrar os dias trabalhados (ex: 10,00)
   - Vencimentos: Deve mostrar o salário proporcional (ex: R$ 1.000,00)
   - Total Vencimentos: Deve estar correto
   - Salário Líquido: Deve estar correto

**✅ Se estiver correto na visualização, estará correto no email!**

## 🔍 O QUE VERIFICAR

### Valores Esperados (Exemplo com 10 dias):

**Se Leonardo trabalhou 10 dias:**
- Salário Base: R$ 3.000,00
- Dias Trabalhados: 10
- **Valor do Dia:** R$ 100,00
- **Salário Proporcional:** R$ 1.000,00

**No HTML/Email deve aparecer:**
```
Código | Descrição    | Referência | Vencimentos | Descontos
8781   | DIAS NORMAIS | 10,00      | R$ 1.000,00 |
```

**Total de Vencimentos:**
- R$ 1.000,00 + outros proventos (se houver)

**Salário Líquido:**
- Total Vencimentos - Total Descontos

## ⚠️ SE OS VALORES ESTIVEREM ERRADOS

**Causa:** O holerite foi salvo antes da correção

**Solução:**
1. Edite o holerite do Leonardo
2. Mude qualquer valor (ex: dias trabalhados)
3. Salve
4. Isso vai recalcular tudo automaticamente
5. Teste novamente

## ✅ QUANDO ENVIAR O EMAIL

**Envie o email SOMENTE se:**
1. ✅ A visualização (👁️ Ver) mostra valores corretos
2. ✅ O script de teste confirma valores corretos
3. ✅ O salário proporcional está correto para os dias trabalhados

## 📧 COMO ENVIAR

Após confirmar que está tudo correto:

1. **Acesse:** https://rhqualitec.vercel.app/admin/holerites
2. **Encontre** o holerite do Leonardo
3. **Clique** no botão "📧 Enviar"
4. **Confirme** o envio

O email será enviado com o HTML correto!

## 🔄 FLUXO COMPLETO

```
1. Editar holerite → Mudar dias trabalhados
2. Salvar → API recalcula tudo
3. Visualizar (👁️) → Verificar se está correto
4. Enviar (📧) → Email com valores corretos
```

## 💡 DICA

Se você já editou e salvou o holerite do Leonardo após o deploy da correção, os valores já estão corretos no banco de dados. Pode enviar o email com segurança!

## 📝 CHECKLIST ANTES DE ENVIAR

- [ ] Holerite foi editado e salvo após a correção
- [ ] Visualização mostra salário proporcional correto
- [ ] Dias trabalhados estão corretos
- [ ] Total de vencimentos está correto
- [ ] Salário líquido está correto
- [ ] Pronto para enviar! ✅
