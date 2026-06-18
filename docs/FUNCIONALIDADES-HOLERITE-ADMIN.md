# Funcionalidades de Holerite para Admin

## 📄 Download de Holerites

O administrador pode baixar holerites em dois formatos diferentes através do modal de visualização.

### Formatos Disponíveis

#### 1. HTML (Recomendado)
- **Botão**: "📄 Baixar HTML"
- **Formato**: Arquivo HTML standalone
- **Vantagens**:
  - Mesmo layout que o funcionário visualiza
  - Pode ser aberto em qualquer navegador
  - Fácil de compartilhar por email
  - Não requer software adicional
  - Tamanho pequeno (~50KB)

#### 2. PDF
- **Botão**: "📄 Baixar PDF"
- **Formato**: Documento PDF
- **Vantagens**:
  - Formato universal
  - Não pode ser editado facilmente
  - Ideal para impressão
  - Aceito oficialmente

### Como Usar

1. Acesse a página de **Holerites** no menu admin
2. Clique em qualquer holerite para abrir o modal
3. Escolha o formato desejado:
   - Clique em "Baixar HTML" para o formato web
   - Clique em "Baixar PDF" para o formato documento

### Estrutura do HTML

O HTML gerado contém:
- **Cabeçalho**: Logo e dados da empresa
- **Dados do Funcionário**: Nome, CPF, cargo, departamento
- **Período**: Data de início e fim do período
- **Proventos**: Salário base, bônus, horas extras, etc.
- **Descontos**: INSS, IRRF, vale transporte, etc.
- **Totalizadores**: Total de proventos, descontos e líquido
- **Informações Adicionais**: FGTS, base de cálculo INSS/IRRF
- **Rodapé**: Data de emissão e assinatura

### API Endpoints

#### GET `/api/holerites/[id]/html`
Retorna o HTML do holerite para download.

**Parâmetros:**
- `id`: ID do holerite

**Resposta:**
- Content-Type: `text/html; charset=utf-8`
- Content-Disposition: `attachment; filename="holerite-[nome].html"`

**Exemplo:**
```javascript
const response = await fetch('/api/holerites/123/html')
const html = await response.text()
```

#### GET `/api/holerites/[id]/pdf`
Retorna o PDF do holerite para download.

**Parâmetros:**
- `id`: ID do holerite

**Resposta:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="holerite-[nome].pdf"`

### Segurança

- Ambos os endpoints usam `serverSupabaseServiceRole` para bypass de RLS
- Apenas administradores têm acesso à página de holerites
- Os arquivos são gerados dinamicamente (não armazenados)

### Diferenças entre HTML e PDF

| Característica | HTML | PDF |
|---------------|------|-----|
| Tamanho | ~50KB | ~200KB |
| Edição | Possível (não recomendado) | Difícil |
| Visualização | Navegador | Leitor PDF |
| Impressão | Boa | Excelente |
| Compartilhamento | Email, WhatsApp | Email, sistemas |
| Oficial | Não | Sim |

### Recomendações

- **Para visualização rápida**: Use HTML
- **Para arquivo oficial**: Use PDF
- **Para envio por email**: Use HTML (menor)
- **Para impressão**: Use PDF
- **Para arquivamento**: Use PDF

### Troubleshooting

**Erro ao baixar HTML:**
```
Erro ao gerar HTML
```
- Verifique se o holerite existe
- Verifique se os dados do funcionário estão completos
- Verifique os logs do servidor

**Erro ao baixar PDF:**
```
Erro ao gerar PDF
```
- Verifique se o Puppeteer está instalado
- Verifique se há memória suficiente
- Verifique os logs do servidor

### Testes

Execute o script de teste:
```bash
node testar-download-html.mjs
```

Isso irá:
1. Buscar um holerite de teste
2. Baixar o HTML
3. Salvar o arquivo localmente
4. Mostrar estatísticas do arquivo
