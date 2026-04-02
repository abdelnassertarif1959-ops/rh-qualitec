# Sistema de Data de Referência para Documentos

## Implementação Completa - 02/04/2026

### Objetivo
Permitir que o admin especifique a data/competência de documentos históricos (ex: documentos de 2024, 2025) para que os funcionários possam filtrar por ano e mês.

---

## ✅ Implementações Realizadas

### 1. Banco de Dados
**Arquivo:** `database/48-adicionar-data-referencia-documentos.sql`

- ✅ Coluna `data_referencia DATE` adicionada à tabela `funcionario_documentos`
- ✅ Comentário explicativo na coluna
- ✅ Fallback: documentos existentes recebem `DATE(criado_em)` como data de referência

**Status:** Coluna existe e está funcionando ✅

### 2. APIs Backend

#### API Admin Upload
**Arquivo:** `server/api/admin/documentos/upload.post.ts`
- ✅ Recebe `data_referencia` do FormData
- ✅ Salva no banco de dados
- ✅ Retorna `data_referencia` no response

#### API Funcionário Upload
**Arquivo:** `server/api/funcionarios/documentos/upload.post.ts`
- ✅ Recebe `data_referencia` do FormData
- ✅ Salva no banco de dados
- ✅ Retorna `data_referencia` no response

#### APIs de Listagem
- ✅ `server/api/funcionarios/documentos/index.get.ts` - retorna `data_referencia`
- ✅ `server/api/admin/documentos/[funcionarioId]/index.get.ts` - retorna `data_referencia`
- ✅ `server/api/admin/documentos/index.get.ts` - retorna `data_referencia`

### 3. Componentes Frontend

#### Modal Admin (FuncionarioDocumentos.vue)
**Arquivo:** `app/components/funcionarios/FuncionarioDocumentos.vue`
- ✅ Campo de data adicionado ao modal de upload
- ✅ Label: "Data de referência (mês/ano do documento)"
- ✅ Input tipo `date`
- ✅ Valor padrão: data atual
- ✅ Texto de ajuda com exemplo
- ✅ Envia `data_referencia` no FormData
- ✅ Exibe data de referência na listagem (formato: "Ref: DD/MM/AAAA")

#### Modal Admin Card (FuncionarioCard.vue)
**Arquivo:** `app/components/funcionarios/FuncionarioCard.vue`
- ✅ Campo de data adicionado ao modal de anexo rápido
- ✅ Mesmo layout e funcionalidade do modal principal
- ✅ Envia `data_referencia` no FormData

#### Modal Funcionário (MeusDocumentos.vue)
**Arquivo:** `app/components/funcionarios/MeusDocumentos.vue`
- ✅ Campo de data adicionado ao modal de upload
- ✅ Posicionado logo após seleção do arquivo
- ✅ Envia `data_referencia` no FormData
- ✅ Exibe data de referência na listagem

### 4. Interfaces TypeScript
- ✅ Interface `Documento` atualizada com `data_referencia: string | null`
- ✅ Todos os componentes tipados corretamente

---

## 🔍 Verificação de Funcionamento

### Teste no Banco de Dados
```bash
node scripts/verificar-coluna-data-referencia.js
```

**Resultado:**
- ✅ Coluna existe
- ✅ Dados sendo salvos corretamente
- ✅ Exemplo: documento salvo com data 2025-01-01

### Documentos de Teste
Documentos salvos com datas diferentes:
- `agendamento.ics` → 31/12/2024
- `area-de-arquivos-rh.html` → 01/04/2025
- `api_credentials.csv` → 01/04/2022

---

## 📋 Como Usar

### Para o Admin

1. Acesse a área de funcionários
2. Clique em "Anexar" no card do funcionário
3. Selecione o tipo de documento
4. **Defina a data de referência** (ex: 01/01/2024 para documentos de janeiro/2024)
5. Adicione descrição (opcional)
6. Selecione o arquivo
7. Clique em "Enviar"

### Para o Funcionário

1. Acesse "Meus Documentos"
2. Clique na área de upload
3. Selecione o arquivo
4. **Defina a data de referência**
5. Adicione título e descrição (opcional)
6. Clique em "Enviar"

### Visualização

- Na listagem, a data aparece como: **"Ref: DD/MM/AAAA"**
- Se não houver data de referência, mostra a data de criação
- Formato: `{{ formatarTamanho(doc.tamanho_bytes) }} · Ref: {{ formatarData(doc.data_referencia) }}`

---

## 🎯 Próximos Passos (Futuro)

### Filtros por Data (Planejado)
Na área do funcionário (`MeusDocumentos.vue`), adicionar:
- Filtro por ano (dropdown com anos disponíveis)
- Filtro por mês (dropdown: Todos, Jan, Fev, Mar...)
- Filtro por tipo de documento

Exemplo de implementação:
```vue
<select v-model="anoFiltro">
  <option value="0">Todos os anos</option>
  <option value="2024">2024</option>
  <option value="2025">2025</option>
  <option value="2026">2026</option>
</select>

<select v-model="mesFiltro">
  <option value="0">Todos os meses</option>
  <option value="1">Janeiro</option>
  <option value="2">Fevereiro</option>
  <!-- ... -->
</select>
```

Query com filtros:
```typescript
const documentosFiltrados = computed(() => {
  return documentos.value.filter(doc => {
    const dataRef = new Date(doc.data_referencia || doc.criado_em)
    const ano = dataRef.getFullYear()
    const mes = dataRef.getMonth() + 1
    
    if (anoFiltro.value > 0 && ano !== anoFiltro.value) return false
    if (mesFiltro.value > 0 && mes !== mesFiltro.value) return false
    
    return true
  })
})
```

---

## 🐛 Troubleshooting

### Data não está sendo salva
1. Verifique se a migration foi executada: `database/48-adicionar-data-referencia-documentos.sql`
2. Execute o script de verificação: `node scripts/verificar-coluna-data-referencia.js`
3. Verifique os logs do navegador (Network tab) para ver se `data_referencia` está sendo enviada no FormData

### Data não aparece no frontend
1. Verifique se a API está retornando o campo: inspecione o response no Network tab
2. Verifique se a interface TypeScript inclui `data_referencia`
3. Limpe o cache do navegador e recarregue

### Data aparece como "hoje" mesmo selecionando outra
1. Verifique se o campo está sendo enviado no FormData
2. Verifique se a API está recebendo e salvando o valor
3. Use o script de verificação para confirmar o valor no banco

---

## 📝 Notas Técnicas

- **Formato no banco:** `DATE` (YYYY-MM-DD)
- **Formato no frontend:** `DD/MM/AAAA` via `toLocaleDateString('pt-BR')`
- **Valor padrão:** Data atual (`new Date().toISOString().split('T')[0]`)
- **Nullable:** Sim (permite NULL para documentos antigos)
- **Fallback:** Se NULL, usa `criado_em` na exibição

---

## ✅ Checklist de Implementação

- [x] Migration SQL criada e documentada
- [x] Coluna adicionada ao banco
- [x] API admin recebe e salva data_referencia
- [x] API funcionário recebe e salva data_referencia
- [x] APIs de listagem retornam data_referencia
- [x] Modal admin com campo de data
- [x] Modal admin card com campo de data
- [x] Modal funcionário com campo de data
- [x] Interfaces TypeScript atualizadas
- [x] Exibição da data na listagem
- [x] Scripts de diagnóstico criados
- [x] Documentação completa
- [ ] Filtros por ano/mês (futuro)
- [ ] Testes automatizados (futuro)

---

**Última atualização:** 02/04/2026
**Status:** ✅ Implementação completa e funcional
