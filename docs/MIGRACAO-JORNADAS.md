# 🕐 Migração: Sistema de Jornadas de Trabalho

## ❌ Problema Identificado

O sistema de jornadas de trabalho estava com erros porque as tabelas não existiam no banco de dados:

1. **Tabela `jornadas_trabalho`** - não existe
2. **Tabela `jornada_horarios`** - não existe
3. **Coluna `jornada_id` na tabela `funcionarios`** - não existe

## ✅ Solução

Execute a migração SQL para criar as tabelas necessárias.

## 📋 Como Executar a Migração

### Opção 1: Via Supabase Dashboard (RECOMENDADO)

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `database/06-criar-jornadas-trabalho.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl+Enter)
8. Aguarde a execução (deve levar alguns segundos)
9. Verifique se não há erros na saída

### Opção 2: Via Script Node.js

```bash
node executar-migracao-jornadas.js
```

**Nota:** Esta opção requer que você tenha a função `exec_sql` criada no Supabase, o que pode não estar disponível por padrão.

## 🔍 Verificar se a Migração Funcionou

Execute o script de verificação:

```bash
node verificar-schema-jornadas.js
```

Você deve ver:
- ✅ Tabela `jornadas_trabalho` acessível
- ✅ Tabela `jornada_horarios` acessível
- ✅ Jornada padrão criada
- ✅ Horários da jornada padrão criados

## 📊 O que a Migração Cria

### 1. Tabela `jornadas_trabalho`

Armazena as jornadas de trabalho configuradas:

```sql
- id (BIGSERIAL PRIMARY KEY)
- nome (VARCHAR 100) - Ex: "Jornada 44h"
- descricao (TEXT) - Descrição detalhada
- horas_semanais (DECIMAL 5,2) - Total de horas semanais
- ativa (BOOLEAN) - Se a jornada está ativa
- padrao (BOOLEAN) - Se é a jornada padrão
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### 2. Tabela `jornada_horarios`

Armazena os horários de cada dia da semana:

```sql
- id (BIGSERIAL PRIMARY KEY)
- jornada_id (BIGINT) - Referência à jornada
- dia_semana (INTEGER) - 1=Seg, 2=Ter, ..., 7=Dom
- entrada (TIME) - Horário de entrada
- saida (TIME) - Horário de saída
- intervalo_inicio (TIME) - Início do intervalo
- intervalo_fim (TIME) - Fim do intervalo
- horas_brutas (DECIMAL 5,2) - Total de horas
- horas_intervalo (DECIMAL 5,2) - Horas de intervalo
- horas_liquidas (DECIMAL 5,2) - Horas trabalhadas
- trabalha (BOOLEAN) - Se trabalha neste dia
- created_at (TIMESTAMPTZ)
```

### 3. Coluna `jornada_id` em `funcionarios`

Permite associar cada funcionário a uma jornada de trabalho.

### 4. Jornada Padrão

Cria automaticamente uma jornada padrão de 44 horas semanais:
- Segunda a Sexta: 08:00 às 17:48 (com 1h de intervalo)
- Sábado e Domingo: Não trabalha

## 🔒 Segurança (RLS)

A migração também configura Row Level Security:

- **Leitura**: Permitida para usuários autenticados
- **Escrita**: Apenas via service_role (backend)

Isso garante que:
- Frontend pode ler jornadas
- Apenas o backend pode criar/editar/deletar jornadas

## 🧪 Testar o Sistema

Após executar a migração:

1. Acesse a página de jornadas: `/admin/jornadas`
2. Você deve ver a jornada padrão listada
3. Tente criar uma nova jornada
4. Configure os horários de cada dia
5. Salve e verifique se aparece na lista

## ⚠️ Observações Importantes

1. **Backup**: Sempre faça backup antes de executar migrações
2. **Service Role Key**: Certifique-se de ter a chave service_role configurada no `.env`
3. **Ordem de Execução**: Esta migração deve ser executada após as migrações básicas do sistema

## 📝 Arquivos Relacionados

- `database/06-criar-jornadas-trabalho.sql` - Script SQL da migração
- `executar-migracao-jornadas.js` - Script Node.js para executar
- `verificar-schema-jornadas.js` - Script para verificar
- `server/api/jornadas/` - APIs do backend
- `app/composables/useJornadas.ts` - Composable do frontend
- `app/components/jornadas/` - Componentes Vue

## 🐛 Problemas Comuns

### Erro: "Could not find the table"

**Causa**: A migração não foi executada ou falhou.

**Solução**: Execute a migração via Supabase Dashboard (Opção 1).

### Erro: "Could not find the column"

**Causa**: A estrutura da tabela está diferente do esperado.

**Solução**: 
1. Verifique se a migração foi executada completamente
2. Execute o script de verificação
3. Se necessário, delete as tabelas e execute novamente

### Erro: "permission denied"

**Causa**: Políticas RLS não configuradas corretamente.

**Solução**: Verifique se as políticas foram criadas na migração.

## ✅ Checklist de Validação

Após executar a migração, verifique:

- [ ] Tabela `jornadas_trabalho` existe
- [ ] Tabela `jornada_horarios` existe
- [ ] Coluna `jornada_id` existe em `funcionarios`
- [ ] Jornada padrão foi criada
- [ ] Horários da jornada padrão foram criados
- [ ] Políticas RLS estão ativas
- [ ] Frontend consegue listar jornadas
- [ ] Frontend consegue criar nova jornada
- [ ] Backend consegue salvar jornadas

## 🎯 Próximos Passos

Após a migração bem-sucedida:

1. Associar funcionários às jornadas
2. Usar jornadas no cálculo de horas trabalhadas
3. Integrar com sistema de ponto eletrônico (futuro)
4. Gerar relatórios de horas por jornada
