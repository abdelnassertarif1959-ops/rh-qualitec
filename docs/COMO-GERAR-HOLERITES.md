# 📄 Como Gerar Holerites

## ✅ Sim, você pode gerar holerites hoje!

O sistema permite gerar holerites **sem enviar** para os funcionários. Você pode:
1. Gerar os holerites
2. Revisar e editar os valores
3. Enviar quando estiver tudo correto

## 🚀 Como Funciona

### 1. Gerar Holerites Automaticamente

Na página `/admin/holerites`, clique no botão **"🤖 Gerar Automático"**

**O que acontece:**
- ✅ Busca todos os funcionários ativos
- ✅ Cria um holerite para cada um
- ✅ Calcula automaticamente:
  - Salário base (do cadastro do funcionário)
  - INSS (baseado em tabela simplificada)
  - Total de proventos
  - Total de descontos
  - Salário líquido
- ✅ Status inicial: **"gerado"** (não enviado)

**Período padrão:**
- Primeira quinzena do mês atual (dia 1 ao dia 15)
- Você pode ajustar manualmente depois

### 2. Revisar os Holerites Gerados

Após gerar, você verá a lista com:
- Nome do funcionário
- Cargo e empresa
- Valor líquido
- Período
- Status (🟡 Gerado)

### 3. Editar Valores (Se Necessário)

Para cada holerite, você pode:

**Clicar em "✏️ Editar"** para ajustar:
- Salário base
- Horas trabalhadas
- Bônus
- Horas extras
- Qualquer outro campo

**Exemplo de uso:**
```
Funcionário: João Silva
Salário Base: R$ 5.000,00
Horas Extras: R$ 500,00 (adicionar)
Bônus: R$ 300,00 (adicionar)
```

### 4. Visualizar Detalhes

**Clicar em "👁️ Ver"** para ver:
- Todos os proventos
- Todos os descontos
- Cálculos detalhados
- Salário líquido final

### 5. Enviar (Quando Estiver Pronto)

Você tem duas opções:

**Enviar Individual:**
- Clique em "📧 Enviar" em cada holerite
- Envia por email para aquele funcionário específico

**Enviar Todos:**
- Clique no botão "📧 Enviar Todos" no topo
- Envia todos os holerites de uma vez

## 📋 Fluxo Completo

```
1. Gerar Automático
   ↓
2. Revisar Lista
   ↓
3. Editar (se necessário)
   ↓
4. Visualizar (conferir)
   ↓
5. Enviar (individual ou todos)
```

## 🎯 Exemplo Prático

### Cenário: Gerar holerites da primeira quinzena de janeiro

1. **Acesse:** `/admin/holerites`

2. **Clique:** "🤖 Gerar Automático"
   - Sistema gera para todos os funcionários ativos
   - Período: 01/01/2026 a 15/01/2026

3. **Revise a lista:**
   ```
   ✓ João Silva - R$ 4.200,00 (líquido)
   ✓ Maria Santos - R$ 3.400,00 (líquido)
   ✓ Pedro Costa - R$ 5.800,00 (líquido)
   ```

4. **Edite se necessário:**
   - João trabalhou horas extras → Adicionar R$ 500,00
   - Maria teve bônus → Adicionar R$ 300,00

5. **Confira os valores:**
   - Clique em "👁️ Ver" para cada um
   - Verifique se está tudo correto

6. **Envie:**
   - Opção 1: Clique "📧 Enviar" em cada holerite
   - Opção 2: Clique "📧 Enviar Todos" no topo

## 💡 Dicas Importantes

### ✅ Boas Práticas

1. **Sempre revise antes de enviar**
   - Confira os valores
   - Verifique os descontos
   - Valide o período

2. **Edite quando necessário**
   - Horas extras
   - Bônus
   - Descontos especiais
   - Faltas

3. **Use os filtros**
   - Por empresa
   - Por mês
   - Por status

4. **Não envie duplicados**
   - O sistema impede gerar holerites duplicados para o mesmo período
   - Se tentar gerar novamente, receberá aviso

### ⚠️ Atenção

- **Status "gerado"** = Não foi enviado ainda
- **Status "enviado"** = Já foi enviado por email
- **Status "visualizado"** = Funcionário já viu

## 🔧 Cálculos Automáticos

### INSS (Simplificado)
```
Até R$ 1.320,00     → 7,5%
R$ 1.320,01 a R$ 2.571,29 → 9%
R$ 2.571,30 a R$ 3.856,94 → 12%
Acima de R$ 3.856,94 → 14%
```

### Salário Líquido
```
Salário Líquido = 
  Salário Base
  + Bônus
  + Horas Extras
  + Outros Proventos
  - INSS
  - IRRF
  - Vale Transporte
  - Outros Descontos
```

## 📊 Campos Editáveis

Você pode editar:
- ✅ Salário base
- ✅ Bônus
- ✅ Horas extras
- ✅ Adicional noturno
- ✅ Adicional de periculosidade
- ✅ Adicional de insalubridade
- ✅ Comissões
- ✅ INSS
- ✅ IRRF
- ✅ Vale transporte
- ✅ Vale refeição
- ✅ Plano de saúde
- ✅ Plano odontológico
- ✅ Adiantamento
- ✅ Faltas
- ✅ Horas trabalhadas
- ✅ Observações
- ✅ Data de pagamento

## 🎯 Resumo

**Sim, você pode gerar holerites hoje!**

1. ✅ Gere sem enviar
2. ✅ Edite os valores
3. ✅ Revise tudo
4. ✅ Envie quando quiser

O sistema é flexível e permite total controle sobre o processo! 🚀
