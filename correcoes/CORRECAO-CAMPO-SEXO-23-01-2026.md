# Correção do Campo Sexo - 23/01/2026

## Problema Identificado
Erro 500 ao tentar atualizar dados pessoais na página "Meus Dados" com a mensagem:
```
"value too long for type character varying(1)"
```

## Causa Raiz
O campo `sexo` na tabela `funcionarios` está definido como `VARCHAR(1)` e aceita apenas os valores 'M', 'F', 'O', mas o frontend estava enviando valores como "feminino", "masculino", etc.

## Estrutura do Banco
```sql
sexo VARCHAR(1),
CONSTRAINT funcionarios_sexo_check CHECK (sexo IN ('M', 'F', 'O'))
```

## Correções Aplicadas

### 1. Frontend - Opções do Select
**Arquivo:** `app/pages/meus-dados.vue`

**Antes:**
```javascript
const sexoOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'outro', label: 'Outro' },
  { value: 'nao_informar', label: 'Prefiro não informar' }
]
```

**Depois:**
```javascript
const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Outro' }
]
```

### 2. Função de Conversão
Adicionada função para converter dados antigos que possam existir no banco:

```javascript
const converterSexoParaFormato = (sexo: string) => {
  if (!sexo) return ''
  
  // Se já está no formato correto (M, F, O), retorna como está
  if (['M', 'F', 'O'].includes(sexo)) {
    return sexo
  }
  
  // Converter valores antigos
  const sexoLower = sexo.toLowerCase()
  if (sexoLower === 'masculino' || sexoLower === 'm') return 'M'
  if (sexoLower === 'feminino' || sexoLower === 'f') return 'F'
  if (sexoLower === 'outro' || sexoLower === 'o' || sexoLower === 'nao_informar') return 'O'
  
  return ''
}
```

### 3. Script SQL de Correção
**Arquivo:** `database/29-corrigir-campo-sexo.sql`

Script para corrigir dados existentes no banco que possam estar no formato antigo.

## Componentes Verificados
- ✅ `app/pages/meus-dados.vue` - CORRIGIDO
- ✅ `app/components/funcionarios/FuncionarioDadosPessoais.vue` - JÁ ESTAVA CORRETO

## Status
✅ **CORREÇÃO APLICADA E TESTADA COM SUCESSO**

- Frontend corrigido para enviar valores no formato correto
- Função de conversão adicionada para compatibilidade
- Script SQL criado para correção de dados existentes
- **TESTE REALIZADO:** Atualização via API funcionando sem erros 500
- **CONFIRMADO:** Campo sexo aceita valores 'M', 'F', 'O' corretamente

## Testes Realizados
✅ GET `/api/funcionarios/meus-dados?userId=1` - Retorna sexo: 'F'
✅ PATCH `/api/funcionarios/meus-dados` - Atualização com sexo: 'F' bem-sucedida
✅ Logs do servidor confirmam status 200 (sem mais erro 400/500)
✅ Resposta da API: "Dados atualizados com sucesso!"

## Próximos Passos
1. Executar o script SQL `29-corrigir-campo-sexo.sql` no banco de produção se necessário
2. Testar a edição de dados pessoais na interface
3. Verificar se outros formulários de cadastro estão usando o formato correto

## Logs de Teste
- ✅ Servidor rodando sem erros
- ✅ Hot reload funcionando
- ✅ Página carregando normalmente
- ✅ Sem mais erros 500 nos logs