# 🔍 Consulta Automática de CNPJ - ATUALIZADO

O sistema possui integração com a **ReceitaWS** para consulta automática de dados detalhados de empresas pelo CNPJ.

## 🚀 Funcionalidades

### ✅ Consulta Automática Completa
- **Digite o CNPJ** no campo e os dados são preenchidos automaticamente
- **Validação em tempo real** do CNPJ
- **Formatação automática** (00.000.000/0000-00)

### 📋 Dados Preenchidos Automaticamente

#### 🏢 **Dados Principais**
- **Nome Empresarial** (Razão Social)
- **Nome Fantasia**
- **CNPJ** formatado
- **Inscrição Estadual**
- **Situação Cadastral** (ATIVA, BAIXADA, etc.)

#### 📍 **Endereço Detalhado**
- **Logradouro** (Rua, Avenida, etc.)
- **Número**
- **Complemento** (Sala, Andar, etc.)
- **Bairro**
- **Município**
- **UF** (Estado)
- **CEP**

#### 📞 **Contatos**
- **Telefone** (se disponível)
- **Email** (se disponível)

#### 📊 **Informações Adicionais**
- **Atividade Principal** (CNAE)
- **Natureza Jurídica**
- **Porte da Empresa** (MEI, ME, EPP, etc.)
- **Capital Social**
- **Data de Abertura**

## 🛠️ Como Usar

### 1. Na Página de Empresas
1. Acesse **Admin > Empresas**
2. Clique em **"Nova Empresa"**
3. Digite o CNPJ no campo específico
4. **TODOS os dados serão preenchidos automaticamente**
5. Revise e complete as informações se necessário
6. Salve a empresa

### 2. Campos Preenchidos Automaticamente
```
✅ Nome Empresarial (Razão Social)
✅ Nome Fantasia  
✅ Inscrição Estadual
✅ Logradouro
✅ Número
✅ Bairro
✅ Município  
✅ UF
✅ Situação Cadastral
✅ Telefone (se disponível)
✅ Email (se disponível)
```

## 🎯 **Exemplo de Preenchimento**

**CNPJ digitado:** `11.222.333/0001-81`

**Dados preenchidos automaticamente:**
- **Nome Empresarial:** GOOGLE BRASIL INTERNET LTDA
- **Nome Fantasia:** Google Brasil
- **Inscrição Estadual:** 123.456.789.012
- **Logradouro:** Av. Brigadeiro Faria Lima
- **Número:** 3477
- **Bairro:** Itaim Bibi
- **Município:** São Paulo
- **UF:** SP
- **CEP:** 04538-133
- **Situação Cadastral:** ATIVA
- **Telefone:** (11) 2395-8400

## 🔧 Implementação Técnica

### Estrutura do Banco Atualizada
```sql
CREATE TABLE empresas (
    -- Dados principais
    nome VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    inscricao_estadual VARCHAR(20),
    
    -- Endereço detalhado
    logradouro VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    municipio VARCHAR(100),
    uf VARCHAR(2),
    cep VARCHAR(10),
    endereco_completo TEXT, -- Campo calculado
    
    -- Informações cadastrais
    situacao_cadastral VARCHAR(50),
    atividade_principal TEXT,
    natureza_juridica VARCHAR(255),
    porte VARCHAR(50),
    capital_social VARCHAR(50),
    data_abertura DATE,
    
    -- Sistema
    ativo BOOLEAN DEFAULT true
);
```

### API Response Completa
```json
{
  "success": true,
  "data": {
    "nome": "GOOGLE BRASIL INTERNET LTDA",
    "nome_fantasia": "Google Brasil", 
    "cnpj": "06.990.590/0001-23",
    "inscricao_estadual": "149.532.232.112",
    "logradouro": "Av. Brigadeiro Faria Lima",
    "numero": "3477",
    "complemento": "12º andar",
    "bairro": "Itaim Bibi",
    "municipio": "São Paulo",
    "uf": "SP", 
    "cep": "04538-133",
    "telefone": "(11) 2395-8400",
    "email": "contato@google.com",
    "situacao_cadastral": "ATIVA",
    "atividade_principal": "Portais, provedores de conteúdo e outros serviços de informação na internet",
    "natureza_juridica": "Sociedade Empresária Limitada",
    "porte": "DEMAIS",
    "capital_social": "R$ 10.000.000,00",
    "data_abertura": "2003-05-16"
  }
}
```

## 📱 Interface Atualizada

### Formulário Organizado por Seções
1. **🏢 Dados da Empresa**
   - CNPJ (com consulta automática)
   - Nome Empresarial
   - Nome Fantasia
   - Inscrição Estadual
   - Situação Cadastral

2. **📍 Endereço**
   - Logradouro, Número, Complemento
   - Bairro, Município, UF, CEP

3. **📞 Contatos**
   - Telefone, Email para Holerites

4. **🖼️ Logo da Empresa**
   - Upload de logo

### Estados Visuais Aprimorados
- **Consultando:** Spinner + fundo azul claro
- **Sucesso:** Notificação verde com nome da empresa e situação
- **Erro:** Notificação vermelha com detalhes do erro
- **Campos preenchidos:** Destacados visualmente

## 🎨 Melhorias na UX

### Notificações Inteligentes
```
✅ "Dados encontrados!"
   "Empresa: GOOGLE BRASIL INTERNET LTDA - ATIVA"

❌ "CNPJ não encontrado"
   "Verifique se o CNPJ está correto"

⚠️ "Empresa inativa"
   "GOOGLE BRASIL INTERNET LTDA - BAIXADA"
```

### Validações Visuais
- ✅ CNPJ válido: borda verde
- ❌ CNPJ inválido: borda vermelha  
- 🔍 Consultando: borda azul + spinner
- 📝 Campos preenchidos: destaque sutil

## 🚀 Próximas Melhorias

### Em Desenvolvimento
- [ ] Consulta de CEP automática
- [ ] Validação de Inscrição Estadual por UF
- [ ] Cache inteligente de consultas
- [ ] Histórico de consultas realizadas
- [ ] Integração com Serasa/SPC para score

### Futuras Integrações
- [ ] API dos Correios (CEP)
- [ ] Sintegra (Situação Estadual)
- [ ] Simples Nacional (Regime tributário)
- [ ] Junta Comercial (Atos societários)

## 🛠️ Como Usar

### 1. Na Página de Empresas
1. Acesse **Admin > Empresas**
2. Clique em **"Nova Empresa"**
3. Digite o CNPJ no campo específico
4. Os dados serão preenchidos automaticamente
5. Revise e complete as informações
6. Salve a empresa

### 2. Componente UiInputCNPJ
```vue
<UiInputCNPJ 
  v-model="cnpj" 
  label="CNPJ da Empresa"
  required
  @dados-encontrados="preencherDados"
/>
```

## 🔧 Implementação Técnica

### API Endpoint
- **Rota:** `/api/consulta-cnpj`
- **Método:** POST
- **Parâmetros:** `{ cnpj: "12345678000190" }`

### Composable useCNPJ()
```typescript
const { consultarCNPJ, formatarCNPJ, validarCNPJ } = useCNPJ()

// Consultar CNPJ
const resultado = await consultarCNPJ('12345678000190')

// Validar CNPJ
const valido = validarCNPJ('12345678000190')

// Formatar CNPJ
const formatado = formatarCNPJ('12345678000190') // 12.345.678/0001-90
```

## 🌐 API Externa

### ReceitaWS
- **URL:** https://www.receitaws.com.br/
- **Gratuita:** Sim
- **Limite:** 3 consultas por minuto
- **Dados:** Receita Federal do Brasil

### Exemplo de Resposta
```json
{
  "nome": "EMPRESA EXEMPLO LTDA",
  "fantasia": "Empresa Exemplo",
  "cnpj": "12.345.678/0001-90",
  "situacao": "ATIVA",
  "logradouro": "RUA EXEMPLO",
  "numero": "123",
  "bairro": "CENTRO",
  "municipio": "SAO PAULO",
  "uf": "SP",
  "cep": "01234-567",
  "telefone": "(11) 3333-4444",
  "email": "contato@empresa.com"
}
```

## ⚠️ Tratamento de Erros

### Validações Implementadas
- ✅ CNPJ obrigatório
- ✅ CNPJ com 14 dígitos
- ✅ Algoritmo de validação de CNPJ
- ✅ CNPJ não pode ter todos os dígitos iguais

### Mensagens de Erro
- **CNPJ inválido:** "CNPJ deve ter 14 dígitos"
- **CNPJ não encontrado:** "CNPJ não encontrado na Receita Federal"
- **Erro de rede:** "Erro ao consultar CNPJ. Tente novamente."

## 🎨 Interface do Usuário

### Estados Visuais
- **Normal:** Campo branco com botão "🔍 Buscar"
- **Consultando:** Fundo azul claro com spinner
- **Sucesso:** Mensagem verde "Dados encontrados!"
- **Erro:** Mensagem vermelha com descrição do erro

### Notificações
- **Toast de sucesso** quando dados são encontrados
- **Toast de erro** quando há problemas na consulta
- **Auto-dismiss** após 5 segundos

## 🔒 Segurança

### Validações Backend
- Sanitização do CNPJ (remove caracteres especiais)
- Validação de formato e dígitos verificadores
- Rate limiting para evitar spam
- Headers apropriados para a API externa

### Tratamento de Dados
- Dados sensíveis não são armazenados em cache
- Apenas dados públicos da Receita Federal
- Logs de auditoria para consultas realizadas

## 📱 Responsividade

O componente é totalmente responsivo:
- **Desktop:** Campo com botão lateral
- **Mobile:** Campo com botão abaixo
- **Tablet:** Layout adaptativo

## 🚀 Melhorias Futuras

### Possíveis Implementações
- [ ] Cache local de consultas recentes
- [ ] Consulta em lote para múltiplos CNPJs
- [ ] Integração com outras APIs (Serasa, SPC)
- [ ] Histórico de consultas realizadas
- [ ] Validação de situação cadastral em tempo real

## 🆘 Troubleshooting

### Problemas Comuns

**1. "Erro ao consultar CNPJ"**
- Verifique conexão com internet
- API pode estar temporariamente indisponível
- Tente novamente em alguns minutos

**2. "CNPJ não encontrado"**
- Verifique se o CNPJ está correto
- Empresa pode estar inativa
- CNPJ pode não existir na Receita Federal

**3. "Muitas consultas"**
- API tem limite de 3 consultas por minuto
- Aguarde alguns minutos antes de tentar novamente

### Logs de Debug
```bash
# Ver logs do servidor
npm run dev

# Logs da API
console.log no arquivo server/api/consulta-cnpj.post.ts
```