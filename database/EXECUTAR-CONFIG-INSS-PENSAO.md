# Executar: Adicionar Configurações de INSS e Pensão

## 🎯 Objetivo

Adicionar colunas na tabela `holerites` para salvar as configurações de percentual do INSS e Pensão Alimentícia, permitindo que os valores sejam mantidos ao reabrir o modal de edição.

## 📋 Pré-requisitos

- Acesso ao Supabase SQL Editor
- Tabela `holerites` existente

## 🚀 Passo a Passo

### 1. Abrir Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em "SQL Editor" no menu lateral

### 2. Executar o SQL

1. Clique em "New Query"
2. Cole o conteúdo do arquivo: `40-adicionar-config-inss-pensao-holerites.sql`
3. Clique em "Run" ou pressione `Ctrl+Enter`

### 3. Verificar Execução

Execute este comando para verificar se as colunas foram criadas:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name IN (
  'inss_tipo', 
  'inss_percentual', 
  'pensao_tipo', 
  'pensao_percentual', 
  'pensao_recorrente'
)
ORDER BY column_name;
```

**Resultado esperado:**

| column_name | data_type | column_default |
|-------------|-----------|----------------|
| inss_percentual | numeric | 7.5 |
| inss_tipo | character varying | 'percentual' |
| pensao_percentual | numeric | 30.0 |
| pensao_recorrente | boolean | false |
| pensao_tipo | character varying | 'percentual' |

### 4. Verificar Dados Atualizados

```sql
SELECT 
  id,
  funcionario_id,
  inss,
  inss_tipo,
  inss_percentual,
  pensao_alimenticia,
  pensao_tipo,
  pensao_percentual,
  pensao_recorrente
FROM holerites
ORDER BY id DESC
LIMIT 5;
```

## ✅ Resultado Esperado

Todos os holerites existentes devem ter:
- `inss_tipo` = 'percentual'
- `inss_percentual` = 7.5
- `pensao_tipo` = 'percentual' (se tiver pensão) ou 'fixo'
- `pensao_percentual` = 30.0
- `pensao_recorrente` = false

## 🧪 Testar no Sistema

1. Abra o sistema em `http://localhost:3000`
2. Vá para Admin > Holerites
3. Edite qualquer holerite
4. Mude o percentual do INSS (ex: 8,79%)
5. Salve e reabra
6. ✅ O percentual deve estar mantido em 8,79%

## ❌ Troubleshooting

### Erro: "column already exists"

Se você já executou este script antes, pode ignorar este erro. As colunas já existem.

### Erro: "permission denied"

Você precisa de permissões de administrador no Supabase para adicionar colunas.

### Valores não estão sendo salvos

1. Verifique se as colunas foram criadas:
```sql
\d holerites
```

2. Verifique se a API está enviando os dados:
- Abra o DevTools (F12)
- Vá para Network
- Edite um holerite e salve
- Veja o payload da requisição PATCH

3. Verifique os logs do servidor:
```bash
# No terminal onde o Nuxt está rodando
# Deve aparecer: "📤 Enviando dados sanitizados: { ... inss_tipo: 'percentual', ... }"
```

## 📝 Notas

- Esta migração é **segura** e não afeta dados existentes
- Holerites antigos receberão valores padrão
- Novos holerites salvarão as configurações automaticamente
- Cada holerite pode ter configurações diferentes

## 🔗 Documentação Relacionada

- `CORRECAO-PERSISTENCIA-PERCENTUAL-INSS-PENSAO-10-02-2026.md` - Documentação completa da correção
- `docs/COMO-USAR-INSS-PERCENTUAL.md` - Como usar o modo percentual do INSS
- `docs/COMO-USAR-PENSAO-PERCENTUAL.md` - Como usar o modo percentual da Pensão
