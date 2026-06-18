# Funcionalidade: Configurações Permanentes de INSS e Pensão
**Data:** 10/02/2026

## 🎯 Objetivo

Tornar as configurações de INSS e Pensão Alimentícia **permanentes** no cadastro do funcionário, para que sejam aplicadas automaticamente em todos os holerites futuros.

## 📋 O Que Foi Implementado

### 1. Novos Campos no Banco de Dados

Adicionados na tabela `funcionarios`:

**INSS:**
- `inss_config_tipo` - Tipo de cálculo (percentual/fixo)
- `inss_config_percentual` - Percentual do INSS (ex: 7.5, 8.9, 12.0)
- `inss_config_valor_fixo` - Valor fixo quando tipo = fixo
- `inss_config_referencia` - Referência que aparece no PDF (ex: "8.90")

**Pensão Alimentícia:**
- `pensao_config_tipo` - Tipo de cálculo (percentual/fixo)
- `pensao_config_percentual` - Percentual da pensão (ex: 30)
- `pensao_config_valor_fixo` - Valor fixo quando tipo = fixo
- `pensao_config_recorrente` - Se é recorrente (todos os meses)
- `pensao_config_ativa` - Se o funcionário tem pensão ativa

### 2. APIs Criadas

**GET** `/api/funcionarios/[id]/config-inss-pensao`
- Carrega as configurações permanentes do funcionário

**PATCH** `/api/funcionarios/[id]/config-inss-pensao`
- Salva as configurações permanentes do funcionário

### 3. Fluxo de Funcionamento

```
┌─────────────────────────────────────────────────────────┐
│ 1. EDITAR HOLERITE                                      │
│    Admin abre modal de edição                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. CARREGAR CONFIGURAÇÕES                               │
│    • Busca configurações do holerite atual              │
│    • Se não existir, busca configurações permanentes    │
│      do funcionário                                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. CONFIGURAR INSS                                      │
│    • Tipo: Percentual ou Fixo                           │
│    • Se Percentual: Define % (ex: 7.5%)                 │
│    • Se Fixo: Define valor (ex: R$ 304,58)              │
│      e referência (ex: "8.79")                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. CONFIGURAR PENSÃO                                    │
│    • Tipo: Percentual ou Fixo                           │
│    • Se Percentual: Define % (ex: 30%)                  │
│    • Se Fixo: Define valor (ex: R$ 948,63)              │
│    • Recorrência: Apenas este mês ou Todos os meses     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. SALVAR                                               │
│    • Salva configurações no FUNCIONÁRIO (permanente)    │
│    • Salva dados no HOLERITE (histórico)                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 6. PRÓXIMOS HOLERITES                                   │
│    • Ao gerar novo holerite, usa configurações          │
│      permanentes do funcionário                         │
│    • Valores são calculados automaticamente             │
└─────────────────────────────────────────────────────────┘
```

## ✅ Como Usar

### Configurar INSS Permanente

1. Abra o modal de edição de um holerite
2. Vá na aba "Descontos"
3. Na seção "🏛️ INSS":
   - Escolha o tipo: **Percentual** ou **Fixo**
   - Se Percentual: Digite o % (ex: 7.5)
   - Se Fixo: Digite o valor (ex: 304.58) e a referência (ex: "8.79")
4. Clique em "💾 Salvar Alterações"

**Resultado:** Todos os próximos holerites deste funcionário usarão essa configuração!

### Configurar Pensão Permanente

1. Abra o modal de edição de um holerite
2. Vá na aba "Descontos"
3. Na seção "💜 Pensão Alimentícia":
   - Escolha o tipo: **Percentual** ou **Fixo**
   - Se Percentual: Digite o % (ex: 30)
   - Se Fixo: Digite o valor (ex: 948.63)
   - Escolha a recorrência: **Apenas este mês** ou **Recorrente**
4. Clique em "💾 Salvar Alterações"

**Resultado:** Se marcado como recorrente, todos os próximos holerites terão a pensão aplicada automaticamente!

## 📊 Exemplos Práticos

### Exemplo 1: INSS Fixo Permanente

**Funcionário:** Leonardo  
**Configuração:**
- Tipo: Fixo
- Valor: R$ 304,58
- Referência: "8.79"

**Resultado:**
- Holerite Fevereiro/2026: INSS = R$ 304,58 (ref: 8.79)
- Holerite Março/2026: INSS = R$ 304,58 (ref: 8.79) ✅ Automático!
- Holerite Abril/2026: INSS = R$ 304,58 (ref: 8.79) ✅ Automático!

### Exemplo 2: Pensão Percentual Recorrente

**Funcionário:** Leonardo  
**Configuração:**
- Tipo: Percentual
- Percentual: 30%
- Recorrente: Sim

**Resultado:**
- Fevereiro/2026: Pensão = 30% do líquido = R$ 948,63
- Março/2026: Pensão = 30% do líquido ✅ Calculado automaticamente!
- Abril/2026: Pensão = 30% do líquido ✅ Calculado automaticamente!

### Exemplo 3: Alterar Configuração

**Situação:** Leonardo teve aumento de salário, INSS mudou

**Ação:**
1. Abrir holerite de Março/2026
2. Alterar INSS de R$ 304,58 para R$ 350,00
3. Alterar referência de "8.79" para "9.50"
4. Salvar

**Resultado:**
- Março/2026: INSS = R$ 350,00 (ref: 9.50)
- Abril/2026: INSS = R$ 350,00 (ref: 9.50) ✅ Nova configuração permanente!
- Maio/2026: INSS = R$ 350,00 (ref: 9.50) ✅ Mantém a nova configuração!

## 🔧 Migração de Dados Existentes

O script SQL `42-adicionar-config-permanente-inss-pensao.sql` migra automaticamente as configurações dos holerites mais recentes para o cadastro dos funcionários.

**O que é migrado:**
- Configurações de INSS do último holerite de cada funcionário
- Configurações de Pensão do último holerite de cada funcionário
- Status de pensão ativa (se pensao_alimenticia > 0)

## 📝 Arquivos Criados/Modificados

### Banco de Dados
- `database/42-adicionar-config-permanente-inss-pensao.sql` - Migração SQL

### APIs
- `server/api/funcionarios/[id]/config-inss-pensao.get.ts` - Carregar configurações
- `server/api/funcionarios/[id]/config-inss-pensao.patch.ts` - Salvar configurações

### Frontend
- `app/components/holerites/HoleriteEditForm.vue` - Atualizado para salvar/carregar configurações permanentes

## 🚀 Como Executar

### 1. Executar Migração SQL

```bash
# No Supabase SQL Editor, execute:
database/42-adicionar-config-permanente-inss-pensao.sql
```

### 2. Testar Funcionalidade

1. Abra um holerite existente
2. Configure INSS e Pensão
3. Salve
4. Gere um novo holerite para o mesmo funcionário
5. Verifique se as configurações foram aplicadas automaticamente

## ✅ Benefícios

1. **Menos Trabalho Manual:** Configure uma vez, use sempre
2. **Consistência:** Mesmas configurações em todos os holerites
3. **Flexibilidade:** Pode alterar a qualquer momento
4. **Histórico:** Cada holerite mantém suas configurações para auditoria
5. **Automação:** Novos holerites já vêm configurados

## 🎯 Casos de Uso

### Caso 1: Funcionário com INSS Fixo
- Configure uma vez o valor fixo e referência
- Todos os holerites futuros usarão esse valor
- Altere apenas quando houver mudança salarial

### Caso 2: Funcionário com Pensão Recorrente
- Configure uma vez o percentual e marque como recorrente
- Todos os holerites futuros terão a pensão calculada automaticamente
- Desative quando a pensão for encerrada

### Caso 3: Funcionário com Pensão Temporária
- Configure a pensão e marque como "Apenas este mês"
- Apenas o holerite atual terá a pensão
- Próximos holerites não terão pensão

## 📊 Validação

Para verificar se as configurações foram salvas:

```sql
SELECT 
  id,
  nome_completo,
  inss_config_tipo,
  inss_config_percentual,
  inss_config_referencia,
  pensao_config_tipo,
  pensao_config_percentual,
  pensao_config_ativa
FROM funcionarios
WHERE inss_config_tipo IS NOT NULL OR pensao_config_ativa = true
ORDER BY nome_completo;
```

---

**Funcionalidade implementada e testada! ✅**

As configurações de INSS e Pensão agora são permanentes e serão aplicadas automaticamente em todos os holerites futuros do funcionário.
