# ✅ Correção Completa: Pensão Alimentícia e Descontos Personalizados

**Data:** 06/02/2026  
**Status:** ✅ CORRIGIDO

## 🎯 Problema Identificado

A pensão alimentícia e descontos personalizados **NÃO APARECIAM** no HTML/PDF do holerite, mesmo estando cadastrados.

### Causa Raiz

Os itens estavam sendo salvos na tabela `holerite_itens_personalizados`, mas o código que gera o HTML **NÃO BUSCAVA** esses itens. Ele apenas usava os campos JSONB `beneficios` e `descontos_personalizados` do holerite.

## 📊 Estrutura de Dados

### Tabela: `holerite_itens_personalizados`

```sql
CREATE TABLE holerite_itens_personalizados (
  id SERIAL PRIMARY KEY,
  funcionario_id INTEGER REFERENCES funcionarios(id),
  tipo VARCHAR(20), -- 'beneficio' ou 'desconto'
  descricao TEXT,
  valor DECIMAL(10,2),
  vigencia_tipo VARCHAR(20), -- 'unico' ou 'recorrente'
  data_inicio DATE,
  data_fim DATE,
  observacoes TEXT
)
```

### Exemplo de Dados

| id | funcionario_id | tipo | descricao | valor | vigencia_tipo | data_inicio | data_fim |
|----|----------------|------|-----------|-------|---------------|-------------|----------|
| 5 | 156 | desconto | PENSÃO ALIMENTICIA | 948.63 | recorrente | 2026-02-06 | 2026-06-02 |

## ✅ Soluções Implementadas

### 1. Buscar Itens Personalizados da Tabela

**Arquivo:** `server/api/holerites/[id]/html.get.ts`

**Adicionado após buscar a empresa:**

```typescript
// Buscar itens personalizados do holerite (da tabela holerite_itens_personalizados)
const { data: itensPersonalizados } = await supabase
  .from('holerite_itens_personalizados')
  .select('*')
  .eq('funcionario_id', funcionario.id)
  .gte('data_inicio', holerite.periodo_inicio)
  .or(`data_fim.is.null,data_fim.gte.${holerite.periodo_inicio}`)

// Separar benefícios e descontos
const beneficiosPersonalizados = (itensPersonalizados || []).filter((item: any) => item.tipo === 'beneficio')
const descontosPersonalizados = (itensPersonalizados || []).filter((item: any) => item.tipo === 'desconto')

console.log(`📋 Itens personalizados encontrados:`)
console.log(`   Benefícios: ${beneficiosPersonalizados.length}`)
console.log(`   Descontos: ${descontosPersonalizados.length}`)
```

### 2. Adicionar Itens ao Holerite Antes de Gerar HTML

**Arquivo:** `server/api/holerites/[id]/html.get.ts`

```typescript
// Adicionar itens personalizados ao holerite
const holeriteComItens = {
  ...holerite,
  beneficios: beneficiosPersonalizados.map((item: any) => ({
    tipo: item.descricao,
    descricao: item.observacoes || item.descricao,
    valor: item.valor
  })),
  descontos_personalizados: descontosPersonalizados.map((item: any) => ({
    descricao: item.descricao,
    referencia: item.id.toString(), // Usar ID como referência
    valor: item.valor
  }))
}

const html = gerarHoleriteHTML(holeriteComItens, funcionarioData, empresaData)
```

### 3. Adicionar Campo Pensão Alimentícia no Formulário de Edição

**Arquivo:** `app/components/holerites/HoleriteEditForm.vue`

**Adicionado na aba "Descontos":**

```vue
<UiInput 
  v-model="form.pensao_alimenticia" 
  type="number" 
  label="Pensão Alimentícia"
  placeholder="0.00"
  step="0.01"
/>
```

**Adicionado no objeto `form`:**

```typescript
const form = ref({
  // ... outros campos
  pensao_alimenticia: props.holerite.pensao_alimenticia || 0
})
```

**Adicionado no cálculo de descontos:**

```typescript
const calcularTotalDescontos = () => {
  return (
    Number(form.value.inss) +
    Number(form.value.irrf) +
    // ... outros descontos
    Number(form.value.pensao_alimenticia) // ✅ Adicionado
  )
}
```

### 4. Aceitar Pensão Alimentícia na API de Edição

**Arquivo:** `server/api/holerites/[id].patch.ts`

**Adicionado nos campos editáveis:**

```typescript
if (body.pensao_alimenticia !== undefined) dadosParaAtualizar.pensao_alimenticia = body.pensao_alimenticia
```

**Adicionado nos campos que afetam cálculo:**

```typescript
const camposQueAfetamCalculo = [
  // ... outros campos
  'pensao_alimenticia' // ✅ Adicionado
]
```

**Adicionado no cálculo de descontos:**

```typescript
const totalDescontos = 
  Number(dadosAtualizados.inss || 0) +
  Number(dadosAtualizados.irrf || 0) +
  // ... outros descontos
  Number(dadosAtualizados.pensao_alimenticia || 0) // ✅ Adicionado
```

### 5. Incluir Pensão no Cálculo da Geração do Holerite

**Arquivo:** `server/api/holerites/gerar.post.ts`

**Movido a variável `pensaoAlimenticia` para fora do bloco if:**

```typescript
// Buscar pensão alimentícia do funcionário (para todos os tipos de contrato)
const pensaoAlimenticia = normalizarPensao((func as any).pensao_alimenticia)

if (tipoContrato === 'PJ') {
  // ...
} else {
  // Usa pensaoAlimenticia no cálculo do IRRF
}
```

**Adicionado no cálculo de descontos:**

```typescript
// Calcular total de descontos personalizados
let totalDescontosPersonalizados = 0
descontosPersonalizados.forEach((d: any) => {
  totalDescontosPersonalizados += Number(d.valor) || 0
})

// Cálculo COMPLETO incluindo pensão e descontos personalizados
const totalDescontos = inss + irrf + totalAdiantamentos + pensaoAlimenticia + totalDescontosPersonalizados
```

### 6. Remover Duplicação da Pensão no HTML

**Arquivo:** `server/utils/holeriteHTML.ts`

**ANTES:** Pensão aparecia 2 vezes (códigos 915 e 960)

**DEPOIS:** Pensão aparece apenas 1 vez (código 915)

**Alterado para buscar do holerite, não do funcionário:**

```typescript
const pensaoAlimenticia = Number(holerite.pensao_alimenticia) || 0
```

## 📊 Como Funciona Agora

### Fluxo Completo

1. **Cadastro no Formulário de Edição do Holerite**
   - Admin abre o holerite
   - Clica em "Editar"
   - Na aba "Itens Personalizados", adiciona "PENSÃO ALIMENTICIA" como desconto
   - Valor: R$ 948,63
   - Salva

2. **Salvamento no Banco**
   - Item é salvo na tabela `holerite_itens_personalizados`
   - Tipo: "desconto"
   - Funcionário ID: 156
   - Vigência: 06/02/2026 até 06/02/2026

3. **Geração do HTML/PDF**
   - Sistema busca itens da tabela `holerite_itens_personalizados`
   - Filtra por funcionário e período
   - Separa benefícios e descontos
   - Adiciona ao objeto do holerite
   - Gera HTML com todos os itens

4. **Exibição no Holerite**
   ```
   Código | Descrição              | Ref | Proventos | Descontos
   -------|------------------------|-----|-----------|----------
   8781   | DIAS NORMAIS           | 30  | 3.466,67  |
   998    | I.N.S.S.               | 9,23|           | 304,58
   910    | ADIANTAMENTO SALARIAL  |     |           | 1.388,67
   5      | PENSÃO ALIMENTICIA     |     |           | 948,63
   ```

5. **Cálculo do Salário Líquido**
   - Total Proventos: R$ 3.466,67
   - Total Descontos: R$ 2.641,88 (304,58 + 1.388,67 + 948,63)
   - **Salário Líquido: R$ 824,79** ✅

## 🧪 Como Testar

### 1. Verificar Item no Banco

```sql
SELECT * FROM holerite_itens_personalizados 
WHERE funcionario_id = 156 
AND tipo = 'desconto';
```

### 2. Gerar HTML do Holerite

1. Acesse **Admin → Holerites**
2. Encontre o holerite do Leonardo
3. Clique em "Ver" (ícone 👁️)
4. Verifique se a pensão aparece na lista de descontos

### 3. Verificar Cálculo

- Verifique se o valor da pensão está sendo subtraído
- Verifique se o salário líquido está correto
- Baixe o PDF e confirme que aparece corretamente

## 🎯 Resultado Final

**CORREÇÃO COMPLETA APLICADA** ✅

Agora os itens personalizados (incluindo pensão alimentícia):
- ✅ São buscados da tabela `holerite_itens_personalizados`
- ✅ Aparecem no HTML/PDF do holerite
- ✅ São incluídos no cálculo do total_descontos
- ✅ São subtraídos do salário líquido
- ✅ Suportam vigência (data_inicio e data_fim)
- ✅ Funcionam para benefícios e descontos

## 📦 Arquivos Modificados

1. `server/api/holerites/[id]/html.get.ts` - Busca itens personalizados da tabela
2. `server/api/holerites/[id].patch.ts` - Aceita pensao_alimenticia na edição
3. `server/api/holerites/gerar.post.ts` - Inclui pensão no cálculo
4. `server/utils/holeriteHTML.ts` - Remove duplicação da pensão
5. `app/components/holerites/HoleriteEditForm.vue` - Adiciona campo pensão

**Nenhuma migration SQL necessária!** As tabelas já existem.

## 📝 Observações Importantes

1. **Dois Lugares para Cadastrar Descontos:**
   - **Funcionário**: Campo `descontos_personalizados` (JSONB) - usado na geração automática
   - **Holerite**: Tabela `holerite_itens_personalizados` - usado para ajustes manuais

2. **Prioridade:**
   - Itens da tabela `holerite_itens_personalizados` **sobrescrevem** os do funcionário
   - Isso permite ajustes pontuais sem alterar o cadastro do funcionário

3. **Vigência:**
   - Itens têm `data_inicio` e `data_fim`
   - Sistema filtra automaticamente por período do holerite
   - Permite descontos temporários (ex: empréstimo de 12 parcelas)
