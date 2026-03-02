# 🔍 Explicação: Diferença de Valores no Holerite do Leonardo

## 📊 VALORES DIFERENTES EM CADA LUGAR

### Listagem (Banco de Dados)
```
Salário Líquido: R$ 1.775,42 ❌ DESATUALIZADO
```
**Por quê?** Valor foi calculado e salvo ANTES da pensão ser cadastrada

---

### Modal (Recalculado)
```
Proventos:       R$ 1.775,42
Descontos:       R$ 962,00 (pensão)
Líquido:         R$ 813,42 ✅ CORRETO
```
**Por quê?** Modal busca pensão da tabela e recalcula

---

### HTML/PDF (Recalculado)
```
Proventos:       R$ 1.775,42
Descontos:       R$ 948,63 (pensão)
Líquido:         R$ 826,79 ✅ CORRETO
```
**Por quê?** HTML busca pensão da tabela e recalcula

---

## ❓ POR QUE VALORES DIFERENTES DE PENSÃO?

### Modal: R$ 962,00
- Busca da tabela `holerite_itens_personalizados`
- Valor atual cadastrado: R$ 962,00

### HTML: R$ 948,63
- Busca da tabela `holerite_itens_personalizados`
- Valor atual cadastrado: R$ 948,63

**Conclusão**: Existem 2 registros diferentes na tabela!

---

## 🔍 VERIFICAR TABELA

Execute no Supabase:

```sql
SELECT 
  id,
  funcionario_id,
  tipo,
  descricao,
  valor,
  data_inicio,
  data_fim,
  vigencia_tipo
FROM holerite_itens_personalizados
WHERE funcionario_id = 156
  AND tipo = 'desconto'
  AND descricao ILIKE '%pensao%'
ORDER BY data_inicio DESC;
```

**Resultado esperado**:
```
ID  | Valor     | Data Início | Data Fim
----|-----------|-------------|----------
5   | 948.63    | 2026-01-01  | null
?   | 962.00    | 2026-02-01  | null
```

---

## ✅ SOLUÇÃO

### Opção 1: Manter Valor Mais Recente
Se R$ 962,00 é o valor correto:

1. Excluir registro antigo (R$ 948,63)
2. Manter apenas R$ 962,00
3. Regerar holerite

### Opção 2: Manter Valor Antigo
Se R$ 948,63 é o valor correto:

1. Excluir registro novo (R$ 962,00)
2. Manter apenas R$ 948,63
3. Regerar holerite

### Opção 3: Valores por Período
Se ambos são corretos (mudança de valor):

1. Ajustar `data_fim` do registro antigo
2. Manter ambos com períodos diferentes
3. Regerar holerite

---

## 🎯 RECOMENDAÇÃO

1. **Verificar qual valor está correto** com o RH/Financeiro
2. **Manter apenas 1 registro ativo** (sem `data_fim`)
3. **Regerar o holerite** para aplicar o valor correto
4. **Resultado**: Todos os lugares mostrarão o mesmo valor

---

## 📝 EXEMPLO DE CORREÇÃO

### Se R$ 962,00 é o correto:

```sql
-- Finalizar registro antigo
UPDATE holerite_itens_personalizados
SET data_fim = '2026-01-31'
WHERE id = 5;

-- Verificar que existe registro com R$ 962,00 ativo
SELECT * FROM holerite_itens_personalizados
WHERE funcionario_id = 156
  AND tipo = 'desconto'
  AND descricao ILIKE '%pensao%'
  AND data_fim IS NULL;
```

Depois: **Regerar holerite do Leonardo**

---

## 🎉 RESULTADO FINAL

Após correção e regeração:

```
Listagem:  R$ 813,42 ✅
Modal:     R$ 813,42 ✅
HTML:      R$ 813,42 ✅
PDF:       R$ 813,42 ✅
```

**Todos os valores iguais e corretos!** 🚀
