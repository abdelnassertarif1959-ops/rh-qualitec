# Sistema de Dependentes para IRRF

## 📋 Resumo
Implementação completa do sistema de dependentes para dedução do IRRF, conforme legislação brasileira.

## 💰 Valor da Dedução
- **R$ 189,59 por dependente** (valor vigente em 2024/2025)
- Deduzido da base de cálculo do IRRF antes de aplicar as alíquotas

## 🗄️ Banco de Dados

### Coluna Adicionada
```sql
ALTER TABLE funcionarios
  ADD COLUMN IF NOT EXISTS numero_dependentes INTEGER DEFAULT 0;
```

### Como Executar
1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Execute o arquivo: `database/12-adicionar-dependentes.sql`

## 🖥️ Interface

### Formulário de Funcionários
- Campo adicionado: "Número de Dependentes (IRRF)"
- Tipo: Número inteiro
- Valor padrão: 0
- Localização: Seção de Dados Profissionais, ao lado do Salário Base

## 📊 Cálculo do IRRF

### Fórmula
```
Base IRRF = Salário Bruto - INSS - (Número de Dependentes × R$ 189,59)
```

### Exemplo Prático
**Funcionário com 2 dependentes:**
- Salário Bruto: R$ 6.200,00
- INSS: R$ 700,00
- Dedução Dependentes: 2 × R$ 189,59 = R$ 379,18
- **Base IRRF**: R$ 6.200 - R$ 700 - R$ 379,18 = **R$ 5.120,82**

**Sem dependentes:**
- Base IRRF: R$ 6.200 - R$ 700 = R$ 5.500,00
- IRRF: ~R$ 60-80

**Com 2 dependentes:**
- Base IRRF: R$ 5.120,82
- IRRF: ~R$ 15-30 (redução significativa!)

## 📄 Holerite

### Exibição
- Aparece na seção de dados do funcionário
- Formato: "Dependentes: 2"
- Só aparece se número de dependentes > 0

## 🔄 Fluxo Completo

1. **Cadastro**: Admin adiciona número de dependentes no cadastro do funcionário
2. **Geração**: Sistema busca número de dependentes ao gerar holerite
3. **Cálculo**: Deduz R$ 189,59 por dependente da base do IRRF
4. **Exibição**: Mostra no holerite quantos dependentes foram considerados

## ✅ Checklist de Implementação

- [x] Criar coluna `numero_dependentes` na tabela `funcionarios`
- [x] Adicionar campo no formulário de cadastro/edição
- [x] Atualizar API de geração de holerites para buscar dependentes
- [x] Implementar dedução no cálculo do IRRF
- [x] Exibir no holerite HTML/PDF
- [x] Documentar funcionalidade

## 🚀 Como Usar

### Para o Admin
1. Acesse "Funcionários"
2. Edite um funcionário
3. Na seção "Dados Profissionais", preencha "Número de Dependentes"
4. Salve
5. Gere o holerite normalmente

### Para o Funcionário
- O número de dependentes aparecerá automaticamente no holerite
- A dedução do IRRF será aplicada automaticamente

## 📌 Observações Importantes

- Dependentes válidos: filhos, cônjuge, pais (conforme legislação)
- Valor de R$ 189,59 pode ser atualizado anualmente pela Receita Federal
- A dedução só afeta o IRRF, não afeta INSS ou outros descontos
- Funcionários sem dependentes: campo fica em 0 (padrão)
