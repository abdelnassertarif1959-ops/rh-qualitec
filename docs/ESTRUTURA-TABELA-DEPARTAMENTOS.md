# 📋 Estrutura da Tabela Departamentos

## ✅ Estrutura Real (database/01-criar-tabelas-base.sql)

```sql
CREATE TABLE departamentos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  responsavel VARCHAR(200),        ← Texto livre, não ID!
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📊 Campos Disponíveis

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | BIGSERIAL | Sim (PK) | ID único do departamento |
| `nome` | VARCHAR(100) | Sim | Nome do departamento |
| `descricao` | TEXT | Não | Descrição detalhada |
| `responsavel` | VARCHAR(200) | Não | Nome do responsável (texto livre) |
| `created_at` | TIMESTAMPTZ | Sim (auto) | Data de criação |
| `updated_at` | TIMESTAMPTZ | Sim (auto) | Data de atualização |

## ⚠️ Campos que NÃO Existem

- ❌ `ativo` (BOOLEAN) - Não existe!
- ❌ `empresa_id` (BIGINT) - Não existe!
- ❌ `responsavel_id` (BIGINT) - Não existe!

## ✅ SQL Correto para Inserir Departamentos

```sql
INSERT INTO departamentos (nome, descricao, responsavel) VALUES
  ('Recursos Humanos', 'Gestão de pessoas e benefícios', 'Silvana Qualitec'),
  ('Financeiro', 'Controle financeiro e contabilidade', 'Silvana Qualitec'),
  ('TI', 'Tecnologia da Informação', 'Silvana Qualitec'),
  ('Comercial', 'Vendas e relacionamento com clientes', 'Silvana Qualitec'),
  ('Produção', 'Fabricação e controle de qualidade', 'Silvana Qualitec'),
  ('Administrativo', 'Suporte administrativo geral', 'Silvana Qualitec');
```

## 🔗 Relacionamento com Funcionários

Na tabela `funcionarios`:

```sql
departamento_id BIGINT REFERENCES departamentos(id)
```

- Funcionário tem `departamento_id` (FK para departamentos)
- Departamento tem `responsavel` (texto livre, não FK)

## 📝 Exemplo de Uso

### Criar Departamento
```sql
INSERT INTO departamentos (nome, descricao, responsavel)
VALUES ('Marketing', 'Marketing e comunicação', 'João Silva');
```

### Buscar Departamentos
```sql
SELECT id, nome, descricao, responsavel 
FROM departamentos 
ORDER BY nome;
```

### Atualizar Departamento
```sql
UPDATE departamentos 
SET responsavel = 'Maria Santos',
    descricao = 'Nova descrição'
WHERE id = 1;
```

### Associar Funcionário a Departamento
```sql
UPDATE funcionarios 
SET departamento_id = 1  -- ID do departamento
WHERE id = 10;           -- ID do funcionário
```

## 🎯 API Correta

### GET /api/departamentos
```typescript
// Buscar todos os departamentos
const response = await fetch(
  `${supabaseUrl}/rest/v1/departamentos?select=*&order=nome.asc`
)
```

**Não usar:** `?ativo=eq.true` (campo não existe!)

### Resposta Esperada
```json
[
  {
    "id": 1,
    "nome": "Recursos Humanos",
    "descricao": "Gestão de pessoas e benefícios",
    "responsavel": "Silvana Qualitec",
    "created_at": "2026-01-14T10:00:00Z",
    "updated_at": "2026-01-14T10:00:00Z"
  }
]
```

## ✅ Arquivos Corrigidos

1. **criar-departamentos-basicos.sql** - SQL correto sem campo `ativo`
2. **server/api/departamentos/index.get.ts** - API sem filtro `ativo`
3. **verificar-schema-departamentos.js** - Script de verificação atualizado

## 🧪 Como Testar

### 1. Inserir Departamentos
```bash
# No Supabase SQL Editor
# Cole o conteúdo de criar-departamentos-basicos.sql
```

### 2. Verificar Inserção
```bash
node verificar-schema-departamentos.js
```

### 3. Testar API
```bash
# No navegador ou Postman
GET http://localhost:3000/api/departamentos
```

### 4. Testar no Sistema
1. Acesse `/meus-dados`
2. Edite dados profissionais
3. Selecione um departamento
4. Salve
5. Recarregue (F5)
6. Deve estar salvo! ✅

---

**Estrutura Confirmada:** ✅  
**Data:** 14/01/2026  
**Fonte:** database/01-criar-tabelas-base.sql
